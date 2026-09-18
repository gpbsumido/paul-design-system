import {
  createElement,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type BlurRevealProps = {
  children: ReactNode;
  /** The element to render. Defaults to a span. */
  as?: ElementType;
  className?: string;
  /** Stagger multiple reveals by offsetting the animation start. */
  delayMs?: number;
};

/**
 * Children resolve from a soft blur as they rise into place. Under
 * prefers-reduced-motion the class drops off and the content is simply present,
 * no animation.
 */
export function BlurReveal({ children, as, className, delayMs = 0 }: BlurRevealProps) {
  const Tag = (as ?? 'span') as ElementType;
  const reduced = usePrefersReducedMotion();
  const style: CSSProperties | undefined =
    reduced || delayMs === 0 ? undefined : { animationDelay: `${delayMs}ms` };
  return createElement(
    Tag,
    { className: cx(!reduced && 'blur-reveal', className), style },
    children,
  );
}
