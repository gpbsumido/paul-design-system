import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/select.css');
const css = readFileSync(cssPath, 'utf-8');

describe('Select CSS component', () => {
  it('defines .select base class', () => {
    expect(css).toContain('.select');
  });

  it('hides the native chevron with appearance: none', () => {
    expect(css).toContain('appearance: none');
  });

  it('paints its own chevron via a background-image', () => {
    expect(css).toContain('background-image');
  });

  it('defines .select--error with error styling', () => {
    expect(css).toContain('.select--error');
    expect(css).toContain('--paul-color-error-600');
  });

  it('defines .select--sm size variant', () => {
    expect(css).toContain('.select--sm');
  });

  it('defines .select--md size variant', () => {
    expect(css).toContain('.select--md');
  });

  it('defines .select__wrapper container class', () => {
    expect(css).toContain('.select__wrapper');
  });

  it('defines .select__wrapper--horizontal orientation modifier', () => {
    expect(css).toContain('.select__wrapper--horizontal');
  });

  it('defines .select__label label class', () => {
    expect(css).toContain('.select__label');
  });

  it('defines .select__helper and error variant', () => {
    expect(css).toContain('.select__helper');
    expect(css).toContain('.select__helper--error');
  });

  it('uses aria-invalid for error state', () => {
    expect(css).toContain('aria-invalid');
  });

  it('uses focus-visible for focus styles', () => {
    expect(css).toContain('focus-visible');
  });

  it('provides dark mode styling', () => {
    expect(css).toContain('[data-theme="dark"]');
  });

  it('uses design tokens for styling', () => {
    expect(css).toContain('--paul-');
  });

  it('respects prefers-reduced-motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
