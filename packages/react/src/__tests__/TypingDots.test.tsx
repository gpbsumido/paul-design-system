import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TypingDots } from '../TypingDots';

describe('TypingDots', () => {
  it('exposes a live status with an accessible label', () => {
    render(<TypingDots label="Assistant is typing" />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-label', 'Assistant is typing');
  });

  it('renders three animated dots that are hidden from the a11y tree', () => {
    const { container } = render(<TypingDots />);
    const dots = container.querySelectorAll('.typing-dots__dot');
    expect(dots).toHaveLength(3);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
