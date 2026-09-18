import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
} from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export type SmoothScrollSlide = {
  image: string;
  title?: string;
  href?: string;
};

type SmoothScrollSliderProps = {
  slides: SmoothScrollSlide[];
  slideWidth?: number;
  slideHeight?: number;
  spacing?: number;
  /** Laziness of the coast — higher trails the input further. */
  smoothness?: number;
  /** How far off-centre slides dim, 0 (none) to 10. */
  dim?: number;
  /** How far wheel/drag input travels the rail. */
  sensitivity?: number;
  /** Wrap the rail so it scrolls forever. */
  loop?: boolean;
  className?: string;
};

/**
 * A horizontal rail of cards that grow toward the centre and coast after you
 * flick it. Reinterpreted on the tokens from the OriginKit component: a target
 * offset and a rendered offset joined by a frame-rate-independent lerp give the
 * momentum, and each card scales by its distance from the centre. Wheel, drag
 * and keyboard all drive it. Under reduced motion the coast is removed (the rail
 * tracks input directly) while the centre-scaling stays, since it's spatial.
 */
export function SmoothScrollSlider({
  slides,
  slideWidth = 320,
  slideHeight = 200,
  spacing = 16,
  smoothness = 10,
  dim = 4,
  sensitivity = 5,
  loop = true,
  className,
}: SmoothScrollSliderProps) {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  const targetRef = useRef(0);
  const renderedRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
  const [width, setWidth] = useState(800);

  const unit = slideWidth + spacing;
  const total = Math.max(unit, slides.length * unit);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width || 800);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const half = width / 2;
    const reach = Math.max(1, half);

    const frame = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      if (!draggingRef.current) {
        targetRef.current += velocityRef.current * dt;
        velocityRef.current *= Math.exp(-dt / 0.5);
        if (Math.abs(velocityRef.current) < 1) velocityRef.current = 0;
      }

      const follow = reduced ? 1 : 1 - Math.exp(-dt / (smoothness / 60));
      renderedRef.current += (targetRef.current - renderedRef.current) * follow;
      const rendered = renderedRef.current;

      for (let i = 0; i < slideRefs.current.length; i++) {
        const el = slideRefs.current[i];
        if (!el) continue;
        let screenX = i * unit - rendered;
        if (loop) screenX = ((((screenX + total / 2) % total) + total) % total) - total / 2;
        const t = Math.min(1, Math.abs(screenX) / reach);
        const scale = 1.5 - 0.9 * t;
        const opacity = 1 - (dim / 10) * t;
        el.style.transform = `translate3d(calc(-50% + ${screenX}px), -50%, 0) scale(${scale})`;
        el.style.opacity = `${opacity}`;
        el.style.zIndex = `${Math.round((1 - t) * 100)}`;
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [width, unit, total, loop, dim, smoothness, reduced]);

  const onWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    targetRef.current += delta * (sensitivity / 5);
    velocityRef.current = 0;
  };

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
    targetRef.current -= dx * (sensitivity / 5);
    renderedRef.current -= dx * (sensitivity / 5);
    velocityRef.current = reduced ? 0 : -dx * 40;
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
    '--sss-w': `${slideWidth}px`,
    '--sss-h': `${slideHeight}px`,
  } as CSSProperties;

  const renderSlide = (slide: SmoothScrollSlide, i: number): ReactNode => {
    const inner = (
      <img src={slide.image} alt={slide.title ?? ''} loading="lazy" draggable={false} />
    );
    const ref = (el: HTMLElement | null) => {
      slideRefs.current[i] = el;
    };
    if (slide.href) {
      return (
        <a key={i} ref={ref} className="smooth-scroll-slider__slide" href={slide.href}>
          {inner}
        </a>
      );
    }
    return (
      <div key={i} ref={ref} className="smooth-scroll-slider__slide">
        {inner}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cx('smooth-scroll-slider', className)}
      style={rootStyle}
      role="group"
      aria-label="Scrollable slider"
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="smooth-scroll-slider__rail">
        {slides.map((slide, i) => renderSlide(slide, i))}
      </div>
    </div>
  );
}
