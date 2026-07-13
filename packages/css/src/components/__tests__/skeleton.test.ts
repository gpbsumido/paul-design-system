import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/skeleton.css');
const css = readFileSync(cssPath, 'utf-8');

describe('Skeleton CSS component', () => {
  it('defines .skeleton base class', () => {
    expect(css).toContain('.skeleton');
    expect(css).toContain('display');
    expect(css).toContain('background');
    expect(css).toContain('border-radius');
    expect(css).toContain('overflow');
    expect(css).toContain('position');
  });

  it('has shimmer animation with @keyframes', () => {
    expect(css).toContain('@keyframes');
    expect(css).toContain('skeleton-shimmer');
    expect(css).toContain('translateX');
  });

  it('defines .skeleton--text variant', () => {
    expect(css).toContain('.skeleton--text');
    expect(css).toContain('height');
    expect(css).toContain('width');
  });

  it('defines .skeleton--circle variant', () => {
    expect(css).toContain('.skeleton--circle');
    expect(css).toContain('aspect-ratio');
  });

  it('defines .skeleton--rect variant', () => {
    expect(css).toContain('.skeleton--rect');
    expect(css).toContain('--skeleton-w');
    expect(css).toContain('--skeleton-h');
  });

  it('supports custom sizing via CSS variables', () => {
    expect(css).toContain('--skeleton-w');
    expect(css).toContain('--skeleton-h');
  });

  it('respects prefers-reduced-motion', () => {
    expect(css).toContain('prefers-reduced-motion');
    expect(css).toContain('animation: none');
  });

  it('uses design tokens', () => {
    expect(css).toContain('--paul-');
  });
});
