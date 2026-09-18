import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/liquid-glass.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('LiquidGlass CSS component', () => {
  it('defines the base class, sheen, and drift keyframes', () => {
    expect(css).toContain('.liquid-glass');
    expect(css).toContain('.liquid-glass__sheen');
    expect(css).toContain('@keyframes paul-liquid-glass-drift');
  });

  it('respects reduced motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
