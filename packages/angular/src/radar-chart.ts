import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { radarAxes, radarPolygon } from './chart-geometry';

export interface PaulRadarSeries {
  label: string;
  /** One value per axis, in axis order. Missing entries read as 0. */
  values: number[];
}

/** At most three series — a fourth overlapping polygon stops being readable. */
const MAX_SERIES = 3;
/**
 * Warn once per offending render when series are dropped.
 *
 * Truncating is the right call — a fourth overlapping polygon is unreadable —
 * but doing it silently means a caller passing five series sees three and has no
 * way to find out why. Dev-only: `ngDevMode` is stripped from production builds.
 */
declare const ngDevMode: boolean | undefined;

/** Series colour comes from the CATEGORICAL palette: series are identities. */
function seriesColor(i: number): string {
  return `var(--paul-chart-${i + 1})`;
}

/**
 * Several measures compared on one frame — the Angular twin of the React
 * `RadarChart`.
 *
 * Two rules make the picture honest. Every series is scaled against ONE ceiling
 * (`max`, defaulting to the max across all series), so the polygons are
 * comparable rather than each filling the frame; and only the first three
 * series are drawn — anything past that is dropped, because overlapping
 * translucent polygons stop resolving into distinct shapes.
 *
 * The frame — spokes and rings — is recessive ink, never a series colour.
 */
@Component({
  selector: 'paul-radar-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': "'paul-chart paul-chart--radar'" },
  template: `
    <div class="paul-chart__figure" role="img" [attr.aria-label]="name()">
      @if (!empty()) {
        <svg class="paul-chart__svg" [attr.viewBox]="viewBox()" aria-hidden="true" focusable="false">
          @for (r of geometry().rings; track r) {
            <circle
              class="paul-chart__ring"
              [attr.cx]="geometry().cx"
              [attr.cy]="geometry().cy"
              [attr.r]="r"
            ></circle>
          }
          @for (axis of geometry().axes; track axis.index) {
            <line
              class="paul-chart__axis"
              [attr.x1]="geometry().cx"
              [attr.y1]="geometry().cy"
              [attr.x2]="axis.x"
              [attr.y2]="axis.y"
            ></line>
          }
          @for (poly of polygons(); track poly.label) {
            <polygon
              class="paul-chart__radar-area"
              [attr.points]="poly.points"
              [attr.fill]="poly.color"
              [attr.stroke]="poly.color"
            ></polygon>
          }
          @for (tick of axisLabels(); track tick.index) {
            <text
              class="paul-chart__axis-label"
              [attr.x]="tick.x"
              [attr.y]="tick.y"
              [attr.text-anchor]="tick.anchor"
              dominant-baseline="middle"
            >
              {{ tick.text }}
            </text>
          }
        </svg>
      } @else {
        <span class="paul-chart__empty" aria-hidden="true">No data</span>
      }
    </div>
    <!-- One series needs no legend — the accessible name already says what it is. -->
    @if (showLegend() && series().length >= 2) {
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
export class PaulRadarChartComponent {
  readonly data = input<PaulRadarSeries[]>([]);
  readonly axes = input<string[]>([]);
  readonly label = input.required<string>();
  readonly max = input<number | undefined>(undefined);
  readonly size = input(160);
  readonly showLegend = input(true);

  readonly viewBox = computed(() => `0 0 ${this.size()} ${this.size()}`);

  /** Extra series are dropped rather than drawn — see the class doc. */
  readonly series = computed(() => {
    const data = this.data();
    if (data.length > MAX_SERIES && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      // eslint-disable-next-line no-console
      console.warn(
        `PaulRadarChart ("${this.label()}"): ${data.length} series given, ${MAX_SERIES} drawn. ` +
          'Overlapping polygons stop being readable past three — facet into small ' +
          'multiples, or fold the tail into one series, rather than relying on this cap.',
      );
    }
    return data.slice(0, MAX_SERIES);
  });

  readonly empty = computed(() => this.series().length === 0 || this.axes().length === 0);

  private readonly box = computed(() => ({
    width: this.size(),
    height: this.size(),
    padding: 18,
  }));

  readonly geometry = computed(() => radarAxes(Math.max(this.axes().length, 1), this.box()));

  /** Pad or trim a series to the axis count so the polygon always closes. */
  private valuesFor(s: PaulRadarSeries): number[] {
    return this.axes().map((_, i) => s.values[i] ?? 0);
  }

  private readonly ceiling = computed(
    () => this.max() ?? Math.max(0, ...this.series().flatMap((s) => this.valuesFor(s))),
  );

  readonly polygons = computed(() =>
    this.series().map((s, i) => ({
      label: s.label,
      color: seriesColor(i),
      points: radarPolygon(this.valuesFor(s), this.box(), this.ceiling())
        .map((p) => `${p.x},${p.y}`)
        .join(' '),
    })),
  );

  readonly axisLabels = computed(() => {
    const geo = this.geometry();
    return geo.axes.map((axis) => ({
      index: axis.index,
      // Nudged past the spoke end so the name clears the outer ring.
      x: axis.x + (axis.x - geo.cx) * 0.12,
      y: axis.y + (axis.y - geo.cy) * 0.12,
      anchor: axis.x > geo.cx + 1 ? 'start' : axis.x < geo.cx - 1 ? 'end' : 'middle',
      text: this.axes()[axis.index] ?? '',
    }));
  });

  readonly name = computed(() => {
    if (this.empty()) return this.label();
    const axes = this.axes();
    const summary = this.series()
      .map((s) => `${s.label} ${axes.map((a, i) => `${a} ${s.values[i] ?? 0}`).join(', ')}`)
      .join('; ');
    return `${this.label()}: ${summary}`;
  });

  colorFor(i: number): string {
    return seriesColor(i);
  }
}
