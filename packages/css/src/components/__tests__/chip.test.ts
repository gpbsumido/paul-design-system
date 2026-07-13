import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/chip.css');
const css = readFileSync(cssPath, 'utf-8');

describe('Chip CSS component', () => {
  it('defines .chip base class', () => {
    expect(css).toContain('.chip');
    expect(css).toContain('inline-flex');
    expect(css).toContain('align-items');
    expect(css).toContain('gap');
    expect(css).toContain('border-radius');
    expect(css).toContain('border');
  });

  it('defines .chip--sm size variant', () => {
    expect(css).toContain('.chip--sm');
  });

  it('defines .chip--md size variant', () => {
    expect(css).toContain('.chip--md');
  });

  it('defines .chip--clickable variant', () => {
    expect(css).toContain('.chip--clickable');
    expect(css).toContain('cursor');
    expect(css).toContain('pointer');
  });

  it('defines .chip--removable variant', () => {
    expect(css).toContain('.chip--removable');
  });

  it('defines .chip__remove element', () => {
    expect(css).toContain('.chip__remove');
    expect(css).toContain('16px');
  });

  it('uses design tokens', () => {
    expect(css).toContain('--paul-');
  });
});
