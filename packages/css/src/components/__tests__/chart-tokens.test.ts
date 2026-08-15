import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const css = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), '../../components/chart.css'),
  'utf-8',
);

/**
 * chart.css is the third place the chart palette is written down, after
 * colors.ts and build.mjs. It maps the slots to token names by hand, so it can
 * drift from chartPalette without anything failing. These pin the mapping the
 * palette test validated.
 */

const CATEGORICAL = [
  ['--paul-chart-1', '--paul-color-primary-500'],
  ['--paul-chart-2', '--paul-color-secondary-600'],
  ['--paul-chart-3', '--paul-color-violet-600'],
  ['--paul-chart-4', '--paul-color-cyan-600'],
  ['--paul-chart-5', '--paul-color-success-700'],
  ['--paul-chart-6', '--paul-color-error-600'],
] as const;

const block = (selector: string): string => {
  const start = css.indexOf(selector);
  expect(start, `${selector} missing from chart.css`).toBeGreaterThan(-1);
  const open = css.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) return css.slice(open, i + 1);
    }
  }
  throw new Error(`unbalanced braces reading ${selector}`);
};

describe('chart palette tokens', () => {
  const light = block('.paul-chart {');
  const dark = block("[data-theme='dark'] .paul-chart");

  it.each(CATEGORICAL)('maps %s to %s in light', (slot, token) => {
    expect(light).toContain(`${slot}: var(${token})`);
  });

  it.each(CATEGORICAL)('maps %s to %s in dark', (slot, token) => {
    // The two modes converged: once verdigris and ember are anchored, only one
    // set of steps clears both lightness bands. The dark block still states
    // them so the theme's palette is readable in one place.
    expect(dark).toContain(`${slot}: var(${token})`);
  });

  it('keeps the sequential ramp on one hue, reversed for dark', () => {
    for (const step of [100, 300, 500, 700, 900]) {
      expect(light).toContain(`var(--paul-color-primary-${step})`);
    }
    expect(dark).toContain('--paul-chart-seq-1: var(--paul-color-primary-900)');
    expect(dark).toContain('--paul-chart-seq-5: var(--paul-color-primary-300)');
  });

  it('does not draw a series from a stock palette', () => {
    for (const stock of ['#3b82f6', '#2563eb', '#8b5cf6', '#7c3aed', '#93c5fd']) {
      expect(css).not.toContain(stock);
    }
  });
});
