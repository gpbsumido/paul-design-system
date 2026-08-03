import { type HTMLAttributes } from 'react';
import { cx } from './cx';
import { funnelStages } from './chartGeometry';

export type FunnelDatum = {
  label: string;
  value: number;
};

type FunnelChartProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  data: FunnelDatum[];
  /** Accessible name for the chart. Required. */
  label: string;
  /** Show the per-stage drop-off beside each row. Defaults to true. */
  showDropOff?: boolean;
  /** viewBox width in coordinate units. Defaults to 200. */
  width?: number;
  /** viewBox height in coordinate units. Defaults to 140. */
  height?: number;
};

/** Stage colour comes from the SEQUENTIAL ramp: funnel stages are ordered. */
const stageColor = (i: number, total: number) => {
  const step = total <= 1 ? 3 : Math.round(1 + (i / (total - 1)) * 3);
  return `var(--paul-chart-seq-${step + 1})`;
};

/**
 * Stage-to-stage conversion, drawn as narrowing bands. Pure SVG from
 * `chartGeometry`, matching the Angular `PaulFunnelChart`.
 *
 * The drop-off is what a funnel is read for, so it is rendered as text rather
 * than left to the taper — the widths carry the shape, the labels carry the
 * number.
 */
export function FunnelChart({
  data,
  label,
  showDropOff = true,
  width = 200,
  height = 140,
  className,
  ...props
}: FunnelChartProps) {
  const stages = funnelStages(
    data.map((d) => d.value),
    { width, height, padding: 2 },
  );
  const summary = data
    .map((d, i) => `${d.label} ${d.value} (${stages[i]?.percent ?? 0}%)`)
    .join(', ');
  const name = data.length > 0 ? `${label}: ${summary}` : label;

  return (
    <div className={cx('paul-chart', 'paul-chart--funnel', className)} {...props}>
      <div role="img" aria-label={name} className="paul-chart__figure">
        {data.length > 0 ? (
          <svg
            className="paul-chart__svg"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            {stages.map((stage) => (
              <path
                key={stage.index}
                className="paul-chart__stage"
                d={stage.path}
                fill={stageColor(stage.index, stages.length)}
              />
            ))}
          </svg>
        ) : (
          <span className="paul-chart__empty" aria-hidden="true">
            No data
          </span>
        )}
      </div>
      {data.length > 0 && (
        <ol className="paul-chart__legend">
          {data.map((d, i) => (
            <li key={d.label} className="paul-chart__legend-item">
              <span
                className="paul-chart__swatch"
                aria-hidden="true"
                style={{ backgroundColor: stageColor(i, data.length) }}
              />
              <span className="paul-chart__legend-label">{d.label}</span>
              <span className="paul-chart__legend-value">{d.value}</span>
              {showDropOff && i > 0 && (
                <span className="paul-chart__delta">−{stages[i]?.dropOff ?? 0}%</span>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
