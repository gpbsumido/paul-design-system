import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/circular-gallery.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('CircularGallery CSS component', () => {
  it('defines the 3D ring and cards', () => {
    expect(css).toContain('.circular-gallery');
    expect(css).toContain('.circular-gallery__ring');
    expect(css).toContain('preserve-3d');
  });
});
