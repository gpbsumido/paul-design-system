import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { wordCloudLayout } from './chart-geometry';

export interface PaulWordCloudDatum {
  text: string;
  weight: number;
}

/**
 * A word cloud. Read this before you use it:
 *
 * Glyph AREA is not a comparable encoding. A long word reads as bigger than a
 * short one at the same weight, so "internationalization" at weight 10 looks
 * heavier than "go" at weight 30, and nobody can recover the numbers from the
 * picture. `PaulBarChart` shows the same data honestly. This component exists
 * because a gallery wants one — when the numbers matter, reach for the bars.
 *
 * The aria-label carries the ranked term/weight list, which is the honest
 * version of the same data, so a screen reader gets the better chart.
 *
 * The Angular twin of the React `WordCloud`. The layout has no randomness in
 * it: the same input renders the same picture every time.
 */
@Component({
  selector: 'paul-word-cloud',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': "'paul-chart paul-chart--word-cloud'" },
  template: `
    <div class="paul-chart__figure" role="img" [attr.aria-label]="name()">
      @if (words().length > 0) {
        <svg class="paul-chart__svg" [attr.viewBox]="viewBox()" aria-hidden="true" focusable="false">
          @for (word of words(); track word.text) {
            <text
              class="paul-chart__word"
              [attr.x]="word.x"
              [attr.y]="word.y"
              [attr.font-size]="word.fontSize"
              [attr.fill]="word.color"
              text-anchor="middle"
              dominant-baseline="middle"
            >{{ word.text }}</text>
          }
        </svg>
      } @else {
        <span class="paul-chart__empty" aria-hidden="true">No data</span>
      }
    </div>
  `,
})
export class PaulWordCloudComponent {
  readonly terms = input<PaulWordCloudDatum[]>([]);
  readonly label = input.required<string>();
  readonly limit = input(50);
  readonly minFontSize = input(12);
  readonly maxFontSize = input(40);
  readonly width = input(400);
  readonly height = input(240);

  readonly viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);

  /**
   * Weight is already carried by font size. Ramping colour by weight too would
   * encode the same number twice; the categorical slots just keep the words
   * apart, cycling by rank.
   */
  readonly words = computed(() =>
    wordCloudLayout(
      this.terms(),
      { width: this.width(), height: this.height(), padding: 4 },
      { limit: this.limit(), minFontSize: this.minFontSize(), maxFontSize: this.maxFontSize() },
    ).map((word) => ({ ...word, color: `var(--paul-chart-${(word.index % 6) + 1})` })),
  );

  /**
   * Ranked from the input rather than from the layout: a term the spiral had no
   * room for still belongs in the accessible list. Same filter, sort and cap the
   * geometry applies, so the two stay in step.
   */
  private readonly ranked = computed(() =>
    [...this.terms()]
      .filter((t) => t.weight > 0)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, this.limit()),
  );

  readonly name = computed(() => {
    const ranked = this.ranked();
    if (ranked.length === 0) return this.label();
    return `${this.label()}: ${ranked.map((t) => `${t.text} ${t.weight}`).join(', ')}`;
  });
}
