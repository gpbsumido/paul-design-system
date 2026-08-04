import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { paretoLayout } from './chart-geometry';

export interface PaulParetoDatum {
  label: string;
  value: number;
}

/** Height reserved under the plot for the category labels. */
const LABEL_BAND = 16;
const PADDING = 2;

/**
 * Sorted bars plus a cumulative line, on ONE y-axis — the Angular twin of the
 * React `ParetoChart`.
 *
 * The textbook Pareto puts raw counts on the left axis and cumulative percent
 * on the right. Two y-scales on one plot invent a relationship the data doesn't
 * have — where the line appears to cross the bars is a function of how the two
 * scales were aligned, and that alignment is arbitrary. So there is one axis
 * here: the bars are percent-of-total and the line is cumulative percent, both
 * on 0–100, and the crossing point means something. Nothing is labelled with a
 * raw count as if it had a scale of its own.
 *
 * One series, one colour. Ramping the bars by value would encode magnitude
 * twice — the height already says it, and the categories are nominal.
 */
@Component({
  selector: 'paul-pareto-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': "'paul-chart paul-chart--pareto'" },
  template: `
    <div class="paul-chart__figure" role="img" [attr.aria-label]="name()">
      @if (ranked().length > 0) {
        <svg
          class="paul-chart__svg"
          [attr.viewBox]="viewBox()"
          aria-hidden="true"
          focusable="false"
        >
          @for (bar of bars(); track $index) {
            <rect
              class="paul-chart__bar"
              [attr.x]="bar.x"
              [attr.y]="bar.y"
              [attr.width]="bar.width"
              [attr.height]="bar.height"
              rx="1"
              fill="var(--paul-chart-1)"
            ></rect>
          }
          <!-- Recessive ink: the threshold is a reference, not a series. -->
          <line
            class="paul-chart__threshold"
            [attr.x1]="padding"
            [attr.x2]="width() - padding"
            [attr.y1]="thresholdY()"
            [attr.y2]="thresholdY()"
            stroke="var(--paul-color-border)"
            stroke-dasharray="4 3"
          ></line>
          <polyline
            class="paul-chart__cumulative"
            [attr.points]="cumulativePoints()"
            fill="none"
            stroke="var(--paul-chart-4)"
            stroke-width="2"
          ></polyline>
          @if (cutPoint(); as cp) {
            <circle
              class="paul-chart__cut"
              [attr.cx]="cp.x"
              [attr.cy]="cp.y"
              r="3"
              fill="var(--paul-chart-4)"
            ></circle>
          }
          @for (bar of bars(); track $index) {
            <text
              class="paul-chart__category"
              [attr.x]="bar.x + bar.width / 2"
              [attr.y]="height() - 5"
              text-anchor="middle"
            >
              {{ bar.label }}
            </text>
          }
        </svg>
      } @else {
        <span class="paul-chart__empty" aria-hidden="true">No data</span>
      }
    </div>
  `,
})
export class PaulParetoChartComponent {
  readonly data = input<PaulParetoDatum[]>([]);
  readonly label = input.required<string>();
  /** Cumulative percent to draw the reference line at. Defaults to 80. */
  readonly threshold = input(80);
  readonly width = input(200);
  readonly height = input(140);

  readonly padding = PADDING;

  readonly viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);

  private readonly plotHeight = computed(() => Math.max(0, this.height() - LABEL_BAND));

  // `paretoLayout` filters out non-positive values and sorts descending, so the
  // incoming order is NOT the bar order. Pair labels to values and put them
  // through the identical filter + sort, or every bar gets the wrong name.
  // `Array.prototype.sort` is stable, so ties keep their original order in both.
  readonly ranked = computed(() =>
    this.data()
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value),
  );

  private readonly layout = computed(() =>
    paretoLayout(
      this.data().map((d) => d.value),
      { width: this.width(), height: this.plotHeight(), padding: PADDING },
      { threshold: this.threshold() },
    ),
  );

  readonly bars = computed(() =>
    this.layout().bars.map((bar, i) => ({ ...bar, label: this.ranked()[i]?.label ?? '' })),
  );

  readonly cumulativePoints = computed(() =>
    this.layout()
      .cumulative.map((p) => `${p.x},${p.y}`)
      .join(' '),
  );

  // The geometry takes the threshold too, so the cut it reports and the rule
  // drawn below are the same number by construction.
  readonly cutIndex = computed(() => this.layout().cutIndex);

  readonly cutPoint = computed(() => this.layout().cumulative[this.cutIndex()] ?? null);

  // Same mapping the geometry uses for the cumulative points, so the reference
  // line and the line it references are on one scale by construction.
  readonly thresholdY = computed(() => {
    const bottom = this.plotHeight() - PADDING;
    const innerHeight = Math.max(0, this.plotHeight() - PADDING * 2);
    return Math.round((bottom - this.threshold() * (innerHeight / 100)) * 1000) / 1000;
  });

  readonly name = computed(() => {
    const ranked = this.ranked();
    if (ranked.length === 0) return this.label();
    const { percents } = this.layout();
    const summary = ranked.map((d, i) => `${d.label} ${percents[i] ?? 0}%`).join(', ');
    const cut = this.cutIndex();
    const crossing =
      cut >= 0
        ? `${this.threshold()}% of the total is reached by the first ${cut + 1} of ${ranked.length}.`
        : `The cumulative total never reaches ${this.threshold()}%.`;
    return `${this.label()}: ${summary}. ${crossing}`;
  });
}
