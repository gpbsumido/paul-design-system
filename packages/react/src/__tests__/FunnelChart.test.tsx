import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FunnelChart } from '../FunnelChart';

const data = [
  { label: 'Visit', value: 1000 },
  { label: 'Signup', value: 620 },
  { label: 'Activate', value: 465 },
];

describe('FunnelChart', () => {
  it('exposes the figure as an image with a data summary', () => {
    render(<FunnelChart data={data} label="Signup funnel" />);
    const figure = screen.getByRole('img');
    expect(figure.getAttribute('aria-label')).toContain('Signup funnel');
    expect(figure.getAttribute('aria-label')).toContain('Visit 1000 (100%)');
    expect(figure.getAttribute('aria-label')).toContain('Signup 620 (62%)');
  });

  it('draws one band per stage', () => {
    const { container } = render(<FunnelChart data={data} label="Signup funnel" />);
    expect(container.querySelectorAll('.paul-chart__stage')).toHaveLength(3);
  });

  it('labels every stage with its value', () => {
    render(<FunnelChart data={data} label="Signup funnel" />);
    for (const d of data) {
      expect(screen.getByText(d.label)).toBeInTheDocument();
      expect(screen.getByText(String(d.value))).toBeInTheDocument();
    }
  });

  it('shows drop-off from the second stage on', () => {
    render(<FunnelChart data={data} label="Signup funnel" />);
    expect(screen.getByText('−38%')).toBeInTheDocument();
    expect(screen.getByText('−25%')).toBeInTheDocument();
    // The first stage has nothing to have dropped from.
    expect(screen.queryByText('−0%')).toBeNull();
  });

  it('hides drop-off when asked', () => {
    render(<FunnelChart data={data} label="Signup funnel" showDropOff={false} />);
    expect(screen.queryByText('−38%')).toBeNull();
  });

  it('renders an empty state without a chart', () => {
    const { container } = render(<FunnelChart data={[]} label="Signup funnel" />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe('Signup funnel');
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.paul-chart__empty')).toBeInTheDocument();
  });

  it('colours stages from the sequential ramp, not the categorical one', () => {
    const { container } = render(<FunnelChart data={data} label="Signup funnel" />);
    const fills = [...container.querySelectorAll('.paul-chart__stage')].map((p) =>
      p.getAttribute('fill'),
    );
    for (const fill of fills) expect(fill).toMatch(/--paul-chart-seq-\d/);
  });
});
