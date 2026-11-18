/// <reference lib="webworker" />
/**
 * Hero lines, drawn off the main thread on an OffscreenCanvas.
 *
 * The story they tell follows the headline: on arrival the lines settle from
 * a loose tangle into a calm sway (work done by hand); as the visitor scrolls
 * past the hero they straighten into an ordered band and the pulses speed up
 * along it (the same work, automated). The pointer bends nearby lines.
 *
 * Every motion is time-based (frame-rate independent) and eased with
 * critically damped smoothing, so a dropped frame never makes it jump.
 */

type Message =
  | { type: 'init'; canvas: OffscreenCanvas; width: number; height: number; dpr: number; mobile: boolean }
  | { type: 'resize'; width: number; height: number }
  | { type: 'pointer'; x: number; y: number; inside: boolean }
  | { type: 'progress'; value: number }
  | { type: 'play' }
  | { type: 'pause' };

interface Line {
  y0: number;
  cp1: number;
  cp2: number;
  y3: number;
  /** Height in the ordered band (scroll story). */
  band: number;
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
let count = 260;
let lines: Line[] = [];
let pulses: Pulse[] = [];
let playing = false;
let frame = 0;
let startedAt = 0;
let last = 0;
let firstFrame = true;

/** Smoothed values: `v` moves toward `t` with a time constant in seconds. */
const smooth = (v: number, t: number, dt: number, tau: number) => t + (v - t) * Math.exp(-dt / tau);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, power: 0, target: 0 };
/** 0 = hero in view, 1 = scrolled past it. */
const story = { value: 0, target: 0 };
/** Arrival: 1 → 0 over the first seconds (tangle settling down). */
let arrival = 1;

/** Same seeded generator as the static image (src/assets/hero.jpg). */
function build() {
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  lines = [];
  for (let i = 0; i < count; i++) {
    const t = rand();
    const y0 = H * (0.2 + t * 1.0);
    const y3 = H * (-0.15 + t * 0.75) + (rand() - 0.5) * H * 0.12;
    const alpha = 0.04 + Math.pow(rand(), 3) * 0.46;
    const width = 0.5 + rand() * 1.3;
    const hue = 210 + rand() * 16;
    const light = 48 + rand() * 22;
    const lift = H * (0.2 + rand() * 0.25);
    lines.push({
      y0,
      cp1: y0 - H * 0.05,
      cp2: y0 - lift,
      y3,
      band: 0,
      alpha,
      width,
      color: `hsla(${hue},92%,${light}%,`,
      phase: (i * 2.399) % (Math.PI * 2),
      speed: 0.12 + ((i * 7) % 13) / 13 * 0.22,
      amp: H * (0.012 + ((i * 11) % 17) / 17 * 0.028),
    });
  }
  // Ordered band: the lines keep their vertical order, packed and parallel
  const order = lines.map((l, i) => [l.y0 + l.y3, i] as const).sort((a, b) => a[0] - b[0]);
  order.forEach(([, i], rank) => {
    lines[i].band = H * (0.5 + (rank / count) * 0.36);
  });
  // Pulses ride on the brighter lines
  const bright = lines.map((l, i) => [l.alpha, i] as const).sort((a, b) => b[0] - a[0]).slice(0, 50).map(([, i]) => i);
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
  const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
  const time = (now - startedAt) / 1000;

  pointer.x = smooth(pointer.x, pointer.tx, dt, 0.12);
  pointer.y = smooth(pointer.y, pointer.ty, dt, 0.12);
  pointer.power = smooth(pointer.power, pointer.target, dt, 0.35);
  story.value = smooth(story.value, story.target, dt, 0.18);
  arrival = smooth(arrival, 0, dt, 0.7);

  const order = easeInOut(Math.min(1, Math.max(0, story.value)));
  const tangle = 1 + arrival * 3.5;
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
  const fadeIn = 1 - arrival * 0.85;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const s = time * l.speed + l.phase;
    const amp = l.amp * tangle * (1 - order * 0.85);
    // Loose curve (by hand) → straight band (automated)
    let y0 = l.y0 + (l.band - l.y0) * order;
    let c1 = l.cp1 + (l.band - l.cp1) * order + Math.sin(s) * amp;
    let c2 = l.cp2 + (l.band - l.cp2) * order + Math.cos(s * 0.8) * amp * 1.4;
    let y3 = l.y3 + (l.band - l.y3) * order + Math.sin(s * 0.6) * amp * 0.6;

    if (pointer.power > 0.01) {
      // Height of the line under the pointer, then a gentle pull toward it
      const u = Math.min(1, Math.max(0, (px - X0) / (X3 - X0)));
      const ly = bez(y0, c1, c2, y3, u);
      const d = py - ly;
      const pull = Math.exp(-((d / reach) ** 2)) * reach * 0.18 * pointer.power * Math.sign(d);
      c1 += pull * (1 - u);
      c2 += pull * (0.4 + u);
    }

    geo[i] = [y0, c1, c2, y3];
    ctx.strokeStyle = `${l.color}${l.alpha * fadeIn})`;
    ctx.lineWidth = l.width * dpr;
    ctx.beginPath();
    ctx.moveTo(X0, y0);
    ctx.bezierCurveTo(X1, c1, X2, c2, X3, y3);
    ctx.stroke();
  }

  // Pulses: a short bright trail travelling along a line; faster once ordered
  const boost = 1 + order * 2.2;
  ctx.lineCap = 'round';
  for (const p of pulses) {
    p.u += p.speed * boost * dt;
    if (p.u > 1.08) {
      p.u = -0.08;
      p.line = (p.line * 31 + 17) % lines.length;
      if (lines[p.line].alpha < 0.1) p.line = (p.line + 1) % lines.length;
    }
    const [y0, c1, c2, y3] = geo[p.line];
    const STEPS = 18;
    const SPAN = 0.075 * (1 + order * 0.6);
    let prevX = 0;
    let prevY = 0;
    for (let k = 0; k <= STEPS; k++) {
      const u = Math.min(1, Math.max(0, p.u - (k / STEPS) * SPAN));
      const x = bez(X0, X1, X2, X3, u);
      const y = bez(y0, c1, c2, y3, u);
      if (k > 0) {
        const fade = 1 - k / STEPS;
        ctx.strokeStyle = `rgba(150,195,255,${0.7 * fade * fade * fadeIn})`;
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
      glow.addColorStop(0, `rgba(190,220,255,${0.55 * fadeIn})`);
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
  draw(now);
}

self.onmessage = (event: MessageEvent<Message>) => {
  const msg = event.data;
  switch (msg.type) {
    case 'init': {
      canvas = msg.canvas;
      ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
      dpr = msg.dpr;
      // Fewer lines on phones: same look, full frame rate, less battery
      count = msg.mobile ? 150 : 260;
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
    case 'progress':
      story.target = msg.value;
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
