/**
 * The colour maths behind the chart-palette test.
 *
 * Ported from the dataviz skill's `validate_palette.js` so the checks live in
 * this repo and run in CI — a palette that passes once and silently regresses
 * on the next edit is the failure mode this exists to prevent.
 *
 * Thresholds and the CVD model are the skill's, unchanged: ΔE is Euclidean
 * distance in OKLab ×100, and the simulation is Machado, Oliveira & Fernandes
 * (2009) at severity 1.0. Swapping the model would move borderline pairs and
 * invalidate the thresholds.
 */

/** OKLCH lightness band a categorical slot must sit inside, per mode. */
export const BAND = { light: [0.43, 0.77], dark: [0.48, 0.67] } as const;
/** Below this OKLCH chroma a slot reads gray. */
export const CHROMA_FLOOR = 0.1;
/** Adjacent-pair separation under simulated CVD. 6–8 is a floor, 8+ is the target. */
export const CVD_TARGET = 8;
export const CVD_FLOOR = 6;
/** Worst-pair separation for unsimulated vision. Below this, nobody can tell them apart. */
export const NORMAL_FLOOR = 15;
/** WCAG contrast against the chart surface. */
export const CONTRAST_MIN = 3;

const MACHADO = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritan: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
} as const;

export type Cvd = keyof typeof MACHADO;

type Triple = [number, number, number];

function hexToSrgb(hex: string): Triple {
  const h = hex.trim().replace(/^#/, '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Triple;
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function linear(hex: string): Triple {
  return hexToSrgb(hex).map(toLinear) as Triple;
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = linear(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colours. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function oklabFromLinear([r, g, b]: Triple): Triple {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

/** OKLCH lightness and chroma for a hex colour. */
export function oklch(hex: string): { l: number; c: number } {
  const [l, a, b] = oklabFromLinear(linear(hex));
  return { l, c: Math.hypot(a, b) };
}

function simulate(hex: string, kind: Cvd): Triple {
  const [r, g, b] = linear(hex);
  const m = MACHADO[kind];
  const clamp = (c: number) => Math.max(0, Math.min(1, c));
  return [
    clamp(m[0][0] * r + m[0][1] * g + m[0][2] * b),
    clamp(m[1][0] * r + m[1][1] * g + m[1][2] * b),
    clamp(m[2][0] * r + m[2][1] * g + m[2][2] * b),
  ];
}

/** Euclidean OKLab distance ×100. Omit `kind` for unsimulated vision. */
export function deltaE(a: string, b: string, kind?: Cvd): number {
  const first = oklabFromLinear(kind ? simulate(a, kind) : linear(a));
  const second = oklabFromLinear(kind ? simulate(b, kind) : linear(b));
  return (
    100 *
    Math.hypot(first[0] - second[0], first[1] - second[1], first[2] - second[2])
  );
}

/** Every adjacent pair in slot order — the pairs a reader has to tell apart. */
export function adjacentPairs(palette: readonly string[]): Array<[string, string]> {
  return palette.slice(0, -1).map((c, i) => [c, palette[i + 1]] as [string, string]);
}
