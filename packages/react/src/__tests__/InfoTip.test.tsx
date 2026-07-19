import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { InfoTip } from '../InfoTip';

afterEach(() => vi.useRealTimers());

/** Hover the trigger and let the popover's show-delay elapse. */
function reveal() {
  fireEvent.mouseEnter(screen.getByRole('img'));
  act(() => vi.advanceTimersByTime(500));
}

describe('InfoTip', () => {
  it('exposes an accessible, focusable trigger', () => {
    render(<InfoTip content="Shown on hover" />);
    const trigger = screen.getByRole('img', { name: 'More information' });
    expect(trigger).toHaveClass('info-tip');
    expect(trigger).toHaveAttribute('tabindex', '0');
  });

  it('reveals the content on hover', () => {
    vi.useFakeTimers();
    render(<InfoTip content="Shown on hover" />);
    expect(screen.queryByRole('tooltip')).toBeNull();
    reveal();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Shown on hover');
  });

  it('accepts rich node content and a custom label + side', () => {
    vi.useFakeTimers();
    render(
      <InfoTip
        content={
          <span>
            Line one
            <br />
            Line two
          </span>
        }
        label="What is this"
        side="bottom"
      />,
    );
    expect(screen.getByRole('img', { name: 'What is this' })).toBeInTheDocument();
    reveal();
    const tip = screen.getByRole('tooltip');
    expect(tip).toHaveClass('tooltip--bottom');
    expect(tip).toHaveTextContent('Line oneLine two');
  });
});
