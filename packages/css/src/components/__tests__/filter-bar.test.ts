import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/filter-bar.css');
const css = readFileSync(cssPath, 'utf-8');

describe('FilterBar CSS component', () => {
  it('defines .filter-bar base class', () => {
    expect(css).toContain('.filter-bar');
  });

  it('separates the region with a bottom border', () => {
    expect(css).toContain('border-bottom');
    expect(css).toContain('--paul-color-border');
  });

  it('defines a wrapping, centered .filter-bar__row', () => {
    expect(css).toContain('.filter-bar__row');
    expect(css).toContain('flex-wrap: wrap');
    expect(css).toContain('margin-inline: auto');
  });

  it('provides dark mode styling', () => {
    expect(css).toContain('[data-theme="dark"]');
  });

  it('uses design tokens for styling', () => {
    expect(css).toContain('--paul-');
  });
});
