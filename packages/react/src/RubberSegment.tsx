import type { CSSProperties } from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

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
 */
export function RubberSegment({
  segments,
  value,
  onChange,
  className,
}: RubberSegmentProps) {
  const reduced = usePrefersReducedMotion();
  const activeIndex = Math.max(0, segments.indexOf(value));
  const indicatorStyle = {
    '--paul-segment-count': segments.length,
    '--paul-segment-index': activeIndex,
  } as CSSProperties;

  return (
    <div
      role="radiogroup"
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
