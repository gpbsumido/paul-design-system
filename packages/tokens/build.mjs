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
