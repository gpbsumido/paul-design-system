import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { colors, semanticColors } from '../../../tokens/src/colors.js';
import { contrast } from '../../../tokens/src/__tests__/palette-check.js';

/**
 * Every text colour StatCard paints has to clear WCAG AA on the card's own
 * surface, in both themes. The positive delta used success-700, which is 5:1 on
 * white but 4.48:1 on this system's warm surface: close enough to look right,
 * and a fail in any consumer's axe scan.
 */
const css = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), '../components/stat-card.css'),
  'utf-8',
).replace(/\/\*[\s\S]*?\*\//g, '');

type Theme = 'light' | 'dark';
type Ramp = keyof typeof colors;

/** Resolve --paul-color-<ramp>-<shade> or --paul-color-<semantic> to a hex. */
function resolveColor(variable: string, theme: Theme): string {
  const name = variable.replace('--paul-color-', '');
  const shade = name.match(/^([a-z]+)-(\d+)$/);
  if (shade && shade[1] in colors) {
    const ramp = colors[shade[1] as Ramp] as Record<string, string>;
    return ramp[shade[2]];
  }
  const semantic = semanticColors[theme] as Record<string, string>;
  if (!(name in semantic)) throw new Error(`unknown colour token ${variable}`);
  return semantic[name];
}

/** The text colour each StatCard selector sets, per theme (dark rules override light). */
function textColors(theme: Theme): Map<string, string> {
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  const out = new Map<string, string>();
  for (const [, rawSelector, body] of rules) {
    const selector = rawSelector.trim();
    const color = body.match(/(?:^|;|\s)color:\s*var\((--paul-color-[a-z0-9-]+)\)/);
    if (!color) continue;
    const isDark = selector.startsWith('[data-theme="dark"]');
    if (isDark && theme === 'light') continue;
    out.set(selector.replace('[data-theme="dark"]', '').trim(), color[1]);
  }
  return out;
}

describe('StatCard text holds AA on its surface', () => {
  for (const theme of ['light', 'dark'] as const) {
    const surface = semanticColors[theme].surface;
    for (const [selector, variable] of textColors(theme)) {
      it(`${theme} ${selector}`, () => {
        const hex = resolveColor(variable, theme);
        expect(contrast(hex, surface), `${variable} (${hex}) on ${surface}`).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});
