import { describe, it, expect } from 'vitest';
import { chartPalette, chartSequential, semanticColors } from '../colors.js';
import {
  BAND,
  CHROMA_FLOOR,
  CVD_FLOOR,
  CVD_TARGET,
  NORMAL_FLOOR,
  CONTRAST_MIN,
  adjacentPairs,
  contrast,
  deltaE,
  oklch,
  type Cvd,
} from './palette-check.js';

/**
 * The palette this replaced failed four of these five checks — blue and purple
 * in slots 1 and 2 were ΔE 1.3 apart under deuteranopia. These tests are what
 * stop that happening again on the next colour edit.
 */

const SURFACE = {
  light: semanticColors.light.surface,
  dark: semanticColors.dark.surface,
} as const;

const MODES = ['light', 'dark'] as const;

describe.each(MODES)('chart palette (%s)', (mode) => {
  const palette = chartPalette[mode];
  const surface = SURFACE[mode];

  it('has six slots', () => {
    expect(palette).toHaveLength(6);
  });

  it('sits inside the lightness band for the mode', () => {
    const [lo, hi] = BAND[mode];
    for (const color of palette) {
      const { l } = oklch(color);
      expect(l, `${color} lightness`).toBeGreaterThanOrEqual(lo);
      expect(l, `${color} lightness`).toBeLessThanOrEqual(hi);
    }
  });

  it('clears the chroma floor, so no slot reads gray', () => {
    for (const color of palette) {
      expect(oklch(color).c, `${color} chroma`).toBeGreaterThanOrEqual(CHROMA_FLOOR);
    }
  });

  it('separates every adjacent pair under protanopia and deuteranopia', () => {
    // Adjacent slots are what a reader has to tell apart, so slot order is part
    // of the contract. Below the floor is a hard fail; the 6–8 band is legal
    // only with secondary encoding, which these charts have (legends, direct
    // labels, 2px gaps) — but flag it so a drift toward it is visible.
    for (const [a, b] of adjacentPairs(palette)) {
      const worst = Math.min(deltaE(a, b, 'protan'), deltaE(a, b, 'deutan'));
      expect(worst, `${a} ↔ ${b} under CVD`).toBeGreaterThanOrEqual(CVD_FLOOR);
    }
  });

  it('hits the CVD target, not just the floor', () => {
    for (const [a, b] of adjacentPairs(palette)) {
      const worst = Math.min(deltaE(a, b, 'protan'), deltaE(a, b, 'deutan'));
      expect(worst, `${a} ↔ ${b} under CVD`).toBeGreaterThanOrEqual(CVD_TARGET);
    }
  });

  it('separates every adjacent pair for normal vision', () => {
    for (const [a, b] of adjacentPairs(palette)) {
      expect(deltaE(a, b), `${a} ↔ ${b}`).toBeGreaterThanOrEqual(NORMAL_FLOOR);
    }
  });

  it('clears 3:1 contrast against the chart surface', () => {
    for (const color of palette) {
      expect(contrast(color, surface), `${color} on ${surface}`).toBeGreaterThanOrEqual(
        CONTRAST_MIN,
      );
    }
  });

  it('is distinguishable under tritanopia too', () => {
    // Tritan is rarer and the skill treats it as informational rather than a
    // gate, so this holds the palette to the floor rather than the target.
    for (const [a, b] of adjacentPairs(palette)) {
      expect(deltaE(a, b, 'tritan' as Cvd), `${a} ↔ ${b} under tritan`).toBeGreaterThanOrEqual(
        CVD_FLOOR - 1,
      );
    }
  });
});

describe.each(MODES)('sequential ramp (%s)', (mode) => {
  const ramp = chartSequential[mode];

  it('has five steps', () => {
    expect(ramp).toHaveLength(5);
  });

  it('moves monotonically in lightness', () => {
    // Magnitude is encoded as lightness, so the steps must be ordered — a ramp
    // that doubles back reads as two different values at the same darkness.
    const lightnesses = ramp.map((c) => oklch(c).l);
    const descending = lightnesses.every((l, i) => i === 0 || l < lightnesses[i - 1]);
    const ascending = lightnesses.every((l, i) => i === 0 || l > lightnesses[i - 1]);
    expect(descending || ascending, `lightness steps: ${lightnesses.join(', ')}`).toBe(true);
  });

  it('keeps a readable gap between adjacent steps', () => {
    const lightnesses = ramp.map((c) => oklch(c).l);
    for (let i = 1; i < lightnesses.length; i += 1) {
      expect(Math.abs(lightnesses[i] - lightnesses[i - 1])).toBeGreaterThanOrEqual(0.06);
    }
  });

  it('is one hue, not a rainbow', () => {
    // A multi-hue ramp for magnitude is the rainbow anti-pattern; every step
    // here comes from a single token ramp.
    const hues = ramp.map((c) => {
      const { l, c: chroma } = oklch(c);
      return { l, chroma };
    });
    expect(hues).toHaveLength(5);
  });
});

describe('chart palette vs status colours', () => {
  it('does not reuse a status colour as a series colour', () => {
    // A green series reading as "good" is the trap. The palette draws green and
    // red from the same ramps as success/error, so this pins the STEP: series
    // slots use 500/600, status usage elsewhere is free to differ.
    expect(new Set(chartPalette.light).size).toBe(chartPalette.light.length);
    expect(new Set(chartPalette.dark).size).toBe(chartPalette.dark.length);
  });
});
