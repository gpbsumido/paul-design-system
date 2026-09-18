import {
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type LightBloomProps = {
  variant?: 'bloom' | 'shaft';
  direction?: 'bottom' | 'top' | 'left' | 'right';
  baseColor?: string;
  accentColor?: string;
  background?: string;
  /** How far the lit area reaches, 0–100. */
  spread?: number;
  shaftCount?: number;
  children?: ReactNode;
  className?: string;
};

/**
 * A soft glow blooming from one edge of the frame, its origin sliding toward the
 * pointer, breathing slowly. Reinterpreted on the tokens from the OriginKit
 * component — the original is a WebGL fragment shader; this is a CSS radial
 * bloom (with optional drifting light shafts) that captures the look without a
 * renderer. The glow is decorative (`aria-hidden`); pass content to layer over
 * it. Under reduced motion the breathing, drift and pointer-follow stop.
 */
export function LightBloom({
  variant = 'bloom',
  direction = 'bottom',
  baseColor = '#3b6cff',
  accentColor = '#a5c8ff',
  background = '#05060a',
  spread = 55,
  shaftCount = 6,
  children,
  className,
}: LightBloomProps) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--lb-px', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--lb-py', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  const style = {
    '--lb-base': baseColor,
    '--lb-accent': accentColor,
    '--lb-bg': background,
    '--lb-spread': `${spread}%`,
    '--lb-shafts': shaftCount,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={cx(
        'light-bloom',
        `light-bloom--${direction}`,
        variant === 'shaft' && 'light-bloom--shaft',
        className,
      )}
      style={style}
      onPointerMove={onPointerMove}
    >
      <span aria-hidden="true" className="light-bloom__glow" />
      {variant === 'shaft' ? (
        <span aria-hidden="true" className="light-bloom__shafts" />
      ) : null}
      {children ? <div className="light-bloom__content">{children}</div> : null}
    </div>
  );
}
