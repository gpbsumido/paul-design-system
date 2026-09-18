import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/smooth-scroll-slider.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('SmoothScrollSlider CSS component', () => {
  it('defines the rail and slides', () => {
    expect(css).toContain('.smooth-scroll-slider');
    expect(css).toContain('.smooth-scroll-slider__slide');
  });

  it('respects reduced motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
