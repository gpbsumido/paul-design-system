import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/tooltip.css');
const css = readFileSync(cssPath, 'utf-8');

describe('Tooltip CSS component', () => {
  it('defines .tooltip base class', () => {
    expect(css).toContain('.tooltip');
    expect(css).toContain('pointer-events');
  });

  // Position is set inline (fixed) by the React component so the bubble can't be
  // clipped by an overflow:hidden ancestor. The base .tooltip rule sets no
  // position of its own (only the ::before arrows are absolutely positioned).
  it('does not hard-code a position on the base bubble rule', () => {
    const base = css.slice(css.indexOf('.tooltip {'), css.indexOf('}', css.indexOf('.tooltip {')));
    expect(base).not.toContain('position');
  });

  it('defines the per-side arrow classes', () => {
    for (const side of ['top', 'bottom', 'left', 'right']) {
      expect(css).toContain(`.tooltip--${side}::before`);
    }
  });

  it('has arrow via pseudo-element', () => {
    expect(css).toMatch(/::before|::after/);
    expect(css).toContain('border');
  });

  it('uses design tokens (--paul-)', () => {
    expect(css).toContain('--paul-');
  });

  it('sets pointer-events none', () => {
    expect(css).toContain('pointer-events: none');
  });

  it('has a max-width constraint', () => {
    expect(css).toContain('max-width');
  });

  it('supports dark mode via data-theme attribute', () => {
    expect(css).toContain('[data-theme="dark"]');
  });
});
