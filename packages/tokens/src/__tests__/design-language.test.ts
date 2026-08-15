import { describe, it, expect } from 'vitest';
import { colors, semanticColors, chartPalette } from '../colors.js';
import { typography } from '../typography.js';

/**
 * Verdigris & Ember — the design language the packages hand down.
 *
 * These pin the ramps themselves rather than anything derived from them,
 * because the values are shared with paul-explore, which asserts the same
 * hexes at its end. A change here that isn't mirrored there breaks a consumer
 * silently, so the hexes are the contract and this is where they are written
 * down.
 */

describe('identity ramps', () => {
  it('runs primary as the verdigris ramp', () => {
    expect(colors.primary).toEqual({
      50: '#eefaf6',
      100: '#d6f3ea',
      200: '#aee6d7',
      300: '#79d2bd',
      400: '#43b69e',
      500: '#219b84',
      600: '#157c6b',
      700: '#136357',
      800: '#124f47',
      900: '#11413b',
      950: '#062520',
    });
  });

  it('runs secondary as the ember ramp', () => {
    // 600 is #b25c12 rather than the obvious #bd6314: that measured 4.06:1 on
    // paper and 4.24:1 for white-on-fill, both under AA.
    expect(colors.secondary).toEqual({
      50: '#fdf7ef',
      100: '#faecd7',
      200: '#f5d6ab',
      300: '#eeba74',
      400: '#e69a42',
      500: '#d97e1f',
      600: '#b25c12',
      700: '#9d4b13',
      800: '#7f3b16',
      900: '#683114',
      950: '#391807',
    });
  });

  it('runs neutral as warm ink on warm paper', () => {
    expect(colors.neutral).toEqual({
      50: '#faf9f7',
      100: '#f1efeb',
      200: '#e3e0d9',
      300: '#cfcac0',
      400: '#a49d90',
      500: '#7f7869',
      600: '#635d50',
      700: '#4f4a40',
      800: '#35312a',
      900: '#24211c',
      950: '#151310',
    });
  });

  it('carries a violet supporting ramp for the chart palette', () => {
    // Not a status colour and not an orange — the categorical palette cannot
    // reach six separable hues without it once ember owns secondary.
    expect(colors.violet[600]).toBe('#735a9c');
    expect(Object.keys(colors.violet)).toEqual(
      Object.keys(colors.primary),
    );
  });
});

describe('status ramps', () => {
  it('darkens warning-700, which failed AA on the light surface', () => {
    expect(colors.warning[700]).toBe('#ae4f08');
  });

  it('leaves the error and success ramps alone', () => {
    expect(colors.error[500]).toBe('#ef4444');
    expect(colors.error[600]).toBe('#dc2626');
    expect(colors.success[600]).toBe('#16a34a');
    expect(colors.success[700]).toBe('#15803d');
  });
});

describe('semantic colours', () => {
  it('reads as warm paper in light', () => {
    expect(semanticColors.light.background).toBe('#fbfaf7');
    expect(semanticColors.light.foreground).toBe('#1d1a15');
    expect(semanticColors.light.surface).toBe('#f4f2ed');
    expect(semanticColors.light.border).toBe('#e3e0d9');
    expect(semanticColors.light.muted).toBe('#6d675b');
  });

  it('reads as warm ink in dark', () => {
    expect(semanticColors.dark.background).toBe('#131110');
    expect(semanticColors.dark.foreground).toBe('#ece8e1');
    expect(semanticColors.dark.surface).toBe('#1b1815');
    expect(semanticColors.dark.border).toBe('#322e28');
    expect(semanticColors.dark.muted).toBe('#a49d90');
  });
});

describe('typography', () => {
  it('adds a display family led by Bricolage Grotesque', () => {
    expect(typography.fontFamily.display).toContain("'Bricolage Grotesque'");
  });

  it('falls the display family back to the sans stack', () => {
    expect(typography.fontFamily.display).toContain(typography.fontFamily.sans);
  });

  it('leaves the sans and mono stacks untouched', () => {
    // The Angular app resolves these; changing them is a separate decision.
    expect(typography.fontFamily.sans).toBe(
      "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    );
    expect(typography.fontFamily.mono).toBe(
      "'JetBrains Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
    );
  });
});

describe('chart palette', () => {
  it('leads with verdigris and ember, then hues that are not status colours', () => {
    // Slot 1 is primary-500, not 600: verdigris-600 sits at OKLCH chroma 0.092,
    // under the 0.1 floor, so the brand colour at its usual step reads gray as
    // a series. The separation maths is enforced in chart-palette.test.ts.
    const expected = ['#219b84', '#b25c12', '#735a9c', '#0891b2', '#15803d', '#dc2626'];
    expect(chartPalette.light).toEqual(expected);
    expect(chartPalette.dark).toEqual(expected);
  });
});
