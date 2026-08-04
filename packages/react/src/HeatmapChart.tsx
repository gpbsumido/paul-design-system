import { type HTMLAttributes } from 'react';
import { cx } from './cx';
import { heatmapCells } from './chartGeometry';

export type HeatmapRow = {
  /** Rendered down the left gutter. */
  label: string;
  /** One value per column. */
  values: number[];
};

type HeatmapChartProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /**
   * One entry per row, each carrying its own label.
   *
   * A row and its label travel together on purpose: as separate `matrix` and
   * `rowLabels` arrays a length mismatch is representable, and it degrades
   * quietly — the label for the missing row just vanishes and every other row
   * still looks right.
   */
  rows: HeatmapRow[];
  /** One label per column, rendered across the top gutter. */
  colLabels: string[];
  /** Accessible name for the chart. Required. */
  label: string;
  /**
   * Print each cell's value inside the cell. Defaults to true.
   *
   * Direct labelling is only honest on a small grid — past roughly 8×8 the text
   * is smaller than the cell can carry and the numbers turn into texture. Turn
   * it off for large cohorts and let the ramp plus the scale legend do the work.
   */
  showValues?: boolean;
  /** viewBox width in coordinate units. Defaults to 220. */
  width?: number;
  /** viewBox height in coordinate units. Defaults to 140. */
  height?: number;
};

/** Gutter reserved for the row labels, in coordinate units. */
const ROW_GUTTER = 40;
/** Gutter reserved for the column labels, in coordinate units. */
const COL_GUTTER = 14;

/**
 * Cell colour comes from the SEQUENTIAL ramp: a heatmap encodes MAGNITUDE, so
 * intensity maps onto one hue light-to-dark. The categorical --paul-chart-N
 * palette would encode the value as identity, which is a different claim.
 */
const cellColor = (intensity: number) => `var(--paul-chart-seq-${Math.round(intensity * 4) + 1})`;

/** The top two ramp steps are dark enough that ink-on-cell has to flip. */
const valueColor = (intensity: number) =>
  Math.round(intensity * 4) + 1 >= 4 ? 'var(--paul-color-surface)' : 'var(--paul-color-foreground)';

/**
 * A cohort-retention grid: one cell per matrix value, shaded by magnitude. Pure
 * SVG from `chartGeometry`, matching the Angular `PaulHeatmapChart`.
 *
 * The scale legend is not optional. A sequential ramp with no key tells a reader
 * that one cell is bigger than another but never by how much, so the five steps
 * are rendered with the matrix min and max as end labels. The `role="img"`
 * summary names every row and its values, so the grid is readable with the
 * colour thrown away entirely.
 */
export function HeatmapChart({
  rows,
  colLabels,
  label,
  showValues = true,
  width = 220,
  height = 140,
  className,
  ...props
}: HeatmapChartProps) {
  const matrix = rows.map((row) => row.values);
  const cells = heatmapCells(matrix, {
    width: width - ROW_GUTTER,
    height: height - COL_GUTTER,
  });
  const values = matrix.flat();
  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 0;

  const summary = rows.map((row) => `${row.label} ${row.values.join(', ')}`).join('; ');
  const name = cells.length > 0 ? `${label}: ${summary}` : label;

  // Column and row label positions ride on the cells themselves, so the text
  // never drifts out of alignment with the grid it annotates.
  const firstInCol = (c: number) => cells.find((cell) => cell.col === c);
  const firstInRow = (r: number) => cells.find((cell) => cell.row === r);

  return (
    <div className={cx('paul-chart', 'paul-chart--heatmap', className)} {...props}>
      <div role="img" aria-label={name} className="paul-chart__figure">
        {cells.length > 0 ? (
          <svg
            className="paul-chart__svg"
            viewBox={`0 0 ${width} ${height}`}
            aria-hidden="true"
            focusable="false"
          >
            {colLabels.map((text, c) => {
              const cell = firstInCol(c);
              if (!cell) return null;
              return (
                <text
                  key={`col-${text}`}
                  className="paul-chart__col-label"
                  x={ROW_GUTTER + cell.x + cell.width / 2}
                  y={COL_GUTTER - 5}
                  textAnchor="middle"
                >
                  {text}
                </text>
              );
            })}
            {rows.map((row, r) => {
              const cell = firstInRow(r);
              if (!cell) return null;
              return (
                <text
                  key={`row-${row.label}`}
                  className="paul-chart__row-label"
                  x={ROW_GUTTER - 5}
                  y={COL_GUTTER + cell.y + cell.height / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {row.label}
                </text>
              );
            })}
            <g transform={`translate(${ROW_GUTTER} ${COL_GUTTER})`}>
              {cells.map((cell) => (
                <rect
                  key={`${cell.row}-${cell.col}`}
                  className="paul-chart__cell"
                  x={cell.x}
                  y={cell.y}
                  width={cell.width}
                  height={cell.height}
                  fill={cellColor(cell.intensity)}
                />
              ))}
              {showValues &&
                cells.map((cell) => (
                  <text
                    key={`v-${cell.row}-${cell.col}`}
                    className="paul-chart__cell-value"
                    x={cell.x + cell.width / 2}
                    y={cell.y + cell.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={valueColor(cell.intensity)}
                  >
                    {cell.value}
                  </text>
                ))}
            </g>
          </svg>
        ) : (
          <span className="paul-chart__empty" aria-hidden="true">
            No data
          </span>
        )}
      </div>
      {cells.length > 0 && (
        <div className="paul-chart__scale">
          <span className="paul-chart__scale-end">{min}</span>
          {[0, 1, 2, 3, 4].map((step) => (
            <span
              key={step}
              className="paul-chart__scale-step"
              aria-hidden="true"
              style={{ backgroundColor: `var(--paul-chart-seq-${step + 1})` }}
            />
          ))}
          <span className="paul-chart__scale-end">{max}</span>
        </div>
      )}
    </div>
  );
}
