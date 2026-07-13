import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Input } from '../Input';

describe('Input', () => {
  it('renders label text', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders input element', () => {
    render(<Input label="Email" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('error prop shows error message and sets aria-invalid', () => {
    render(<Input label="Email" error="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('helper text rendered and linked via aria-describedby', () => {
    render(<Input label="Email" helper="Enter your email" />);
    const helper = screen.getByText('Enter your email');
    expect(helper).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', helper.id);
  });

  it('disabled state', () => {
    render(<Input label="Email" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('forwards ref to input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input label="Email" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('onChange fires', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input label="Email" onChange={handleChange} />);
    await user.type(screen.getByRole('textbox'), 'a');
    expect(handleChange).toHaveBeenCalled();
  });

  it('size variants apply correct class', () => {
    const { rerender } = render(<Input label="Email" size="sm" />);
    expect(screen.getByRole('textbox')).toHaveClass('input--sm');

    rerender(<Input label="Email" size="md" />);
    expect(screen.getByRole('textbox')).toHaveClass('input');
  });

  it('default renders with .input class', () => {
    render(<Input label="Email" />);
    expect(screen.getByRole('textbox')).toHaveClass('input');
  });
});
