import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { scatterPoints, type ScatterDomain } from './chart-geometry';

export interface PaulScatterSeries {
  label: string;
  points: { x: number; y: number }[];
}

/** Series colour comes from the CATEGORICAL palette: series are identities. */
function seriesColor(i: number): string {
  return `var(--paul-chart-${(i % 6) + 1})`;
}

/**
 * Two measures against each other, one mark per observation — the Angular twin
 * of the React `ScatterPlot`.
 *
 * Every mark carries a surface-coloured ring (in CSS, not inline) so points that
 * land on top of each other still read as two points rather than one blob. The
 * whole plot is one `role="img"`; the summary counts observations per series.
 */
@Component({
  selector: 'paul-scatter-plot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': "'paul-chart paul-chart--scatter'" },
  template: `
    <div class="paul-chart__figure" role="img" [attr.aria-label]="name()">
      @if (total() > 0) {
        <svg class="paul-chart__svg" [attr.viewBox]="viewBox()" aria-hidden="true" focusable="false">
          @for (s of marks(); track s.label) {
            <g class="paul-chart__series">
              @for (point of s.points; track point.index) {
                <circle
                  class="paul-chart__mark"
                  [attr.cx]="point.x"
                  [attr.cy]="point.y"
                  [attr.r]="radius()"
                  [attr.fill]="s.color"
                ></circle>
              }
            </g>
          }
        </svg>
      } @else {
        <span class="paul-chart__empty" aria-hidden="true">No data</span>
      }
    </div>
    <!-- One series needs no legend — the aria-label already names it. -->
    @if (series().length > 1 && total() > 0) {
      <ul class="paul-chart__legend">
        @for (s of series(); track s.label; let i = $index) {
          <li class="paul-chart__legend-item">
            <span class="paul-chart__swatch" aria-hidden="true" [style.background-color]="colorFor(i)"></span>
            <span class="paul-chart__legend-label">{{ s.label }}</span>
          </li>
        }
      </ul>
    }
  `,
})
export class PaulScatterPlotComponent {
  readonly series = input<PaulScatterSeries[]>([]);
  readonly label = input.required<string>();
  /**
   * Fixes the scale. Pass it when several plots have to be read against each
   * other — without it every plot rescales to its own extent and two charts
   * side by side stop being comparable.
   */
  readonly domain = input<ScatterDomain | undefined>(undefined);
  readonly width = input(200);
  readonly height = input(140);
  /** Mark radius in coordinate units. Defaults to 4 — an 8px target. */
  readonly radius = input(4);

  readonly viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);

  readonly total = computed(() => this.series().reduce((n, s) => n + s.points.length, 0));

  readonly marks = computed(() => {
    // Inset by the radius so marks on the extremes sit inside the box.
    const box = { width: this.width(), height: this.height(), padding: this.radius() };
    return this.series().map((s, i) => ({
      label: s.label,
      color: seriesColor(i),
      points: scatterPoints(s.points, box, this.domain()),
    }));
  });

  readonly name = computed(() => {
    if (this.total() === 0) return this.label();
    const summary = this.series()
      .map((s) => `${s.label} ${s.points.length} points`)
      .join(', ');
    return `${this.label()}: ${summary}`;
  });

  colorFor(i: number): string {
    return seriesColor(i);
  }
}
