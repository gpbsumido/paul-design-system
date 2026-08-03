import { type HTMLAttributes } from 'react';
import { cx } from './cx';
import { wordCloudLayout } from './chartGeometry';

export type WordCloudDatum = {
  text: string;
  weight: number;
};

type WordCloudProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  terms: WordCloudDatum[];
  /** Accessible name for the chart. Required. */
  label: string;
  /** Terms considered, heaviest first. Beyond this the tail is dropped. Defaults to 50. */
  limit?: number;
  /** Font size of the lightest term, in coordinate units. Defaults to 12. */
  minFontSize?: number;
  /** Font size of the heaviest term, in coordinate units. Defaults to 40. */
  maxFontSize?: number;
  /** viewBox width in coordinate units. Defaults to 400. */
  width?: number;
  /** viewBox height in coordinate units. Defaults to 240. */
  height?: number;
};

/**
 * A word cloud. Read this before you use it:
 *
 * Glyph AREA is not a comparable encoding. A long word reads as bigger than a
 * short one at the same weight, so "internationalization" at weight 10 looks
 * heavier than "go" at weight 30, and nobody can recover the numbers from the
 * picture. `BarChart` shows the same data honestly. This component exists
 * because a gallery wants one — when the numbers matter, reach for the bars.
 *
 * The aria-label carries the ranked term/weight list, which is the honest
 * version of the same data, so a screen reader gets the better chart.
 *
 * Pure SVG from `chartGeometry`, matching the Angular `PaulWordCloud`. The
 * layout has no randomness in it: the same input renders the same picture every
 * time, so server and client agree and visual regression settles.
 */
export function WordCloud({
  terms,
  label,
  limit = 50,
  minFontSize = 12,
  maxFontSize = 40,
  width = 400,
  height = 240,
  className,
  ...props
}: WordCloudProps) {
  const words = wordCloudLayout(
    terms,
    { width, height, padding: 4 },
    { limit, minFontSize, maxFontSize },
  );

  // Ranked from the input rather than from the layout: a term the spiral had no
  // room for still belongs in the accessible list. Same filter, sort and cap the
  // geometry applies, so the two stay in step.
  const ranked = [...terms]
    .filter((t) => t.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);

  const summary = ranked.map((t) => `${t.text} ${t.weight}`).join(', ');
  const name = ranked.length > 0 ? `${label}: ${summary}` : label;

  // Weight is already carried by font size. Ramping colour by weight too would
  // encode the same number twice; the categorical slots just keep the words
  // apart, cycling by rank.
  const colorFor = (i: number) => `var(--paul-chart-${(i % 6) + 1})`;

  return (
    <div className={cx('paul-chart', 'paul-chart--word-cloud', className)} {...props}>
      <div role="img" aria-label={name} className="paul-chart__figure">
        {words.length > 0 ? (
          <svg
            className="paul-chart__svg"
            viewBox={`0 0 ${width} ${height}`}
            aria-hidden="true"
            focusable="false"
          >
            {words.map((word) => (
              <text
                key={word.text}
                className="paul-chart__word"
                x={word.x}
                y={word.y}
                fontSize={word.fontSize}
                fill={colorFor(word.index)}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {word.text}
              </text>
            ))}
          </svg>
        ) : (
          <span className="paul-chart__empty" aria-hidden="true">
            No data
          </span>
        )}
      </div>
    </div>
  );
}
