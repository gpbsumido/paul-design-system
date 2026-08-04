import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { funnelStages } from './chart-geometry';

export interface PaulFunnelDatum {
  label: string;
  value: number;
}

/** Stage colour comes from the SEQUENTIAL ramp: funnel stages are ordered. */
function stageColor(i: number, total: number): string {
  const step = total <= 1 ? 3 : Math.round(1 + (i / (total - 1)) * 3);
  return `var(--paul-chart-seq-${step + 1})`;
}

/**
 * Stage-to-stage conversion, drawn as narrowing bands — the Angular twin of the
 * React `FunnelChart`.
 *
 * The drop-off is what a funnel is read for, so it is rendered as text rather
 * than left to the taper.
 */
@Component({
  selector: 'paul-funnel-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': "'paul-chart paul-chart--funnel'" },
  template: `
    <div class="paul-chart__figure" role="img" [attr.aria-label]="name()">
      @if (data().length > 0) {
        <svg
          class="paul-chart__svg"
          [attr.viewBox]="viewBox()"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          @for (stage of stages(); track stage.index) {
            <path class="paul-chart__stage" [attr.d]="stage.path" [attr.fill]="stage.color"></path>
          }
        </svg>
      } @else {
        <span class="paul-chart__empty" aria-hidden="true">No data</span>
      }
    </div>
    @if (data().length > 0) {
      <ol class="paul-chart__legend">
        @for (d of data(); track d.label; let i = $index) {
          <li class="paul-chart__legend-item">
            <span class="paul-chart__swatch" aria-hidden="true" [style.background-color]="colorFor(i)"></span>
            <span class="paul-chart__legend-label">{{ d.label }}</span>
            <span class="paul-chart__legend-value">{{ d.value }}</span>
            @if (showDropOff() && i > 0) {
              <span class="paul-chart__delta">−{{ dropOffAt(i) }}%</span>
            }
          </li>
        }
      </ol>
    }
  `,
})
export class PaulFunnelChartComponent {
  readonly data = input<PaulFunnelDatum[]>([]);
  readonly label = input.required<string>();
  readonly showDropOff = input(true);
  readonly width = input(200);
  readonly height = input(140);

  readonly viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);

  private readonly layout = computed(() =>
    funnelStages(
      this.data().map((d) => d.value),
      { width: this.width(), height: this.height(), padding: 2 },
    ),
  );

  readonly stages = computed(() =>
    this.layout().map((stage) => ({
      ...stage,
      color: stageColor(stage.index, this.layout().length),
    })),
  );

  readonly name = computed(() => {
    const data = this.data();
    if (data.length === 0) return this.label();
    const layout = this.layout();
    const summary = data
      .map((d, i) => `${d.label} ${d.value} (${layout[i]?.percent ?? 0}%)`)
      .join(', ');
    return `${this.label()}: ${summary}`;
  });

  colorFor(i: number): string {
    return stageColor(i, this.data().length);
  }

  dropOffAt(i: number): number {
    return this.layout()[i]?.dropOff ?? 0;
  }
}
