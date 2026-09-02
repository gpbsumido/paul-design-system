import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RichTextEditor } from '../RichTextEditor';

describe('RichTextEditor', () => {
  beforeEach(() => {
    // execCommand is not implemented in jsdom; stub it so we can assert calls.
    document.execCommand = vi.fn(() => true);
  });

  it('renders an accessible toolbar and editable region', () => {
    render(<RichTextEditor label="Message" />);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    const editor = screen.getByRole('textbox', { name: 'Message' });
    expect(editor).toHaveAttribute('contenteditable', 'true');
    expect(editor).toHaveAttribute('aria-multiline', 'true');
  });

  it('only renders the toolbar controls it is given', () => {
    render(<RichTextEditor label="Message" toolbar={['bold', 'italic']} />);
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Bullet list' })).toBeNull();
  });

  it('runs a formatting command when a toolbar button is pressed', async () => {
    render(<RichTextEditor label="Message" toolbar={['bold']} />);
    await userEvent.click(screen.getByRole('button', { name: 'Bold' }));
    expect(document.execCommand).toHaveBeenCalledWith('bold', false, undefined);
  });

  it('emits the current HTML on input', async () => {
    const onChange = vi.fn();
    render(<RichTextEditor label="Message" onChange={onChange} />);
    const editor = screen.getByRole('textbox', { name: 'Message' });
    editor.innerHTML = '<p>hi</p>';
    editor.dispatchEvent(new InputEvent('input', { bubbles: true }));
    expect(onChange).toHaveBeenCalledWith('<p>hi</p>');
  });

  it('applies bold via the keyboard shortcut', async () => {
    render(<RichTextEditor label="Message" />);
    const editor = screen.getByRole('textbox', { name: 'Message' });
    editor.focus();
    await userEvent.keyboard('{Control>}b{/Control}');
    expect(document.execCommand).toHaveBeenCalledWith('bold', false, undefined);
  });
});
