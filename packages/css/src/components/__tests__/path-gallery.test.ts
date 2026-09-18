import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/path-gallery.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('PathGallery CSS component', () => {
  it('defines the path items and travel keyframes', () => {
    expect(css).toContain('.path-gallery');
    expect(css).toContain('.path-gallery__item');
    expect(css).toContain('@keyframes paul-path-travel');
    expect(css).toContain('offset-rotate');
  });

  it('respects reduced motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
