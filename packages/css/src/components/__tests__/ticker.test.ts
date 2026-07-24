import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/ticker.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('Ticker CSS component', () => {
  it('defines the .ticker base as a scroll container', () => {
    expect(css).toContain('.ticker');
    expect(css).toContain('overflow-x');
  });

  it('defines the marquee variant with a keyframe animation', () => {
    expect(css).toContain('.ticker--marquee');
    expect(css).toContain('@keyframes');
  });

  it('gates the marquee scroll behind prefers-reduced-motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });

  it('defines top and bottom edge variants', () => {
    expect(css).toContain('.ticker--top');
    expect(css).toContain('.ticker--bottom');
  });

  it('uses design tokens', () => {
    expect(css).toContain('--paul-');
  });
});
