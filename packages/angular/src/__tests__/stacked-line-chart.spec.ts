import { describe, it, expect } from 'vitest';
import { PaulStackedLineChartComponent } from '../stacked-line-chart';
import { renderComponent, host } from './render';

const series = [
  { label: 'Organic', values: [10, 20, 30] },
  { label: 'Paid', values: [5, 10, 15] },
];

/** Every y in a path `d`, so a test can ask how high a series actually reaches. */
function ys(path: string): number[] {
  return [...path.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map((m) => Number(m[2]));
}

/** Mirrors packages/react/src/__tests__/StackedLineChart.test.tsx. */
describe('PaulStackedLineChart', () => {
  const render_ = (inputs: Record<string, unknown> = {}) =>
    host(
      renderComponent(PaulStackedLineChartComponent, { series, label: 'Traffic', ...inputs }),
    );

  it('exposes the figure as an image with a data summary', () => {
    const name = render_().querySelector('[role="img"]')?.getAttribute('aria-label') ?? '';
    expect(name).toContain('Traffic');
    expect(name).toContain('Organic 30');
    expect(name).toContain('Paid 15');
  });

  it('draws one line per series', () => {
    expect(render_().querySelectorAll('.paul-chart__series-line')).toHaveLength(2);
  });

  it('draws one band per series when stacked', () => {
    expect(render_({ variant: 'stacked' }).querySelectorAll('.paul-chart__band')).toHaveLength(2);
  });

  it('renders different markup for the two variants', () => {
    // One TestBed per test, so the variant is swapped on a live fixture rather
    // than by mounting a second component.
    const fixture = renderComponent(PaulStackedLineChartComponent, {
      series,
      label: 'Traffic',
    });
    const el = host(fixture);
    expect(el.querySelectorAll('.paul-chart__band')).toHaveLength(0);
    const linesMarkup = el.querySelector('svg')?.innerHTML;

    fixture.componentRef.setInput('variant', 'stacked');
    fixture.detectChanges();
    expect(el.querySelectorAll('.paul-chart__series-line')).toHaveLength(0);
    expect(el.querySelector('svg')?.innerHTML).not.toBe(linesMarkup);
  });

  it('scales every series against one shared y-domain', () => {
    const el = render_({
      series: [
        { label: 'Big', values: [0, 10] },
        { label: 'Small', values: [0, 5] },
      ],
      height: 120,
    });
    const [big, small] = [...el.querySelectorAll('.paul-chart__series-line')].map((p) =>
      Math.min(...ys(p.getAttribute('d') ?? '')),
    );
    // The 10 tops the box (y = the 2px inset); the 5 stops halfway up, not at
    // the top of its own extent.
    expect(big).toBe(2);
    expect(small).toBeGreaterThan(big);
    expect(small).toBeCloseTo(60, 5);
  });

  it('colours series from the categorical palette, in slot order', () => {
    const strokes = [...render_().querySelectorAll('.paul-chart__series-line')].map((p) =>
      p.getAttribute('stroke'),
    );
    expect(strokes).toEqual(['var(--paul-chart-1)', 'var(--paul-chart-2)']);
  });

  it('colours stacked bands from the same categorical slots', () => {
    const fills = [...render_({ variant: 'stacked' }).querySelectorAll('.paul-chart__band')].map(
      (p) => p.getAttribute('fill'),
    );
    expect(fills).toEqual(['var(--paul-chart-1)', 'var(--paul-chart-2)']);
  });

  it('renders a legend naming every series when there are two or more', () => {
    const el = render_();
    expect(el.querySelectorAll('.paul-chart__legend-item')).toHaveLength(2);
    const text = el.textContent ?? '';
    expect(text).toContain('Organic');
    expect(text).toContain('Paid');
  });

  it('renders no legend for a single series', () => {
    expect(render_({ series: [series[0]] }).querySelector('.paul-chart__legend')).toBeNull();
  });

  it('suppresses the legend when asked', () => {
    expect(render_({ showLegend: false }).querySelector('.paul-chart__legend')).toBeNull();
  });

  it('renders an empty state without a chart', () => {
    const el = render_({ series: [] });
    expect(el.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Traffic');
    expect(el.querySelector('svg')).toBeNull();
    expect(el.querySelector('.paul-chart__empty')).not.toBeNull();
  });

  it('treats series with no values as empty', () => {
    const el = render_({
      series: [
        { label: 'Organic', values: [] },
        { label: 'Paid', values: [] },
      ],
    });
    expect(el.querySelector('svg')).toBeNull();
    expect(el.querySelector('.paul-chart__empty')).not.toBeNull();
    expect(el.querySelector('.paul-chart__legend')).toBeNull();
  });
});
