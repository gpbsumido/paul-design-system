import { type HTMLAttributes } from 'react';
import { cx } from './cx';
import { multiLinePoints, stackedSeries, type Point } from './chartGeometry';

export type LineSeries = {
  label: string;
  values: number[];
};

type StackedLineChartProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  series: LineSeries[];
  /** Accessible name for the chart. Required. */
  label: string;
  /** `lines` (default) overlays one line per series; `stacked` fills part-to-whole bands. */
  variant?: 'lines' | 'stacked';
  /** viewBox width in coordinate units. Defaults to 200. */
  width?: number;
  /** viewBox height in coordinate units. Defaults to 120. */
  height?: number;
  /**
   * Render the swatch legend. Defaults to true, and a legend is the only thing
   * naming a series here — set this to false with two or more series and
   * identity becomes colour-only, which fails the same readers the palette was
   * ordered for. One series never gets a legend regardless: the accessible
   * name already says what the line is.
   */
  showLegend?: boolean;
};

/**
 * Series colour comes from the CATEGORICAL palette: series are identities, not
 * magnitudes. Clamped at slot 6 rather than cycled — a seventh line reusing
 * slot 1 would read as the first series, and two identical hues on one plot is
 * worse than none. Past six, facet or roll the tail into "Other".
 */
const seriesColor = (i: number) => `var(--paul-chart-${Math.min(i, 5) + 1})`;

const toPath = (points: Point[]) =>
  points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

/**
 * Several series over one shared x — either overlaid as lines, or stacked as
 * part-to-whole bands. Pure SVG from `chartGeometry`, matching the Angular
 * `PaulStackedLineChart`.
 *
 * Both variants take their y-domain from `chartGeometry`, which computes it
 * once across every series. That is the whole point of the primitive: series
 * rescaled to their own extents look comparable and aren't.
 */
export function StackedLineChart({
  series,
  label,
  variant = 'lines',
  width = 200,
  height = 120,
  showLegend = true,
  className,
  ...props
}: StackedLineChartProps) {
  const box = { width, height, padding: 2 };
  const values = series.map((s) => s.values);
  const hasData = values.some((v) => v.length > 0);

  const lines = variant === 'lines' ? multiLinePoints(values, box) : [];
  const bands = variant === 'stacked' ? stackedSeries(values, box) : [];

  // The last value is what a trend line is read for, so it is what the
  // accessible name carries — the drawing itself is hidden.
  const summary = series
    .map((s) => `${s.label} ${s.values.length > 0 ? s.values[s.values.length - 1] : 0}`)
    .join(', ');
  const name = hasData ? `${label}: ${summary}` : label;

  // Two or more series ALWAYS get a legend; one never does.
  const legend = showLegend && hasData && series.length >= 2;

  return (
    <div className={cx('paul-chart', 'paul-chart--lines', className)} {...props}>
      <div role="img" aria-label={name} className="paul-chart__figure">
        {hasData ? (
          <svg
            className="paul-chart__svg"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            {variant === 'stacked'
              ? bands.map((band) => (
                  <path
                    key={band.index}
                    className="paul-chart__band"
                    d={band.path}
                    fill={seriesColor(band.index)}
                  />
                ))
              : lines.map((points, i) => (
                  <path
                    key={series[i]?.label ?? i}
                    className="paul-chart__series-line"
                    d={toPath(points)}
                    fill="none"
                    stroke={seriesColor(i)}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
          </svg>
        ) : (
          <span className="paul-chart__empty" aria-hidden="true">
            No data
          </span>
        )}
      </div>
      {legend && (
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
