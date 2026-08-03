import { describe, it, expect } from 'vitest';
import { PaulRadarChartComponent } from '../radar-chart';
import { renderComponent, host } from './render';

const axes = ['Speed', 'Power', 'Range'];
const data = [
  { label: 'Alpha', values: [10, 6, 8] },
  { label: 'Beta', values: [5, 9, 3] },
];

/** Centre of the frame at the default size (160) and padding (18). */
const CENTER = { x: 80, y: 80 };

const radii = (polygon: Element) =>
  (polygon.getAttribute('points') ?? '')
    .split(' ')
    .filter(Boolean)
    .map((pair) => {
      const [x, y] = pair.split(',').map(Number);
      return Math.hypot(x - CENTER.x, y - CENTER.y);
    });

/** Mirrors packages/react/src/__tests__/RadarChart.test.tsx. */
describe('PaulRadarChart', () => {
  const render_ = (inputs: Record<string, unknown> = {}) =>
    host(renderComponent(PaulRadarChartComponent, { data, axes, label: 'Team profile', ...inputs }));

  it('exposes the figure as an image with a data summary', () => {
    const name = render_().querySelector('[role="img"]')?.getAttribute('aria-label') ?? '';
    expect(name).toContain('Team profile');
    expect(name).toContain('Alpha Speed 10, Power 6, Range 8');
    expect(name).toContain('Beta Speed 5, Power 9, Range 3');
  });

  it('draws one polygon per series', () => {
    expect(render_().querySelectorAll('.paul-chart__radar-area')).toHaveLength(2);
  });

  it('drops series past the third — more than three polygons is unreadable', () => {
    const many = ['A', 'B', 'C', 'D'].map((label) => ({ label, values: [1, 2, 3] }));
    const el = render_({ data: many });
    expect(el.querySelectorAll('.paul-chart__radar-area')).toHaveLength(3);
    const legend = Array.from(el.querySelectorAll('.paul-chart__legend-label')).map((n) =>
      n.textContent?.trim(),
    );
    expect(legend).toEqual(['A', 'B', 'C']);
  });

  it('draws a spoke per axis and a set of rings', () => {
    const el = render_();
    expect(el.querySelectorAll('.paul-chart__axis')).toHaveLength(3);
    expect(el.querySelectorAll('.paul-chart__ring').length).toBeGreaterThan(0);
  });

  it('names every axis', () => {
    const text = render_().textContent ?? '';
    for (const axis of axes) expect(text).toContain(axis);
  });

  it('scales every series against one shared ceiling', () => {
    const el = render_({
      data: [
        { label: 'Alpha', values: [10, 10, 10] },
        { label: 'Beta', values: [5, 5, 5] },
      ],
    });
    const [alpha, beta] = Array.from(el.querySelectorAll('.paul-chart__radar-area'));
    const outer = radii(alpha);
    const inner = radii(beta);
    // Beta never rescales to fill the frame: it stays at half of Alpha's reach.
    for (let i = 0; i < outer.length; i += 1) {
      expect(inner[i]).toBeCloseTo(outer[i] / 2, 1);
    }
  });

  it('honours an explicit max', () => {
    const el = render_({ data: [{ label: 'Alpha', values: [5, 5, 5] }], max: 10 });
    const polygon = el.querySelector('.paul-chart__radar-area')!;
    // Half of the 62-unit radius, because the ceiling is 10 and not the series max.
    for (const r of radii(polygon)) expect(r).toBeCloseTo(31, 0);
  });

  it('shows a legend for two or more series', () => {
    const el = render_();
    expect(el.querySelector('.paul-chart__legend')).not.toBeNull();
    expect(el.querySelectorAll('.paul-chart__legend-item')).toHaveLength(2);
  });

  it('omits the legend for a single series — the accessible name already says what it is', () => {
    expect(render_({ data: [data[0]] }).querySelector('.paul-chart__legend')).toBeNull();
  });

  it('renders an empty state without a chart', () => {
    const el = render_({ data: [] });
    expect(el.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Team profile');
    expect(el.querySelector('svg')).toBeNull();
    expect(el.querySelector('.paul-chart__empty')).not.toBeNull();
  });

  it('colours series from the categorical palette', () => {
    const fills = Array.from(render_().querySelectorAll('.paul-chart__radar-area')).map((p) =>
      p.getAttribute('fill'),
    );
    expect(fills).toEqual(['var(--paul-chart-1)', 'var(--paul-chart-2)']);
  });

  it('leaves the frame recessive rather than colouring it from the palette', () => {
    const frame = render_().querySelectorAll('.paul-chart__axis, .paul-chart__ring');
    for (const el of Array.from(frame)) {
      expect(el.getAttribute('fill')).toBeNull();
      expect(el.getAttribute('stroke')).toBeNull();
    }
  });
});
