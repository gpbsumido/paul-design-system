import { describe, it, expect } from 'vitest';
import { contrastRatio, readableOn, chipColors } from '../readableOn';

describe('contrastRatio', () => {
  it('is 21 for black on white and symmetric', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 0);
  });
});

describe('readableOn', () => {
  it('picks white text on a dark fill', () => {
    expect(readableOn('#0f7a58')).toBe('#ffffff');
  });

  it('picks ink text on a light fill', () => {
    expect(readableOn('#ffe08a')).toBe('#171717');
  });

  it('returns undefined for a non-hex colour (CSS var, named)', () => {
    expect(readableOn('var(--x)')).toBeUndefined();
    expect(readableOn('rebeccapurple')).toBeUndefined();
  });
});

describe('chipColors', () => {
  it('keeps the fill and gives it a readable label when one clears AA', () => {
    const pair = chipColors('#ffe08a'); // light → ink
    expect(pair).toEqual({ background: '#ffe08a', color: '#171717' });
  });

  it('always returns a pair that clears AA, darkening the fill when it must', () => {
    // Scan the greys plus the app's own feature accents. Every result must clear
    // AA, and the mid-tone band (which fails both ink and white) must trigger the
    // darkening path at least once — proving that branch is real, not dead.
    let darkenedAny = false;
    const greys = Array.from({ length: 18 }, (_, i) => {
      const v = (i * 15).toString(16).padStart(2, '0');
      return `#${v}${v}${v}`;
    });
    for (const fill of [...greys, '#0f7a58', '#ffe08a', '#4a90d9', '#b04351', '#2b7d8c']) {
      const pair = chipColors(fill)!;
      expect(contrastRatio(pair.color, pair.background)).toBeGreaterThanOrEqual(4.5);
      if (pair.background.toLowerCase() !== fill.toLowerCase()) darkenedAny = true;
    }
    expect(darkenedAny).toBe(true);
  });

  it('returns undefined for a non-hex colour', () => {
    expect(chipColors('var(--accent)')).toBeUndefined();
  });
});
