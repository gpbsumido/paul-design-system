import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { heatmapCells, type HeatmapCell } from './chart-geometry';

/** Gutter reserved for the row labels, in coordinate units. */
const ROW_GUTTER = 40;
/** Gutter reserved for the column labels, in coordinate units. */
const COL_GUTTER = 14;

/**
 * Cell colour comes from the SEQUENTIAL ramp: a heatmap encodes MAGNITUDE, so
 * intensity maps onto one hue light-to-dark. The categorical --paul-chart-N
 * palette would encode the value as identity, which is a different claim.
 */
function cellColor(intensity: number): string {
  return `var(--paul-chart-seq-${Math.round(intensity * 4) + 1})`;
}

/** The top two ramp steps are dark enough that ink-on-cell has to flip. */
function valueColor(intensity: number): string {
  return Math.round(intensity * 4) + 1 >= 4
    ? 'var(--paul-color-surface)'
    : 'var(--paul-color-foreground)';
}

interface PlacedCell extends HeatmapCell {
  color: string;
  textColor: string;
  centerX: number;
  centerY: number;
}

/**
 * A cohort-retention grid: one cell per matrix value, shaded by magnitude — the
 * Angular twin of the React `HeatmapChart`.
 *
 * The scale legend is not optional. A sequential ramp with no key tells a reader
 * that one cell is bigger than another but never by how much, so the five steps
 * are rendered with the matrix min and max as end labels. The `role="img"`
 * summary names every row and its values, so the grid is readable with the
 * colour thrown away entirely.
 */
@Component({
  selector: 'paul-heatmap-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': "'paul-chart paul-chart--heatmap'" },
  template: `
    <div class="paul-chart__figure" role="img" [attr.aria-label]="name()">
      @if (cells().length > 0) {
        <svg
          class="paul-chart__svg"
          [attr.viewBox]="viewBox()"
          aria-hidden="true"
          focusable="false"
        >
          @for (col of columns(); track col.label) {
            <text
              class="paul-chart__col-label"
              [attr.x]="col.x"
              [attr.y]="colGutter - 5"
              text-anchor="middle"
            >
              {{ col.label }}
            </text>
          }
          @for (row of rows(); track row.label) {
            <text
              class="paul-chart__row-label"
              [attr.x]="rowGutter - 5"
              [attr.y]="row.y"
              text-anchor="end"
              dominant-baseline="middle"
            >
              {{ row.label }}
            </text>
          }
          <g [attr.transform]="plotTransform">
            @for (cell of cells(); track cell.row + ':' + cell.col) {
              <rect
                class="paul-chart__cell"
                [attr.x]="cell.x"
                [attr.y]="cell.y"
                [attr.width]="cell.width"
                [attr.height]="cell.height"
                [attr.fill]="cell.color"
              ></rect>
            }
            @if (showValues()) {
              @for (cell of cells(); track cell.row + ':' + cell.col) {
                <text
                  class="paul-chart__cell-value"
                  [attr.x]="cell.centerX"
                  [attr.y]="cell.centerY"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  [attr.fill]="cell.textColor"
                >
                  {{ cell.value }}
                </text>
              }
            }
          </g>
        </svg>
      } @else {
        <span class="paul-chart__empty" aria-hidden="true">No data</span>
      }
    </div>
    @if (cells().length > 0) {
      <div class="paul-chart__scale">
        <span class="paul-chart__scale-end">{{ min() }}</span>
        @for (step of steps; track step) {
          <span
            class="paul-chart__scale-step"
            aria-hidden="true"
            [style.background-color]="'var(--paul-chart-seq-' + step + ')'"
          ></span>
        }
        <span class="paul-chart__scale-end">{{ max() }}</span>
      </div>
    }
  `,
})
export class PaulHeatmapChartComponent {
  /** Row-major grid of values. `matrix[row][col]`. */
  readonly matrix = input<number[][]>([]);
  /** One label per row, rendered down the left gutter. */
  readonly rowLabels = input<string[]>([]);
  /** One label per column, rendered across the top gutter. */
  readonly colLabels = input<string[]>([]);
  readonly label = input.required<string>();
  /**
   * Print each cell's value inside the cell. Defaults to true.
   *
   * Direct labelling is only honest on a small grid — past roughly 8×8 the text
   * is smaller than the cell can carry and the numbers turn into texture. Turn
   * it off for large cohorts and let the ramp plus the scale legend do the work.
   */
  readonly showValues = input(true);
  readonly width = input(220);
  readonly height = input(140);

  readonly rowGutter = ROW_GUTTER;
  readonly colGutter = COL_GUTTER;
  readonly plotTransform = `translate(${ROW_GUTTER} ${COL_GUTTER})`;
  readonly steps = [1, 2, 3, 4, 5];

  readonly viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);

  readonly cells = computed<PlacedCell[]>(() =>
    heatmapCells(this.matrix(), {
      width: this.width() - ROW_GUTTER,
      height: this.height() - COL_GUTTER,
    }).map((cell) => ({
      ...cell,
      color: cellColor(cell.intensity),
      textColor: valueColor(cell.intensity),
      centerX: cell.x + cell.width / 2,
      centerY: cell.y + cell.height / 2,
    })),
  );

  // Column and row label positions ride on the cells themselves, so the text
  // never drifts out of alignment with the grid it annotates.
  readonly columns = computed(() =>
    this.colLabels()
      .map((label, c) => {
        const cell = this.cells().find((cur) => cur.col === c);
        return cell ? { label, x: ROW_GUTTER + cell.x + cell.width / 2 } : null;
      })
      .filter((col): col is { label: string; x: number } => col !== null),
  );

  readonly rows = computed(() =>
    this.rowLabels()
      .map((label, r) => {
        const cell = this.cells().find((cur) => cur.row === r);
        return cell ? { label, y: COL_GUTTER + cell.y + cell.height / 2 } : null;
      })
      .filter((row): row is { label: string; y: number } => row !== null),
  );

  private readonly values = computed(() => this.matrix().flat());
  readonly min = computed(() => (this.values().length > 0 ? Math.min(...this.values()) : 0));
  readonly max = computed(() => (this.values().length > 0 ? Math.max(...this.values()) : 0));

  readonly name = computed(() => {
    if (this.cells().length === 0) return this.label();
    const labels = this.rowLabels();
    const summary = this.matrix()
      .map((row, r) => `${labels[r] ?? `Row ${r + 1}`} ${row.join(', ')}`)
      .join('; ');
    return `${this.label()}: ${summary}`;
  });
}
