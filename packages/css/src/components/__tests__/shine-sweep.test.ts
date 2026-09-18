import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/shine-sweep.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('ShineSweep CSS component', () => {
  it('defines the base class, sheen, and keyframes', () => {
    expect(css).toContain('.shine-sweep');
    expect(css).toContain('.shine-sweep__sheen');
    expect(css).toContain('@keyframes paul-shine-sweep');
  });

  it('respects reduced motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
