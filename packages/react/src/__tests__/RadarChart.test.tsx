import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RadarChart } from '../RadarChart';

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

describe('RadarChart', () => {
  it('exposes the figure as an image with a data summary', () => {
    render(<RadarChart data={data} axes={axes} label="Team profile" />);
    const name = screen.getByRole('img').getAttribute('aria-label') ?? '';
    expect(name).toContain('Team profile');
    expect(name).toContain('Alpha Speed 10, Power 6, Range 8');
    expect(name).toContain('Beta Speed 5, Power 9, Range 3');
  });

  it('draws one polygon per series', () => {
    const { container } = render(<RadarChart data={data} axes={axes} label="Team profile" />);
    expect(container.querySelectorAll('.paul-chart__radar-area')).toHaveLength(2);
  });

  it('drops series past the third — more than three polygons is unreadable', () => {
    const many = ['A', 'B', 'C', 'D'].map((label) => ({ label, values: [1, 2, 3] }));
    const { container } = render(<RadarChart data={many} axes={axes} label="Team profile" />);
    expect(container.querySelectorAll('.paul-chart__radar-area')).toHaveLength(3);
    expect(screen.queryByText('D')).toBeNull();
  });

  it('draws a spoke per axis and a set of rings', () => {
    const { container } = render(<RadarChart data={data} axes={axes} label="Team profile" />);
    expect(container.querySelectorAll('.paul-chart__axis')).toHaveLength(3);
    expect(container.querySelectorAll('.paul-chart__ring').length).toBeGreaterThan(0);
  });

  it('names every axis', () => {
    render(<RadarChart data={data} axes={axes} label="Team profile" />);
    for (const axis of axes) expect(screen.getByText(axis)).toBeInTheDocument();
  });

  it('scales every series against one shared ceiling', () => {
    const { container } = render(
      <RadarChart
        data={[
          { label: 'Alpha', values: [10, 10, 10] },
          { label: 'Beta', values: [5, 5, 5] },
        ]}
        axes={axes}
        label="Team profile"
      />,
    );
    const [alpha, beta] = [...container.querySelectorAll('.paul-chart__radar-area')];
    const outer = radii(alpha);
    const inner = radii(beta);
    // Beta never rescales to fill the frame: it stays at half of Alpha's reach.
    for (let i = 0; i < outer.length; i += 1) {
      expect(inner[i]).toBeCloseTo(outer[i] / 2, 1);
    }
  });

  it('honours an explicit max', () => {
    const { container } = render(
      <RadarChart data={[{ label: 'Alpha', values: [5, 5, 5] }]} axes={axes} label="P" max={10} />,
    );
    const polygon = container.querySelector('.paul-chart__radar-area')!;
    // Half of the 62-unit radius, because the ceiling is 10 and not the series max.
    for (const r of radii(polygon)) expect(r).toBeCloseTo(31, 0);
  });

  it('shows a legend for two or more series', () => {
    const { container } = render(<RadarChart data={data} axes={axes} label="Team profile" />);
    expect(container.querySelector('.paul-chart__legend')).toBeInTheDocument();
    expect(container.querySelectorAll('.paul-chart__legend-item')).toHaveLength(2);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('omits the legend for a single series — the accessible name already says what it is', () => {
    const { container } = render(<RadarChart data={[data[0]]} axes={axes} label="Team profile" />);
    expect(container.querySelector('.paul-chart__legend')).toBeNull();
  });

  it('renders an empty state without a chart', () => {
    const { container } = render(<RadarChart data={[]} axes={axes} label="Team profile" />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe('Team profile');
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.paul-chart__empty')).toBeInTheDocument();
  });

  it('colours series from the categorical palette', () => {
    const { container } = render(<RadarChart data={data} axes={axes} label="Team profile" />);
    const fills = [...container.querySelectorAll('.paul-chart__radar-area')].map((p) =>
      p.getAttribute('fill'),
    );
    expect(fills).toEqual(['var(--paul-chart-1)', 'var(--paul-chart-2)']);
  });

  it('leaves the frame recessive rather than colouring it from the palette', () => {
    const { container } = render(<RadarChart data={data} axes={axes} label="Team profile" />);
    for (const el of container.querySelectorAll('.paul-chart__axis, .paul-chart__ring')) {
      expect(el.getAttribute('fill')).toBeNull();
      expect(el.getAttribute('stroke')).toBeNull();
    }
  });
});

describe('RadarChart series cap', () => {
  it('warns when it drops series instead of truncating silently', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <RadarChart
        label="Team profile"
        axes={['Speed', 'Power']}
        data={[
          { label: 'A', values: [1, 2] },
          { label: 'B', values: [2, 3] },
          { label: 'C', values: [3, 4] },
          { label: 'D', values: [4, 5] },
        ]}
      />,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('4 series given, 3 drawn');
    warn.mockRestore();
  });

  it('says nothing at or below the cap', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <RadarChart
        label="Team profile"
        axes={['Speed', 'Power']}
        data={[
          { label: 'A', values: [1, 2] },
          { label: 'B', values: [2, 3] },
          { label: 'C', values: [3, 4] },
        ]}
      />,
    );
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
