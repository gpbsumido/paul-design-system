import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/drift-wall.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('DriftWall CSS component', () => {
  it('defines the plane, columns, and tiles', () => {
    expect(css).toContain('.drift-wall');
    expect(css).toContain('.drift-wall__plane');
    expect(css).toContain('.drift-wall__tile');
  });

  it('respects reduced motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
