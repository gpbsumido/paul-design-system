import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/star-border.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('StarBorder CSS component', () => {
  it('defines the base class, ring, and spin keyframes', () => {
    expect(css).toContain('.star-border');
    expect(css).toContain('.star-border__ring');
    expect(css).toContain('@keyframes paul-star-spin');
  });

  it('respects reduced motion and stops the rotation', () => {
    expect(css).toContain('prefers-reduced-motion');
    // The reduced block disables the ring rather than reusing the spin keyframe.
    const reduced = css.slice(css.indexOf('prefers-reduced-motion'));
    expect(reduced).not.toContain('paul-star-spin');
  });
});
