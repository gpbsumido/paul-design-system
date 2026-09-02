import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox } from '../Combobox';

const options = [
  { value: 'gpt', label: 'GPT-4o' },
  { value: 'claude', label: 'Claude Opus' },
  { value: 'llama', label: 'Llama 3' },
];

describe('Combobox', () => {
  it('renders a labelled combobox that starts collapsed', () => {
    render(<Combobox label="Model" options={options} onChange={vi.fn()} />);
    const input = screen.getByRole('combobox', { name: 'Model' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens and filters the list as you type', async () => {
    render(<Combobox label="Model" options={options} onChange={vi.fn()} />);
    await userEvent.type(screen.getByRole('combobox'), 'cla');
    const list = screen.getAllByRole('option');
    expect(list).toHaveLength(1);
    expect(list[0]).toHaveTextContent('Claude Opus');
  });

  it('selects an option with the keyboard and reports the value', async () => {
    const onChange = vi.fn();
    render(<Combobox label="Model" options={options} onChange={onChange} />);
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('gpt');
    expect(input).toHaveValue('GPT-4o');
  });

  it('selects an option on click', async () => {
    const onChange = vi.fn();
    render(<Combobox label="Model" options={options} onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Llama 3' }));
    expect(onChange).toHaveBeenCalledWith('llama');
  });

  it('closes the list on Escape', async () => {
    render(<Combobox label="Model" options={options} onChange={vi.fn()} />);
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });
});
