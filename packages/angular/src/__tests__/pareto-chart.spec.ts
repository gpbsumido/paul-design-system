import { describe, it, expect } from 'vitest';
import { PaulParetoChartComponent } from '../pareto-chart';
import { renderComponent, host } from './render';

const data = [
  { label: 'Scratch', value: 50 },
  { label: 'Dent', value: 30 },
  { label: 'Chip', value: 12 },
  { label: 'Crack', value: 5 },
  { label: 'Bend', value: 3 },
];

/** The same five categories, shuffled — the bar order must not follow this. */
const unsorted = [
  { label: 'Chip', value: 12 },
  { label: 'Bend', value: 3 },
  { label: 'Scratch', value: 50 },
  { label: 'Crack', value: 5 },
  { label: 'Dent', value: 30 },
];

/** The nth "x,y" pair of a polyline's points attribute. */
function pointAt(points: string, i: number): [number, number] {
  const [x, y] = points.trim().split(/\s+/)[i].split(',');
  return [Number(x), Number(y)];
}

/** Mirrors packages/react/src/__tests__/ParetoChart.test.tsx. */
describe('PaulParetoChart', () => {
  const render_ = (inputs: Record<string, unknown> = {}) =>
    host(renderComponent(PaulParetoChartComponent, { data, label: 'Defects', ...inputs }));

  const ariaLabel = (el: HTMLElement) =>
    el.querySelector('[role="img"]')?.getAttribute('aria-label') ?? '';

  const points = (el: HTMLElement) =>
    el.querySelector('.paul-chart__cumulative')?.getAttribute('points') ?? '';

  it('exposes the figure as an image with a data summary', () => {
    const name = ariaLabel(render_());
    expect(name).toContain('Defects');
    expect(name).toContain('Scratch 50%');
    expect(name).toContain('Dent 30%');
    expect(name).toContain('80% of the total is reached by the first 2 of 5.');
  });

  it('draws one bar per positive value', () => {
    expect(render_().querySelectorAll('.paul-chart__bar')).toHaveLength(5);
  });

  it('drops non-positive values instead of drawing empty bars', () => {
    const el = render_({ data: [...data, { label: 'None', value: 0 }] });
    expect(el.querySelectorAll('.paul-chart__bar')).toHaveLength(5);
  });

  it('pairs each label with its own bar when the input is unsorted', () => {
    const el = render_({ data: unsorted });
    const labels = [...el.querySelectorAll('.paul-chart__category')].map((t) =>
      t.textContent?.trim(),
    );
    // Bars come back sorted descending; the labels must be sorted with them.
    expect(labels).toEqual(['Scratch', 'Dent', 'Chip', 'Crack', 'Bend']);
    // And each label sits over the bar whose height is its own share.
    const heights = [...el.querySelectorAll('.paul-chart__bar')].map((b) =>
      Number(b.getAttribute('height')),
    );
    for (let i = 1; i < heights.length; i += 1) {
      expect(heights[i]).toBeLessThanOrEqual(heights[i - 1]);
    }
    // The summary is sorted the same way, not left in input order.
    expect(ariaLabel(el)).toContain('Scratch 50%, Dent 30%, Chip 12%, Crack 5%, Bend 3%');
  });

  it('renders the cumulative line as one polyline with a point per bar', () => {
    const line = render_().querySelector('.paul-chart__cumulative');
    expect(line).not.toBeNull();
    expect(line?.getAttribute('points')?.trim().split(/\s+/)).toHaveLength(5);
    expect(line?.getAttribute('stroke')).toBe('var(--paul-chart-4)');
    expect(line?.getAttribute('stroke-width')).toBe('2');
  });

  it('draws the threshold line where the cumulative line reads 80%', () => {
    const el = render_();
    const rule = el.querySelector('.paul-chart__threshold');
    // 50 + 30 = 80, so the second cumulative point sits exactly on the rule.
    const [, y] = pointAt(points(el), 1);
    expect(Number(rule?.getAttribute('y1'))).toBeCloseTo(y, 3);
    expect(Number(rule?.getAttribute('y2'))).toBeCloseTo(y, 3);
    expect(rule?.getAttribute('stroke')).toBe('var(--paul-color-border)');
    expect(rule?.getAttribute('stroke-dasharray')).toBe('4 3');
  });

  it('moves the threshold line and the cut marker with a custom threshold', () => {
    const el = render_({ threshold: 50 });
    const [x0, y0] = pointAt(points(el), 0);
    // The first item is 50% of the total, so a 50% threshold cuts after it.
    const rule = el.querySelector('.paul-chart__threshold');
    expect(Number(rule?.getAttribute('y1'))).toBeCloseTo(y0, 3);
    const cut = el.querySelector('.paul-chart__cut');
    expect(Number(cut?.getAttribute('cx'))).toBeCloseTo(x0, 3);
    expect(Number(cut?.getAttribute('cy'))).toBeCloseTo(y0, 3);
    expect(ariaLabel(el)).toContain('50% of the total is reached by the first 1 of 5.');
  });

  it('marks where the cumulative line crosses the default threshold', () => {
    const el = render_();
    const [x, y] = pointAt(points(el), 1);
    const cut = el.querySelector('.paul-chart__cut');
    expect(Number(cut?.getAttribute('cx'))).toBeCloseTo(x, 3);
    expect(Number(cut?.getAttribute('cy'))).toBeCloseTo(y, 3);
  });

  it('gives every bar the same colour — one series, one hue', () => {
    const fills = [...render_().querySelectorAll('.paul-chart__bar')].map((b) =>
      b.getAttribute('fill'),
    );
    expect(new Set(fills)).toEqual(new Set(['var(--paul-chart-1)']));
  });

  it('draws exactly one y-scale — no second axis and no raw-count labels', () => {
    const text = [...render_().querySelectorAll('text')].map((t) => t.textContent?.trim());
    expect(text).toEqual(['Scratch', 'Dent', 'Chip', 'Crack', 'Bend']);
    for (const d of data) expect(text).not.toContain(String(d.value));
  });

  it('renders an empty state without a chart', () => {
    const el = render_({ data: [] });
    expect(ariaLabel(el)).toBe('Defects');
    expect(el.querySelector('svg')).toBeNull();
    expect(el.querySelector('.paul-chart__empty')).not.toBeNull();
  });

  it('treats all-zero data as empty', () => {
    const el = render_({
      data: [
        { label: 'A', value: 0 },
        { label: 'B', value: 0 },
      ],
    });
    expect(ariaLabel(el)).toBe('Defects');
    expect(el.querySelector('svg')).toBeNull();
    expect(el.querySelector('.paul-chart__empty')).not.toBeNull();
  });
});
