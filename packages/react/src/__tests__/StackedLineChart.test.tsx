import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StackedLineChart } from '../StackedLineChart';

const series = [
  { label: 'Organic', values: [10, 20, 30] },
  { label: 'Paid', values: [5, 10, 15] },
];

/** Every y in a path `d`, so a test can ask how high a series actually reaches. */
function ys(path: string): number[] {
  return [...path.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map((m) => Number(m[2]));
}

describe('StackedLineChart', () => {
  it('exposes the figure as an image with a data summary', () => {
    render(<StackedLineChart series={series} label="Traffic" />);
    const figure = screen.getByRole('img');
    expect(figure.getAttribute('aria-label')).toContain('Traffic');
    expect(figure.getAttribute('aria-label')).toContain('Organic 30');
    expect(figure.getAttribute('aria-label')).toContain('Paid 15');
  });

  it('draws one line per series', () => {
    const { container } = render(<StackedLineChart series={series} label="Traffic" />);
    expect(container.querySelectorAll('.paul-chart__series-line')).toHaveLength(2);
  });

  it('draws one band per series when stacked', () => {
    const { container } = render(
      <StackedLineChart series={series} label="Traffic" variant="stacked" />,
    );
    expect(container.querySelectorAll('.paul-chart__band')).toHaveLength(2);
  });

  it('renders different markup for the two variants', () => {
    const lines = render(<StackedLineChart series={series} label="Traffic" />).container;
    const stacked = render(
      <StackedLineChart series={series} label="Traffic" variant="stacked" />,
    ).container;

    expect(lines.querySelectorAll('.paul-chart__band')).toHaveLength(0);
    expect(stacked.querySelectorAll('.paul-chart__series-line')).toHaveLength(0);
    expect(lines.querySelector('svg')?.innerHTML).not.toBe(stacked.querySelector('svg')?.innerHTML);
  });

  it('scales every series against one shared y-domain', () => {
    const { container } = render(
      <StackedLineChart
        series={[
          { label: 'Big', values: [0, 10] },
          { label: 'Small', values: [0, 5] },
        ]}
        label="Traffic"
        height={120}
      />,
    );
    const [big, small] = [...container.querySelectorAll('.paul-chart__series-line')].map((p) =>
      Math.min(...ys(p.getAttribute('d') ?? '')),
    );
    // The 10 tops the box (y = the 2px inset); the 5 stops halfway up, not at
    // the top of its own extent.
    expect(big).toBe(2);
    expect(small).toBeGreaterThan(big);
    expect(small).toBeCloseTo(60, 5);
  });

  it('colours series from the categorical palette, in slot order', () => {
    const { container } = render(<StackedLineChart series={series} label="Traffic" />);
    const strokes = [...container.querySelectorAll('.paul-chart__series-line')].map((p) =>
      p.getAttribute('stroke'),
    );
    expect(strokes).toEqual(['var(--paul-chart-1)', 'var(--paul-chart-2)']);
  });

  it('colours stacked bands from the same categorical slots', () => {
    const { container } = render(
      <StackedLineChart series={series} label="Traffic" variant="stacked" />,
    );
    const fills = [...container.querySelectorAll('.paul-chart__band')].map((p) =>
      p.getAttribute('fill'),
    );
    expect(fills).toEqual(['var(--paul-chart-1)', 'var(--paul-chart-2)']);
  });

  it('renders a legend naming every series when there are two or more', () => {
    const { container } = render(<StackedLineChart series={series} label="Traffic" />);
    expect(container.querySelectorAll('.paul-chart__legend-item')).toHaveLength(2);
    expect(screen.getByText('Organic')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('renders no legend for a single series', () => {
    const { container } = render(
      <StackedLineChart series={[series[0]]} label="Traffic" />,
    );
    expect(container.querySelector('.paul-chart__legend')).toBeNull();
  });

  it('suppresses the legend when asked', () => {
    const { container } = render(
      <StackedLineChart series={series} label="Traffic" showLegend={false} />,
    );
    expect(container.querySelector('.paul-chart__legend')).toBeNull();
  });

  it('renders an empty state without a chart', () => {
    const { container } = render(<StackedLineChart series={[]} label="Traffic" />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe('Traffic');
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.paul-chart__empty')).toBeInTheDocument();
  });

  it('treats series with no values as empty', () => {
    const { container } = render(
      <StackedLineChart
        series={[
          { label: 'Organic', values: [] },
          { label: 'Paid', values: [] },
        ]}
        label="Traffic"
      />,
    );
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.paul-chart__empty')).toBeInTheDocument();
    expect(container.querySelector('.paul-chart__legend')).toBeNull();
  });
});
