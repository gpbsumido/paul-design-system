import { describe, it, expect } from 'vitest';
import { PaulFunnelChartComponent } from '../funnel-chart';
import { renderComponent, host } from './render';

const data = [
  { label: 'Visit', value: 1000 },
  { label: 'Signup', value: 620 },
  { label: 'Activate', value: 465 },
];

/** Mirrors packages/react/src/__tests__/FunnelChart.test.tsx. */
describe('PaulFunnelChart', () => {
  const render_ = (inputs: Record<string, unknown> = {}) =>
    host(renderComponent(PaulFunnelChartComponent, { data, label: 'Signup funnel', ...inputs }));

  it('exposes the figure as an image with a data summary', () => {
    const name = render_().querySelector('[role="img"]')?.getAttribute('aria-label') ?? '';
    expect(name).toContain('Signup funnel');
    expect(name).toContain('Visit 1000 (100%)');
    expect(name).toContain('Signup 620 (62%)');
  });

  it('draws one band per stage', () => {
    expect(render_().querySelectorAll('.paul-chart__stage')).toHaveLength(3);
  });

  it('labels every stage with its value', () => {
    const text = render_().textContent ?? '';
    for (const d of data) {
      expect(text).toContain(d.label);
      expect(text).toContain(String(d.value));
    }
  });

  it('shows drop-off from the second stage on', () => {
    const deltas = [...render_().querySelectorAll('.paul-chart__delta')].map((el) =>
      el.textContent?.trim(),
    );
    expect(deltas).toEqual(['−38%', '−25%']);
  });

  it('hides drop-off when asked', () => {
    expect(render_({ showDropOff: false }).querySelectorAll('.paul-chart__delta')).toHaveLength(0);
  });

  it('renders an empty state without a chart', () => {
    const el = render_({ data: [] });
    expect(el.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Signup funnel');
    expect(el.querySelector('svg')).toBeNull();
    expect(el.querySelector('.paul-chart__empty')).not.toBeNull();
  });

  it('colours stages from the sequential ramp, not the categorical one', () => {
    for (const path of render_().querySelectorAll('.paul-chart__stage')) {
      expect(path.getAttribute('fill')).toMatch(/--paul-chart-seq-\d/);
    }
  });
});
