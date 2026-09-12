import { type ReactNode } from 'react';
import { cx } from './cx';
import { Sparkline } from './Sparkline';
import { VisuallyHidden } from './VisuallyHidden';

export type StatDirection = 'up' | 'down' | 'flat';
export type StatIntent = 'positive' | 'negative' | 'neutral';

export type StatDelta = {
  /** The change, already formatted, e.g. "+1.4pt" or "-320". */
  value: ReactNode;
  direction: StatDirection;
  /** Colours the delta. Defaults from `direction` (up→positive, down→negative). */
  intent?: StatIntent;
};

type StatCardProps = {
  label: string;
  value: ReactNode;
  delta?: StatDelta;
  /** Numbers for an inline trend Sparkline. */
  trend?: number[];
  /** Accessible name for the trend chart. Defaults to "{label} trend". */
  trendLabel?: string;
  footnote?: ReactNode;
  className?: string;
};

const ARROW: Record<StatDirection, string> = { up: '▲', down: '▼', flat: '—' };
const DIRECTION_WORD: Record<StatDirection, string> = {
  up: 'increased',
  down: 'decreased',
  flat: 'no change',
};
const INTENT_FROM_DIRECTION: Record<StatDirection, StatIntent> = {
  up: 'positive',
  down: 'negative',
  flat: 'neutral',
};

/**
 * A dashboard KPI tile: the metric, its change, and an optional trend. The delta
 * pairs a colour with an arrow glyph AND a screen-reader direction word, so the
 * up/down meaning survives without colour. The trend reuses `Sparkline`, so it
 * renders identically to the charts elsewhere in the system.
 */
export function StatCard({
  label,
  value,
  delta,
  trend,
  trendLabel,
  footnote,
  className,
}: StatCardProps) {
  const intent = delta ? (delta.intent ?? INTENT_FROM_DIRECTION[delta.direction]) : undefined;

  return (
    <div className={cx('stat-card', className)}>
      <span className="stat-card__label">{label}</span>
      <div className="stat-card__value">{value}</div>
      {delta && (
        <span className={cx('stat-card__delta', `stat-card__delta--${intent}`)}>
          <span className="stat-card__arrow" aria-hidden="true">
            {ARROW[delta.direction]}
          </span>
          <VisuallyHidden>{DIRECTION_WORD[delta.direction]} </VisuallyHidden>
          <span className="stat-card__delta-value">{delta.value}</span>
        </span>
      )}
      {trend && trend.length > 0 && (
        <Sparkline
          data={trend}
          label={trendLabel ?? `${label} trend`}
          className="stat-card__trend"
        />
      )}
      {footnote && <span className="stat-card__footnote">{footnote}</span>}
    </div>
  );
}
