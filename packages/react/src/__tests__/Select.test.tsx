import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Select } from '../Select';

function options() {
  return (
    <>
      <option value="a">A</option>
      <option value="b">B</option>
    </>
  );
}

describe('Select', () => {
  it('renders label text', () => {
    render(<Select label="Team">{options()}</Select>);
    expect(screen.getByText('Team')).toBeInTheDocument();
  });

  it('renders a combobox with an accessible name from the label', () => {
    render(<Select label="Team">{options()}</Select>);
    expect(screen.getByRole('combobox', { name: 'Team' })).toBeInTheDocument();
  });

  it('renders the passed options', () => {
    render(<Select label="Team">{options()}</Select>);
    expect(screen.getByRole('option', { name: 'A' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'B' })).toBeInTheDocument();
  });

  it('error prop shows error message and sets aria-invalid', () => {
    render(<Select label="Team" error="Required">{options()}</Select>);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('helper text rendered and linked via aria-describedby', () => {
    render(<Select label="Team" helper="Pick one">{options()}</Select>);
    const helper = screen.getByText('Pick one');
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-describedby', helper.id);
  });

  it('disabled state', () => {
    render(<Select label="Team" disabled>{options()}</Select>);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('forwards ref to the select element', () => {
    const ref = createRef<HTMLSelectElement>();
    render(<Select label="Team" ref={ref}>{options()}</Select>);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('onChange fires with the selected value', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select label="Team" defaultValue="a" onChange={handleChange}>{options()}</Select>);
    await user.selectOptions(screen.getByRole('combobox'), 'b');
    expect(handleChange).toHaveBeenCalled();
    expect(screen.getByRole('combobox')).toHaveValue('b');
  });

  it('size variant applies correct class', () => {
    const { rerender } = render(<Select label="Team" size="sm">{options()}</Select>);
    expect(screen.getByRole('combobox')).toHaveClass('select--sm');

    rerender(<Select label="Team" size="md">{options()}</Select>);
    expect(screen.getByRole('combobox')).toHaveClass('select');
    expect(screen.getByRole('combobox')).not.toHaveClass('select--md');
  });

  it('horizontal orientation applies the wrapper modifier', () => {
    const { container } = render(<Select label="Team" orientation="horizontal">{options()}</Select>);
    expect(container.querySelector('.select__wrapper')).toHaveClass('select__wrapper--horizontal');
  });

  it('default renders with .select class and vertical wrapper', () => {
    const { container } = render(<Select label="Team">{options()}</Select>);
    expect(screen.getByRole('combobox')).toHaveClass('select');
    expect(container.querySelector('.select__wrapper')).not.toHaveClass('select__wrapper--horizontal');
  });

  it('supports an aria-label when there is no visible label', () => {
    render(<Select aria-label="Season">{options()}</Select>);
    expect(screen.getByRole('combobox', { name: 'Season' })).toBeInTheDocument();
  });
});
