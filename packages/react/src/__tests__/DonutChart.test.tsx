import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DonutChart } from '../DonutChart';

const data = [
  { label: 'Online', value: 6, color: '#22c55e' },
  { label: 'Degraded', value: 3, color: '#f59e0b' },
  { label: 'Offline', value: 1, color: '#ef4444' },
];

describe('DonutChart', () => {
  it('renders one arc per non-zero slice', () => {
    const { container } = render(<DonutChart data={data} label="Fleet health" />);
    expect(container.querySelectorAll('path.paul-chart__slice')).toHaveLength(3);
  });

  it('renders a legend row per slice with label and value', () => {
    render(<DonutChart data={data} label="Fleet health" />);
    const legend = screen.getByRole('list');
    expect(legend).toBeTruthy();
    expect(screen.getByText(/Online/)).toBeTruthy();
    expect(screen.getByText(/Offline/)).toBeTruthy();
  });

  it('can hide the legend', () => {
    render(<DonutChart data={data} label="Fleet health" legend={false} />);
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('summarises the slices in the accessible label', () => {
    render(<DonutChart data={data} label="Fleet health" />);
    expect(screen.getByRole('img', { name: /Fleet health/ })).toBeTruthy();
  });

  it('handles empty data as an accessible figure with no slices', () => {
    const { container } = render(<DonutChart data={[]} label="No stores" />);
    expect(screen.getByRole('img', { name: 'No stores' })).toBeTruthy();
    expect(container.querySelectorAll('path.paul-chart__slice')).toHaveLength(0);
  });
});
