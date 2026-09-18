import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/blur-reveal.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('BlurReveal CSS component', () => {
  it('defines the base class and keyframes', () => {
    expect(css).toContain('.blur-reveal');
    expect(css).toContain('@keyframes paul-blur-reveal');
  });

  it('respects reduced motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
