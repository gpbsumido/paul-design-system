import type { ReactNode } from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type StarBorderProps = {
  children: ReactNode;
  className?: string;
};

/**
 * An animated border: a conic gradient sweeps around the edge of the card. The
 * ring takes its colour from `currentColor`, so set the wrapper's text colour
 * to tint it. Under prefers-reduced-motion the ring is a static gradient frame,
 * never rotating.
 */
export function StarBorder({ children, className }: StarBorderProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <div className={cx('star-border', reduced && 'star-border--static', className)}>
      <span aria-hidden="true" className="star-border__ring" />
      <div className="star-border__content">{children}</div>
    </div>
  );
}
