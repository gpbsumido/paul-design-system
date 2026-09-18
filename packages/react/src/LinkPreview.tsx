import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type LinkPreviewProps = {
  href: string;
  /** The preview image (custom mode — no external screenshot service). */
  image: string;
  children: ReactNode;
  previewWidth?: number;
  previewHeight?: number;
  radius?: number;
  className?: string;
};

/**
 * An inline link that raises a floating thumbnail on hover, leaning toward the
 * pointer. Reinterpreted on the tokens from the OriginKit component, in its
 * "custom image" mode (no external screenshot API). The lean rides on CSS
 * custom properties the pointer handler writes; the card fades, rises and
 * scales in. Under reduced motion the lean is dropped and the card just fades.
 * The card is decorative (`aria-hidden`) — the real `<a>` carries the link.
 */
export function LinkPreview({
  href,
  image,
  children,
  previewWidth = 320,
  previewHeight = 200,
  radius = 12,
  className,
}: LinkPreviewProps) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  const onPointerMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (reduced) return;
    const root = rootRef.current;
    const card = cardRef.current;
    if (!root || !card) return;
    const rect = root.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    card.style.setProperty('--lp-lean', `${px * 16}deg`);
    card.style.setProperty('--lp-shift', `${px * 20}px`);
  };

  const cardStyle = {
    '--lp-w': `${previewWidth}px`,
    '--lp-h': `${previewHeight}px`,
    '--lp-radius': `${radius}px`,
  } as CSSProperties;

  return (
    <span
      ref={rootRef}
      className={cx('link-preview', className)}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onPointerMove={onPointerMove}
    >
      <a
        href={href}
        className="link-preview__link"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </a>
      <span
        ref={cardRef}
        aria-hidden="true"
        className={cx('link-preview__card', open && 'is-open')}
        style={cardStyle}
      >
        <img src={image} alt="" loading="lazy" className="link-preview__img" />
      </span>
    </span>
  );
}
