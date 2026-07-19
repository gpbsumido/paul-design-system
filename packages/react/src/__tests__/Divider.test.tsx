import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Divider } from '../Divider';

describe('Divider', () => {
  it('renders a horizontal separator by default', () => {
    render(<Divider />);
    const sep = screen.getByRole('separator');
    expect(sep).toHaveClass('divider');
    expect(sep).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('supports a vertical orientation', () => {
    render(<Divider orientation="vertical" />);
    const sep = screen.getByRole('separator');
    expect(sep).toHaveClass('divider--vertical');
    expect(sep).toHaveAttribute('aria-orientation', 'vertical');
  });
});
