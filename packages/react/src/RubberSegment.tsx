import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/** Layout effect on the client, a no-op-safe effect on the server (SSR). */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type RubberSegmentProps = {
  /** The segment labels, in order. */
  segments: string[];
  /** The currently selected segment. */
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

/**
 * A segmented control whose selection indicator rubber-bands between segments —
 * it overshoots and settles rather than sliding stiffly, so switching feels
 * elastic. A real `role="radiogroup"` of radios, keyboard-operable. Under
 * prefers-reduced-motion the indicator jumps without the elastic travel.
 *
 * Segments size to their labels rather than to equal widths, so the indicator
 * hugs each one; it takes the active option's measured position and width so a
 * short label and a long one both get a snug pill. Before measurement (SSR, no
 * ResizeObserver) it holds still and hidden rather than guessing.
 */
export function RubberSegment({
  segments,
  value,
  onChange,
  className,
}: RubberSegmentProps) {
  const reduced = usePrefersReducedMotion();
  const activeIndex = Math.max(0, segments.indexOf(value));
  const rootRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return;
    // ResizeObserver fires on observe and on any width change (a web font
    // loading, the container resizing), so the pill is measured from a callback
    // rather than synchronously in the effect. Re-running on `value` re-measures
    // for the newly active option.
    const measure = () => {
      const active = root.querySelector<HTMLElement>('[aria-checked="true"]');
      if (active && active.offsetWidth > 0) {
        setPill({ x: active.offsetLeft, w: active.offsetWidth });
      }
    };
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [value, segments.length]);

  const indicatorStyle = {
    '--paul-segment-count': segments.length,
    '--paul-segment-index': activeIndex,
    ...(pill ? { '--rs-x': `${pill.x}px`, '--rs-w': `${pill.w}px` } : {}),
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      role="radiogroup"
      data-measured={pill ? 'true' : undefined}
      className={cx('rubber-segment', reduced && 'rubber-segment--static', className)}
    >
      <span
        aria-hidden="true"
        className="rubber-segment__indicator"
        style={indicatorStyle}
      />
      {segments.map((segment) => (
        <button
          key={segment}
          type="button"
          role="radio"
          aria-checked={segment === value}
          onClick={() => onChange(segment)}
          className="rubber-segment__option"
        >
          {segment}
        </button>
      ))}
    </div>
  );
}
