import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('hides the label visually but keeps it accessible', () => {
    render(<Textarea label="Bio" hideLabel />);
    // still reachable by its accessible name
    const field = screen.getByLabelText('Bio');
    expect(field).toBeInTheDocument();
    // the label element carries the sr-only class
    expect(screen.getByText('Bio')).toHaveClass('sr-only');
  });

  it('shows and updates a live character count', async () => {
    render(<Textarea label="Bio" maxLength={100} showCount />);
    const count = screen.getByText('0 / 100');
    expect(count).toHaveAttribute('aria-live', 'polite');
    await userEvent.type(screen.getByLabelText('Bio'), 'hello');
    expect(screen.getByText('5 / 100')).toBeInTheDocument();
  });

  it('does not show a count without showCount', () => {
    render(<Textarea label="Bio" maxLength={100} />);
    expect(screen.queryByText('0 / 100')).toBeNull();
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLTextAreaElement | null>;
    render(<Textarea label="Bio" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
