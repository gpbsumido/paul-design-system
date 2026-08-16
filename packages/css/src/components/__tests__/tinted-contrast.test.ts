import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { colors, semanticColors } from '../../../../tokens/src/colors';
import { contrast } from '../../../../tokens/src/__tests__/palette-check';

/**
 * The tinted-fill family: a component that paints a pale fill from one ramp and
 * sets its label to a darker step of the same ramp. Badge, avatar and the
 * secondary button all do it, and until now nothing measured any of them —
 * `contrast()` was only ever pointed at the chart palette, so a ramp edit could
 * push a label under AA without a single test going red.
 *
 * These read the real declarations out of the real CSS rather than restating
 * the colours, so the assertion is about what the component actually paints.
 * The state list per component is written down here because CSS has no way to
 * enumerate "every variant and state this thing has" — that part is a claim the
 * test makes, and it is the part to extend when a variant is added.
 */

const here = dirname(fileURLToPath(import.meta.url));
const read = (file: string): string => readFileSync(resolve(here, '..', file), 'utf-8');

/** Normal-size text under WCAG 2.1 AA. */
const AA_NORMAL = 4.5;

type Theme = 'light' | 'dark';

/** Resolve one `var(--paul-color-*)` reference, or a literal, to a hex string. */
const resolveColor = (value: string, theme: Theme): string => {
  const literal = value.trim();
  if (literal.startsWith('#')) return literal;

  // Take the token the declaration names, not the fallback inside it. Label
  // declarations now read `var(--paul-color-on-x, <old literal>)`, and matching
  // the inner fallback would measure the value the token is meant to replace —
  // green either way today, and wrong the moment the two are allowed to differ.
  const token = literal.match(/var\(\s*(--paul-color-[a-z0-9-]+)\s*[,)]/i)?.[1];
  if (!token) throw new Error(`cannot resolve colour: ${value}`);

  const name = token.replace('--paul-color-', '');
  const ramped = name.match(/^([a-z]+)-(\d+)$/);
  if (ramped) {
    const [, ramp, step] = ramped;
    const hex = (colors as Record<string, Record<string, string>>)[ramp]?.[step];
    if (!hex) throw new Error(`unknown ramp step: ${token}`);
    return hex;
  }

  const semantic = (semanticColors[theme] as Record<string, string>)[name];
  if (!semantic) throw new Error(`unknown semantic token: ${token}`);
  return semantic;
};

type Declared = { readonly color?: string; readonly fills?: readonly string[] };

/**
 * Pull the colour-bearing declarations out of one rule. Every `var()` in a
 * background is treated as a fill candidate, so a gradient contributes each of
 * its stops and the label has to clear the worst one.
 */
const declarationsFor = (css: string, selector: string): Declared => {
  const start = css.indexOf(`\n  ${selector} {`);
  if (start === -1) throw new Error(`selector not found: ${selector}`);
  const open = css.indexOf('{', start);
  let depth = 0;
  let body = '';
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        body = css.slice(open + 1, i);
        break;
      }
    }
  }

  const color = body.match(/(?:^|;)\s*color:\s*([^;]+);/)?.[1]?.trim();
  const background = body.match(/(?:^|;)\s*background(?:-color|-image)?:\s*([^;]+);/s);
  const fills = background
    ? [...background[1].matchAll(/var\(\s*--paul-color-[a-z0-9-]+\s*\)|#[0-9a-f]{3,8}/gi)].map(
        (m) => m[0],
      )
    : undefined;

  return { color, fills: fills?.length ? fills : undefined };
};

type Combo = {
  readonly label: string;
  readonly theme: Theme;
  /** Selectors in cascade order — later ones win for whatever they declare. */
  readonly chain: readonly string[];
};

/** Fold a cascade chain down to the label colour and the fills behind it. */
const effective = (css: string, combo: Combo) => {
  let color: string | undefined;
  let fills: readonly string[] | undefined;
  for (const selector of combo.chain) {
    const declared = declarationsFor(css, selector);
    if (declared.color) color = declared.color;
    if (declared.fills) fills = declared.fills;
  }
  if (!color) throw new Error(`${combo.label}: no label colour in cascade`);
  if (!fills) throw new Error(`${combo.label}: no fill in cascade`);
  return {
    color: resolveColor(color, combo.theme),
    fills: fills.map((f) => resolveColor(f, combo.theme)),
  };
};

const worstRatio = (css: string, combo: Combo) => {
  const { color, fills } = effective(css, combo);
  const ratios = fills.map((fill) => ({ fill, ratio: contrast(color, fill) }));
  return ratios.reduce((worst, next) => (next.ratio < worst.ratio ? next : worst));
};

const BUTTON: readonly Combo[] = [
  { label: 'secondary rest, light', theme: 'light', chain: ['.btn--secondary'] },
  {
    label: 'secondary hover, light',
    theme: 'light',
    chain: ['.btn--secondary', '.btn--secondary:hover'],
  },
  {
    label: 'secondary rest, dark',
    theme: 'dark',
    chain: ['.btn--secondary', '[data-theme="dark"] .btn--secondary'],
  },
  {
    label: 'secondary hover, dark',
    theme: 'dark',
    chain: [
      '.btn--secondary',
      '.btn--secondary:hover',
      '[data-theme="dark"] .btn--secondary',
      '[data-theme="dark"] .btn--secondary:hover',
    ],
  },
];

