import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeatmapChart } from '../HeatmapChart';

const matrix = [
  [100, 60, 40],
  [100, 50, 0],
];
const rowLabels = ['Week 0', 'Week 1'];
const colLabels = ['D0', 'D7', 'D30'];

const setup = (props: Partial<Parameters<typeof HeatmapChart>[0]> = {}) =>
  render(
    <HeatmapChart
      matrix={matrix}
      rowLabels={rowLabels}
      colLabels={colLabels}
      label="Cohort retention"
      {...props}
    />,
  );

describe('HeatmapChart', () => {
  it('exposes the figure as an image with a data summary', () => {
    setup();
    const name = screen.getByRole('img').getAttribute('aria-label') ?? '';
    expect(name).toContain('Cohort retention');
    expect(name).toContain('Week 0 100, 60, 40');
    expect(name).toContain('Week 1 100, 50, 0');
  });

  it('draws one cell per matrix value', () => {
    const { container } = setup();
    expect(container.querySelectorAll('.paul-chart__cell')).toHaveLength(6);
  });

  it('colours cells from the sequential ramp, not the categorical one', () => {
    const { container } = setup();
    const fills = [...container.querySelectorAll('.paul-chart__cell')].map((c) =>
      c.getAttribute('fill'),
    );
    for (const fill of fills) {
      expect(fill).toMatch(/--paul-chart-seq-\d/);
      expect(fill).not.toMatch(/--paul-chart-\d/);
    }
  });

  it('gives the highest cell the darkest step and a zero cell the lightest', () => {
    const { container } = setup();
    const fills = [...container.querySelectorAll('.paul-chart__cell')].map((c) =>
      c.getAttribute('fill'),
    );
    // matrix[0][0] is the max, matrix[1][2] is zero.
    expect(fills[0]).toBe('var(--paul-chart-seq-5)');
    expect(fills[5]).toBe('var(--paul-chart-seq-1)');
  });

  it('renders row and column labels outside the plot', () => {
    const { container } = setup();
    const rows = [...container.querySelectorAll('.paul-chart__row-label')].map(
      (t) => t.textContent,
    );
    const cols = [...container.querySelectorAll('.paul-chart__col-label')].map(
      (t) => t.textContent,
    );
    expect(rows).toEqual(rowLabels);
    expect(cols).toEqual(colLabels);
  });

  it('direct-labels every cell by default', () => {
    const { container } = setup();
    const values = [...container.querySelectorAll('.paul-chart__cell-value')].map(
      (t) => t.textContent,
    );
    expect(values).toEqual(['100', '60', '40', '100', '50', '0']);
  });

  it('hides cell values when asked', () => {
    const { container } = setup({ showValues: false });
    expect(container.querySelectorAll('.paul-chart__cell-value')).toHaveLength(0);
    // The cells themselves are untouched.
    expect(container.querySelectorAll('.paul-chart__cell')).toHaveLength(6);
  });

  it('renders the scale legend with the min and max as end labels', () => {
    const { container } = setup();
    const scale = container.querySelector('.paul-chart__scale');
    expect(scale).not.toBeNull();
    expect(scale?.querySelectorAll('.paul-chart__scale-step')).toHaveLength(5);
    const ends = [...(scale?.querySelectorAll('.paul-chart__scale-end') ?? [])].map(
      (e) => e.textContent,
    );
    expect(ends).toEqual(['0', '100']);
  });

  it('renders an empty state without a chart', () => {
    const { container } = setup({ matrix: [] });
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe('Cohort retention');
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.paul-chart__empty')).toBeInTheDocument();
    expect(container.querySelector('.paul-chart__scale')).toBeNull();
  });
});
