import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/hover-image-reveal.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('HoverImageReveal CSS component', () => {
  it('defines the menu, window, and image', () => {
    expect(css).toContain('.hover-image-reveal');
    expect(css).toContain('.hover-image-reveal__window');
    expect(css).toContain('.hover-image-reveal__img');
  });

  it('respects reduced motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
