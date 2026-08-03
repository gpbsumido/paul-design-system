import { type HTMLAttributes } from 'react';
import { cx } from './cx';
import { gaugeArc } from './chartGeometry';

export type GaugeTone = 'default' | 'good' | 'warning' | 'critical';

type GaugeChartProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** The reading. Clamped into [min, max] for the arc; shown verbatim as text. */
  value: number;
  /** Accessible name for the chart. Required. */
  label: string;
  /** Bottom of the range. Defaults to 0. */
  min?: number;
  /** Top of the range. Defaults to 100. */
  max?: number;
  /** Suffix beside the hero number, e.g. "%" or "GB". */
  unit?: string;
  /** Outer diameter, in coordinate units. Defaults to 120. */
  size?: number;
  /** Arc thickness, in coordinate units. Defaults to 20. */
  thickness?: number;
  /** Total sweep in degrees. Defaults to 270 — a dial, not a full ring. */
  sweep?: number;
  /** Status colour for the fill. Defaults to the neutral series colour. */
  tone?: GaugeTone;
};

/**
 * Status is never colour alone: a tone other than `default` also renders its
 * name as visible text beside the value, so the reading survives greyscale,
 * a colour-vision deficiency, and a printout.
 */
const TONE_LABEL: Record<GaugeTone, string> = {
  default: '',
  good: 'Good',
  warning: 'Warning',
  critical: 'Critical',
};

/** Tones borrow the SEMANTIC status colours, not the categorical series ramp. */
const TONE_COLOR: Record<GaugeTone, string> = {
  default: 'var(--paul-chart-1)',
  good: 'var(--paul-color-success-600)',
  warning: 'var(--paul-color-warning-600)',
  critical: 'var(--paul-color-error-600)',
};

/**
 * One ratio against a limit, drawn as a radial dial. Pure SVG from
 * `chartGeometry`, matching the Angular `PaulGaugeChart`.
 *
 * The number is the point, so it is a hero figure inside the arc rather than a
 * label hanging off it — the arc gives the reading a position in its range, the
 * text gives it precision. Text wears the text tokens and never the series
 * colour; the track is recessive and the fill carries the tone. No legend: a
 * single value has nothing to key.
 *
 * When `tone` is anything but `default` the tone name is rendered as text next
 * to the value, because status must never be carried by colour alone.
 */
export function GaugeChart({
  value,
  label,
  min = 0,
  max = 100,
  unit,
  size = 120,
  thickness = 20,
  sweep = 270,
  tone = 'default',
  className,
  ...props
}: GaugeChartProps) {
  const geo = gaugeArc(value, { size, thickness, min, max, sweep });
  const toneLabel = TONE_LABEL[tone];
  const name = `${label}: ${value} of ${max} (${geo.percent}%)${toneLabel ? `, ${toneLabel}` : ''}`;

  return (
    <div className={cx('paul-chart', 'paul-chart--gauge', className)} {...props}>
      <div role="img" aria-label={name} className="paul-chart__figure">
        <svg
          className="paul-chart__svg"
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
          focusable="false"
        >
          {/* The track is always drawn — an empty gauge still has to show its range. */}
          <path className="paul-chart__gauge-track" d={geo.track} />
          {geo.fill !== '' && (
            <path className="paul-chart__gauge-fill" d={geo.fill} fill={TONE_COLOR[tone]} />
          )}
        </svg>
      </div>
      <div className="paul-chart__readout">
        <p className="paul-chart__value">
          {value}
          {unit && <span className="paul-chart__unit">{unit}</span>}
        </p>
        {toneLabel && <p className="paul-chart__tone">{toneLabel}</p>}
        <p className="paul-chart__caption">of {max}</p>
      </div>
    </div>
  );
}
