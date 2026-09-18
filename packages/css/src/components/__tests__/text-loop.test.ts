import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/text-loop.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('TextLoop CSS component', () => {
  it('defines the container and sliding track', () => {
    expect(css).toContain('.text-loop');
    expect(css).toContain('.text-loop__track');
  });

  it('respects reduced motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
