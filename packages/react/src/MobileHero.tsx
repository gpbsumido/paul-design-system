'use client';

import { useId, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { cx } from './cx';
import type { PortraitHeroImage, PortraitHeroProps } from './PortraitHero';

export type MobileHeroProps = Pick<PortraitHeroProps,
  'heading' | 'headingLevel' | 'description' | 'images' | 'actions' | 'className' | 'id'>;

function Frame({ image }: { image: PortraitHeroImage }) {
  const [failed, setFailed] = useState(false);
  return <div className="mobile-hero__frame">
    {failed ? <span className="mobile-hero__fallback">{image.alt || 'Project preview'}</span>
      : <img src={image.src} alt="" draggable={false} decoding="async"
        style={{ objectPosition: image.objectPosition }} onError={() => setFailed(true)} />}
  </div>;
}

function Shell({ heading, headingLevel = 1, description, actions, id, className, variant, children }: MobileHeroProps & {
  variant: 'orbit' | 'reel' | 'lens'; children: ReactNode;
}) {
  const headingId = useId();
  const Heading = `h${headingLevel}` as 'h1' | 'h2' | 'h3';
  return <section id={id} aria-labelledby={headingId} className={cx('mobile-hero', `mobile-hero--${variant}`, className)}>
    <div className="mobile-hero__copy">
      <Heading id={headingId} className="mobile-hero__heading">{heading}</Heading>
      {description && <div className="mobile-hero__description">{description}</div>}
    </div>
    {children}
    {actions && <div className="mobile-hero__actions">{actions}</div>}
  </section>;
}

function ProjectAction({ image }: { image: PortraitHeroImage }) {
  const label = `Open ${image.alt || 'project'}`;
  if (image.href) return <a className="mobile-hero__project-link" href={image.href}>{label}<span aria-hidden="true">↗</span></a>;
  if (image.onClick) return <button type="button" className="mobile-hero__project-link" onClick={image.onClick}>{label}<span aria-hidden="true">↗</span></button>;
  return null;
}

/** A filmstrip with a native range scrubber; no autoplay and no precision dragging required. */
export function MobileReelHero({ images = [], ...props }: MobileHeroProps) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const index = images.length ? selected % images.length : 0;
  const image = images[index];
  return <Shell {...props} variant="reel">
    {image && <div className="mobile-hero__reel">
      <div className="mobile-hero__film-label"><span>Selected experiments</span><span aria-hidden="true">↔ REEL</span></div>
      <Frame key={image.src} image={image} />
      <p className="mobile-hero__reel-caption" role="status" aria-live="polite"><span>{image.alt || 'Selected project'}</span><span>{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span></p>
      <div className="mobile-hero__scrubber">
        <label htmlFor={id}>Scrub projects <span aria-hidden="true">↔</span></label>
        <input id={id} type="range" min={0} max={Math.max(0, images.length - 1)} step={1} value={index}
          disabled={images.length < 2} aria-valuetext={`${image.alt || 'Project'}, ${index + 1} of ${images.length}`}
          onChange={event => setSelected(Number(event.target.value))} />
      </div>
      <ProjectAction image={image} />
    </div>}
  </Shell>;
}

/** A project constellation: turn the ring with a thumb or tap a numbered satellite. */
export function MobileOrbitHero({ images = [], ...props }: MobileHeroProps) {
  const entries = images.slice(0, 6);
  const [selected, setSelected] = useState(0);
  const index = entries.length ? selected % entries.length : 0;
  const image = entries[index];
  const dragging = useRef<number | null>(null);
  const rotate = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - box.left - box.width / 2;
    const y = event.clientY - box.top - box.height / 2;
    if (Math.hypot(x, y) < box.width * .2) return;
    const angle = (Math.atan2(x, -y) + Math.PI * 2) % (Math.PI * 2);
    setSelected(Math.round(angle / (Math.PI * 2) * entries.length) % entries.length);
  };
  return <Shell {...props} variant="orbit">
    {image && <div className="mobile-hero__orbit-gallery">
      <div className="mobile-hero__orbit" style={{ '--orbit-angle': `${index / entries.length * 360}deg` } as CSSProperties}>
        <div className="mobile-hero__dial" role="slider" tabIndex={0} aria-label="Rotate project dial"
          aria-valuemin={0} aria-valuemax={entries.length - 1} aria-valuenow={index}
          aria-valuetext={`${image.alt || 'Project'}, ${index + 1} of ${entries.length}`}
          onKeyDown={event => {
            const delta = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : 0;
            if (delta || event.key === 'Home' || event.key === 'End') {
              event.preventDefault();
              setSelected(event.key === 'Home' ? 0 : event.key === 'End' ? entries.length - 1 : (index + delta + entries.length) % entries.length);
            }
          }} onPointerDown={event => {
            if (!event.isPrimary || event.button !== 0) return;
            dragging.current = event.pointerId;
            event.currentTarget.setPointerCapture?.(event.pointerId);
            rotate(event);
          }} onPointerMove={event => { if (dragging.current === event.pointerId) rotate(event); }}
          onPointerUp={() => { dragging.current = null; }} onPointerCancel={() => { dragging.current = null; }}
          onLostPointerCapture={() => { dragging.current = null; }} />
        <div className="mobile-hero__planet" aria-hidden="true"><Frame key={image.src} image={image} /><span>{String(index + 1).padStart(2, '0')}</span></div>
        {entries.map((entry, i) => <button key={`${i}-${entry.src}`} type="button" className="mobile-hero__satellite"
          style={{ '--orbit-x': `${50 + 41 * Math.sin(i / entries.length * Math.PI * 2)}%`, '--orbit-y': `${50 - 41 * Math.cos(i / entries.length * Math.PI * 2)}%` } as CSSProperties}
          aria-label={`Select ${entry.alt || `project ${i + 1}`}`} aria-pressed={i === index} onClick={() => setSelected(i)}>
          <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
        </button>)}
      </div>
      <div className="mobile-hero__orbit-caption"><p role="status" aria-live="polite">{image.alt || 'Selected project'}</p><span>Drag the ring. Find your orbit.</span></div>
      <ProjectAction image={image} />
    </div>}
  </Shell>;
}

