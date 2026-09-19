import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { cx } from './cx';

/** Layout effect on the client, a no-op-safe effect on the server (SSR). */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type PathGalleryItem = {
  image: string;
  title?: string;
  href?: string;
};

type PathGalleryProps = {
  items: PathGalleryItem[];
  /** SVG path the items travel, in the 600×360 viewBox. Should be closed. */
  path?: string;
  /** Seconds for one full lap. */
  duration?: number;
  itemSize?: number;
  /** Draw the dashed track line the items follow. */
  showPath?: boolean;
  className?: string;
};

const DEFAULT_PATH =
  'M 60,180 C 160,40 260,40 300,180 C 340,320 440,320 540,180 C 440,40 340,40 300,180 C 260,320 160,320 60,180 Z';

/**
 * Images gliding along a curved path, spaced evenly and travelling as a loop.
 * Reinterpreted on the tokens from the OriginKit component using CSS motion path
 * (`offset-path`) — no renderer, no dependency. Items are real links; the strip
 * is a labelled `role="group"`. Under reduced motion the travel stops and the
 * images rest at their spots along the path.
 *
 * The path and the items live on a fixed 600×360 plane that is scaled to the
 * container's width. `offset-path` coordinates are pixels, so without this the
 * dashed track (an SVG that scales with its viewBox) and the images (stuck at
 * 600×360) drift apart in any container narrower than 600px.
 */
export function PathGallery({
  items,
  path = DEFAULT_PATH,
  duration = 32,
  itemSize = 84,
  showPath = true,
  className,
}: PathGalleryProps) {
  const count = Math.max(1, items.length);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    // ResizeObserver fires once on observe with the current size, so the scale
    // is set from a callback rather than synchronously in the effect body.
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setScale(width / 600);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cx('path-gallery', className)}
      role="group"
      aria-label="Gallery along a path"
      style={{ '--pg-dur': `${duration}s`, '--pg-size': `${itemSize}px` } as CSSProperties}
    >
      <div
        className="path-gallery__plane"
        style={{ '--pg-scale': scale } as CSSProperties}
      >
        {showPath ? (
          <svg className="path-gallery__track" viewBox="0 0 600 360" aria-hidden="true">
            <path d={path} />
          </svg>
        ) : null}
        {items.map((item, i) => {
          const style = {
            offsetPath: `path('${path}')`,
            animationDelay: `${(-duration * i) / count}s`,
          } as CSSProperties;
          const inner = (
            <img src={item.image} alt={item.title ?? ''} draggable={false} />
          );
          if (item.href) {
            return (
              <a key={i} href={item.href} className="path-gallery__item" style={style}>
                {inner}
              </a>
            );
          }
          return (
            <div key={i} className="path-gallery__item" style={style}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
