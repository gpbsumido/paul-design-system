import { type HTMLAttributes } from 'react';
import { cx } from './cx';
import { linePath, areaPath, multiLinePoints } from './chartGeometry';

type SparklineProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** The series to plot. Ignored when `series` is given. */
  data?: number[];
  /**
   * Several series on one shared y-domain — for comparing trends at a glance.
   * Takes precedence over `data`.
   */
  series?: number[][];
  /** `line` (default) draws a stroke; `area` fills under it. Single series only. */
  variant?: 'line' | 'area';
  /** Accessible name for the chart. Required — the SVG itself is hidden. */
  label: string;
  /** viewBox width in coordinate units. Defaults to 160. */
  width?: number;
  /** viewBox height in coordinate units. Defaults to 40. */
  height?: number;
};

/**
 * A compact, axis-free trend line — the sparkline used across dashboards and
 * KPI cards. Pure SVG from `chartGeometry`, so it renders identically to the
 * Angular `PaulSparkline`. Exposes `role="img"` with a caller-supplied label
 * since the drawing carries no text of its own.
 *
 * With `series`, every line is scaled against ONE domain spanning all of them —
 * independently scaled sparklines look comparable and aren't. `area` applies to
 * the single-series form only; stacked fills at this size are mud.
 */
export function Sparkline({
  data,
  series,
  variant = 'line',
  label,
  width = 160,
  height = 40,
  className,
  ...props
}: SparklineProps) {
  const box = { width, height, padding: 2 };
  const multi = series?.filter((s) => s.length > 0) ?? [];
  const single = data ?? [];
  const hasData = multi.length > 0 || single.length > 0;
  const lines = multi.length > 0 ? multiLinePoints(multi, box) : [];

  return (
    <div
      role="img"
      aria-label={label}
      className={cx('paul-chart', 'paul-chart--sparkline', className)}
      {...props}
    >
      {hasData ? (
        <svg
          className="paul-chart__svg"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          {multi.length > 0 ? (
            lines.map((points, i) => (
              <path
                key={i}
                className="paul-chart__line"
                d={points.map((p, j) => `${j === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={`var(--paul-chart-${Math.min(i, 5) + 1})`}
                vectorEffect="non-scaling-stroke"
              />
            ))
          ) : (
            <>
              {variant === 'area' && (
                <path className="paul-chart__area" d={areaPath(single, box)} />
              )}
              <path
                className="paul-chart__line"
                d={linePath(single, box)}
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </svg>
      ) : (
        <span className="paul-chart__empty" aria-hidden="true">
          No data
        </span>
      )}
    </div>
  );
}
