import { createElement, type ElementType, type ReactNode } from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type LiquidGlassProps = {
  children: ReactNode;
  /** The element to render. Defaults to a div. */
  as?: ElementType;
  className?: string;
};

/**
 * iOS "Liquid Glass": a frosted, translucent surface with a specular highlight
 * that drifts across it. The surface itself is the frosted, tinted backdrop;
 * the drift is the liquid part. Under prefers-reduced-motion the sheen holds
 * still and the frosted surface remains.
 */
export function LiquidGlass({ children, as, className }: LiquidGlassProps) {
  const Tag = (as ?? 'div') as ElementType;
  const reduced = usePrefersReducedMotion();
  return createElement(
    Tag,
    { className: cx('liquid-glass', reduced && 'liquid-glass--static', className) },
    <span key="sheen" aria-hidden="true" className="liquid-glass__sheen" />,
    <div key="content" className="liquid-glass__content">
      {children}
    </div>,
  );
}
