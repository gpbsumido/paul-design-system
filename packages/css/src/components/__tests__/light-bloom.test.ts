import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/light-bloom.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('LightBloom CSS component', () => {
  it('defines the frame, glow, and breathe keyframes', () => {
    expect(css).toContain('.light-bloom');
    expect(css).toContain('.light-bloom__glow');
    expect(css).toContain('@keyframes paul-bloom-breathe');
  });

  it('respects reduced motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
