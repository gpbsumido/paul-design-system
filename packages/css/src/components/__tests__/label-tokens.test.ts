import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as csstree from 'css-tree';
import { colors, semanticColors } from '../../../../tokens/src/colors';

/**
 * A label a consumer cannot re-point is a label that fails on somebody's brand.
 *
 * `.btn--primary` painted `color: #fff` on a primary fill, which assumes the
 * primary is dark. ketsup's is a light gold, so the same declaration measured
 * 2.02:1 there and the app had to fork the component's selectors to get a
 * readable label. A literal in a component stylesheet is not a default — it is
 * a decision taken on the consumer's behalf, in the one place they cannot
 * reach.
 *
 * `tinted-contrast.test.ts` measures whether the pairs this package ships are
 * readable. This file measures something prior to it: whether a consumer who
 * re-points the palette can keep them readable. A ratio test over fixed values
 * passes right up until someone changes the values.
 *
 * The properties, in the order they matter:
 *  1. no label is a literal — every one reads a token
 *  2. the label layer and the fill layer stay disjoint, so no single value has
 *     to be dark enough to read as text and light enough to be a brand fill
 *  3. every label token carries an inline fallback equal to its shipped
 *     default, so a consumer on an older `@paul-portfolio/tokens` renders
 *     exactly what this package rendered before the tokens existed
 */

const componentsDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const files = readdirSync(componentsDir)
  .filter((f) => f.endsWith('.css'))
  .sort()
  .map((name) => ({ name, css: readFileSync(resolve(componentsDir, name), 'utf-8') }));

/** Properties that paint text or an icon — the thing a reader has to read. */
const LABEL_PROPERTIES = new Set(['color', '-webkit-text-fill-color']);

/** Properties that paint the surface a label sits on. */
const FILL_PROPERTIES = new Set(['background', 'background-color', 'background-image']);

/** Values that name no colour, so they cannot be the wrong one. */
const COLOURLESS = new Set([
  'transparent',
  'inherit',
  'currentcolor',
  'unset',
  'initial',
  'revert',
  'none',
]);

type Usage = {
  readonly file: string;
  readonly selector: string;
  readonly property: string;
  readonly value: string;
};

const collect = (): readonly Usage[] => {
  const found: Usage[] = [];
  for (const { name, css } of files) {
    csstree.walk(csstree.parse(css), {
      visit: 'Declaration',
      enter(node) {
        found.push({
          file: name,
          selector: this.rule ? csstree.generate(this.rule.prelude).trim() : '(no rule)',
          property: node.property.toLowerCase(),
          value: csstree.generate(node.value).trim(),
        });
      },
    });
  }
  return found;
};

const USAGES = collect();

const show = (u: Usage): string => `${u.file}  ${u.selector} { ${u.property}: ${u.value} }`;

