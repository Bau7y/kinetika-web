/**
 * Plain-Markdown versions of the site's content for AI assistants
 * (llms.txt and llms-full.txt). Pure functions over the content entries.
 */
import type { Work } from '../data/work';
import type { Guide } from '../data/guides';
import type { FaqItem } from '../data/faq';

const abs = (base: URL, path: string) => new URL(path, base).toString();

export function workMarkdown(base: URL, p: Work, status: string): string {
  const d = p.data;
  const lines = [
    `## ${d.name}`,
    '',
    `URL: ${abs(base, p.href)}`,
    `Estado: ${status} · Para: ${d.audience} · Actualizado: ${d.updated.toISOString().slice(0, 10)}`,
    '',
    `**${d.answer.question}** ${d.answer.text}`,
    '',
    ...(d.case
      ? [`### Caso`, `- **Problema:** ${d.case.problem}`, `- **Solución:** ${d.case.solution}`, `- **Resultado:** ${d.case.result}`, ...d.case.milestones.map((m) => `- ${m.date.toISOString().slice(0, 10)}: ${m.text}`), '']
      : []),
    `### ${d.highlights.title}`,
    ...d.highlights.items.map((i) => `- **${i.title}:** ${i.text}`),
  ];
  if (d.comparison) {
    lines.push('', `### ${d.comparison.title}`, '', `| | ${d.comparison.columns[0]} | ${d.comparison.columns[1]} |`, '| --- | --- | --- |');
    lines.push(...d.comparison.rows.map(([k, a, b]) => `| ${k} | ${a} | ${b} |`));
  }
  lines.push('', `### ${d.steps.title}`, ...d.steps.items.map((s, i) => `${i + 1}. **${s.title}:** ${s.text}`));
  if (d.faq.length) lines.push('', '### Preguntas', ...d.faq.map((f) => `- **${f.q}** ${f.a}`));
  return lines.join('\n');
}

export function guideMarkdown(base: URL, g: Guide): string {
  const d = g.data;
  const lines = [
    `## ${d.title}`,
    '',
    `URL: ${abs(base, g.href)} · Actualizado: ${d.updated.toISOString().slice(0, 10)}`,
    '',
    `**En resumen:** ${d.summary}`,
    '',
    (g.body ?? '').replace(/^## /gm, '### ').trim(),
  ];
  if (d.faq.length) lines.push('', '### Preguntas rápidas', ...d.faq.map((f) => `- **${f.q}** ${f.a}`));
  if (d.sources.length) lines.push('', '### Fuentes', ...d.sources.map((s) => `- [${s.title}](${s.url})`));
  return lines.join('\n');
}

export const faqMarkdown = (items: FaqItem[]) => items.map((f) => `- **${f.q}** ${f.a}`).join('\n');
