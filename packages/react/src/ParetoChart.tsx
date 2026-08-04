import { type HTMLAttributes } from 'react';
import { cx } from './cx';
import { paretoLayout } from './chartGeometry';

export type ParetoDatum = {
  label: string;
  value: number;
};

type ParetoChartProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  data: ParetoDatum[];
  /** Accessible name for the chart. Required. */
  label: string;
  /** Cumulative percent to draw the reference line at. Defaults to 80. */
  threshold?: number;
  /** viewBox width in coordinate units. Defaults to 200. */
  width?: number;
  /** viewBox height in coordinate units. Defaults to 140. */
  height?: number;
};

/** Height reserved under the plot for the category labels. */
const LABEL_BAND = 16;
const PADDING = 2;

/**
 * Sorted bars plus a cumulative line, on ONE y-axis.
 *
 * The textbook Pareto puts raw counts on the left axis and cumulative percent
 * on the right. Two y-scales on one plot invent a relationship the data doesn't
 * have — where the line appears to cross the bars is a function of how the two
 * scales were aligned, and that alignment is arbitrary. So there is one axis
 * here: the bars are percent-of-total and the line is cumulative percent, both
 * on 0–100, and the crossing point means something. Nothing is labelled with a
 * raw count as if it had a scale of its own.
 *
 * One series, one colour. Ramping the bars by value would encode magnitude
 * twice — the height already says it, and the categories are nominal.
 *
 * Pure SVG from `chartGeometry`, matching the Angular `PaulParetoChart`.
 */
export function ParetoChart({
  data,
  label,
  threshold = 80,
  width = 200,
  height = 140,
  className,
  ...props
}: ParetoChartProps) {
  // `paretoLayout` filters out non-positive values and sorts descending, so the
  // incoming order is NOT the bar order. Pair labels to values and put them
  // through the identical filter + sort, or every bar gets the wrong name.
  // `Array.prototype.sort` is stable, so ties keep their original order in both.
  const ranked = data.filter((d) => d.value > 0).sort((a, b) => b.value - a.value);

  const plotHeight = Math.max(0, height - LABEL_BAND);
  const box = { width, height: plotHeight, padding: PADDING };
  // The geometry takes the threshold too, so the cut it reports and the rule
  // drawn below are the same number by construction.
  const { bars, cumulative, percents, cutIndex: cut } = paretoLayout(
    data.map((d) => d.value),
    box,
    { threshold },
  );

  // Same mapping the geometry uses for the cumulative points, so the reference
  // line and the line it references are on one scale by construction.
  const inner = { bottom: plotHeight - PADDING, height: Math.max(0, plotHeight - PADDING * 2) };
  const thresholdY = Math.round((inner.bottom - threshold * (inner.height / 100)) * 1000) / 1000;

  const summary = ranked.map((d, i) => `${d.label} ${percents[i] ?? 0}%`).join(', ');
  const crossing =
    cut >= 0
      ? `${threshold}% of the total is reached by the first ${cut + 1} of ${ranked.length}.`
      : `The cumulative total never reaches ${threshold}%.`;
  const name = ranked.length > 0 ? `${label}: ${summary}. ${crossing}` : label;

  return (
    <div className={cx('paul-chart', 'paul-chart--pareto', className)} {...props}>
      <div role="img" aria-label={name} className="paul-chart__figure">
        {ranked.length > 0 ? (
          <svg
            className="paul-chart__svg"
            viewBox={`0 0 ${width} ${height}`}
            aria-hidden="true"
            focusable="false"
          >
            {bars.map((bar, i) => (
              <rect
                key={ranked[i]?.label ?? i}
                className="paul-chart__bar"
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                rx={1}
                fill="var(--paul-chart-1)"
              />
            ))}
            {/* Recessive ink: the threshold is a reference, not a series. */}
            <line
              className="paul-chart__threshold"
              x1={PADDING}
              x2={width - PADDING}
              y1={thresholdY}
              y2={thresholdY}
              stroke="var(--paul-color-border)"
              strokeDasharray="4 3"
            />
            <polyline
              className="paul-chart__cumulative"
              points={cumulative.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="var(--paul-chart-4)"
              strokeWidth={2}
            />
            {cut >= 0 && cumulative[cut] && (
              <circle
                className="paul-chart__cut"
                cx={cumulative[cut].x}
                cy={cumulative[cut].y}
                r={3}
                fill="var(--paul-chart-4)"
              />
            )}
            {bars.map((bar, i) => (
              <text
                key={`label-${ranked[i]?.label ?? i}`}
                className="paul-chart__category"
                x={bar.x + bar.width / 2}
                y={height - 5}
                textAnchor="middle"
              >
                {ranked[i]?.label ?? ''}
              </text>
            ))}
          </svg>
        ) : (
          <span className="paul-chart__empty" aria-hidden="true">
            No data
          </span>
        )}
      </div>
    </div>
  );
}
