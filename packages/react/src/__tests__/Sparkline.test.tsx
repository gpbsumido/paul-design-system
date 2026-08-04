import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sparkline } from '../Sparkline';

describe('Sparkline', () => {
  it('renders an accessible figure with a label', () => {
    render(<Sparkline data={[1, 5, 3, 8]} label="Weekly signups" />);
    const fig = screen.getByRole('img', { name: 'Weekly signups' });
    expect(fig).toHaveClass('paul-chart');
    expect(fig.querySelector('svg')).toBeTruthy();
  });

  it('draws a line path by default', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} label="l" />);
    const path = container.querySelector('path.paul-chart__line');
    expect(path).toBeTruthy();
    expect(path?.getAttribute('d')).toMatch(/^M/);
  });

  it('draws a filled area when variant="area"', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} variant="area" label="l" />);
    expect(container.querySelector('path.paul-chart__area')).toBeTruthy();
  });

  it('renders an empty state when there is no data', () => {
    render(<Sparkline data={[]} label="Nothing yet" />);
    expect(screen.getByRole('img', { name: 'Nothing yet' })).toBeTruthy();
  });

  it('forwards a custom className', () => {
    render(<Sparkline data={[1, 2]} label="l" className="mine" />);
    expect(screen.getByRole('img', { name: 'l' })).toHaveClass('mine');
  });
});

describe('Sparkline with multiple series', () => {
  const series = [
    [0, 5],
    [0, 10],
  ];

  it('draws one line per series', () => {
    const { container } = render(<Sparkline series={series} label="Two teams" />);
    expect(container.querySelectorAll('.paul-chart__line')).toHaveLength(2);
  });

  it('gives each series its own palette slot', () => {
    const { container } = render(<Sparkline series={series} label="Two teams" />);
    const strokes = [...container.querySelectorAll('.paul-chart__line')].map((p) =>
      p.getAttribute('stroke'),
    );
    expect(strokes).toEqual(['var(--paul-chart-1)', 'var(--paul-chart-2)']);
  });

  it('scales every series against one shared domain', () => {
    const { container } = render(<Sparkline series={series} label="Two teams" height={40} />);
    const ys = [...container.querySelectorAll('.paul-chart__line')].map((p) => {
      const d = p.getAttribute('d') ?? '';
      const points = [...d.matchAll(/,(-?\d+(?:\.\d+)?)/g)].map((m) => Number(m[1]));
      return Math.min(...points);
    });
    // The taller series reaches the top; the shorter one must not.
    expect(ys[1]).toBeLessThan(ys[0]);
  });

  it('takes precedence over data', () => {
    const { container } = render(
      <Sparkline data={[1, 2, 3]} series={series} label="Two teams" />,
    );
    expect(container.querySelectorAll('.paul-chart__line')).toHaveLength(2);
  });

  it('ignores empty series and falls back to the empty state', () => {
    const { container } = render(<Sparkline series={[[], []]} label="Nothing" />);
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.paul-chart__empty')).toBeInTheDocument();
  });

  it('does not fill under multiple series, even with variant=area', () => {
    const { container } = render(
      <Sparkline series={series} variant="area" label="Two teams" />,
    );
    expect(container.querySelector('.paul-chart__area')).toBeNull();
  });
});
