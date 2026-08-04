import { type HTMLAttributes } from 'react';
import { cx } from './cx';
import { scatterPoints, type ScatterDomain } from './chartGeometry';

export type ScatterSeries = {
  label: string;
  points: { x: number; y: number }[];
};

type ScatterPlotProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  series: ScatterSeries[];
  /** Accessible name for the chart. Required. */
  label: string;
  /**
   * Fixes the scale. Pass it when several plots have to be read against each
   * other — without it every plot rescales to its own extent and two charts
   * side by side stop being comparable.
   */
  domain?: ScatterDomain;
  /** viewBox width in coordinate units. Defaults to 200. */
  width?: number;
  /** viewBox height in coordinate units. Defaults to 140. */
  height?: number;
  /** Mark radius in coordinate units. Defaults to 4 — an 8px target. */
  radius?: number;
};

/** Series colour comes from the CATEGORICAL palette: series are identities. */
const seriesColor = (i: number) => `var(--paul-chart-${(i % 6) + 1})`;

/**
 * Two measures against each other, one mark per observation. Pure SVG from
 * `chartGeometry`, matching the Angular `PaulScatterPlot`.
 *
 * Every mark carries a surface-coloured ring (in CSS, not inline) so points
 * that land on top of each other still read as two points rather than one blob.
 * The whole plot is one `role="img"`; a per-point accessibility tree would be
 * noise, so the summary counts observations per series instead.
 */
export function ScatterPlot({
  series,
  label,
  domain,
  width = 200,
  height = 140,
  radius = 4,
  className,
  ...props
}: ScatterPlotProps) {
  // Inset by the radius so marks on the extremes sit inside the box.
  const box = { width, height, padding: radius };
  const total = series.reduce((n, s) => n + s.points.length, 0);
  const summary = series.map((s) => `${s.label} ${s.points.length} points`).join(', ');
  const name = total > 0 ? `${label}: ${summary}` : label;

  return (
    <div className={cx('paul-chart', 'paul-chart--scatter', className)} {...props}>
      <div role="img" aria-label={name} className="paul-chart__figure">
        {total > 0 ? (
          <svg
            className="paul-chart__svg"
            viewBox={`0 0 ${width} ${height}`}
            aria-hidden="true"
            focusable="false"
          >
            {series.map((s, i) => (
              <g key={s.label} className="paul-chart__series">
                {scatterPoints(s.points, box, domain).map((point) => (
                  <circle
                    key={point.index}
                    className="paul-chart__mark"
                    cx={point.x}
                    cy={point.y}
                    r={radius}
                    fill={seriesColor(i)}
                  />
                ))}
              </g>
            ))}
          </svg>
        ) : (
          <span className="paul-chart__empty" aria-hidden="true">
            No data
          </span>
        )}
      </div>
      {/* One series needs no legend — the aria-label already names it. */}
      {series.length > 1 && total > 0 && (
        <ul className="paul-chart__legend">
          {series.map((s, i) => (
            <li key={s.label} className="paul-chart__legend-item">
              <span
                className="paul-chart__swatch"
                aria-hidden="true"
                style={{ backgroundColor: seriesColor(i) }}
              />
              <span className="paul-chart__legend-label">{s.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
