import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { LiquidCarveButton } from '../LiquidCarveButton';

let frames: Map<number, FrameRequestCallback>;
let tick: number;
let seq: number;
let reduced: boolean;
vi.mock('../usePrefersReducedMotion', () => ({ usePrefersReducedMotion: () => reduced }));
beforeEach(() => {
  frames = new Map(); tick = 0; seq = 0; reduced = false;
  vi.stubGlobal('requestAnimationFrame', vi.fn((cb: FrameRequestCallback) => { frames.set(++seq, cb); return seq; }));
  vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => frames.delete(id)));
  vi.stubGlobal('PointerEvent', MouseEvent);
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
function advance(count = 1) {
  act(() => { for (let i = 0; i < count; i++) { tick += 16; const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(cb => cb(tick)); } });
}
function enter() {
  const button = screen.getByRole('button');
  vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({ x: 0, y: 0, left: 0, top: 0, width: 180, height: 48, right: 180, bottom: 48, toJSON() {} });
  fireEvent.pointerEnter(button, { clientX: 30, clientY: 20 });
  return button;
}
describe('LiquidCarveButton', () => {
  it('supports keyboard activation, native disabled state and anchor click handlers', async () => {
    const click = vi.fn();
    const { rerender } = render(<LiquidCarveButton label="Create" onClick={click} />);
    const user = userEvent.setup();
    await user.tab(); await user.keyboard('{Enter}');
    expect(click).toHaveBeenCalledTimes(1);
    rerender(<LiquidCarveButton label="Create" disabled onClick={click} />);
    expect(screen.getByRole('button')).toBeDisabled();
    fireEvent.click(screen.getByRole('button')); expect(click).toHaveBeenCalledTimes(1);
    rerender(<LiquidCarveButton label="Create" href="#work" onClick={click} />);
    fireEvent.click(screen.getByRole('link')); expect(click).toHaveBeenCalledTimes(2);
  });
  it('uses unique decorative SVG masks and remains axe-clean', async () => {
    const { container } = render(<><LiquidCarveButton label="One" /><LiquidCarveButton label="Two" /></>);
    const ids = [...container.querySelectorAll('mask')].map(el => el.id);
    expect(ids).toHaveLength(2); expect(new Set(ids).size).toBe(2);
    expect(await axe(container)).toHaveNoViolations();
  });
  it('runs only during interaction and settling, and cancels on unmount', () => {
    const { container, unmount } = render(<LiquidCarveButton label="Create" />);
    expect(frames.size).toBe(0);
    const button = enter(); advance(12);
    const path = container.querySelector('mask path')!;
    expect(path.getAttribute('d')).toMatch(/^M/);
    expect(path.getAttribute('d')).not.toMatch(/NaN|Infinity/);
    const before = path.getAttribute('d');
    fireEvent.pointerMove(button, { clientX: 150, clientY: 35 }); advance(4);
    expect(path.getAttribute('d')).not.toBe(before);
    fireEvent.pointerMove(button, { clientX: 10, clientY: 10 }); advance();
    expect(path.getAttribute('d')).not.toMatch(/NaN|Infinity/);
    fireEvent.pointerLeave(button); advance(240);
    expect(frames.size).toBe(0);
    fireEvent.pointerEnter(button, { clientX: 30, clientY: 20 });
    expect(frames.size).toBe(1); unmount(); expect(frames.size).toBe(0);
  });
  it('cancels and clears the carve when reduced motion becomes enabled', () => {
    const { container, rerender } = render(<LiquidCarveButton label="Create" />);
    enter(); advance(10); reduced = true;
    rerender(<LiquidCarveButton label="Create" />);
    expect(frames.size).toBe(0);
    expect(container.querySelector('mask path')).toHaveAttribute('d', '');
    fireEvent.pointerMove(screen.getByRole('button'), { clientX: 120, clientY: 30 });
    expect(frames.size).toBe(0);
  });
});
