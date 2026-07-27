import { useRef, type HTMLAttributes, type PointerEvent, type ReactNode } from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type TiltCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Maximum rotation, in degrees, at the edges of the card. */
  maxTilt?: number;
  /** Show the cursor-tracking glare highlight. Defaults to true. */
  glare?: boolean;
  children: ReactNode;
};

/**
 * A surface that tilts in 3D toward the pointer, with an optional glare that
 * tracks the cursor. The effect is purely decorative — the content layer stays
 * readable — and it is pointer-driven only, so keyboard users are never left
 * without access. Under prefers-reduced-motion it renders as a flat card with
 * no tilt or glare. Content-agnostic: pass any children (a Card, an image…).
 */
export function TiltCard({
  maxTilt = 12,
  glare = true,
  className,
  children,
  ...rest
}: TiltCardProps) {
  const reduced = usePrefersReducedMotion();
  const innerRef = useRef<HTMLDivElement>(null);

  // No tilt, no glare, no pointer handlers — just a flat, static card.
  if (reduced) {
    return (
      <div className={cx('tilt-card', className)} {...rest}>
        <div className="tilt-card__inner">{children}</div>
      </div>
    );
  }

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const px = (e.clientX - rect.left) / rect.width; // 0 (left) … 1 (right)
    const py = (e.clientY - rect.top) / rect.height; // 0 (top) … 1 (bottom)
    const rotateY = (px - 0.5) * 2 * maxTilt;
    const rotateX = -(py - 0.5) * 2 * maxTilt;
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.setProperty('--paul-tilt-x', `${rotateX.toFixed(2)}deg`);
    inner.style.setProperty('--paul-tilt-y', `${rotateY.toFixed(2)}deg`);
    inner.style.setProperty('--paul-glare-x', `${(px * 100).toFixed(1)}%`);
    inner.style.setProperty('--paul-glare-y', `${(py * 100).toFixed(1)}%`);
    inner.dataset.active = 'true';
  };

  const handleLeave = () => {
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.setProperty('--paul-tilt-x', '0deg');
    inner.style.setProperty('--paul-tilt-y', '0deg');
    delete inner.dataset.active;
  };

  return (
    <div
      className={cx('tilt-card', className)}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...rest}
    >
      <div ref={innerRef} className="tilt-card__inner">
        {glare && <div aria-hidden="true" className="tilt-card__glare" />}
        {children}
      </div>
    </div>
  );
}
