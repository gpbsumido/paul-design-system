import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { TextLoop } from '../TextLoop';

function stubReducedMotion(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('TextLoop', () => {
  it('renders every phrase but exposes only the active one to assistive tech', () => {
    stubReducedMotion(false);
    const { container } = render(<TextLoop items={['fast', 'safe', 'fair']} />);
    const items = container.querySelectorAll('.text-loop__item');
    expect(items).toHaveLength(3);
    expect(items[0].getAttribute('aria-hidden')).toBeNull();
    expect(items[1].getAttribute('aria-hidden')).toBe('true');
  });

  it('advances to the next phrase on the interval', () => {
    vi.useFakeTimers();
    stubReducedMotion(false);
    const { container } = render(
      <TextLoop items={['one', 'two']} intervalMs={1000} />,
    );
    const track = container.querySelector('.text-loop__track') as HTMLElement;
    expect(track.style.transform).toBe('translateY(-0%)');
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(track.style.transform).toBe('translateY(-100%)');
  });
});
