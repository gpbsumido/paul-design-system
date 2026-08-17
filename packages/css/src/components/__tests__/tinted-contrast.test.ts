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
/** The declaration block for one rule, braces balanced. */
const ruleBody = (css: string, selector: string): string => {
  const start = css.indexOf(`\n  ${selector} {`);
  if (start === -1) throw new Error(`selector not found: ${selector}`);
  const open = css.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) return css.slice(open + 1, i);
    }
  }
  throw new Error(`unterminated rule: ${selector}`);
};

const declarationsFor = (css: string, selector: string): Declared => {
  const body = ruleBody(css, selector);

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

/* ------------------------------------------------------------------
 * Layered gradients.
 *
 * `worstRatio` reads the discrete stops a background names and takes the worst.
 * That is the right instrument for the starburst badge, whose stops are opaque:
 * the worst pixel really is one of them. The gel button breaks both halves of
 * that assumption. Its fill is two stacked gradients and the upper one is
 * translucent white, so the colour under the label is an interpolation of the
 * base composited beneath a gloss, and no stop the CSS names is ever painted on
 * its own.
 *
 * Reading a stop there understates the failure, which is the dangerous
 * direction to be wrong in: the gloss is at full strength exactly where the
 * base gradient is lightest, so the two worst things line up on the same pixel.
 * ------------------------------------------------------------------ */

type Rgba = {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
};

/** Split on commas that sit outside any parentheses. */
const splitTop = (value: string): readonly string[] => {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of value) {
    if (ch === '(') depth += 1;
    if (ch === ')') depth -= 1;
    if (ch === ',' && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  parts.push(current);
  return parts.map((part) => part.trim()).filter((part) => part.length > 0);
};

const opaque = (hex: string): Rgba => {
  const raw = hex.replace('#', '');
  const full =
    raw.length === 3
      ? [...raw].map((c) => `${c}${c}`).join('')
      : raw;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return { r, g, b, a: 1 };
};

const toHex = (color: Rgba): string =>
  `#${(['r', 'g', 'b'] as const)
    .map((key) => Math.round(color[key]).toString(16).padStart(2, '0'))
    .join('')}`;

/** An `rgba()`/`rgb()` literal, a hex, or a token reference. */
const parseColor = (raw: string, theme: Theme): Rgba => {
  const value = raw.trim();
  const fn = value.match(/^rgba?\(([^)]*)\)$/i);
  if (!fn) return opaque(resolveColor(value, theme));

  const [r, g, b, a] = fn[1].split(/[,/]/).map((part) => Number(part.trim()));
  return { r, g, b, a: a ?? 1 };
};

type Stop = { readonly color: Rgba; readonly pos: number };

/** Parse one `linear-gradient(...)` layer into stops with resolved positions. */
const parseGradient = (layer: string, theme: Theme): readonly Stop[] => {
  const inner = layer
    .trim()
    .replace(/^linear-gradient\s*\(/i, '')
    .replace(/\)\s*$/, '');
  const parts = splitTop(inner);
  const body = /^(-?[\d.]+deg|to\s)/i.test(parts[0]) ? parts.slice(1) : parts;

  return body.map((part, index) => {
    const pct = part.match(/\s(-?[\d.]+)%$/);
    const color = parseColor(pct ? part.slice(0, pct.index) : part, theme);
    if (pct) return { color, pos: Number(pct[1]) / 100 };
    if (index === 0) return { color, pos: 0 };
    if (index === body.length - 1) return { color, pos: 1 };
    return { color, pos: index / (body.length - 1) };
  });
};

/**
 * Sample one layer at `t`, interpolating with premultiplied alpha because that
 * is what CSS does. It is the reason a fade to a transparent colour does not
 * dip through gray on the way, and modelling it any other way would invent a
 * colour the browser never paints.
 */
const sampleLayer = (stops: readonly Stop[], t: number): Rgba => {
  const first = stops[0];
  const last = stops[stops.length - 1];
  if (t <= first.pos) return first.color;
  if (t >= last.pos) return last.color;

  const upper = stops.findIndex((stop) => stop.pos >= t);
  const from = stops[upper - 1];
  const to = stops[upper];
  const span = to.pos - from.pos;
  const k = span === 0 ? 0 : (t - from.pos) / span;

  const a = from.color.a + (to.color.a - from.color.a) * k;
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };

  const channel = (key: 'r' | 'g' | 'b'): number => {
    const start = from.color[key] * from.color.a;
    const end = to.color[key] * to.color.a;
    return (start + (end - start) * k) / a;
  };
  return { r: channel('r'), g: channel('g'), b: channel('b'), a };
};

/**
 * Composite the stack at `t`. The first layer in `background-image` is painted
 * on TOP, so the list is walked back to front.
 */
