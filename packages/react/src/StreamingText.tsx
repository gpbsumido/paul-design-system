import { useEffect, useRef, useState } from 'react';
import { cx } from './cx';

type StreamingTextProps = {
  /** The full text to reveal. */
  text: string;
  /** Characters revealed per tick. */
  speed?: number;
  /** Milliseconds between ticks. */
  interval?: number;
  /** Show a blinking caret while streaming. */
  cursor?: boolean;
  /** Called once when the whole string has been revealed. */
  onDone?: () => void;
  className?: string;
};

function detectReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Reveals text a few characters at a time, the way a streamed model response
 * arrives, with an optional caret. Honours prefers-reduced-motion by showing
 * the whole string at once, and announces itself through a polite live region.
 */
export function StreamingText({
  text,
  speed = 2,
  interval = 30,
  cursor = true,
  onDone,
  className,
}: StreamingTextProps) {
  // Read the preference synchronously so a reduced-motion user never sees the
  // animation start, then keep it live for the rare mid-session change.
  const [reduced, setReduced] = useState(detectReducedMotion);
  const [count, setCount] = useState(() => (detectReducedMotion() ? text.length : 0));
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced) {
      setCount(text.length);
      onDoneRef.current?.();
      return;
    }
    setCount(0);
    let current = 0;
    const id = setInterval(() => {
      current = Math.min(current + speed, text.length);
      setCount(current);
      if (current >= text.length) {
        clearInterval(id);
        onDoneRef.current?.();
      }
    }, interval);
    return () => clearInterval(id);
  }, [text, speed, interval, reduced]);

  const streaming = count < text.length;

  return (
    <span role="status" aria-live="polite" className={cx('streaming-text', className)}>
      {text.slice(0, count)}
      {cursor && !reduced && streaming && (
        <span className="streaming-text__cursor" aria-hidden="true" />
      )}
    </span>
  );
}
