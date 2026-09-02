import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette } from '../CommandPalette';

const commands = [
  { id: 'new', label: 'New chat', onSelect: vi.fn() },
  { id: 'clear', label: 'Clear history', onSelect: vi.fn() },
  { id: 'theme', label: 'Toggle theme', keywords: ['dark', 'light'], onSelect: vi.fn() },
];

describe('CommandPalette', () => {
  it('renders nothing when closed', () => {
    render(<CommandPalette open={false} onClose={vi.fn()} commands={commands} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('lists every command when open', () => {
    render(<CommandPalette open onClose={vi.fn()} commands={commands} />);
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('filters commands by label and keywords', async () => {
    render(<CommandPalette open onClose={vi.fn()} commands={commands} />);
    await userEvent.type(screen.getByRole('combobox'), 'dark');
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Toggle theme');
  });

  it('selects the active command with the keyboard', async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(
      <CommandPalette
        open
        onClose={onClose}
        commands={[{ id: 'a', label: 'Alpha', onSelect }]}
      />,
    );
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on Escape', async () => {
    const onClose = vi.fn();
    render(<CommandPalette open onClose={onClose} commands={commands} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('shows an empty state when nothing matches', async () => {
    render(<CommandPalette open onClose={vi.fn()} commands={commands} />);
    await userEvent.type(screen.getByRole('combobox'), 'zzzzz');
    expect(screen.queryByRole('option')).toBeNull();
    expect(screen.getByText(/no commands/i)).toBeInTheDocument();
  });
});
