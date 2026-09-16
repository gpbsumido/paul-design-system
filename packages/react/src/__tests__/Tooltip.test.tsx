import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Tooltip, viewportNudge } from '../Tooltip';

afterEach(() => vi.useRealTimers());

describe('viewportNudge', () => {
  const vp = { width: 375, height: 640 };
  const box = (o: Partial<{ left: number; right: number; top: number; bottom: number }>) => ({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    ...o,
  });

  it('leaves a bubble that is already on screen alone', () => {
    expect(viewportNudge(box({ left: 100, right: 200, top: 100, bottom: 140 }), { x: 0, y: 0 }, vp)).toEqual({
      x: 0,
      y: 0,
    });
  });

  it('pulls a bubble back from the right and bottom edges', () => {
    const n = viewportNudge(box({ left: 300, right: 400, top: 600, bottom: 700 }), { x: 0, y: 0 }, vp);
    expect(n.x).toBe(375 - 8 - 400); // negative — back onto the screen
    expect(n.y).toBe(640 - 8 - 700);
  });

  it('pushes a bubble back from the left edge', () => {
    const n = viewportNudge(box({ left: -20, right: 80, top: 100, bottom: 140 }), { x: 0, y: 0 }, vp);
    expect(n.x).toBe(28); // 8 - (-20)
  });

  it('accounts for the nudge already applied, so it settles instead of drifting', () => {
    // Same base as the left-edge case (left -20), but the box is already shifted +28.
    const n = viewportNudge(box({ left: 8, right: 108, top: 100, bottom: 140 }), { x: 28, y: 0 }, vp);
    expect(n).toEqual({ x: 28, y: 0 });
  });
});

/** Hover the anchor and let the show-delay elapse. */
function hover(el: HTMLElement, ms = 500) {
  fireEvent.mouseEnter(el);
  act(() => vi.advanceTimersByTime(ms));
}

describe('Tooltip', () => {
  it('shrinks the anchor to content by default, and fills its container with fill', () => {
    const { rerender } = render(
      <Tooltip content="Tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    const anchor = () => screen.getByText('Trigger').parentElement!;
    expect(anchor()).not.toHaveStyle({ width: '100%' });

    rerender(
      <Tooltip content="Tip" fill>
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(anchor()).toHaveStyle({ width: '100%', height: '100%' });
  });

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