/** A movable magnifying glass over a contact sheet, with tap and keyboard alternatives. */
export function MobileLensHero({ images = [], ...props }: MobileHeroProps) {
  const entries = images.slice(0, 6);
  const [selected, setSelected] = useState(0);
  const [position, setPosition] = useState({ x: 28, y: 25 });
  const stage = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ id: number; offsetX: number; offsetY: number } | null>(null);
  const index = entries.length ? selected % entries.length : 0;
  const image = entries[index];
  const rows = Math.ceil(entries.length / 2);
  const select = (next: number) => {
    setSelected(next);
    setPosition({ x: next % 2 ? 72 : 28, y: Math.max(25, Math.min(75, (Math.floor(next / 2) + .5) / rows * 100)) });
  };
  return <Shell {...props} variant="lens">
    {image && <div className="mobile-hero__lens-gallery">
      <div className="mobile-hero__contact-sheet" ref={stage}>
        {entries.map((entry, i) => <button className="mobile-hero__contact" type="button" key={`${i}-${entry.src}`}
          aria-label={`Inspect ${entry.alt || `project ${i + 1}`}`} aria-pressed={index === i} onClick={() => select(i)}>
          <Frame image={entry} /><span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
        </button>)}
        <div className="mobile-hero__lens" style={{ left: `${position.x}%`, top: `${position.y}%` }}>
          <div className="mobile-hero__lens-glass" aria-hidden="true"><Frame key={image.src} image={image} /></div>
          <button type="button" className="mobile-hero__lens-handle" aria-label="Move magnifying lens"
            onKeyDown={event => {
              const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowDown' ? 2 : event.key === 'ArrowUp' ? -2 : 0;
              if (delta) { event.preventDefault(); select((index + delta + entries.length) % entries.length); }
            }} onPointerDown={event => {
              if (!event.isPrimary || event.button !== 0) return;
              const box = stage.current?.getBoundingClientRect();
              if (!box) return;
              dragging.current = { id: event.pointerId, offsetX: event.clientX - box.left - position.x / 100 * box.width, offsetY: event.clientY - box.top - position.y / 100 * box.height };
              event.currentTarget.setPointerCapture?.(event.pointerId);
            }} onPointerMove={event => {
              if (dragging.current?.id !== event.pointerId || !stage.current) return;
              const box = stage.current.getBoundingClientRect();
              if (!box.width || !box.height) return;
              const x = Math.max(25, Math.min(75, (event.clientX - box.left - dragging.current.offsetX) / box.width * 100));
              const y = Math.max(25, Math.min(75, (event.clientY - box.top - dragging.current.offsetY) / box.height * 100));
              setPosition({ x, y });
              setSelected(Math.min(entries.length - 1, Math.floor(y / 100 * rows) * 2 + (x >= 50 ? 1 : 0)));
            }} onPointerUp={() => { dragging.current = null; }} onPointerCancel={() => { dragging.current = null; }}
            onLostPointerCapture={() => { dragging.current = null; }}><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3" /></svg></button>
        </div>
      </div>
      <div className="mobile-hero__lens-caption"><div><p role="status" aria-live="polite">{image.alt || 'Selected project'}</p><span>Drag the lens. Look a little closer.</span></div>
        <button type="button" aria-label="Next project" disabled={entries.length < 2} onClick={() => select((index + 1) % entries.length)}>→</button>
      </div>
      <ProjectAction image={image} />
    </div>}
  </Shell>;
}
