import { useEffect, useState, type ElementType, type ReactNode } from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type TextLoopProps = {
  /** The phrases to cycle through, in order. */
  items: string[];
  /** How long each phrase holds before the next slides up, in milliseconds. */
  intervalMs?: number;
  /** The element to render as the inline container. Defaults to a span. */
  as?: ElementType;
  className?: string;
};

/**
 * Cycles a list of phrases in place, each sliding up as the next arrives. Every
 * phrase stays in the DOM (only the active one is exposed to assistive tech), so
 * it reads as a single word that keeps changing rather than a run-on. Under
 * prefers-reduced-motion the slide is dropped and the phrase simply swaps.
 */
export function TextLoop({
  items,
  intervalMs = 2200,
  as,
  className,
}: TextLoopProps): ReactNode {
  const Tag = (as ?? 'span') as ElementType;
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      intervalMs,
    );
    return () => clearInterval(id);
  }, [items.length, intervalMs]);

  return (
    <Tag className={cx('text-loop', className)}>
      <span
        className="text-loop__track"
        data-reduced={reduced ? 'true' : undefined}
        style={{ transform: `translateY(-${index * 100}%)` }}
      >
        {items.map((item, i) => (
          <span
            // The list is fixed and order-stable, so the index is a safe key.
            key={i}
            className="text-loop__item"
            aria-hidden={i === index ? undefined : 'true'}
          >
            {item}
          </span>
        ))}
      </span>
    </Tag>
  );
}
