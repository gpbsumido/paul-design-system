import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ParetoChart } from '../ParetoChart';

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

describe('ParetoChart', () => {
  it('exposes the figure as an image with a data summary', () => {
    render(<ParetoChart data={data} label="Defects" />);
    const name = screen.getByRole('img').getAttribute('aria-label') ?? '';
    expect(name).toContain('Defects');
    expect(name).toContain('Scratch 50%');
    expect(name).toContain('Dent 30%');
    expect(name).toContain('80% of the total is reached by the first 2 of 5.');
  });

  it('draws one bar per positive value', () => {
    const { container } = render(<ParetoChart data={data} label="Defects" />);
    expect(container.querySelectorAll('.paul-chart__bar')).toHaveLength(5);
  });

  it('drops non-positive values instead of drawing empty bars', () => {
    const { container } = render(
      <ParetoChart data={[...data, { label: 'None', value: 0 }]} label="Defects" />,
    );
    expect(container.querySelectorAll('.paul-chart__bar')).toHaveLength(5);
  });

  it('pairs each label with its own bar when the input is unsorted', () => {
    const { container } = render(<ParetoChart data={unsorted} label="Defects" />);
    const bars = [...container.querySelectorAll('.paul-chart__bar')];
    const labels = [...container.querySelectorAll('.paul-chart__category')].map((t) =>
      t.textContent?.trim(),
    );
    // Bars come back sorted descending; the labels must be sorted with them.
    expect(labels).toEqual(['Scratch', 'Dent', 'Chip', 'Crack', 'Bend']);
    // And each label sits over the bar whose height is its own share.
    const heights = bars.map((b) => Number(b.getAttribute('height')));
    for (let i = 1; i < heights.length; i += 1) {
      expect(heights[i]).toBeLessThanOrEqual(heights[i - 1]);
    }
    // The summary is sorted the same way, not left in input order.
    const name = screen.getByRole('img').getAttribute('aria-label') ?? '';
    expect(name).toContain('Scratch 50%, Dent 30%, Chip 12%, Crack 5%, Bend 3%');
  });

  it('renders the cumulative line as one polyline with a point per bar', () => {
    const { container } = render(<ParetoChart data={data} label="Defects" />);
    const line = container.querySelector('.paul-chart__cumulative');
    expect(line).not.toBeNull();
    expect(line?.getAttribute('points')?.trim().split(/\s+/)).toHaveLength(5);
    expect(line?.getAttribute('stroke')).toBe('var(--paul-chart-4)');
    expect(line?.getAttribute('stroke-width')).toBe('2');
  });

  it('draws the threshold line where the cumulative line reads 80%', () => {
    const { container } = render(<ParetoChart data={data} label="Defects" />);
    const rule = container.querySelector('.paul-chart__threshold');
    const points = container.querySelector('.paul-chart__cumulative')?.getAttribute('points') ?? '';
    // 50 + 30 = 80, so the second cumulative point sits exactly on the rule.
    const [, y] = pointAt(points, 1);
    expect(Number(rule?.getAttribute('y1'))).toBeCloseTo(y, 3);
    expect(Number(rule?.getAttribute('y2'))).toBeCloseTo(y, 3);
    expect(rule?.getAttribute('stroke')).toBe('var(--paul-color-border)');
    expect(rule?.getAttribute('stroke-dasharray')).toBe('4 3');
  });

  it('moves the threshold line and the cut marker with a custom threshold', () => {
    const { container } = render(<ParetoChart data={data} label="Defects" threshold={50} />);
    const points = container.querySelector('.paul-chart__cumulative')?.getAttribute('points') ?? '';
    const [x0, y0] = pointAt(points, 0);
    // The first item is 50% of the total, so a 50% threshold cuts after it.
    const rule = container.querySelector('.paul-chart__threshold');
    expect(Number(rule?.getAttribute('y1'))).toBeCloseTo(y0, 3);
    const cut = container.querySelector('.paul-chart__cut');
    expect(Number(cut?.getAttribute('cx'))).toBeCloseTo(x0, 3);
    expect(Number(cut?.getAttribute('cy'))).toBeCloseTo(y0, 3);
    const name = screen.getByRole('img').getAttribute('aria-label') ?? '';
    expect(name).toContain('50% of the total is reached by the first 1 of 5.');
  });

  it('marks where the cumulative line crosses the default threshold', () => {
    const { container } = render(<ParetoChart data={data} label="Defects" />);
    const points = container.querySelector('.paul-chart__cumulative')?.getAttribute('points') ?? '';
    const [x, y] = pointAt(points, 1);
    const cut = container.querySelector('.paul-chart__cut');
    expect(Number(cut?.getAttribute('cx'))).toBeCloseTo(x, 3);
    expect(Number(cut?.getAttribute('cy'))).toBeCloseTo(y, 3);
  });

  it('gives every bar the same colour — one series, one hue', () => {
    const { container } = render(<ParetoChart data={data} label="Defects" />);
    const fills = [...container.querySelectorAll('.paul-chart__bar')].map((b) =>
      b.getAttribute('fill'),
    );
    expect(new Set(fills)).toEqual(new Set(['var(--paul-chart-1)']));
  });

  it('draws exactly one y-scale — no second axis and no raw-count labels', () => {
    const { container } = render(<ParetoChart data={data} label="Defects" />);
    const text = [...container.querySelectorAll('text')].map((t) => t.textContent?.trim());
    expect(text).toEqual(['Scratch', 'Dent', 'Chip', 'Crack', 'Bend']);
    for (const d of data) expect(text).not.toContain(String(d.value));
  });

  it('renders an empty state without a chart', () => {
    const { container } = render(<ParetoChart data={[]} label="Defects" />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe('Defects');
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.paul-chart__empty')).toBeInTheDocument();
  });

  it('treats all-zero data as empty', () => {
    const { container } = render(
      <ParetoChart data={[{ label: 'A', value: 0 }, { label: 'B', value: 0 }]} label="Defects" />,
    );
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe('Defects');
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.paul-chart__empty')).toBeInTheDocument();
  });
});
