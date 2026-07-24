import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from './cx';

/**
 * Tracks prefers-reduced-motion. Defaults to false so the server and the first
 * client render agree (SSR-stable), then updates once mounted.
 */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return;
    }
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Microtask defer keeps the effect from setting state synchronously.
    queueMicrotask(() => setReduced(query.matches));
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

type TickerProps = {
  /** Accessible name for the strip. Scroll mode renders a labelled region. */
  label: string;
  /**
   * `scroll` (default) is an accessible, real scroll container with an ambient
   * auto-scroll — every item stays reachable. `marquee` is a decorative,
   * aria-hidden CSS loop for pure flavour.
   */
  mode?: 'scroll' | 'marquee';
  /** Which edge the strip sits on; picks the border side. */
  edge?: 'top' | 'bottom';
  /** Which way the ambient motion travels. */
  direction?: 'left' | 'right';
  /** Ambient auto-scroll speed for scroll mode, in px/sec. */
  speed?: number;
  className?: string;
  children: ReactNode;
};

/** How long a touch keeps the strip frozen before the ambient scroll resumes. */
const TOUCH_RESUME_MS = 4000;

/**
 * A horizontal ticker strip with two modes: an accessible, auto-scrolling
 * container (`scroll`) and a decorative CSS marquee (`marquee`). Both loop
 * seamlessly and both honour prefers-reduced-motion. Content is passed as
 * children, so the strip stays content-agnostic.
 */
export function Ticker(props: TickerProps) {
  return props.mode === 'marquee' ? (
    <MarqueeTicker {...props} />
  ) : (
    <ScrollTicker {...props} />
  );
}

function edgeClassFor(edge: 'top' | 'bottom'): string {
  return edge === 'top' ? 'ticker--top' : 'ticker--bottom';
}

/** Decorative marquee: aria-hidden, CSS-driven, content duplicated for the loop. */
function MarqueeTicker({
  edge = 'top',
  direction = 'left',
  className,
  children,
}: TickerProps) {
  return (
    <div
      aria-hidden="true"
      data-direction={direction}
      className={cx('ticker', 'ticker--marquee', edgeClassFor(edge), className)}
    >
      <div className="ticker__track">
        <div className="ticker__group">{children}</div>
        <div className="ticker__group">{children}</div>
      </div>
    </div>
  );
}

/** Accessible scroll container with an ambient JS auto-scroll loop. */
function ScrollTicker({
  label,
  edge = 'top',
  direction = 'left',
  speed = 40,
  className,
  children,
}: TickerProps) {
  const reduced = usePrefersReducedMotion();
  const scrollerRef = useRef<HTMLElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Mirror `paused` into a ref so the animation-frame loop reads the latest
  // value without the scroll effect re-subscribing on every toggle.
  const pausedRef = useRef(false);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // The clone fills the trailing half of the loop and stays clickable for
  // pointer users, so drop its focusables out of the tab order by hand. Paired
  // with aria-hidden, screen readers and axe never see the duplicate.
  useEffect(() => {
    const focusables = cloneRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]',
    );
    focusables?.forEach((el) => {
      el.tabIndex = -1;
    });
  });

  // Ambient scroll: advance scrollLeft each frame and wrap by one copy width
  // for a seamless loop. Pauses on hover/touch; user scrolling is left alone.
  useEffect(() => {
    if (reduced) return;
    const el = scrollerRef.current;
    if (!el) return;

    const dir = direction === 'left' ? 1 : -1;
    // Start the rightward strip one copy in, so it has somewhere to scroll back.
    if (dir < 0) el.scrollLeft = el.scrollWidth / 2;

    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      const half = el.scrollWidth / 2;
      if (!pausedRef.current && half > 0) {
        let next = el.scrollLeft + (dir * speed * dt) / 1000;
        if (next >= half) next -= half;
        else if (next < 0) next += half;
        el.scrollLeft = next;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced, direction, speed]);

  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const freezeForTouch = () => {
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), TOUCH_RESUME_MS);
  };

  const classes = cx('ticker', edgeClassFor(edge), className);

  // Reduced motion: a plain, single-copy scrollable row. No clone, no loop.
  if (reduced) {
    return (
      <section aria-label={label} className={classes}>
        <div className="ticker__group">{children}</div>
      </section>
    );
  }

  return (
    <section
      ref={scrollerRef}
      aria-label={label}
      data-direction={direction}
      className={classes}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={freezeForTouch}
    >
      <div className="ticker__track" data-paused={paused || undefined}>
        <div className="ticker__group">{children}</div>
        <div ref={cloneRef} aria-hidden="true" className="ticker__group">
          {children}
        </div>
      </div>
    </section>
  );
}
