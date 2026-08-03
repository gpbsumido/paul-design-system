import { type HTMLAttributes } from 'react';
import { cx } from './cx';
import { barRects, barRectsHorizontal, type Rect } from './chartGeometry';

type BarChartProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** One bar per value. */
  data: number[];
  /** Optional category labels, used to build the accessible summary. */
  labels?: string[];
  /** Bar direction. Defaults to vertical. */
  orientation?: 'vertical' | 'horizontal';
  /** Per-bar fill colors. Falls back to the token palette when omitted. */
  colors?: string[];
  /** Accessible name for the chart. Required. */
  label: string;
  width?: number;
  height?: number;
};

function summarise(data: number[], labels?: string[]): string {
  return data
    .map((v, i) => (labels?.[i] ? `${labels[i]} ${v}` : `${v}`))
    .join(', ');
}

/**
 * A categorical bar chart, vertical or horizontal. Pure SVG from
 * `chartGeometry`, matching the Angular `PaulBarChart`. Colour is never the
 * only signal — the values are summarised in the `role="img"` label.
 */
export function BarChart({
  data,
  labels,
  orientation = 'vertical',
  colors,
  label,
  width = 160,
  height = 100,
  className,
  ...props
}: BarChartProps) {
  const horizontal = orientation === 'horizontal';
  const box = { width, height, padding: 2 };
  const rects: Rect[] = horizontal ? barRectsHorizontal(data, box) : barRects(data, box);
  const name = data.length > 0 ? `${label}: ${summarise(data, labels)}` : label;
  const fillFor = (i: number) => colors?.[i] ?? `var(--paul-chart-${(i % 6) + 1})`;

  return (
    <div role="img" aria-label={name} className={cx('paul-chart', 'paul-chart--bar', className)} {...props}>
      <svg
        className={cx('paul-chart__svg', horizontal && 'paul-chart__svg--horizontal')}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        {rects.map((r, i) => (
          <rect
            key={i}
            className="paul-chart__bar"
            x={r.x}
            y={r.y}
            width={r.width}
            height={r.height}
            rx={2}
            fill={fillFor(i)}
          />
        ))}
      </svg>
    </div>
  );
}
