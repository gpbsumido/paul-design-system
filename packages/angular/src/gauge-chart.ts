import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { gaugeArc } from './chart-geometry';

export type PaulGaugeTone = 'default' | 'good' | 'warning' | 'critical';

/**
 * Status is never colour alone: a tone other than `default` also renders its
 * name as visible text beside the value, so the reading survives greyscale,
 * a colour-vision deficiency, and a printout.
 */
const TONE_LABEL: Record<PaulGaugeTone, string> = {
  default: '',
  good: 'Good',
  warning: 'Warning',
  critical: 'Critical',
};

/** Tones borrow the SEMANTIC status colours, not the categorical series ramp. */
const TONE_COLOR: Record<PaulGaugeTone, string> = {
  default: 'var(--paul-chart-1)',
  good: 'var(--paul-color-success-600)',
  warning: 'var(--paul-color-warning-600)',
  critical: 'var(--paul-color-error-600)',
};

/**
 * One ratio against a limit, drawn as a radial dial — the Angular twin of the
 * React `GaugeChart`.
 *
 * The number is the point, so it is a hero figure inside the arc rather than a
 * label hanging off it. Text wears the text tokens and never the series colour;
 * the track is recessive and the fill carries the tone. No legend: a single
 * value has nothing to key.
 *
 * When `tone` is anything but `default` the tone name is rendered as text next
 * to the value, because status must never be carried by colour alone.
 */
@Component({
  selector: 'paul-gauge-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': "'paul-chart paul-chart--gauge'" },
  template: `
    <div class="paul-chart__figure" role="img" [attr.aria-label]="name()">
      <svg class="paul-chart__svg" [attr.viewBox]="viewBox()" aria-hidden="true" focusable="false">
        <!-- The track is always drawn — an empty gauge still has to show its range. -->
        <path class="paul-chart__gauge-track" [attr.d]="geometry().track"></path>
        @if (geometry().fill !== '') {
          <path
            class="paul-chart__gauge-fill"
            [attr.d]="geometry().fill"
            [attr.fill]="toneColor()"
          ></path>
        }
      </svg>
    </div>
    <div class="paul-chart__readout">
      <p class="paul-chart__value">
        {{ value() }}@if (unit()) {<span class="paul-chart__unit">{{ unit() }}</span>}
      </p>
      @if (toneLabel()) {
        <p class="paul-chart__tone">{{ toneLabel() }}</p>
      }
      <p class="paul-chart__caption">of {{ range() }}</p>
    </div>
  `,
})
export class PaulGaugeChartComponent {
  /** The reading. Clamped into [min, max] for the arc; shown verbatim as text. */
  readonly value = input.required<number>();
  readonly label = input.required<string>();
  readonly min = input(0);
  readonly max = input(100);
  /** Suffix beside the hero number, e.g. "%" or "GB". */
  readonly unit = input<string | undefined>(undefined);
  readonly size = input(120);
  readonly thickness = input(20);
  /** Total sweep in degrees. Defaults to 270 — a dial, not a full ring. */
  readonly sweep = input(270);
  readonly tone = input<PaulGaugeTone>('default');

  readonly viewBox = computed(() => `0 0 ${this.size()} ${this.size()}`);

  readonly geometry = computed(() =>
    gaugeArc(this.value(), {
      size: this.size(),
      thickness: this.thickness(),
      min: this.min(),
      max: this.max(),
      sweep: this.sweep(),
    }),
  );

  readonly toneLabel = computed(() => TONE_LABEL[this.tone()]);
  readonly toneColor = computed(() => TONE_COLOR[this.tone()]);

  /**
   * Name the whole range, not just its top: a gauge running 20–60 that says
   * "of 60" invites the reader to compute 41.5/60 when the arc means
   * (41.5-20)/(60-20). Only mention `min` when it isn't the assumed zero.
   */
  readonly range = computed(() => (this.min() === 0 ? `${this.max()}` : `${this.min()} to ${this.max()}`));

  readonly name = computed(() => {
    const tone = this.toneLabel();
    const summary = `${this.value()} of ${this.range()} (${this.geometry().percent}%)`;
    return `${this.label()}: ${summary}${tone ? `, ${tone}` : ''}`;
  });
}
