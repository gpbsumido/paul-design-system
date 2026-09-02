import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatComposer } from '../ChatComposer';

describe('ChatComposer', () => {
  it('submits the trimmed value on Enter and clears the field', async () => {
    const onSubmit = vi.fn();
    render(<ChatComposer label="Message" onSubmit={onSubmit} />);
    const field = screen.getByRole('textbox', { name: 'Message' });
    await userEvent.type(field, '  hello  ');
    await userEvent.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('hello');
    expect(field).toHaveValue('');
  });

  it('inserts a newline on Shift+Enter instead of submitting', async () => {
    const onSubmit = vi.fn();
    render(<ChatComposer label="Message" onSubmit={onSubmit} />);
    const field = screen.getByRole('textbox', { name: 'Message' });
    await userEvent.type(field, 'line one');
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}');
    expect(onSubmit).not.toHaveBeenCalled();
    expect(field).toHaveValue('line one\n');
  });

  it('submits when the send button is clicked', async () => {
    const onSubmit = vi.fn();
    render(<ChatComposer label="Message" onSubmit={onSubmit} submitLabel="Send" />);
    await userEvent.type(screen.getByRole('textbox'), 'ping');
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).toHaveBeenCalledWith('ping');
  });

  it('does not submit an empty message', async () => {
    const onSubmit = vi.fn();
    render(<ChatComposer label="Message" onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('disables input and send while busy', () => {
    render(<ChatComposer label="Message" onSubmit={vi.fn()} busy />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
  });
});
