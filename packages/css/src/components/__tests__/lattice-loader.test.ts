import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/lattice-loader.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('LatticeLoader CSS component', () => {
  it('defines the grid, cells, and pulse keyframes', () => {
    expect(css).toContain('.lattice-loader');
    expect(css).toContain('.lattice-loader__cell');
    expect(css).toContain('@keyframes paul-lattice-on');
  });

  it('respects reduced motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
