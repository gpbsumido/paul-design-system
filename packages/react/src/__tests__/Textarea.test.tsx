import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Textarea } from '../Textarea';

describe('Textarea', () => {
  it('associates the label with the field', () => {
    render(<Textarea label="Bio" />);
    expect(screen.getByLabelText('Bio')).toHaveClass('textarea');
  });

  it('marks the field invalid and links the error text', () => {
    render(<Textarea label="Bio" error="Too short" />);
    const field = screen.getByLabelText('Bio');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveClass('textarea--error');
    expect(screen.getByText('Too short')).toBeInTheDocument();
  });

  it('shows helper text when there is no error', () => {
    render(<Textarea label="Bio" helper="Max 200 chars" />);
    expect(screen.getByText('Max 200 chars')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLTextAreaElement | null>;
    render(<Textarea label="Bio" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
