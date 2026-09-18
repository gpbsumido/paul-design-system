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
  /** Optional centrepiece above the heading (Hero06). */
  visual?: ReactNode;
  className?: string;
  id?: string;
};

function Portrait({ image, index, tunnel }: { image: PortraitHeroImage; index: number; tunnel: boolean }) {
  const [failed, setFailed] = useState(false);
  const angle = index * 137.508 * Math.PI / 180;
  const ring = 33 + (index % 3) * 6;
  // Deterministic positions: the server and first client frame always agree.
  const side = index % 4;
  const depth = Math.floor(index / 4);
  const spread = 46 - depth * 9;
  const x = tunnel ? (side === 0 ? -spread : side === 1 ? spread : (index % 3 - 1) * 20) : Math.cos(angle) * ring;
  const y = tunnel ? (side === 2 ? -spread : side === 3 ? spread : (index % 3 - 1) * 19) : Math.sin(angle) * ring;
  const style = {
    '--portrait-x': `${50 + x}%`, '--portrait-y': `${50 + y}%`,
    '--portrait-rotate': `${tunnel ? 0 : (index % 5 - 2) * 9}deg`,
    '--portrait-scale': tunnel ? 1 - depth * 0.18 : 0.7 + (index % 3) * 0.15,
    '--portrait-rotate-x': `${tunnel && side >= 2 ? (side === 2 ? -55 : 55) : 0}deg`,
    '--portrait-rotate-y': `${tunnel && side < 2 ? (side === 0 ? 55 : -55) : 0}deg`,
    objectPosition: image.objectPosition,
  } as CSSProperties;
  return <img className="portrait-hero__image" src={image.src} alt="" draggable={false}
    decoding="async" style={style} hidden={failed} onError={() => setFailed(true)} />;
}

function PortraitHero({ heading, description, headingLevel = 1, images = [], actions, navigation,
  visual, className, id, variant }: PortraitHeroProps & { variant: 'spiral' | 'tunnel' }) {
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
      {images.slice(0, 16).map((image, index) => <Portrait key={`${index}-${image.src}`} image={image} index={index} tunnel={variant === 'tunnel'} />)}
    </div>
    <div className="portrait-hero__content">
      {visual && <div className="portrait-hero__visual">{visual}</div>}
      <Heading id={headingId} className="portrait-hero__heading">{heading}</Heading>
      {description && <div className="portrait-hero__description">{description}</div>}
      {actions && <div className="portrait-hero__actions">{actions}</div>}
    </div>
  </section>;
}

/** Portrait spiral composition inspired by OriginKit Hero 06. */
export function Hero06(props: PortraitHeroProps) { return <PortraitHero {...props} variant="spiral" />; }
/** CSS perspective composition inspired by the public OriginKit Hero 13 poster. */
export function Hero13(props: PortraitHeroProps) { return <PortraitHero {...props} variant="tunnel" />; }
