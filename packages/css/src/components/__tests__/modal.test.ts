import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/modal.css');
const css = readFileSync(cssPath, 'utf-8');

describe('Modal CSS component', () => {
  it('defines .modal__backdrop class', () => {
    expect(css).toContain('.modal__backdrop');
    expect(css).toContain('position');
    expect(css).toContain('inset');
  });

  it('defines .modal__content class', () => {
    expect(css).toContain('.modal__content');
    expect(css).toContain('background');
    expect(css).toContain('border-radius');
    expect(css).toContain('box-shadow');
  });

  it('defines .modal__header class', () => {
    expect(css).toContain('.modal__header');
    expect(css).toContain('padding');
    expect(css).toContain('border-bottom');
  });

  it('defines .modal__body class', () => {
    expect(css).toContain('.modal__body');
    expect(css).toContain('padding');
  });

  it('defines .modal__footer class', () => {
    expect(css).toContain('.modal__footer');
    expect(css).toContain('border-top');
    expect(css).toContain('gap');
  });

  it('defines .modal--open class', () => {
    expect(css).toContain('.modal--open');
    expect(css).toContain('overflow');
  });

  it('backdrop uses z-index token', () => {
    expect(css).toContain('--paul-z-');
  });

  it('content uses z-index token', () => {
    expect(css).toMatch(/\.modal__content[\s\S]*--paul-z-/);
  });

  it('uses backdrop-blur', () => {
    expect(css).toContain('backdrop-filter');
    expect(css).toContain('blur');
  });

  it('uses design tokens', () => {
    expect(css).toContain('--paul-');
  });

  it('animates the panel in, from tokens', () => {
    expect(css).toContain('@keyframes paul-modal-content-in');
    expect(css).toMatch(/\.modal__content[\s\S]*animation:[\s\S]*paul-modal-content-in/);
    expect(css).toContain('--paul-easing-bounce');
  });

  it('paints an iridescent hairline from the primary and secondary tokens', () => {
    expect(css).toMatch(/\.modal__content[\s\S]*--paul-color-primary/);
    expect(css).toContain('--paul-color-secondary');
  });

  it('disables the entrance animation under reduced motion', () => {
    expect(css).toMatch(
      /prefers-reduced-motion: reduce[\s\S]*\.modal__content[\s\S]*animation:\s*none/,
    );
  });
});
