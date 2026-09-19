import { useEffect, useId, useRef, type CSSProperties, type ReactNode, type PointerEvent, type MouseEventHandler } from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export type LiquidCarveButtonProps = {
  label: ReactNode;
  blobColor?: string;
  fillColor?: string;
  textColor?: string;
  radius?: number;
  href?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  className?: string;
  id?: string;
  'aria-label'?: string;
};

/** A subtractive SVG carve with independent, velocity-preserving springs. */
export function LiquidCarveButton({ label, blobColor, fillColor, textColor, radius,
  href, disabled = false, onClick, className, ...attributes }: LiquidCarveButtonProps) {
  const reduced = usePrefersReducedMotion();
  const id = useId().replace(/:/g, '');
  const pathRef = useRef<SVGPathElement>(null);
  const frameRef = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);
  const target = useRef({ x: 0, y: 0, r: 0 });
  const current = useRef({ x: 0, y: 0, r: 0 });
  const velocity = useRef({ x: 0, y: 0, r: 0 });

  function stop() {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    lastTime.current = null;
  }
  useEffect(() => {
    if (reduced || disabled) {
      stop();
      target.current.r = 0;
      current.current.r = 0;
      velocity.current = { x: 0, y: 0, r: 0 };
      pathRef.current?.setAttribute('d', '');
    }
    return stop;
  }, [reduced, disabled]);

  function frame(time: number) {
    const dt = Math.min((time - (lastTime.current ?? time - 16)) / 1000, 0.032);
    lastTime.current = time;
    // Exact critically damped spring solution; changing target keeps velocity.
    const omega = 22;
    let moving = false;
    for (const axis of ['x', 'y', 'r'] as const) {
      const delta = current.current[axis] - target.current[axis];
      const c = velocity.current[axis] + omega * delta;
      const decay = Math.exp(-omega * dt);
      current.current[axis] = target.current[axis] + (delta + c * dt) * decay;
      velocity.current[axis] = (velocity.current[axis] - omega * c * dt) * decay;
      if (Math.abs(current.current[axis] - target.current[axis]) > 0.02 || Math.abs(velocity.current[axis]) > 0.1) moving = true;
    }
    const { x, y, r } = current.current;
    const speed = Math.hypot(velocity.current.x, velocity.current.y);
    const tail = r * (1 + Math.min(speed / 800, 0.8));
    const angle = Math.atan2(velocity.current.y, velocity.current.x) * 180 / Math.PI;
    pathRef.current?.setAttribute('d', r < 0.02 ? '' :
      `M ${r} 0 C ${r} ${r * 0.75} ${-tail} ${r} ${-tail} 0 C ${-tail} ${-r} ${r} ${-r * 0.75} ${r} 0 Z`);
    pathRef.current?.setAttribute('transform', `translate(${x} ${y}) rotate(${angle})`);
    if (moving) frameRef.current = requestAnimationFrame(frame);
    else { frameRef.current = null; lastTime.current = null; }
  }
  function wake() {
    if (frameRef.current === null) frameRef.current = requestAnimationFrame(frame);
  }
  function move(event: PointerEvent<HTMLElement>, entering = false) {
    if (reduced || disabled || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    target.current.x = event.clientX - rect.left;
    target.current.y = event.clientY - rect.top;
    if (entering) {
      if (current.current.r < 0.02) {
        current.current.x = target.current.x;
        current.current.y = target.current.y;
      }
      target.current.r = Math.max(16, rect.height * 0.55);
    }
    wake();
  }
  function leave() {
    if (reduced || disabled) return;
    target.current.r = 0;
    wake();
  }
  const style = {
    ...(blobColor ? { '--lcb-blob': blobColor } : {}),
    ...(fillColor ? { '--lcb-fill': fillColor } : {}),
    ...(textColor ? { '--lcb-text': textColor } : {}),
    ...(radius !== undefined ? { '--lcb-radius': `${Math.max(0, radius)}px` } : {}),
  } as CSSProperties;
  const common = {
    ...attributes, className: cx('liquid-carve-button', className), style,
    onPointerEnter: (e: PointerEvent<HTMLElement>) => move(e, true),
    onPointerMove: (e: PointerEvent<HTMLElement>) => move(e),
    onPointerLeave: leave, onPointerCancel: leave,
    onClick: ((event) => {
      if (disabled) { event.preventDefault(); return; }
      onClick?.(event);
    }) as MouseEventHandler<HTMLElement>,
  };
  const content = <>
    <svg className="liquid-carve-button__surface" aria-hidden="true" focusable="false">
      <defs>
        <filter id={`${id}-soften`} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <mask id={`${id}-carve`} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%" style={{ maskType: 'luminance' }}>
          <rect width="100%" height="100%" fill="white" />
          <path ref={pathRef} d="" fill="black" filter={`url(#${id}-soften)`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="var(--lcb-fill, var(--paul-color-neutral-800))" mask={`url(#${id}-carve)`} />
    </svg>
    <span className="liquid-carve-button__label">{label}</span>
  </>;
  return href
    ? <a {...common} href={href} aria-disabled={disabled || undefined} tabIndex={disabled ? -1 : undefined}>{content}</a>
    : <button {...common} type="button" disabled={disabled}>{content}</button>;
}
