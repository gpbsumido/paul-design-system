import { useId, type CSSProperties } from 'react';
import { cx } from './cx';

export type FolderFloatItem = { label: string; href?: string };

type FolderFloatProps = {
  label: string;
  items: FolderFloatItem[];
  /** Folder colour (any CSS colour). Defaults to the primary token. */
  accent?: string;
  className?: string;
};

/**
 * A folder whose contents float out above it, fanned and gently bobbing. The
 * ReactBits original runs a matter-js physics simulation; this reinterprets the
 * feel on the tokens with a CSS fan and a per-chip bob — no physics engine, no
 * dependency. The folder is a labelled `role="group"`; chips are real links
 * when given an `href`. Under reduced motion the bob stops and the chips rest.
 */
export function FolderFloat({ label, items, accent, className }: FolderFloatProps) {
  const labelId = useId();
  const shown = items.slice(0, 8);
  const mid = (shown.length - 1) / 2;

  return (
    <div
      className={cx('folder-float', className)}
      role="group"
      aria-labelledby={labelId}
      style={accent ? ({ '--ff-accent': accent } as CSSProperties) : undefined}
    >
      <span aria-hidden="true" className="folder-float__back" />
      <div className="folder-float__stack">
        {shown.map((item, i) => {
          const style = {
            '--ff-shift': `${(i - mid) * 30}px`,
            '--ff-rot': `${(i - mid) * 5}deg`,
            '--ff-delay': `${-(i % 5) * 0.7}s`,
          } as CSSProperties;
          if (item.href) {
            return (
              <a key={i} href={item.href} className="folder-float__chip" style={style}>
                {item.label}
              </a>
            );
          }
          return (
            <span key={i} className="folder-float__chip" style={style}>
              {item.label}
            </span>
          );
        })}
      </div>
      <span aria-hidden="true" className="folder-float__tab" />
      <span aria-hidden="true" className="folder-float__front" />
      <span id={labelId} className="folder-float__label">
        {label}
      </span>
    </div>
  );
}
