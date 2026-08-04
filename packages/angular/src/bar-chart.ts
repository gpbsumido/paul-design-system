import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { barRects, barRectsHorizontal } from './chart-geometry';

/**
 * A categorical bar chart, vertical or horizontal — the Angular twin of the
 * React `BarChart`. Colour is never the only signal: the values are summarised
 * in the `role="img"` label.
 */
@Component({
  selector: 'paul-bar-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'img',
    '[class]': "'paul-chart paul-chart--bar'",
    '[attr.aria-label]': 'name()',
  },
  template: `
    <svg
      [class]="svgClasses()"
      [attr.viewBox]="viewBox()"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      @for (r of rects(); track $index) {
        <rect
          class="paul-chart__bar"
          [attr.x]="r.x"
          [attr.y]="r.y"
          [attr.width]="r.width"
          [attr.height]="r.height"
          rx="2"
          [attr.fill]="fillFor($index)"
        ></rect>
      }
    </svg>
  `,
})
export class PaulBarChartComponent {
  readonly data = input<number[]>([]);
  readonly labels = input<string[]>();
  readonly orientation = input<'vertical' | 'horizontal'>('vertical');
  readonly colors = input<string[]>();
  readonly label = input.required<string>();
  readonly width = input(160);
  readonly height = input(100);

  private readonly horizontal = computed(() => this.orientation() === 'horizontal');
  private readonly box = computed(() => ({ width: this.width(), height: this.height(), padding: 2 }));

  readonly viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);
  readonly rects = computed(() =>
    this.horizontal() ? barRectsHorizontal(this.data(), this.box()) : barRects(this.data(), this.box()),
  );

  readonly svgClasses = computed(() =>
    this.horizontal() ? 'paul-chart__svg paul-chart__svg--horizontal' : 'paul-chart__svg',
  );

  readonly name = computed(() => {
    const data = this.data();
    if (data.length === 0) return this.label();
    const labels = this.labels();
    const summary = data.map((v, i) => (labels?.[i] ? `${labels[i]} ${v}` : `${v}`)).join(', ');
    return `${this.label()}: ${summary}`;
  });

  fillFor(i: number): string {
    return this.colors()?.[i] ?? `var(--paul-chart-${(i % 6) + 1})`;
  }
}
