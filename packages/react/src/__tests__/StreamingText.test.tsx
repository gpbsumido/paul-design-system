import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { StreamingText } from '../StreamingText';

describe('StreamingText', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('reveals the text progressively over time', () => {
    vi.useFakeTimers();
    render(<StreamingText text="hello" speed={1} interval={10} />);
    const region = screen.getByRole('status');
    expect(region).toHaveTextContent('');
    act(() => {
      vi.advanceTimersByTime(30);
    });
    expect(region.textContent).toBe('hel');
    act(() => {
      vi.advanceTimersByTime(20);
    });
    expect(region.textContent).toBe('hello');
  });

  it('calls onDone once the full text has streamed', () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(<StreamingText text="hi" speed={1} interval={10} onDone={onDone} />);
    act(() => {
      vi.advanceTimersByTime(30);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('renders the whole string immediately when motion is reduced', () => {
    const mql = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mql));
    render(<StreamingText text="instant" />);
    expect(screen.getByRole('status')).toHaveTextContent('instant');
    vi.unstubAllGlobals();
  });
});
