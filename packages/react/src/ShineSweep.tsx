import { createElement, type ElementType, type ReactNode } from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type ShineSweepProps = {
  children: ReactNode;
  /** The element to render. Defaults to a span. */
  as?: ElementType;
  className?: string;
};

/**
 * A specular bar sweeps diagonally across the element, the way a highlight
 * travels over glossy hardware. Wrap a button or a badge in it. Under
 * prefers-reduced-motion the sheen isn't rendered at all.
 */
export function ShineSweep({ children, as, className }: ShineSweepProps) {
  const Tag = (as ?? 'span') as ElementType;
  const reduced = usePrefersReducedMotion();
  return createElement(
    Tag,
    { className: cx('shine-sweep', className) },
    children,
    reduced ? null : (
      <span key="sheen" aria-hidden="true" className="shine-sweep__sheen" />
    ),
  );
}
