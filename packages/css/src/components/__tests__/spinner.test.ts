import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/spinner.css');
const css = readFileSync(cssPath, 'utf-8');

describe('Spinner CSS component', () => {
  it('defines the base class and keyframes', () => {
    expect(css).toContain('.spinner');
    expect(css).toContain('@keyframes paul-spinner-rotate');
  });

  it('respects reduced motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
