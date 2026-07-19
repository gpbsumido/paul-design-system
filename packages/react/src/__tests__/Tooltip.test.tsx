import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Tooltip } from '../Tooltip';

afterEach(() => vi.useRealTimers());

/** Hover the anchor and let the show-delay elapse. */
function hover(el: HTMLElement, ms = 500) {
  fireEvent.mouseEnter(el);
  act(() => vi.advanceTimersByTime(ms));
}

describe('Tooltip', () => {
  it('is not rendered until shown', () => {
    render(
      <Tooltip content="Tip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('appears on hover after the delay and carries role + describedby', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Tip text" delay={500}>
        <button>Hover me</button>
      </Tooltip>,
    );
    const anchor = screen.getByText('Hover me').parentElement!;
    fireEvent.mouseEnter(anchor);
    // not yet — still within the delay
    expect(screen.queryByRole('tooltip')).toBeNull();
    act(() => vi.advanceTimersByTime(500));
    const tip = screen.getByRole('tooltip');
    expect(tip).toHaveTextContent('Tip text');
    expect(anchor).toHaveAttribute('aria-describedby', tip.id);
  });

  it('appears on focus and hides on Escape', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Tip">
        <button>Focus me</button>
      </Tooltip>,
    );
    const anchor = screen.getByText('Focus me').parentElement!;
    fireEvent.focus(anchor);
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.keyDown(anchor, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('applies the side class', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Tip" side="bottom">
        <button>Hover me</button>
      </Tooltip>,
    );
    hover(screen.getByText('Hover me').parentElement!);
    expect(screen.getByRole('tooltip')).toHaveClass('tooltip', 'tooltip--bottom');
  });

  it('renders rich node content', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content={<strong>Bold tip</strong>}>
        <button>Hover me</button>
      </Tooltip>,
    );
    hover(screen.getByText('Hover me').parentElement!);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Bold tip');
  });
});
