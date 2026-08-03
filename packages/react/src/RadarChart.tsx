import { type HTMLAttributes } from 'react';
import { cx } from './cx';
import { radarAxes, radarPolygon } from './chartGeometry';

export type RadarSeries = {
  label: string;
  /** One value per axis, in axis order. Missing entries read as 0. */
  values: number[];
};

type RadarChartProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  data: RadarSeries[];
  /** Axis names, in order. The polygon has one vertex per entry. */
  axes: string[];
  /** Accessible name for the chart. Required. */
  label: string;
  /** Shared ceiling for every series. Defaults to the max across all series. */
  max?: number;
  /** Width and height of the square viewBox, in coordinate units. Defaults to 160. */
  size?: number;
  /** Show the series legend. Only consulted when there are ≥2 series. Defaults to true. */
  showLegend?: boolean;
};

/** At most three series — a fourth overlapping polygon stops being readable. */
const MAX_SERIES = 3;

/**
 * Warn once per offending call when series are dropped.
 *
 * Truncating is the right call — a fourth overlapping polygon is unreadable —
 * but doing it silently means a caller passing five series sees three and has no
 * way to find out why. Dev-only: production builds strip it.
 */
declare const process: { env?: { NODE_ENV?: string } } | undefined;

function warnTruncated(count: number, label: string): void {
  // Declared locally rather than pulling @types/node into a browser package.
  if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'production') return;
  // eslint-disable-next-line no-console
  console.warn(
    `RadarChart ("${label}"): ${count} series given, ${MAX_SERIES} drawn. ` +
      'Overlapping polygons stop being readable past three — facet into small ' +
      'multiples, or fold the tail into one series, rather than relying on this cap.',
  );
}

/** Series colour comes from the CATEGORICAL palette: series are identities. */
const seriesColor = (i: number) => `var(--paul-chart-${i + 1})`;

/**
 * Several measures compared on one frame — the shape behind skill profiles and
 * capability scorecards. Pure SVG from `chartGeometry`, matching the Angular
 * `PaulRadarChart`.
 *
 * Two rules make the picture honest. Every series is scaled against ONE ceiling
 * (`max`, defaulting to the max across all series), so the polygons are
 * comparable rather than each filling the frame; and only the first three
 * series are drawn — anything past that is dropped, because overlapping
 * translucent polygons stop resolving into distinct shapes.
 *
 * The frame — spokes and rings — is recessive ink, never a series colour, so
 * the data reads on top of it instead of competing with it.
 */
export function RadarChart({
  data,
  axes,
  label,
  max,
  size = 160,
  showLegend = true,
  className,
  ...props
}: RadarChartProps) {
  const series = data.slice(0, MAX_SERIES);
  if (data.length > MAX_SERIES) warnTruncated(data.length, label);
  const box = { width: size, height: size, padding: 18 };
  const empty = series.length === 0 || axes.length === 0;
  const geo = radarAxes(Math.max(axes.length, 1), box);

  /** Pad or trim each series to the axis count so the polygon always closes. */
  const valuesFor = (s: RadarSeries) => axes.map((_, i) => s.values[i] ?? 0);
  const ceiling = max ?? Math.max(0, ...series.flatMap((s) => valuesFor(s)));

  const polygons = series.map((s, i) => ({
    label: s.label,
    color: seriesColor(i),
    points: radarPolygon(valuesFor(s), box, ceiling)
      .map((p) => `${p.x},${p.y}`)
      .join(' '),
  }));

  const summary = series
    .map((s) => `${s.label} ${axes.map((a, i) => `${a} ${s.values[i] ?? 0}`).join(', ')}`)
    .join('; ');
  const name = empty ? label : `${label}: ${summary}`;

  return (
    <div className={cx('paul-chart', 'paul-chart--radar', className)} {...props}>
      <div role="img" aria-label={name} className="paul-chart__figure">
        {!empty ? (
          <svg
            className="paul-chart__svg"
            viewBox={`0 0 ${size} ${size}`}
            aria-hidden="true"
            focusable="false"
          >
            {geo.rings.map((r) => (
              <circle key={r} className="paul-chart__ring" cx={geo.cx} cy={geo.cy} r={r} />
            ))}
            {geo.axes.map((axis) => (
              <line
                key={axis.index}
                className="paul-chart__axis"
                x1={geo.cx}
                y1={geo.cy}
                x2={axis.x}
                y2={axis.y}
              />
            ))}
            {polygons.map((poly) => (
              <polygon
                key={poly.label}
                className="paul-chart__radar-area"
                points={poly.points}
                fill={poly.color}
                stroke={poly.color}
              />
            ))}
            {geo.axes.map((axis) => (
              <text
                key={axis.index}
                className="paul-chart__axis-label"
                // Nudged past the spoke end so the name clears the outer ring.
                x={axis.x + (axis.x - geo.cx) * 0.12}
                y={axis.y + (axis.y - geo.cy) * 0.12}
                textAnchor={axis.x > geo.cx + 1 ? 'start' : axis.x < geo.cx - 1 ? 'end' : 'middle'}
                dominantBaseline="middle"
              >
                {axes[axis.index]}
              </text>
            ))}
          </svg>
        ) : (
          <span className="paul-chart__empty" aria-hidden="true">
            No data
          </span>
        )}
      </div>
      {/* One series needs no legend — the accessible name already says what it is. */}
      {showLegend && series.length >= 2 && (
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
