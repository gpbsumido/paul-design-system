import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chip } from '../Chip';

describe('Chip', () => {
  it('renders label text', () => {
    render(<Chip label="Tag" />);
    expect(screen.getByText('Tag')).toBeInTheDocument();
  });

  it('size variants (sm, md)', () => {
    const { rerender, container } = render(<Chip label="Tag" size="sm" />);
    expect(container.firstElementChild).toHaveClass('chip--sm');

    rerender(<Chip label="Tag" size="md" />);
    expect(container.firstElementChild).toHaveClass('chip');
  });

  it('clickable variant renders a label button and fires onClick', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Chip label="Tag" onClick={handleClick} />);
    expect(screen.getByText('Tag').closest('.chip')).toHaveClass('chip--clickable');
    // the label is a real, focusable button
    const labelBtn = screen.getByRole('button', { name: 'Tag' });
    expect(labelBtn).toHaveClass('chip__label');
    await user.click(labelBtn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('color sets the background and full-width stretches', () => {
    const { container } = render(<Chip label="Tag" color="#3b82f6" fullWidth />);
    const chip = container.firstElementChild as HTMLElement;
    expect(chip).toHaveClass('chip--full-width');
    expect(chip.style.backgroundColor).not.toBe('');
  });

  it('removable variant shows close button and fires onRemove', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    render(<Chip label="Tag" removable onRemove={handleRemove} />);
    const chip = screen.getByText('Tag').closest('.chip');
    expect(chip).toHaveClass('chip--removable');
    const removeBtn = screen.getByRole('button', { name: 'Remove Tag' });
    expect(removeBtn).toHaveClass('chip__remove');
    // A visible × glyph, so the button isn't a blank clickable square.
    expect(removeBtn).toHaveTextContent('×');
    await user.click(removeBtn);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('has correct base class .chip', () => {
    const { container } = render(<Chip label="Tag" />);
    expect(container.firstElementChild).toHaveClass('chip');
  });
});
