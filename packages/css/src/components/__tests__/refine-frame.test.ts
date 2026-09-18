import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/refine-frame.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('RefineFrame CSS component', () => {
  it('defines the frame, content, and spinner keyframes', () => {
    expect(css).toContain('.refine-frame');
    expect(css).toContain('.refine-frame__content');
    expect(css).toContain('@keyframes paul-refine-spin');
  });

  it('respects reduced motion by pulsing instead of spinning', () => {
    expect(css).toContain('prefers-reduced-motion');
    const reduced = css.slice(css.indexOf('prefers-reduced-motion'));
    expect(reduced).not.toContain('paul-refine-spin');
    expect(reduced).toContain('paul-refine-pulse');
  });
});
