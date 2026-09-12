import { type ReactNode } from 'react';
import { cx } from './cx';
import { VisuallyHidden } from './VisuallyHidden';

export type TimelineStatus = 'default' | 'success' | 'warning' | 'error' | 'info';

export type TimelineItem = {
  id: string;
  title: ReactNode;
  /** Pre-formatted time string, rendered in a `<time>`. */
  time?: string;
  description?: ReactNode;
  /** Colours the marker and adds a screen-reader status word. */
  status?: TimelineStatus;
  /** Optional glyph inside the marker (decorative). */
  icon?: ReactNode;
};

type TimelineProps = {
  items: TimelineItem[];
  /** Accessible name for the list. Defaults to "Activity". */
  label?: string;
  className?: string;
};

const STATUS_WORD: Record<Exclude<TimelineStatus, 'default'>, string> = {
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
  info: 'Info',
};

/**
 * A vertical audit rail — the session/case history a fraud reviewer scans top to
 * bottom. Renders as an ordered list so order is real to assistive tech, with a
 * status-coloured marker per event. The colour is an accent: any non-default
 * status also emits a screen-reader word, so the state is never colour-only.
 */
export function Timeline({ items, label = 'Activity', className }: TimelineProps) {
  return (
    <ol className={cx('timeline', className)} aria-label={label}>
      {items.map((item) => {
        const status = item.status ?? 'default';
        const word = status === 'default' ? undefined : STATUS_WORD[status];
        return (
          <li key={item.id} className="timeline__item">
            <span
              className={cx('timeline__marker', `timeline__marker--${status}`)}
              aria-hidden="true"
            >
              {item.icon}
            </span>
            {word && <VisuallyHidden>{word}: </VisuallyHidden>}
            <div className="timeline__content">
              <div className="timeline__head">
                <span className="timeline__title">{item.title}</span>
                {item.time && <time className="timeline__time">{item.time}</time>}
              </div>
              {item.description && (
                <div className="timeline__desc">{item.description}</div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
