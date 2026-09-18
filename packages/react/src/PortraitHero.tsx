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
    // Each portrait rides one of twelve spokes out from the centre, flying from
    // the vanishing point to the rim and scaling up as it comes. The rest
    // fraction is where it sits when motion is off.
    style = {
      '--portrait-x': '50%', '--portrait-y': '50%',
      '--tunnel-angle': `${(index % 12) * 30}deg`,
      '--tunnel-dur': `${6 + (index % 5)}s`,
      '--tunnel-delay': `-${(index * 0.5).toFixed(2)}s`,
      '--tunnel-rest': `${(0.25 + (index % 5) * 0.15).toFixed(2)}`,
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
    const angle = index * 137.508 * Math.PI / 180;
    const ring = 33 + (index % 3) * 6;
    style = {
      '--portrait-x': `${50 + Math.cos(angle) * ring}%`, '--portrait-y': `${50 + Math.sin(angle) * ring}%`,
      '--portrait-rotate': `${(index % 5 - 2) * 9}deg`,
      '--portrait-scale': 0.7 + (index % 3) * 0.15,
      // Each portrait drifts along its own small circle, upright, at its own
      // speed and phase — deterministic per index so SSR and hydration agree.
      '--portrait-orbit-r': `${10 + (index % 4) * 4}px`,
      '--portrait-orbit-dur': `${16 + (index % 5) * 2}s`,
      '--portrait-orbit-delay': `-${(index % 7) * 2.4}s`,
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
