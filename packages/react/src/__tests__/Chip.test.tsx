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

  it('clickable variant fires onClick', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Chip label="Tag" clickable onClick={handleClick} />);
    const chip = screen.getByText('Tag').closest('.chip');
    expect(chip).toHaveClass('chip--clickable');
    await user.click(chip!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('removable variant shows close button and fires onRemove', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    render(<Chip label="Tag" removable onRemove={handleRemove} />);
    const chip = screen.getByText('Tag').closest('.chip');
    expect(chip).toHaveClass('chip--removable');
    const removeBtn = screen.getByRole('button', { name: 'Remove' });
    expect(removeBtn).toHaveClass('chip__remove');
    await user.click(removeBtn);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('has correct base class .chip', () => {
    const { container } = render(<Chip label="Tag" />);
    expect(container.firstElementChild).toHaveClass('chip');
  });
});
