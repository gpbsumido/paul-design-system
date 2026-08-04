import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { multiLinePoints, stackedSeries, type Point } from './chart-geometry';

export interface PaulLineSeries {
  label: string;
  values: number[];
}

/**
 * Series colour comes from the CATEGORICAL palette: series are identities, not
 * magnitudes. Clamped at slot 6 rather than cycled — a seventh line reusing
 * slot 1 would read as the first series.
 */
function seriesColor(i: number): string {
  return `var(--paul-chart-${Math.min(i, 5) + 1})`;
}

function toPath(points: Point[]): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
}

/**
 * Several series over one shared x — either overlaid as lines, or stacked as
 * part-to-whole bands. The Angular twin of the React `StackedLineChart`,
 * rendering identical pure SVG from the shared `chart-geometry`.
 *
 * The y-domain is computed once across every series by the geometry, which is
 * the point of the primitive: series rescaled to their own extents look
 * comparable and aren't.
 */
@Component({
  selector: 'paul-stacked-line-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': "'paul-chart paul-chart--lines'" },
  template: `
    <div class="paul-chart__figure" role="img" [attr.aria-label]="name()">
      @if (hasData()) {
        <svg
          class="paul-chart__svg"
          [attr.viewBox]="viewBox()"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          @if (variant() === 'stacked') {
            @for (band of bands(); track band.index) {
              <path class="paul-chart__band" [attr.d]="band.path" [attr.fill]="band.color"></path>
            }
          } @else {
            @for (line of lines(); track line.index) {
              <path
                class="paul-chart__series-line"
                [attr.d]="line.d"
                fill="none"
                [attr.stroke]="line.color"
                vector-effect="non-scaling-stroke"
              ></path>
            }
          }
        </svg>
      } @else {
        <span class="paul-chart__empty" aria-hidden="true">No data</span>
      }
    </div>
    @if (legend()) {
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
export class PaulStackedLineChartComponent {
  readonly series = input<PaulLineSeries[]>([]);
  readonly label = input.required<string>();
  readonly variant = input<'lines' | 'stacked'>('lines');
  readonly width = input(200);
  readonly height = input(120);
  /**
   * Defaults to true. Setting it false with two or more series makes identity
   * colour-only; one series never renders a legend regardless, since the
   * accessible name already identifies it.
   */
  readonly showLegend = input(true);

  private readonly box = computed(() => ({
    width: this.width(),
    height: this.height(),
    padding: 2,
  }));

  private readonly values = computed(() => this.series().map((s) => s.values));

  readonly viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);
  readonly hasData = computed(() => this.values().some((v) => v.length > 0));

  readonly lines = computed(() =>
    this.variant() === 'lines'
      ? multiLinePoints(this.values(), this.box()).map((points, index) => ({
          index,
          d: toPath(points),
          color: seriesColor(index),
        }))
      : [],
  );

  readonly bands = computed(() =>
    this.variant() === 'stacked'
      ? stackedSeries(this.values(), this.box()).map((band) => ({
          ...band,
          color: seriesColor(band.index),
        }))
      : [],
  );

  readonly legend = computed(() => this.showLegend() && this.hasData() && this.series().length >= 2);

  readonly name = computed(() => {
    const series = this.series();
    if (!this.hasData()) return this.label();
    const summary = series
      .map((s) => `${s.label} ${s.values.length > 0 ? s.values[s.values.length - 1] : 0}`)
      .join(', ');
    return `${this.label()}: ${summary}`;
  });

  colorFor(i: number): string {
    return seriesColor(i);
  }
}
