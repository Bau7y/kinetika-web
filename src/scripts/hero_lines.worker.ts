/// <reference lib="webworker" />
/**
 * Hero lines, drawn off the main thread on an OffscreenCanvas.
 * The lines come from the same seeded generator as src/assets/hero.jpg, so
 * the first frame matches the static image they replace. Each line sways
 * slowly, a few bright pulses travel along them and the lines near the
 * pointer bend slightly toward it.
 */

type Message =
  | { type: 'init'; canvas: OffscreenCanvas; width: number; height: number; dpr: number; mobile: boolean }
  | { type: 'resize'; width: number; height: number }
  | { type: 'pointer'; x: number; y: number; inside: boolean }
  | { type: 'play' }
  | { type: 'pause' };

interface Line {
  y0: number;
  cp1: number;
  cp2: number;
  y3: number;
  alpha: number;
  width: number;
  color: string;
  phase: number;
  speed: number;
  amp: number;
}

interface Pulse {
  line: number;
  u: number;
  speed: number;
}

let ctx: OffscreenCanvasRenderingContext2D | null = null;
let canvas: OffscreenCanvas | null = null;
let W = 0;
let H = 0;
let dpr = 1;
let count = 420;
let lines: Line[] = [];
let pulses: Pulse[] = [];
let playing = false;
let frame = 0;
let startedAt = 0;
let last = 0;
let firstFrame = true;
let minFrameMs = 0;

// Pointer, eased toward its target in the frame loop
const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, power: 0, target: 0 };

/** Same generator as the static image (scripts in docs: hero.jpg). */
function build() {
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  lines = [];
  for (let i = 0; i < count; i++) {
    const t = rand();
    const y0 = H * (0.2 + t * 1.0);
    const y3 = H * (-0.15 + t * 0.75) + (rand() - 0.5) * H * 0.12;
    const alpha = 0.02 + Math.pow(rand(), 3) * 0.42;
    const width = 0.5 + rand() * 1.3;
    const hue = 210 + rand() * 16;
    const light = 48 + rand() * 22;
    const lift = H * (0.2 + rand() * 0.25);
    lines.push({
      y0,
      cp1: y0 - H * 0.05,
      cp2: y0 - lift,
      y3,
      alpha,
      width,
      color: `hsla(${hue},92%,${light}%,`,
      phase: (i * 2.399) % (Math.PI * 2),
      speed: 0.12 + ((i * 7) % 13) / 13 * 0.22,
      amp: H * (0.012 + ((i * 11) % 17) / 17 * 0.028),
    });
  }
  // Pulses ride on the brighter lines
  const bright = lines.map((l, i) => [l.alpha, i] as const).sort((a, b) => b[0] - a[0]).slice(0, 60).map(([, i]) => i);
  pulses = Array.from({ length: 7 }, (_, k) => ({
    line: bright[(k * 9) % bright.length],
    u: (k * 0.37) % 1,
    speed: 0.09 + (k % 4) * 0.025,
  }));
}

function resize(width: number, height: number) {
  if (!canvas) return;
  W = Math.round(width * dpr);
  H = Math.round(height * dpr);
  canvas.width = W;
  canvas.height = H;
  build();
}

/** Point on a cubic Bézier for one coordinate. */
const bez = (p0: number, p1: number, p2: number, p3: number, u: number) => {
  const v = 1 - u;
  return v * v * v * p0 + 3 * v * v * u * p1 + 3 * v * u * u * p2 + u * u * u * p3;
};

