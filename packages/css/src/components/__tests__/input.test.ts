import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/input.css');
const css = readFileSync(cssPath, 'utf-8');

describe('Input CSS component', () => {
  it('defines .input base class', () => {
    expect(css).toContain('.input');
  });

  it('defines .input--error with error styling', () => {
    expect(css).toContain('.input--error');
    expect(css).toContain('--paul-color-error-600');
  });

  it('defines .input--sm size variant', () => {
    expect(css).toContain('.input--sm');
  });

  it('defines .input--md size variant', () => {
    expect(css).toContain('.input--md');
  });

  it('defines .input__wrapper container class', () => {
    expect(css).toContain('.input__wrapper');
  });

  it('defines .input__label label class', () => {
    expect(css).toContain('.input__label');
  });

  it('defines .input__helper class', () => {
    expect(css).toContain('.input__helper');
  });

  it('defines .input__helper--error class', () => {
    expect(css).toContain('.input__helper--error');
    expect(css).toContain('--paul-color-error-600');
  });

  it('defines .textarea class', () => {
    expect(css).toContain('.textarea');
  });

  it('uses aria-invalid for error state', () => {
    expect(css).toContain('aria-invalid');
  });

  it('uses focus-visible for focus styles', () => {
    expect(css).toContain('focus-visible');
  });

  it('uses design tokens for styling', () => {
    expect(css).toContain('--paul-');
  });

  it('respects prefers-reduced-motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
