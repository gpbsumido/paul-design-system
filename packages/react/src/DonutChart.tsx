import { type HTMLAttributes } from 'react';
import { cx } from './cx';
import { donutSegments } from './chartGeometry';

export type DonutDatum = {
  label: string;
  value: number;
  /** Slice colour. Falls back to the token palette when omitted. */
  color?: string;
};

type DonutChartProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  data: DonutDatum[];
  /** Accessible name for the chart. Required. */
  label: string;
  /** Show the swatch + value legend beside the ring. Defaults to true. */
  legend?: boolean;
  /** Outer diameter, in coordinate units. Defaults to 120. */
  size?: number;
  /** Ring thickness, in coordinate units. Defaults to 28. */
  thickness?: number;
};

/**
 * A donut (ring) chart with an optional legend — the shape behind fleet-health
 * and revenue-mix breakdowns. Pure SVG from `chartGeometry`, matching the
 * Angular `PaulDonutChart`. The ring is `role="img"`; the legend sits outside
 * it so its rows stay in the accessibility tree.
 */
export function DonutChart({
  data,
  label,
  legend = true,
  size = 120,
  thickness = 28,
  className,
  ...props
}: DonutChartProps) {
  const values = data.map((d) => d.value);
  const segments = donutSegments(values, { size, thickness });
  const summary = data.map((d) => `${d.label} ${d.value}`).join(', ');
  const name = data.length > 0 ? `${label}: ${summary}` : label;
  const colorFor = (i: number) => data[i]?.color ?? `var(--paul-chart-${(i % 6) + 1})`;

  return (
    <div className={cx('paul-chart', 'paul-chart--donut', className)} {...props}>
      <div role="img" aria-label={name} className="paul-chart__figure">
        <svg
          className="paul-chart__svg"
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
          focusable="false"
        >
          {segments
            .filter((seg) => seg.percent > 0)
            .map((seg) => (
              <path
                key={seg.index}
                className="paul-chart__slice"
                d={seg.path}
                fill={colorFor(seg.index)}
              />
            ))}
        </svg>
      </div>
      {legend && data.length > 0 && (
        <ul className="paul-chart__legend">
          {data.map((d, i) => (
            <li key={d.label} className="paul-chart__legend-item">
              <span
                className="paul-chart__swatch"
                aria-hidden="true"
                style={{ backgroundColor: colorFor(i) }}
              />
              <span className="paul-chart__legend-label">{d.label}</span>
              <span className="paul-chart__legend-value">{d.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
