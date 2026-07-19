import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/icon-button.css');
const css = readFileSync(cssPath, 'utf-8');

describe('IconButton CSS component', () => {
  it('defines .icon-btn base class', () => {
    expect(css).toContain('.icon-btn');
  });

  it('defines the small size variant', () => {
    expect(css).toContain('.icon-btn--sm');
  });

  it('defines a visible focus ring', () => {
    expect(css).toContain('.icon-btn:focus-visible');
  });
});
