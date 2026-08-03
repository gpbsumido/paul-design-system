import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { linePath, areaPath } from './chart-geometry';

/**
 * A compact, axis-free trend line — the Angular twin of the React `Sparkline`.
 * Renders identical pure SVG from the shared `chart-geometry`. Exposes
 * `role="img"` with a caller-supplied label since the drawing has no text.
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
    @if (data().length > 0) {
      <svg
        class="paul-chart__svg"
        [attr.viewBox]="viewBox()"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        @if (variant() === 'area') {
          <path class="paul-chart__area" [attr.d]="areaD()"></path>
        }
        <path
          class="paul-chart__line"
          [attr.d]="lineD()"
          fill="none"
          vector-effect="non-scaling-stroke"
        ></path>
      </svg>
    } @else {
      <span class="paul-chart__empty" aria-hidden="true">No data</span>
    }
  `,
})
export class PaulSparklineComponent {
  readonly data = input<number[]>([]);
  readonly variant = input<'line' | 'area'>('line');
  readonly label = input.required<string>();
  readonly width = input(160);
  readonly height = input(40);

  private readonly box = computed(() => ({
    width: this.width(),
    height: this.height(),
    padding: 2,
  }));

  readonly viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);
  readonly lineD = computed(() => linePath(this.data(), this.box()));
  readonly areaD = computed(() => areaPath(this.data(), this.box()));
}
