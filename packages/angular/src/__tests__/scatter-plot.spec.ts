import { describe, it, expect } from 'vitest';
import { PaulScatterPlotComponent } from '../scatter-plot';
import { renderComponent, host } from './render';

const series = [
  {
    label: 'Fleet A',
    points: [
      { x: 0, y: 0 },
      { x: 5, y: 8 },
      { x: 10, y: 10 },
    ],
  },
  {
    label: 'Fleet B',
    points: [
      { x: 2, y: 6 },
      { x: 8, y: 3 },
    ],
  },
];

const cxOf = (el: HTMLElement) =>
  [...el.querySelectorAll('.paul-chart__mark')].map((c) => Number(c.getAttribute('cx')));

/** Mirrors packages/react/src/__tests__/ScatterPlot.test.tsx. */
describe('PaulScatterPlot', () => {
  const render_ = (inputs: Record<string, unknown> = {}) =>
    host(
      renderComponent(PaulScatterPlotComponent, { series, label: 'Cost vs uptime', ...inputs }),
    );

  it('exposes the figure as an image with a data summary', () => {
    const name = render_().querySelector('[role="img"]')?.getAttribute('aria-label') ?? '';
    expect(name).toContain('Cost vs uptime');
    expect(name).toContain('Fleet A 3 points');
    expect(name).toContain('Fleet B 2 points');
  });

  it('draws one mark per point across every series', () => {
    expect(render_().querySelectorAll('.paul-chart__mark')).toHaveLength(5);
  });

  it('colours series from the categorical palette, 1-based and uncycled', () => {
    const groups = [...render_().querySelectorAll('.paul-chart__series')];
    expect(groups[0].querySelector('.paul-chart__mark')?.getAttribute('fill')).toBe(
      'var(--paul-chart-1)',
    );
    expect(groups[1].querySelector('.paul-chart__mark')?.getAttribute('fill')).toBe(
      'var(--paul-chart-2)',
    );
  });

  it('rescales the marks when an explicit domain is given', () => {
    // One fixture, reconfigured — TestBed only allows one module per test.
    const fixture = renderComponent(PaulScatterPlotComponent, {
      series: [{ label: 'Fleet A', points: series[0].points }],
      label: 'Cost vs uptime',
    });
    // Auto-scaled, x = 10 is the extent, so it lands on the right edge.
    expect(Math.max(...cxOf(host(fixture)))).toBe(196);

    fixture.componentRef.setInput('domain', { xMin: 0, xMax: 20, yMin: 0, yMax: 20 });
    fixture.detectChanges();
    // Same data on a 0..20 scale sits halfway across instead.
    expect(Math.max(...cxOf(host(fixture)))).toBe(100);
  });

  it('shows a legend for two or more series', () => {
    const el = render_();
    expect(el.querySelectorAll('.paul-chart__legend-item')).toHaveLength(2);
    const text = el.textContent ?? '';
    expect(text).toContain('Fleet A');
    expect(text).toContain('Fleet B');
  });

  it('omits the legend for a single series', () => {
    expect(render_({ series: [series[0]] }).querySelector('.paul-chart__legend')).toBeNull();
  });

  it('renders an empty state without a chart', () => {
    const el = render_({ series: [] });
    expect(el.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Cost vs uptime');
    expect(el.querySelector('svg')).toBeNull();
    expect(el.querySelector('.paul-chart__empty')).not.toBeNull();
  });
});
