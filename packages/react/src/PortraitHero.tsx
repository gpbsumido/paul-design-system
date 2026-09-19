import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from './cx';
import { posterCorners, posterPlacement, projectPoster } from './portraitHeroGeometry';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export type PortraitHeroImage = {
  src: string;
  objectPosition?: string;
  /** Accessible name for an optional image link or action. */
  alt?: string;
  href?: string;
  onClick?: () => void;
};
export type PortraitHeroProps = {
  heading: ReactNode;
  description?: ReactNode;
  headingLevel?: 1 | 2 | 3;
  /** Images are decorative unless href or onClick is provided. */
  images?: readonly PortraitHeroImage[];
  actions?: ReactNode;
  navigation?: ReactNode;
  /** Optional centrepiece above the heading (spiral variant). */
  visual?: ReactNode;
  className?: string;
  id?: string;
};

type HeroVariant = 'spiral' | 'tunnel' | 'corridor';

function Portrait({ image, index, variant, onHover }: {
  image: PortraitHeroImage; index: number; variant: HeroVariant; onHover: (hovered: boolean) => void;
}) {
  const [failed, setFailed] = useState(false);
  const Tag = image.href ? 'a' : image.onClick ? 'button' : 'span';
  const interactive = Boolean(image.href || image.onClick);
  const placement = variant === 'spiral' ? null : posterPlacement(index, variant);
  const portrait = <Tag className={placement ? 'portrait-hero__wall-image' : 'portrait-hero__image'}
    href={image.href} onClick={image.onClick} type={Tag === 'button' ? 'button' : undefined}
    aria-label={interactive ? image.alt || `View image ${index + 1}` : undefined}
    hidden={failed} onPointerEnter={event => { if (event.pointerType !== 'touch') onHover(true); }}
    onPointerLeave={() => onHover(false)} onPointerCancel={() => onHover(false)}
    style={placement
      ? { transform: `matrix3d(${projectPoster(posterCorners(placement.wall, placement.lane)).join(',')})` }
      : { '--spiral-delay': `${-index * 2}s` } as CSSProperties}>
    <img src={image.src} alt="" draggable={false} decoding="async"
      style={{ objectPosition: image.objectPosition }}
      onError={() => { setFailed(true); onHover(false); }} />
  </Tag>;
  if (!placement) return portrait;
  return <g className="portrait-hero__poster" data-wall={placement.wall} data-lane={placement.lane}
    style={{ '--poster-delay': `${-placement.phase * 24}s` } as CSSProperties}>
    <foreignObject width="1000" height="1000" overflow="visible">{portrait}</foreignObject>
  </g>;
}

function PortraitHero({ heading, description, headingLevel = 1, images = [], actions, navigation,
  visual, className, id, variant }: PortraitHeroProps & { variant: HeroVariant }) {
  const headingId = useId();
  const reduced = usePrefersReducedMotion();
  const gallery = useRef<HTMLDivElement>(null);
  const hovered = useRef(false);
  const focused = useRef(false);
  const updateSpeed = () => {
    // Changing playback rate preserves the current frame; changing CSS duration
    // would jump to a different point along the path.
    gallery.current?.getAnimations?.({ subtree: true }).forEach(animation => {
      animation.updatePlaybackRate(hovered.current || focused.current ? 0.2 : 1);
    });
  };
  const onHover = (value: boolean) => { hovered.current = value; updateSpeed(); };
  const reset = () => { if (gallery.current) gallery.current.style.transform = ''; };
  useEffect(() => { if (reduced) reset(); }, [reduced]);
  const Heading = `h${headingLevel}` as 'h1' | 'h2' | 'h3';
  return <section id={id} aria-labelledby={headingId} className={cx('portrait-hero', `portrait-hero--${variant}`, className)}
    onPointerMove={reduced || variant !== 'spiral' ? undefined : event => {
      if (event.pointerType === 'touch' || !gallery.current) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)) * 10;
      const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)) * 10;
      gallery.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }} onPointerLeave={reset} onPointerCancel={reset}>
    {navigation && <div className="portrait-hero__navigation">{navigation}</div>}
    <div ref={gallery} className="portrait-hero__gallery"
      onFocusCapture={() => { focused.current = true; updateSpeed(); }}
      onBlurCapture={event => {
        focused.current = Boolean(event.relatedTarget && event.currentTarget.contains(event.relatedTarget));
        updateSpeed();
      }}>
      {variant === 'spiral' ? images.slice(0, 16).map((image, index) =>
        <Portrait key={`${index}-${image.src}`} image={image} index={index} variant={variant} onHover={onHover} />
      ) : <svg className="portrait-hero__scene" viewBox="0 0 1000 1000" preserveAspectRatio="none" focusable="false">
        {variant === 'tunnel' && <g className="portrait-hero__wire" aria-hidden="true">
          <rect x="430" y="430" width="140" height="140" />
          <path d="M0 0L430 430 M1000 0L570 430 M0 1000L430 570 M1000 1000L570 570" />
          <path data-wall-divisions="true" d="M500 0V430 M1000 500H570 M500 1000V570 M0 500H430" />
        </g>}
        {images.slice(0, 16).map((image, index) =>
          <Portrait key={`${index}-${image.src}`} image={image} index={index} variant={variant} onHover={onHover} />)}
      </svg>}
    </div>
    <div className="portrait-hero__content">
      {visual && <div className="portrait-hero__visual">{visual}</div>}
      <Heading id={headingId} className="portrait-hero__heading">{heading}</Heading>
      {description && <div className="portrait-hero__description">{description}</div>}
      {actions && <div className="portrait-hero__actions">{actions}</div>}
    </div>
  </section>;
}

/** A portrait hero whose imagery spirals behind the copy. */
export function SpiralPortraitHero(props: PortraitHeroProps) { return <PortraitHero {...props} variant="spiral" />; }
/** A portrait hero whose imagery moves along all four divided walls of a perspective tunnel. */
export function PerspectivePortraitHero(props: PortraitHeroProps) { return <PortraitHero {...props} variant="tunnel" />; }
/** A portrait hero whose imagery moves along the divided side walls of a perspective corridor. */
export function CorridorPortraitHero(props: PortraitHeroProps) { return <PortraitHero {...props} variant="corridor" />; }
