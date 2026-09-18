import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/squish-switch.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('SquishSwitch CSS component', () => {
  it('defines the track and thumb', () => {
    expect(css).toContain('.squish-switch');
    expect(css).toContain('.squish-switch__thumb');
  });

  it('respects reduced motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
