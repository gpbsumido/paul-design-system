import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BarChart } from '../BarChart';

describe('BarChart', () => {
  it('renders one bar rect per value', () => {
    const { container } = render(<BarChart data={[3, 6, 9]} label="Revenue" />);
    expect(container.querySelectorAll('rect.paul-chart__bar')).toHaveLength(3);
  });

  it('exposes a data summary as the accessible label', () => {
    render(<BarChart data={[1, 2]} labels={['Jan', 'Feb']} label="Sales by month" />);
    expect(screen.getByRole('img', { name: /Sales by month/ })).toBeTruthy();
  });

  it('supports a horizontal orientation', () => {
    const { container } = render(
      <BarChart data={[1, 2, 3]} orientation="horizontal" label="l" />,
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain(
      'paul-chart__svg--horizontal',
    );
    expect(container.querySelectorAll('rect.paul-chart__bar')).toHaveLength(3);
  });

  it('applies per-bar colors when provided', () => {
    const { container } = render(
      <BarChart data={[1, 2]} colors={['#f00', '#0f0']} label="l" />,
    );
    const rects = container.querySelectorAll('rect.paul-chart__bar');
    expect(rects[0].getAttribute('fill')).toBe('#f00');
    expect(rects[1].getAttribute('fill')).toBe('#0f0');
  });

  it('renders nothing to draw for empty data but stays an accessible figure', () => {
    const { container } = render(<BarChart data={[]} label="Empty" />);
    expect(screen.getByRole('img', { name: 'Empty' })).toBeTruthy();
    expect(container.querySelectorAll('rect.paul-chart__bar')).toHaveLength(0);
  });
});
