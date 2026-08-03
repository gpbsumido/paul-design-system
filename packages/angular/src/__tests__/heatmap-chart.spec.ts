import { describe, it, expect } from 'vitest';
import { PaulHeatmapChartComponent } from '../heatmap-chart';
import { renderComponent, host } from './render';

const matrix = [
  [100, 60, 40],
  [100, 50, 0],
];
const rowLabels = ['Week 0', 'Week 1'];
const colLabels = ['D0', 'D7', 'D30'];

/** Mirrors packages/react/src/__tests__/HeatmapChart.test.tsx. */
describe('PaulHeatmapChart', () => {
  const render_ = (inputs: Record<string, unknown> = {}) =>
    host(
      renderComponent(PaulHeatmapChartComponent, {
        matrix,
        rowLabels,
        colLabels,
        label: 'Cohort retention',
        ...inputs,
      }),
    );

  const texts = (el: HTMLElement, selector: string) =>
    [...el.querySelectorAll(selector)].map((n) => n.textContent?.trim());

  it('exposes the figure as an image with a data summary', () => {
    const name = render_().querySelector('[role="img"]')?.getAttribute('aria-label') ?? '';
    expect(name).toContain('Cohort retention');
    expect(name).toContain('Week 0 100, 60, 40');
    expect(name).toContain('Week 1 100, 50, 0');
  });

  it('draws one cell per matrix value', () => {
    expect(render_().querySelectorAll('.paul-chart__cell')).toHaveLength(6);
  });

  it('colours cells from the sequential ramp, not the categorical one', () => {
    for (const cell of render_().querySelectorAll('.paul-chart__cell')) {
      const fill = cell.getAttribute('fill');
      expect(fill).toMatch(/--paul-chart-seq-\d/);
      expect(fill).not.toMatch(/--paul-chart-\d/);
    }
  });

  it('gives the highest cell the darkest step and a zero cell the lightest', () => {
    const fills = [...render_().querySelectorAll('.paul-chart__cell')].map((c) =>
      c.getAttribute('fill'),
    );
    // matrix[0][0] is the max, matrix[1][2] is zero.
    expect(fills[0]).toBe('var(--paul-chart-seq-5)');
    expect(fills[5]).toBe('var(--paul-chart-seq-1)');
  });

  it('renders row and column labels outside the plot', () => {
    const el = render_();
    expect(texts(el, '.paul-chart__row-label')).toEqual(rowLabels);
    expect(texts(el, '.paul-chart__col-label')).toEqual(colLabels);
  });

  it('direct-labels every cell by default', () => {
    expect(texts(render_(), '.paul-chart__cell-value')).toEqual([
      '100',
      '60',
      '40',
      '100',
      '50',
      '0',
    ]);
  });

  it('hides cell values when asked', () => {
    const el = render_({ showValues: false });
    expect(el.querySelectorAll('.paul-chart__cell-value')).toHaveLength(0);
    // The cells themselves are untouched.
    expect(el.querySelectorAll('.paul-chart__cell')).toHaveLength(6);
  });

  it('renders the scale legend with the min and max as end labels', () => {
    const el = render_();
    const scale = el.querySelector('.paul-chart__scale');
    expect(scale).not.toBeNull();
    expect(scale?.querySelectorAll('.paul-chart__scale-step')).toHaveLength(5);
    expect(texts(el, '.paul-chart__scale-end')).toEqual(['0', '100']);
  });

  it('renders an empty state without a chart', () => {
    const el = render_({ matrix: [] });
    expect(el.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Cohort retention');
    expect(el.querySelector('svg')).toBeNull();
    expect(el.querySelector('.paul-chart__empty')).not.toBeNull();
    expect(el.querySelector('.paul-chart__scale')).toBeNull();
  });
});
