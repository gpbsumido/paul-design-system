import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export type HoverImageRevealItem = {
  label: string;
  image: string;
  href?: string;
};

type HoverImageRevealProps = {
  items: HoverImageRevealItem[];
  imageWidth?: number;
  imageHeight?: number;
  radius?: number;
  align?: 'left' | 'center' | 'right';
  /** Where the image window sits relative to the pointer, in pixels. */
  offsetX?: number;
  offsetY?: number;
  className?: string;
};

/**
 * A vertical text menu that reveals an image per row on hover, in a window that
 * trails the cursor. Reinterpreted on the tokens from the OriginKit component:
 * the window position is written to a transform and eased in CSS (a cheap
 * spring), and the active row's image fades in over the others. Under reduced
 * motion the window stops trailing the pointer; hover/focus still swaps the
 * image, and the images stay decorative (`aria-hidden`) behind the real links.
 */
export function HoverImageReveal({
  items,
  imageWidth = 300,
  imageHeight = 400,
  radius = 16,
  align = 'left',
  offsetX = 200,
  offsetY = 0,
  className,
}: HoverImageRevealProps) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const root = rootRef.current;
    const win = windowRef.current;
    if (!root || !win) return;
    const rect = root.getBoundingClientRect();
    const x = event.clientX - rect.left + offsetX;
    const y = event.clientY - rect.top + offsetY;
    win.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  };

  const rootStyle = {
    '--hir-w': `${imageWidth}px`,
    '--hir-h': `${imageHeight}px`,
    '--hir-radius': `${radius}px`,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={cx('hover-image-reveal', `hover-image-reveal--${align}`, className)}
      style={rootStyle}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="hover-image-reveal__list">
        {items.map((item, i) => {
          const handlers = {
            onPointerEnter: () => setActive(i),
            onFocus: () => setActive(i),
            onBlur: () => setActive(null),
          };
          return (
            <li key={i} className="hover-image-reveal__row">
              {item.href ? (
                <a href={item.href} className="hover-image-reveal__label" {...handlers}>
                  {item.label}
                </a>
              ) : (
                <span className="hover-image-reveal__label" {...handlers}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <div
        ref={windowRef}
        aria-hidden="true"
        className={cx('hover-image-reveal__window', active !== null && 'is-visible')}
      >
        {items.map((item, i) => (
          <img
            key={i}
            src={item.image}
            alt=""
            loading="lazy"
            className={cx('hover-image-reveal__img', active === i && 'is-active')}
          />
        ))}
      </div>
    </div>
  );
}
