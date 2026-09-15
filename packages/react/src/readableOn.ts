/**
 * Readable text on an arbitrary fill colour.
 *
 * A component that fills with a caller's colour cannot hardcode its label
 * colour: white is right on a dark accent and wrong on a light one. Rather than
 * pick a side, measure — and where no label colour clears AA against the fill
 * (a mid-tone can fail against both ink and white), darken the fill just enough
 * that white clears, keeping the caller's hue recognisable.
 */

/** Relative luminance, per WCAG 2.x. */
function luminance(hex: string): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(hex.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two six-digit hex colours. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Dark ink, and white. */
const INK = '#171717';
const WHITE = '#ffffff';
const AA = 4.5;

const isHex6 = (value: string) => /^#[0-9a-fA-F]{6}$/.test(value);

/** Whichever of ink or white reads better on the fill, or undefined for non-hex. */
export function readableOn(fill: string): string | undefined {
  if (!isHex6(fill)) return undefined;
  return contrastRatio(WHITE, fill) >= contrastRatio(INK, fill) ? WHITE : INK;
}

/** Mixes a hex toward black by the given fraction. */
function darken(hex: string, amount: number): string {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `#${channels
    .map((c) =>
      Math.round(c * (1 - amount))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

/**
 * A fill and a label colour for it that clear AA together. Returns undefined for
 * anything that isn't a six-digit hex, so a CSS variable or named colour falls
 * back to the caller's own styling rather than being guessed at.
 */
export function chipColors(fill: string): { background: string; color: string } | undefined {
  if (!isHex6(fill)) return undefined;

  const label = readableOn(fill);
  if (label && contrastRatio(label, fill) >= AA) {
    return { background: fill, color: label };
  }

  for (let amount = 0.1; amount <= 0.7; amount += 0.05) {
    const darker = darken(fill, amount);
    if (contrastRatio(WHITE, darker) >= AA) {
      return { background: darker, color: WHITE };
    }
  }
  return { background: darken(fill, 0.7), color: WHITE };
}
