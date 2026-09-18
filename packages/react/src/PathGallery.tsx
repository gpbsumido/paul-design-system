import { type CSSProperties } from 'react';
import { cx } from './cx';

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
 */
export function PathGallery({
  items,
  path = DEFAULT_PATH,
  duration = 32,
  itemSize = 84,
  className,
}: PathGalleryProps) {
  const count = Math.max(1, items.length);
  return (
    <div
      className={cx('path-gallery', className)}
      role="group"
      aria-label="Gallery along a path"
      style={{ '--pg-dur': `${duration}s`, '--pg-size': `${itemSize}px` } as CSSProperties}
    >
      <svg
        className="path-gallery__track"
        viewBox="0 0 600 360"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
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
  );
}
