#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Compile TypeScript to build/
execSync('npx tsc', { stdio: 'inherit' });

// ---------------------------------------------------------------------------
// Color data (single source of truth for CSS generation)
// Mirrors packages/tokens/src/colors.ts — keep in sync.
// ---------------------------------------------------------------------------

const colors = {
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
};

const semanticColors = {
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
};

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------

const spacing = {
  0: '0px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
};

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

const fontSize = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
};

const lineHeight = {
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
};

const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
};

const fontFamily = {
  sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
};

// ---------------------------------------------------------------------------
// Radii
// ---------------------------------------------------------------------------

const radii = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
};

// ---------------------------------------------------------------------------
// Shadows
// ---------------------------------------------------------------------------

const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
};

// ---------------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------------

const duration = {
  fast: '100ms',
  normal: '200ms',
  slow: '350ms',
  glacial: '500ms',
};

const easing = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

// ---------------------------------------------------------------------------
// Z-Index
// ---------------------------------------------------------------------------

const zIndex = {
  base: '0',
  dropdown: '10',
  sticky: '20',
  fixed: '30',
  'modal-backdrop': '40',
  modal: '50',
  popover: '60',
  toast: '70',
};

// ---------------------------------------------------------------------------
// CSS generation
// ---------------------------------------------------------------------------

function generateCSS() {
  const lines = [':root {'];

  // Palette colors
  for (const [palette, shades] of Object.entries(colors)) {
    for (const [shade, value] of Object.entries(shades)) {
      lines.push(`  --paul-color-${palette}-${shade}: ${value};`);
    }
  }

  // Light-mode semantic aliases
  for (const [name, value] of Object.entries(semanticColors.light)) {
    lines.push(`  --paul-color-${name}: ${value};`);
  }

  // Spacing
  for (const [key, value] of Object.entries(spacing)) {
    lines.push(`  --paul-spacing-${key}: ${value};`);
  }

  // Typography - font size
  for (const [key, value] of Object.entries(fontSize)) {
    lines.push(`  --paul-font-size-${key}: ${value};`);
  }

  // Typography - line height
  for (const [key, value] of Object.entries(lineHeight)) {
    lines.push(`  --paul-line-height-${key}: ${value};`);
  }

  // Typography - font weight
  for (const [key, value] of Object.entries(fontWeight)) {
    lines.push(`  --paul-font-weight-${key}: ${value};`);
  }

  // Typography - letter spacing
  for (const [key, value] of Object.entries(letterSpacing)) {
    lines.push(`  --paul-letter-spacing-${key}: ${value};`);
  }

  // Typography - font family
  for (const [key, value] of Object.entries(fontFamily)) {
    lines.push(`  --paul-font-family-${key}: ${value};`);
  }

  // Radii
  for (const [key, value] of Object.entries(radii)) {
    lines.push(`  --paul-radius-${key}: ${value};`);
  }

  // Shadows
  for (const [key, value] of Object.entries(shadows)) {
    lines.push(`  --paul-shadow-${key}: ${value};`);
  }

  // Motion - duration
  for (const [key, value] of Object.entries(duration)) {
    lines.push(`  --paul-duration-${key}: ${value};`);
  }

  // Motion - easing
  for (const [key, value] of Object.entries(easing)) {
    lines.push(`  --paul-easing-${key}: ${value};`);
  }

  // Z-Index
  for (const [key, value] of Object.entries(zIndex)) {
    lines.push(`  --paul-z-${key}: ${value};`);
  }

  lines.push('}');
  lines.push('');
  lines.push('[data-theme="dark"] {');

  // Dark-mode semantic overrides
  for (const [name, value] of Object.entries(semanticColors.dark)) {
    lines.push(`  --paul-color-${name}: ${value};`);
  }

  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

// Write CSS tokens
const buildDir = join(__dirname, 'build');
mkdirSync(buildDir, { recursive: true });
writeFileSync(join(buildDir, 'tokens.css'), generateCSS(), 'utf-8');

console.log('tokens.css written to build/tokens.css');
