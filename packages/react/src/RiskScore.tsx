import { type HTMLAttributes } from 'react';
import { cx } from './cx';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

type RiskScoreProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** The score, clamped to `0..max`. */
  value: number;
  /** Override the band. When omitted it's derived from `value / max`. */
  level?: RiskLevel;
  /** Top of the scale. Defaults to 100. */
  max?: number;
  /** `detailed` (default) draws a track; `compact` is just the pill. */
  variant?: 'detailed' | 'compact';
  /** Accessible name for the meter. Defaults to "Risk score". */
  label?: string;
};

const LEVEL_LABEL: Record<RiskLevel, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

/** Fraction thresholds for the derived band: [low, medium, high), else critical. */
function levelFor(fraction: number): RiskLevel {
  if (fraction < 0.25) return 'low';
  if (fraction < 0.5) return 'medium';
  if (fraction < 0.75) return 'high';
  return 'critical';
}

/**
 * A risk score as an accessible meter — the number a fraud reviewer reads first.
 * Renders `role="meter"` with the value exposed to assistive tech, and shows the
 * numeric score alongside a band word (Low/Medium/High/Critical) so the tier is
 * never carried by colour alone. `detailed` adds a proportional track; `compact`
 * is the inline pill for tables and headers.
 */
export function RiskScore({
  value,
  level,
  max = 100,
  variant = 'detailed',
  label = 'Risk score',
  className,
  ...props
}: RiskScoreProps) {
  const clamped = Math.max(0, Math.min(max, value));
  const fraction = max > 0 ? clamped / max : 0;
  const band = level ?? levelFor(fraction);
  const bandLabel = LEVEL_LABEL[band];
  const rounded = Math.round(clamped);

  return (
    <div
      role="meter"
      aria-valuenow={rounded}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={`${rounded} of ${max}, ${bandLabel} risk`}
      aria-label={label}
      className={cx('risk-score', `risk-score--${variant}`, className)}
      {...props}
    >
      <span className={cx('risk-score__level', `risk-score__level--${band}`)}>
        <span className="risk-score__value">{rounded}</span>
        <span className="risk-score__band">{bandLabel}</span>
      </span>
      {variant === 'detailed' && (
        <span className="risk-score__track" aria-hidden="true">
          <span
            className={cx('risk-score__fill', `risk-score__fill--${band}`)}
            style={{ inlineSize: `${Math.round(fraction * 100)}%` }}
          />
        </span>
      )}
    </div>
  );
}
