import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScatterPlot } from '../ScatterPlot';

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

const cxOf = (container: HTMLElement) =>
  [...container.querySelectorAll('.paul-chart__mark')].map((c) => Number(c.getAttribute('cx')));

describe('ScatterPlot', () => {
  it('exposes the figure as an image with a data summary', () => {
    render(<ScatterPlot series={series} label="Cost vs uptime" />);
    const figure = screen.getByRole('img');
    expect(figure.getAttribute('aria-label')).toContain('Cost vs uptime');
    expect(figure.getAttribute('aria-label')).toContain('Fleet A 3 points');
    expect(figure.getAttribute('aria-label')).toContain('Fleet B 2 points');
  });

  it('draws one mark per point across every series', () => {
    const { container } = render(<ScatterPlot series={series} label="Cost vs uptime" />);
    expect(container.querySelectorAll('.paul-chart__mark')).toHaveLength(5);
  });

  it('colours series from the categorical palette, 1-based and uncycled', () => {
    const { container } = render(<ScatterPlot series={series} label="Cost vs uptime" />);
    const groups = [...container.querySelectorAll('.paul-chart__series')];
    expect(groups[0].querySelector('.paul-chart__mark')?.getAttribute('fill')).toBe(
      'var(--paul-chart-1)',
    );
    expect(groups[1].querySelector('.paul-chart__mark')?.getAttribute('fill')).toBe(
      'var(--paul-chart-2)',
    );
  });

  it('rescales the marks when an explicit domain is given', () => {
    const one = [{ label: 'Fleet A', points: series[0].points }];
    const auto = render(<ScatterPlot series={one} label="Cost vs uptime" />);
    // Auto-scaled, x = 10 is the extent, so it lands on the right edge.
    expect(Math.max(...cxOf(auto.container))).toBe(196);

    const fixed = render(
      <ScatterPlot series={one} label="Cost vs uptime" domain={{ xMin: 0, xMax: 20, yMin: 0, yMax: 20 }} />,
    );
    // Same data on a 0..20 scale sits halfway across instead.
    expect(Math.max(...cxOf(fixed.container))).toBe(100);
  });

  it('shows a legend for two or more series', () => {
    const { container } = render(<ScatterPlot series={series} label="Cost vs uptime" />);
    expect(container.querySelectorAll('.paul-chart__legend-item')).toHaveLength(2);
    expect(screen.getByText('Fleet A')).toBeInTheDocument();
    expect(screen.getByText('Fleet B')).toBeInTheDocument();
  });

  it('omits the legend for a single series', () => {
    const { container } = render(
      <ScatterPlot series={[series[0]]} label="Cost vs uptime" />,
    );
    expect(container.querySelector('.paul-chart__legend')).toBeNull();
  });

  it('renders an empty state without a chart', () => {
    const { container } = render(<ScatterPlot series={[]} label="Cost vs uptime" />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe('Cost vs uptime');
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.paul-chart__empty')).toBeInTheDocument();
  });
});
