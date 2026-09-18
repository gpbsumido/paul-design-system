import {
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export type CircularGalleryItem = {
  image: string;
  title?: string;
  href?: string;
};

type CircularGalleryProps = {
  items: CircularGalleryItem[];
  radius?: number;
  cardWidth?: number;
  cardHeight?: number;
  autoRotate?: boolean;
  className?: string;
};

/**
 * Cards arranged on a rotating 3D cylinder you can spin with a drag. The
 * OriginKit original is WebGL; this reinterprets it as a CSS `preserve-3d` ring
 * — no renderer, no dependency. A drag flings it and it coasts; left alone it
 * turns slowly. The cards are real links; the ring is a labelled `role="group"`.
 * Under reduced motion the auto-spin and coast are dropped — it only turns while
 * you drag it.
 */
export function CircularGallery({
  items,
  radius = 320,
  cardWidth = 200,
  cardHeight = 140,
  autoRotate = true,
  className,
}: CircularGalleryProps) {
  const reduced = usePrefersReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  const count = Math.max(1, items.length);
  const angleStep = 360 / count;

  useEffect(() => {
    const frame = (ts: number) => {
      const dt =
        lastTsRef.current === null
          ? 0
          : Math.min(0.05, (ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;
      if (!draggingRef.current) {
        if (autoRotate && !reduced) rotationRef.current += 6 * dt;
        rotationRef.current += velocityRef.current * dt;
        velocityRef.current *= Math.exp(-dt / 0.6);
        if (Math.abs(velocityRef.current) < 0.5) velocityRef.current = 0;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translateZ(-${radius}px) rotateY(${rotationRef.current}deg)`;
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [autoRotate, radius, reduced]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
    if (typeof e.currentTarget.setPointerCapture === 'function')
      e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    rotationRef.current += dx * 0.3;
    velocityRef.current = reduced ? 0 : dx * 6;
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (
      typeof e.currentTarget.hasPointerCapture === 'function' &&
      e.currentTarget.hasPointerCapture(e.pointerId)
    )
      e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const rootStyle = {
    '--cg-w': `${cardWidth}px`,
    '--cg-h': `${cardHeight}px`,
  } as CSSProperties;

  return (
    <div
      className={cx('circular-gallery', className)}
      style={rootStyle}
      role="group"
      aria-label="Rotating gallery"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div ref={ringRef} className="circular-gallery__ring">
        {items.map((item, i) => {
          const cardStyle = {
            transform: `rotateY(${i * angleStep}deg) translateZ(${radius}px)`,
          } as CSSProperties;
          const inner = <img src={item.image} alt={item.title ?? ''} draggable={false} />;
          if (item.href) {
            return (
              <a
                key={i}
                href={item.href}
                className="circular-gallery__card"
                style={cardStyle}
              >
                {inner}
              </a>
            );
          }
          return (
            <div key={i} className="circular-gallery__card" style={cardStyle}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