const sampleStack = (layers: readonly (readonly Stop[])[], t: number): Rgba =>
  [...layers].reverse().reduce<Rgba>(
    (below, layer) => {
      const above = sampleLayer(layer, t);
      const mix = (key: 'r' | 'g' | 'b'): number =>
        above[key] * above.a + below[key] * (1 - above.a);
      return { r: mix('r'), g: mix('g'), b: mix('b'), a: 1 };
    },
    { r: 0, g: 0, b: 0, a: 1 },
  );

/**
 * `filter: brightness()` multiplies channels in sRGB and clamps. It applies to
 * the whole element, so on hover the fill lightens while a white label just
 * clamps at white -- which makes hover the WORSE state for a white label, not
 * the safer one.
 */
const brighten = (color: Rgba, amount: number): Rgba => ({
  r: Math.min(255, color.r * amount),
  g: Math.min(255, color.g * amount),
  b: Math.min(255, color.b * amount),
  a: color.a,
});

/** `filter: brightness(N)` declared anywhere in the cascade chain. */
const brightnessFor = (css: string, chain: readonly string[]): number =>
  chain.reduce((amount, selector) => {
    const found = ruleBody(css, selector).match(/filter:\s*brightness\(\s*([\d.]+)\s*\)/);
    return found ? Number(found[1]) : amount;
  }, 1);

/** Fold a cascade chain down to the layer stack the last background declares. */
const layeredFill = (css: string, combo: Combo): readonly (readonly Stop[])[] => {
  let value: string | undefined;
  for (const selector of combo.chain) {
    const found = ruleBody(css, selector).match(
      /(?:^|;)\s*background-image:\s*([^;]+);/s,
    )?.[1];
    if (found) value = found;
  }
  if (!value) throw new Error(`${combo.label}: no background-image in cascade`);
  return splitTop(value).map((layer) => parseGradient(layer, combo.theme));
};

const labelColor = (css: string, combo: Combo): string => {
  let color: string | undefined;
  for (const selector of combo.chain) {
    const declared = declarationsFor(css, selector);
    if (declared.color) color = declared.color;
  }
  if (!color) throw new Error(`${combo.label}: no label colour in cascade`);
  return resolveColor(color, combo.theme);
};

/**
 * Every half-percent of the button's height. The label does not span the whole
 * fill, but the band it does span moves with `.btn--xs` and `.btn--lg`, so a
 * band-based measurement would pass at one size and fail at another. Measuring
 * the whole gradient is stricter and size-independent.
 */
const SAMPLES = 201;

const worstComposited = (css: string, combo: Combo) => {
  const layers = layeredFill(css, combo);
  const amount = brightnessFor(css, combo.chain);
  const label = toHex(brighten(opaque(labelColor(css, combo)), amount));

  const samples = Array.from({ length: SAMPLES }, (_, i) => {
    const t = i / (SAMPLES - 1);
    const fill = toHex(brighten(sampleStack(layers, t), amount));
    return { t, fill, ratio: contrast(label, fill) };
  });
  return samples.reduce((worst, next) => (next.ratio < worst.ratio ? next : worst));
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

/**
 * Gel is the layered one. Rest, hover and active in both themes: hover carries a
 * `brightness()` that lightens the fill under a label already clamped at white,
 * and active declares no colour of its own, so measuring it is what pins that it
 * stays that way.
 *
 * Both themes are listed even though the variant has no dark override. It is
 * built from ramp steps, which do not flip by theme, but `on-primary` is
 * themeable and a consumer can move one theme without the other.
 */
const GEL: readonly Combo[] = (['light', 'dark'] as const).flatMap((theme): Combo[] => [
  { label: `gel rest, ${theme}`, theme, chain: ['.btn--gel'] },
  { label: `gel hover, ${theme}`, theme, chain: ['.btn--gel', '.btn--gel:hover'] },
  { label: `gel active, ${theme}`, theme, chain: ['.btn--gel', '.btn--gel:active'] },
]);

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

  describe('gel button', () => {
    it.each(GEL)('keeps the label over AA at every stop — $label', (combo) => {
      const { ratio, fill, t } = worstComposited(button, combo);
      expect(
        ratio,
        `${combo.label}: worst ${(t * 100).toFixed(1)}% down the fill, label on ${fill}`,
      ).toBeGreaterThanOrEqual(AA_NORMAL);
    });

    /**
     * The guard on the instrument itself. If the gloss ever stops being
     * composited -- a parser change, a refactor back to reading stops -- the
     * ratios would silently improve and the suite would stay green while the
     * button got worse. The composited floor must stay below the bare-stop
     * reading, because a white gloss can only ever lighten the fill.
     */
    it('measures the gloss, not the stop beneath it', () => {
      const combo: Combo = { label: 'gel rest, light', theme: 'light', chain: ['.btn--gel'] };
      expect(worstComposited(button, combo).ratio).toBeLessThan(
        worstRatio(button, combo).ratio,
      );
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
