import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton } from '../IconButton';

describe('IconButton', () => {
  it('names the button from aria-label', () => {
    render(<IconButton aria-label="Close">✕</IconButton>);
    expect(screen.getByRole('button', { name: 'Close' })).toHaveClass('icon-btn');
  });

  it('applies the small size class', () => {
    render(
      <IconButton aria-label="Close" size="sm">
        ✕
      </IconButton>,
    );
    expect(screen.getByRole('button')).toHaveClass('icon-btn--sm');
  });

  it('defaults to type=button so it never submits a form by accident', () => {
    render(<IconButton aria-label="Close">✕</IconButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('fires onClick', async () => {
    const onClick = vi.fn();
    render(
      <IconButton aria-label="Close" onClick={onClick}>
        ✕
      </IconButton>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLButtonElement | null>;
    render(
      <IconButton aria-label="Close" ref={ref}>
        ✕
      </IconButton>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
