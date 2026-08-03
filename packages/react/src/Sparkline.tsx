import { type HTMLAttributes } from 'react';
import { cx } from './cx';
import { linePath, areaPath } from './chartGeometry';

type SparklineProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** The series to plot. */
  data: number[];
  /** `line` (default) draws a stroke; `area` fills under it. */
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
 */
export function Sparkline({
  data,
  variant = 'line',
  label,
  width = 160,
  height = 40,
  className,
  ...props
}: SparklineProps) {
  const box = { width, height, padding: 2 };
  return (
    <div role="img" aria-label={label} className={cx('paul-chart', 'paul-chart--sparkline', className)} {...props}>
      {data.length > 0 ? (
        <svg
          className="paul-chart__svg"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          {variant === 'area' && (
            <path className="paul-chart__area" d={areaPath(data, box)} />
          )}
          <path
            className="paul-chart__line"
            d={linePath(data, box)}
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ) : (
        <span className="paul-chart__empty" aria-hidden="true">
          No data
        </span>
      )}
    </div>
  );
}
