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
