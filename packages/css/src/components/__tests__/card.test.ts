import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/card.css');
const css = readFileSync(cssPath, 'utf-8');

describe('Card CSS component', () => {
  it('defines .card base class', () => {
    expect(css).toContain('.card');
    expect(css).toContain('border');
    expect(css).toContain('border-radius');
    expect(css).toContain('overflow');
  });

  it('defines .card--elevated variant', () => {
    expect(css).toContain('.card--elevated');
    expect(css).toContain('box-shadow');
  });

  it('defines .card--interactive variant', () => {
    expect(css).toContain('.card--interactive');
    expect(css).toContain('cursor');
    expect(css).toContain('transition');
  });

  it('defines .card__header section', () => {
    expect(css).toContain('.card__header');
    expect(css).toContain('border-bottom');
  });

  it('defines .card__body section', () => {
    expect(css).toContain('.card__body');
    expect(css).toContain('padding');
  });

  it('defines .card__footer section', () => {
    expect(css).toContain('.card__footer');
    expect(css).toContain('border-top');
  });

  it('uses design tokens', () => {
    expect(css).toContain('--paul-');
  });

  it('respects prefers-reduced-motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