/**
 * Solid fills — the other half of the family, and the half that went unmeasured
 * for longer. These paint a saturated ramp step and put white on it, which was a
 * literal until the label tokens landed. Measuring them here is what makes the
 * ketsup case a test rather than a bug report: re-point `on-primary` or the
 * ramp and this is what says whether the label still reads.
 *
 * Both themes are listed even though neither button has a dark override, because
 * `on-primary` and `on-error` are now themeable and a consumer can move one
 * theme without the other.
 *
 * `.btn--gel` is deliberately absent — see the note at the end of this file.
 */
const SOLID: readonly Combo[] = (['light', 'dark'] as const).flatMap((theme) => [
  { label: `primary rest, ${theme}`, theme, chain: ['.btn--primary'] },
  {
    label: `primary hover, ${theme}`,
    theme,
    chain: ['.btn--primary', '.btn--primary:hover'],
  },
  { label: `danger rest, ${theme}`, theme, chain: ['.btn--danger'] },
  {
    label: `danger hover, ${theme}`,
    theme,
    chain: ['.btn--danger', '.btn--danger:hover'],
  },
]);

/** The tooltip inverts the surface, so its label is the one that flips by theme. */
const TOOLTIP: readonly Combo[] = [
  { label: 'bubble, light', theme: 'light', chain: ['.tooltip'] },
  {
    label: 'bubble, dark',
    theme: 'dark',
    chain: ['.tooltip', '[data-theme="dark"] .tooltip'],
  },
];

const BADGE_VARIANTS = ['success', 'warning', 'error', 'info'] as const;

const BADGE: readonly Combo[] = [
  ...BADGE_VARIANTS.map(
    (v): Combo => ({ label: `${v}, light`, theme: 'light', chain: [`.badge--${v}`] }),
  ),
  ...BADGE_VARIANTS.map(
    (v): Combo => ({
      label: `${v}, dark`,
      theme: 'dark',
      chain: [`.badge--${v}`, `[data-theme="dark"] .badge--${v}`],
    }),
  ),
];

/**
 * Starburst is 10px bold. That is under the 14px-bold cut for "large text", so
 * it carries the full 4.5:1 floor rather than 3:1. It deliberately has no dark
 * override, so each variant is measured once and holds for both themes.
 */
const STARBURST: readonly Combo[] = [
  { label: 'starburst primary', theme: 'light', chain: ['.badge--starburst'] },
  ...(['success', 'warning', 'error'] as const).map(
    (v): Combo => ({
      label: `starburst ${v}`,
      theme: 'light',
      chain: ['.badge--starburst', `.badge--starburst.badge--${v}`],
    }),
  ),
];

const AVATAR: readonly Combo[] = [
  { label: 'fallback, light', theme: 'light', chain: ['.avatar--fallback'] },
  {
    label: 'fallback, dark',
    theme: 'dark',
    chain: ['.avatar--fallback', '[data-theme="dark"] .avatar--fallback'],
  },
];

describe('tinted-fill contrast', () => {
  const button = read('button.css');
  const badge = read('badge.css');
  const avatar = read('avatar.css');
  const tooltip = read('tooltip.css');

  describe('secondary button', () => {
    it.each(BUTTON)('keeps the label over AA — $label', (combo) => {
      const { ratio, fill } = worstRatio(button, combo);
      expect(ratio, `${combo.label}: label on ${fill}`).toBeGreaterThanOrEqual(AA_NORMAL);
    });
  });

  describe('solid buttons', () => {
    it.each(SOLID)('keeps the label over AA — $label', (combo) => {
      const { ratio, fill } = worstRatio(button, combo);
      expect(ratio, `${combo.label}: label on ${fill}`).toBeGreaterThanOrEqual(AA_NORMAL);
    });
  });

  describe('tooltip', () => {
    it.each(TOOLTIP)('keeps the label over AA — $label', (combo) => {
      const { ratio, fill } = worstRatio(tooltip, combo);
      expect(ratio, `${combo.label}: label on ${fill}`).toBeGreaterThanOrEqual(AA_NORMAL);
    });
  });

  describe('badge', () => {
    it.each(BADGE)('keeps the label over AA — $label', (combo) => {
      const { ratio, fill } = worstRatio(badge, combo);
      expect(ratio, `${combo.label}: label on ${fill}`).toBeGreaterThanOrEqual(AA_NORMAL);
    });

    it.each(STARBURST)('keeps the seal legible at every stop — $label', (combo) => {
      const { ratio, fill } = worstRatio(badge, combo);
      expect(ratio, `${combo.label}: label on ${fill}`).toBeGreaterThanOrEqual(AA_NORMAL);
    });
  });

  describe('avatar', () => {
    it.each(AVATAR)('keeps the initials over AA — $label', (combo) => {
      const { ratio, fill } = worstRatio(avatar, combo);
      expect(ratio, `${combo.label}: initials on ${fill}`).toBeGreaterThanOrEqual(AA_NORMAL);
    });
  });
});

/*
 * `.btn--gel` is measured but not asserted, and that is a finding rather than an
 * oversight. Its fill is a gradient from `primary-500` to `primary-700` under a
 * 55% white gloss, and white on the `primary-500` stop is 3.45:1 — under AA
 * before the gloss lightens it further. That is true of the gel variant as it
 * shipped; the label tokens neither caused it nor fixed it.
 *
 * Asserting it here would go red for a reason this change is not responsible
 * for, and the fix is a visual one — retone the gradient or drop the gloss —
 * which belongs in a change that is allowed to move pixels. Tokenising the
 * label is what this change owes it: a consumer can now set `on-primary` and
 * get a readable gel button without forking the selector.
 */
