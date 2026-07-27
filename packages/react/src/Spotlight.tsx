import {
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type SpotlightProps = HTMLAttributes<HTMLDivElement> & {
  /** Diameter of the glow, in pixels. */
  size?: number;
  /** Glow colour. Any CSS colour; defaults to a soft brand-blue wash. */
  color?: string;
  children: ReactNode;
};

/**
 * An interactive background: a soft radial glow that follows the cursor across
 * the surface. The glow is decorative and clipped to the container, and the
 * content sits in its own layer on top, so the component stays content-agnostic.
 * Under prefers-reduced-motion the glow is pinned to the centre and stops
 * tracking the pointer — visible, but with no cursor-driven movement.
 */
export function Spotlight({
  size = 350,
  color,
  className,
  style,
  children,
  ...rest
}: SpotlightProps) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const baseStyle: CSSProperties = {
    ['--paul-spotlight-size']: `${size}px`,
    ...(color ? { ['--paul-spotlight-color']: color } : {}),
    ...style,
  } as CSSProperties;

  // Static, centred glow — visible, but never chases the pointer.
  if (reduced) {
    return (
      <div
        className={cx('spotlight', className)}
        data-active="true"
        style={baseStyle}
        {...rest}
      >
        <div aria-hidden="true" className="spotlight__glow" />
        <div className="spotlight__content">{children}</div>
      </div>
    );
  }

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--paul-spotlight-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--paul-spotlight-y', `${e.clientY - rect.top}px`);
    el.dataset.active = 'true';
  };

  const handleLeave = () => {
    const el = rootRef.current;
    if (el) delete el.dataset.active;
  };

  return (
    <div
      ref={rootRef}
      className={cx('spotlight', className)}
      style={baseStyle}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...rest}
    >
      <div aria-hidden="true" className="spotlight__glow" />
      <div className="spotlight__content">{children}</div>
    </div>
  );
}
