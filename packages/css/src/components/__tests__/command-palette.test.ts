import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/command-palette.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('command palette CSS component', () => {
  it('defines the backdrop and panel classes', () => {
    expect(css).toContain('.command-palette__backdrop');
    expect(css).toContain('.command-palette');
  });

  it('uses design tokens', () => {
    expect(css).toContain('--paul-');
  });

  it('sizes to the small viewport in dvh, not vh', () => {
    // On a phone the on-screen keyboard eats into the viewport. `vh` ignores it,
    // so a `vh`-sized palette overflows and scrolls; `dvh` tracks the visible area.
    expect(css).toContain('dvh');
    expect(css).not.toMatch(/\d+vh(?!\w)/);
  });
});
