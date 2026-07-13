import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/tooltip.css');
const css = readFileSync(cssPath, 'utf-8');

describe('Tooltip CSS component', () => {
  it('defines .tooltip base class', () => {
    expect(css).toContain('.tooltip');
    expect(css).toContain('position');
    expect(css).toContain('opacity');
    expect(css).toContain('pointer-events');
  });

  it('defines .tooltip--visible class', () => {
    expect(css).toContain('.tooltip--visible');
    expect(css).toContain('opacity: 1');
  });

  it('defines .tooltip--top position variant', () => {
    expect(css).toContain('.tooltip--top');
    expect(css).toContain('bottom: 100%');
  });

  it('defines .tooltip--bottom position variant', () => {
    expect(css).toContain('.tooltip--bottom');
    expect(css).toContain('top: 100%');
  });

  it('defines .tooltip--left position variant', () => {
    expect(css).toContain('.tooltip--left');
    expect(css).toContain('right: 100%');
  });

  it('defines .tooltip--right position variant', () => {
    expect(css).toContain('.tooltip--right');
    expect(css).toContain('left: 100%');
  });

  it('has arrow via pseudo-element', () => {
    expect(css).toMatch(/::before|::after/);
    expect(css).toContain('border');
  });

  it('respects prefers-reduced-motion', () => {
    expect(css).toContain('prefers-reduced-motion');
    expect(css).toContain('transition');
  });

  it('uses design tokens (--paul-)', () => {
    expect(css).toContain('--paul-');
  });

  it('sets pointer-events none by default', () => {
    expect(css).toContain('pointer-events: none');
  });

  it('has max-width constraint', () => {
    expect(css).toContain('max-width');
  });

  it('supports dark mode via data-theme attribute', () => {
    expect(css).toContain('[data-theme="dark"]');
  });
});
