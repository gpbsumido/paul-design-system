export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  secondary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    950: '#2e1065',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
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
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
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
 * Light and dark are separately chosen steps, not a flip: the two modes have
 * different lightness bands. Both orders are validated for colourblind
 * separation, chroma, lightness and contrast — see the palette test in this
 * package. Adjacent slots are what a reader has to tell apart, so slot ORDER is
 * part of the contract; don't reshuffle without re-validating.
 *
 * Past six series, fold the tail into "Other" — a seventh generated hue is
 * indistinguishable from one of these under CVD.
 */
export const chartPalette = {
  light: [
    colors.primary[600], // blue
    colors.success[600], // green
    colors.secondary[600], // purple
    colors.warning[600], // amber
    colors.cyan[600], // cyan
    colors.error[600], // red
  ],
  dark: [
    colors.primary[500],
    colors.success[600],
    colors.secondary[500],
    colors.warning[600],
    colors.cyan[600],
    colors.error[500],
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

export const semanticColors = {
  light: {
    foreground: colors.neutral[950],
    background: '#ffffff',
    surface: colors.neutral[50],
    border: colors.neutral[200],
    muted: colors.neutral[500],
    'muted-foreground': colors.neutral[400],
  },
  dark: {
    foreground: colors.neutral[50],
    background: colors.neutral[950],
    surface: colors.neutral[900],
    border: colors.neutral[800],
    muted: colors.neutral[400],
    'muted-foreground': colors.neutral[500],
  },
} as const;

export type SemanticColors = typeof semanticColors;
