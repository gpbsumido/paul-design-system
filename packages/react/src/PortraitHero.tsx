import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from './cx';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export type PortraitHeroImage = { src: string; objectPosition?: string };
export type PortraitHeroProps = {
  heading: ReactNode;
  description?: ReactNode;
  headingLevel?: 1 | 2 | 3;
  /** Decorative imagery. Put meaningful descriptions in the section copy. */
  images?: readonly PortraitHeroImage[];
  actions?: ReactNode;
  navigation?: ReactNode;
  /** Optional centrepiece above the heading (spiral variant). */
  visual?: ReactNode;
  className?: string;
  id?: string;
};

type HeroVariant = 'spiral' | 'tunnel' | 'corridor';

function Portrait({ image, index, variant }: { image: PortraitHeroImage; index: number; variant: HeroVariant }) {
  const [failed, setFailed] = useState(false);
  // Every value below is deterministic per index, so the server and the first
  // client frame always agree and there is no hydration flash.
  let style: CSSProperties;
  if (variant === 'tunnel') {
    // A one-point-perspective corridor: posters pasted on the left (-1) and
    // right (+1) walls, streaming out of the centre and growing as they near the
    // viewer. slot is the depth along the wall; the delay staggers each wall
    // into a continuous run, and rest is where a poster sits when motion is off.
    const dir = index % 2 === 0 ? -1 : 1;
    const slot = Math.floor(index / 2);
    style = {
      '--corr-dir': `${dir}`,
      '--corr-delay': `-${(slot * 2).toFixed(1)}s`,
      '--corr-rest': `${(1 - slot / 8).toFixed(3)}`,
      objectPosition: image.objectPosition,
    } as CSSProperties;
  } else if (variant === 'corridor') {
    // Portraits stream out of the centre to alternating sides, growing and
    // tilting into a receding corridor wall. Lanes stagger the stream so each
    // side is a continuous run rather than one card.
    const dir = index % 2 === 0 ? 1 : -1;
    const lane = Math.floor(index / 2);
    style = {
      '--portrait-x': '50%', '--portrait-y': '50%',
      '--corridor-dir': `${dir}`,
      '--corridor-dur': `${9 + (index % 4)}s`,
      '--corridor-delay': `-${(lane * 1.1).toFixed(2)}s`,
      '--corridor-rest': `${(0.3 + (index % 4) * 0.18).toFixed(2)}`,
      objectPosition: image.objectPosition,
    } as CSSProperties;
  } else {
    // Spiral: the copy is the sun and the portraits are planets. Each sits on one
    // of four rings, spread around by the golden angle so they never bunch, and
    // circles the centre at its own speed. phase doubles as the rest angle.
    style = {
      '--orbit-r': `${15 + (index % 4) * 9}vmin`,
      '--orbit-phase': `${((index * 137.508) % 360).toFixed(1)}deg`,
      '--orbit-scale': `${(0.75 - (index % 4) * 0.07).toFixed(2)}`,
      '--orbit-dur': `${26 + (index % 5) * 7}s`,
      objectPosition: image.objectPosition,
    } as CSSProperties;
  }
  return <img className="portrait-hero__image" src={image.src} alt="" draggable={false}
    decoding="async" style={style} hidden={failed} onError={() => setFailed(true)} />;
}

function PortraitHero({ heading, description, headingLevel = 1, images = [], actions, navigation,
  visual, className, id, variant }: PortraitHeroProps & { variant: HeroVariant }) {
  const headingId = useId();
  const reduced = usePrefersReducedMotion();
  const gallery = useRef<HTMLDivElement>(null);
  const reset = () => { if (gallery.current) gallery.current.style.transform = ''; };
  useEffect(() => { if (reduced) reset(); }, [reduced]);
  const Heading = `h${headingLevel}` as 'h1' | 'h2' | 'h3';
  return <section id={id} aria-labelledby={headingId} className={cx('portrait-hero', `portrait-hero--${variant}`, className)}
    onPointerMove={reduced ? undefined : event => {
      if (event.pointerType === 'touch' || !gallery.current) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)) * 10;
      const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)) * 10;
      gallery.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }} onPointerLeave={reset} onPointerCancel={reset}>
    {navigation && <div className="portrait-hero__navigation">{navigation}</div>}
    <div ref={gallery} className="portrait-hero__gallery" aria-hidden="true">
      {variant === 'tunnel' && (
        <svg className="portrait-hero__wire" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          <rect x="43" y="43" width="14" height="14" />
          <line x1="0" y1="0" x2="43" y2="43" />
          <line x1="100" y1="0" x2="57" y2="43" />
          <line x1="0" y1="100" x2="43" y2="57" />
          <line x1="100" y1="100" x2="57" y2="57" />
        </svg>
      )}
      {images.slice(0, 16).map((image, index) => <Portrait key={`${index}-${image.src}`} image={image} index={index} variant={variant} />)}
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
/** A portrait hero whose imagery flies outward from a central vanishing point along radial tunnel lines. */
export function PerspectivePortraitHero(props: PortraitHeroProps) { return <PortraitHero {...props} variant="tunnel" />; }
/** A portrait hero whose imagery streams out of the centre to both sides into a receding corridor wall. */
export function CorridorPortraitHero(props: PortraitHeroProps) { return <PortraitHero {...props} variant="corridor" />; }
