import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { linePath, areaPath, multiLinePoints } from './chart-geometry';

/**
 * A compact, axis-free trend line — the Angular twin of the React `Sparkline`.
 * Renders identical pure SVG from the shared `chart-geometry`. Exposes
 * `role="img"` with a caller-supplied label since the drawing has no text.
 *
 * With `series`, every line is scaled against ONE domain spanning all of them —
 * independently scaled sparklines look comparable and aren't. `area` applies to
 * the single-series form only; stacked fills at this size are mud.
 */
@Component({
  selector: 'paul-sparkline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'img',
    '[class]': "'paul-chart paul-chart--sparkline'",
    '[attr.aria-label]': 'label()',
  },
  template: `
    @if (hasData()) {
      <svg
        class="paul-chart__svg"
        [attr.viewBox]="viewBox()"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        @if (lines().length > 0) {
          @for (line of lines(); track line.index) {
            <path
              class="paul-chart__line"
              [attr.d]="line.d"
              fill="none"
              [attr.stroke]="line.color"
              vector-effect="non-scaling-stroke"
            ></path>
          }
        } @else {
          @if (variant() === 'area') {
            <path class="paul-chart__area" [attr.d]="areaD()"></path>
          }
          <path
            class="paul-chart__line"
            [attr.d]="lineD()"
            fill="none"
            vector-effect="non-scaling-stroke"
          ></path>
        }
      </svg>
    } @else {
      <span class="paul-chart__empty" aria-hidden="true">No data</span>
    }
  `,
})
export class PaulSparklineComponent {
  /** The series to plot. Ignored when `series` is given. */
  readonly data = input<number[]>([]);
  /** Several series on one shared y-domain. Takes precedence over `data`. */
  readonly series = input<number[][]>([]);
  readonly variant = input<'line' | 'area'>('line');
  readonly label = input.required<string>();
  readonly width = input(160);
  readonly height = input(40);

  private readonly box = computed(() => ({
    width: this.width(),
    height: this.height(),
    padding: 2,
  }));

  private readonly multi = computed(() => this.series().filter((s) => s.length > 0));

  readonly viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);
  readonly hasData = computed(() => this.multi().length > 0 || this.data().length > 0);

  readonly lines = computed(() =>
    multiLinePoints(this.multi(), this.box()).map((points, index) => ({
      index,
      d: points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' '),
      color: `var(--paul-chart-${Math.min(index, 5) + 1})`,
    })),
  );

  readonly lineD = computed(() => linePath(this.data(), this.box()));
  readonly areaD = computed(() => areaPath(this.data(), this.box()));
}