/** Every `--paul-*` custom property a value reads. */
const tokensIn = (value: string): readonly string[] =>
  [...value.matchAll(/var\(\s*(--paul-[a-z0-9-]+)/gi)].map((m) => m[1]);

const isLabelToken = (token: string): boolean => token.startsWith('--paul-color-on-');

describe('component labels are tokenised', () => {
  it('never hardcodes a foreground colour', () => {
    const literals = USAGES.filter(
      (u) =>
        LABEL_PROPERTIES.has(u.property) &&
        !COLOURLESS.has(u.value.toLowerCase()) &&
        !/var\(\s*--paul-/i.test(u.value),
    );

    expect(literals.map(show)).toEqual([]);
  });

  /**
   * The sharper half of the defect. `--paul-color-primary-700` was the secondary
   * button's label and the primary button's hover fill at the same time: one
   * value that has to be dark enough to read on a pale tint and stay on-brand as
   * a saturated fill. For a light brand colour those pull apart and no single
   * step satisfies both. Label tokens only fix that if they stay out of the fill
   * layer, so that separation is the thing worth asserting.
   */
  it('never paints a fill with a label token', () => {
    const asFill = USAGES.filter(
      (u) => FILL_PROPERTIES.has(u.property) && tokensIn(u.value).some(isLabelToken),
    );

    expect(asFill.map(show)).toEqual([]);
  });
});

type Theme = 'light' | 'dark';

const expand = (hex: string): string =>
  (hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex
  ).toLowerCase();

/** Resolve a literal or a single ramp reference down to a hex string. */
const resolveDefault = (value: string): string => {
  if (value.startsWith('#')) return expand(value);

  const ramp = value.match(/^var\(\s*--paul-color-([a-z]+)-(\d+)\s*\)$/i);
  if (!ramp) throw new Error(`fallback is neither a hex nor a ramp step: ${value}`);

  const hex = (colors as Record<string, Record<string, string>>)[ramp[1]]?.[ramp[2]];
  if (!hex) throw new Error(`unknown ramp step: ${value}`);
  return expand(hex);
};

/** `var(--paul-color-on-x, <fallback>)` split into its two halves. */
const splitFallback = (value: string): { token: string; fallback: string } | undefined => {
  const m = value.match(/^var\(\s*(--paul-color-on-[a-z0-9-]+)\s*,\s*(.+)\)$/i);
  return m ? { token: m[1], fallback: m[2].trim() } : undefined;
};

/**
 * Which selectors are expected to read which label token.
 *
 * CSS cannot enumerate "every control that paints a label on its own fill", so
 * this list is a claim the test makes rather than something it derives. It is
 * the part to extend when a variant is added — and the thing that goes red if a
 * label quietly reverts to a ramp step.
 */
const EXPECTED: ReadonlyArray<readonly [file: string, selector: string, token: string]> = [
  ['button.css', '.btn--primary', '--paul-color-on-primary'],
  ['button.css', '.btn--gel', '--paul-color-on-primary'],
  ['button.css', '.btn--danger', '--paul-color-on-error'],
  ['button.css', '.btn--secondary', '--paul-color-on-primary-tint'],
  ['button.css', '[data-theme="dark"] .btn--secondary', '--paul-color-on-primary-tint'],
  ['badge.css', '.badge--info', '--paul-color-on-primary-tint'],
  ['badge.css', '[data-theme="dark"] .badge--info', '--paul-color-on-primary-tint'],
  ['badge.css', '.badge--success', '--paul-color-on-success-tint'],
  ['badge.css', '[data-theme="dark"] .badge--success', '--paul-color-on-success-tint'],
  ['badge.css', '.badge--warning', '--paul-color-on-warning-tint'],
  ['badge.css', '[data-theme="dark"] .badge--warning', '--paul-color-on-warning-tint'],
  ['badge.css', '.badge--error', '--paul-color-on-error-tint'],
  ['badge.css', '[data-theme="dark"] .badge--error', '--paul-color-on-error-tint'],
  ['avatar.css', '.avatar--fallback', '--paul-color-on-primary-tint'],
  ['avatar.css', '[data-theme="dark"] .avatar--fallback', '--paul-color-on-primary-tint'],
  ['tooltip.css', '.tooltip', '--paul-color-on-inverse'],
  ['tooltip.css', '[data-theme="dark"] .tooltip', '--paul-color-on-inverse'],
  ['guided-tour.css', '.tour__next', '--paul-color-on-primary'],
];

describe('label tokens', () => {
  it.each(EXPECTED.map(([file, selector, token]) => ({ file, selector, token })))(
    'is what $file $selector paints its label with',
    ({ file, selector, token }) => {
      const declared = USAGES.find(
        (u) => u.file === file && u.selector === selector && u.property === 'color',
      );

      expect(declared, `${file} ${selector} declares no colour`).toBeDefined();
      expect(tokensIn(declared?.value ?? '')).toContain(token);
    },
  );

  it('are all defined by the tokens package, in both themes', () => {
    const used = new Set(
      USAGES.filter((u) => LABEL_PROPERTIES.has(u.property))
        .flatMap((u) => tokensIn(u.value))
        .filter(isLabelToken),
    );

    expect(used.size, 'no label tokens are in use').toBeGreaterThan(0);

    const missing = [...used].flatMap((token) => {
      const name = token.replace('--paul-color-', '');
      return (['light', 'dark'] as const)
        .filter((theme) => !(name in semanticColors[theme]))
        .map((theme) => `${token} is undefined for ${theme}`);
    });

    expect(missing).toEqual([]);
  });
});

/**
 * The whole change is supposed to be visually inert. A consumer who bumps this
 * package and sets nothing must get the pixels they got before, including one
 * still on an older tokens build where `--paul-color-on-*` does not exist at
 * all — which is why every reference carries an inline fallback. These two
 * assertions are what make "inert" checkable rather than asserted.
 */
describe('label tokens default to what the package rendered before', () => {
  it('never reference a label token without a fallback', () => {
    const bare = USAGES.filter(
      (u) =>
        LABEL_PROPERTIES.has(u.property) &&
        tokensIn(u.value).some(isLabelToken) &&
        splitFallback(u.value) === undefined,
    );

    expect(bare.map(show)).toEqual([]);
  });

  const withFallback = USAGES.filter((u) => LABEL_PROPERTIES.has(u.property)).flatMap((usage) => {
    const parsed = splitFallback(usage.value);
    return parsed ? [{ usage, ...parsed }] : [];
  });

  it.each(
    withFallback.map((entry) => ({
      label: `${entry.usage.file} ${entry.usage.selector} -> ${entry.token}`,
      ...entry,
    })),
  )('falls back to the shipped default — $label', ({ usage, token, fallback }) => {
    const theme: Theme = usage.selector.includes('[data-theme="dark"]') ? 'dark' : 'light';
    const name = token.replace('--paul-color-', '');
    const shipped = (semanticColors[theme] as Record<string, string>)[name];

    expect(shipped, `${token} is not defined for the ${theme} theme`).toBeDefined();
    expect(resolveDefault(fallback), `${token} in ${theme}`).toBe(expand(shipped));
  });
});
