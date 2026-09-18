import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/rubber-segment.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('RubberSegment CSS component', () => {
  it('defines the track and moving indicator', () => {
    expect(css).toContain('.rubber-segment');
    expect(css).toContain('.rubber-segment__indicator');
  });

  it('respects reduced motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