function draw(now: number) {
  if (!ctx) return;
  const time = (now - startedAt) / 1000;

  pointer.x += (pointer.tx - pointer.x) * 0.08;
  pointer.y += (pointer.ty - pointer.y) * 0.08;
  pointer.power += (pointer.target - pointer.power) * 0.05;
  const px = pointer.x * W;
  const py = pointer.y * H;
  const reach = H * 0.22;

  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';

  const X0 = -60 * dpr;
  const X1 = W * 0.35;
  const X2 = W * 0.5;
  const X3 = W + 60 * dpr;
  const geo: [number, number, number, number][] = new Array(lines.length);

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const s = time * l.speed + l.phase;
    let c1 = l.cp1 + Math.sin(s) * l.amp;
    let c2 = l.cp2 + Math.cos(s * 0.8) * l.amp * 1.4;
    const y3 = l.y3 + Math.sin(s * 0.6) * l.amp * 0.6;

    if (pointer.power > 0.01) {
      // Height of the line under the pointer, then a gentle pull toward it
      const u = Math.min(1, Math.max(0, (px - X0) / (X3 - X0)));
      const ly = bez(l.y0, c1, c2, y3, u);
      const d = py - ly;
      const pull = Math.exp(-((d / reach) ** 2)) * reach * 0.18 * pointer.power * Math.sign(d);
      c1 += pull * (1 - u);
      c2 += pull * (0.4 + u);
    }

    geo[i] = [l.y0, c1, c2, y3];
    ctx.strokeStyle = `${l.color}${l.alpha})`;
    ctx.lineWidth = l.width * dpr;
    ctx.beginPath();
    ctx.moveTo(X0, l.y0);
    ctx.bezierCurveTo(X1, c1, X2, c2, X3, y3);
    ctx.stroke();
  }

  // Pulses: a short bright trail travelling along a line
  const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
  for (const p of pulses) {
    p.u += p.speed * dt;
    if (p.u > 1.08) {
      p.u = -0.08;
      p.line = (p.line * 31 + 17) % lines.length;
      if (lines[p.line].alpha < 0.08) p.line = (p.line + 1) % lines.length;
    }
    const [y0, c1, c2, y3] = geo[p.line];
    // A continuous streak that fades toward its tail, plus a soft glowing head
    const STEPS = 22;
    const SPAN = 0.075;
    ctx.lineCap = 'round';
    let prevX = 0;
    let prevY = 0;
    for (let k = 0; k <= STEPS; k++) {
      const u = p.u - (k / STEPS) * SPAN;
      const x = bez(X0, X1, X2, X3, Math.min(1, Math.max(0, u)));
      const y = bez(y0, c1, c2, y3, Math.min(1, Math.max(0, u)));
      if (k > 0 && u >= 0 && u <= 1) {
        const fade = 1 - k / STEPS;
        ctx.strokeStyle = `rgba(150,195,255,${0.7 * fade * fade})`;
        ctx.lineWidth = (0.6 + 1.6 * fade) * dpr;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      prevX = x;
      prevY = y;
    }
    if (p.u >= 0 && p.u <= 1) {
      const hx = bez(X0, X1, X2, X3, p.u);
      const hy = bez(y0, c1, c2, y3, p.u);
      const r = 10 * dpr;
      const glow = ctx.createRadialGradient(hx, hy, 0, hx, hy, r);
      glow.addColorStop(0, 'rgba(190,220,255,0.55)');
      glow.addColorStop(1, 'rgba(110,168,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(hx - r, hy - r, r * 2, r * 2);
    }
  }

  // Same darkening as the static image: calmer bottom-left behind the text
  ctx.globalCompositeOperation = 'source-over';
  const mask = ctx.createLinearGradient(0, H, W * 0.7, 0);
  mask.addColorStop(0, 'rgba(5,8,15,0.9)');
  mask.addColorStop(0.55, 'rgba(5,8,15,0.35)');
  mask.addColorStop(1, 'rgba(5,8,15,0)');
  ctx.fillStyle = mask;
  ctx.fillRect(0, 0, W, H);

  last = now;
  if (firstFrame) {
    firstFrame = false;
    (self as unknown as Worker).postMessage({ type: 'ready' });
  }
}

function loop(now: number) {
  if (!playing) return;
  frame = requestAnimationFrame(loop);
  if (now - last < minFrameMs) return;
  draw(now);
}

self.onmessage = (event: MessageEvent<Message>) => {
  const msg = event.data;
  switch (msg.type) {
    case 'init': {
      canvas = msg.canvas;
      ctx = canvas.getContext('2d', { alpha: true });
      dpr = msg.dpr;
      // Fewer lines and 30 fps on phones: same look, less battery
      count = msg.mobile ? 240 : 420;
      minFrameMs = msg.mobile ? 30 : 0;
      startedAt = performance.now();
      resize(msg.width, msg.height);
      break;
    }
    case 'resize':
      resize(msg.width, msg.height);
      if (!playing) draw(performance.now());
      break;
    case 'pointer':
      pointer.tx = msg.x;
      pointer.ty = msg.y;
      pointer.target = msg.inside ? 1 : 0;
      break;
    case 'play':
      if (playing) return;
      playing = true;
      last = 0;
      frame = requestAnimationFrame(loop);
      break;
    case 'pause':
      playing = false;
      cancelAnimationFrame(frame);
      break;
  }
};
