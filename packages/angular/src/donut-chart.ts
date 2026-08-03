import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { donutSegments } from './chart-geometry';

export interface PaulDonutDatum {
  label: string;
  value: number;
  /** Slice colour. Falls back to the token palette when omitted. */
  color?: string;
}

/**
 * A donut (ring) chart with an optional legend — the Angular twin of the React
 * `DonutChart`. The ring is `role="img"`; the legend sits outside it so its
 * rows stay in the accessibility tree.
 */
@Component({
  selector: 'paul-donut-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': "'paul-chart paul-chart--donut'" },
  template: `
    <div class="paul-chart__figure" role="img" [attr.aria-label]="name()">
      <svg class="paul-chart__svg" [attr.viewBox]="viewBox()" aria-hidden="true" focusable="false">
        @for (seg of slices(); track seg.index) {
          <path class="paul-chart__slice" [attr.d]="seg.path" [attr.fill]="seg.color"></path>
        }
      </svg>
    </div>
    @if (legend() && data().length > 0) {
      <ul class="paul-chart__legend">
        @for (d of data(); track d.label; let i = $index) {
          <li class="paul-chart__legend-item">
            <span class="paul-chart__swatch" aria-hidden="true" [style.background-color]="colorFor(i)"></span>
            <span class="paul-chart__legend-label">{{ d.label }}</span>
            <span class="paul-chart__legend-value">{{ d.value }}</span>
          </li>
        }
      </ul>
    }
  `,
})
export class PaulDonutChartComponent {
  readonly data = input<PaulDonutDatum[]>([]);
  readonly label = input.required<string>();
  readonly legend = input(true);
  readonly size = input(120);
  readonly thickness = input(28);

  readonly viewBox = computed(() => `0 0 ${this.size()} ${this.size()}`);

  readonly slices = computed(() =>
    donutSegments(
      this.data().map((d) => d.value),
      { size: this.size(), thickness: this.thickness() },
    )
      .filter((seg) => seg.percent > 0)
      .map((seg) => ({ ...seg, color: this.colorFor(seg.index) })),
  );

  readonly name = computed(() => {
    const data = this.data();
    if (data.length === 0) return this.label();
    const summary = data.map((d) => `${d.label} ${d.value}`).join(', ');
    return `${this.label()}: ${summary}`;
  });

  colorFor(i: number): string {
    return this.data()[i]?.color ?? `var(--paul-chart-${(i % 6) + 1})`;
  }
}
