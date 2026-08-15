export const colors = {
  primary: {
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
  },
  secondary: {
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
  },
  neutral: {
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
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    950: '#083344',
  },
  violet: {
    50: '#f8f5ff',
    100: '#f0e9ff',
    200: '#dfd1fd',
    300: '#c9b3f2',
    400: '#b095e1',
    500: '#9677ca',
    600: '#735a9c',
    700: '#63488d',
    800: '#503b72',
    900: '#42305e',
    950: '#251b35',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#ae4f08',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
} as const;

export type Colors = typeof colors;

/**
 * Categorical chart palette — the series colours, in fixed slot order.
 *
 * These are NOT the status colours. Reusing success/warning/error for "series 3"
 * makes a green series read as "good"; the slots below are chosen for separation,
 * not meaning.
 *
 * Light and dark hold the same steps here, which is new. They used to differ,
 * because the dark lightness band (0.48–0.67) is tighter than the light one
 * (0.43–0.77). Once verdigris and ember are anchored, the set that clears both
 * bands is the intersection, and only one combination survives it. Keeping the
 * two arrays is deliberate: the day a ramp moves, they will diverge again.
 *
 * Both orders are validated for colourblind separation, chroma, lightness and
 * contrast — see the palette test in this package. Adjacent slots are what a
 * reader has to tell apart, so slot ORDER is part of the contract; don't
 * reshuffle without re-validating.
 *
 * Slot 1 is primary-500 rather than 600: verdigris-600 sits at OKLCH chroma
 * 0.092, under the 0.1 floor, so the brand colour at its usual step reads gray
 * as a series.
 *
 * Slot 3 is why the violet ramp exists. With ember in secondary, the palette is
 * two oranges short of six separable hues — searched exhaustively over every
 * slot order and every viable step, nothing passes using only the other ramps.
 * Amber drops out of the set for the same reason: next to ember it lands at
 * ΔE 1.3 under deuteranopia, which is the collision this test was written for.
 *
 * Past six series, fold the tail into "Other" — a seventh generated hue is
 * indistinguishable from one of these under CVD.
 */
export const chartPalette = {
  light: [
    colors.primary[500], // verdigris
    colors.secondary[600], // ember
    colors.violet[600], // violet
    colors.cyan[600], // cyan
    colors.success[700], // green
    colors.error[600], // red
  ],
  dark: [
    colors.primary[500],
    colors.secondary[600],
    colors.violet[600],
    colors.cyan[600],
    colors.success[700],
    colors.error[600],
  ],
} as const;

export type ChartPalette = typeof chartPalette;

/**
 * Sequential ramp for magnitude — cohort heatmaps, funnel stages, anything with
 * a natural order. One hue, light to dark. A categorical palette on ordered data
 * double-encodes the value as hue and reads as noise.
 */
export const chartSequential = {
  light: [
    colors.primary[100],
    colors.primary[300],
    colors.primary[500],
    colors.primary[700],
    colors.primary[900],
  ],
  dark: [
    colors.primary[900],
    colors.primary[700],
    colors.primary[500],
    colors.primary[400],
    colors.primary[300],
  ],
} as const;

export type ChartSequential = typeof chartSequential;

/**
 * Semantic aliases. Light is warm paper rather than white, and dark is warm ink
 * rather than black — the point of the warm neutral ramp is lost if the page
 * behind it is #ffffff.
 *
 * Most of these are ramp steps, and the ones that aren't are deliberate: paper
 * sits a shade off neutral-50, ink a shade off neutral-950, and light `muted`
 * falls between 500 and 600 because 500 measured under 4.5:1 on the surface.
 * Changing the surface moves the chart palette's contrast floor with it.
 */
export const semanticColors = {
  light: {
    foreground: '#1d1a15',
    background: '#fbfaf7',
    surface: '#f4f2ed',
    border: colors.neutral[200],
    muted: '#6d675b',
    'muted-foreground': colors.neutral[400],
  },
  dark: {
    foreground: '#ece8e1',
    background: '#131110',
    surface: '#1b1815',
    border: '#322e28',
    muted: colors.neutral[400],
    'muted-foreground': colors.neutral[500],
  },
} as const;

export type SemanticColors = typeof semanticColors;
