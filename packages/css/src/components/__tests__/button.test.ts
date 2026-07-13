import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/button.css');
const css = readFileSync(cssPath, 'utf-8');

describe('Button CSS component', () => {
  it('defines .btn base class', () => {
    expect(css).toContain('.btn');
  });

  it('defines primary variant', () => {
    expect(css).toContain('.btn--primary');
  });

  it('defines secondary variant', () => {
    expect(css).toContain('.btn--secondary');
  });

  it('defines outline variant', () => {
    expect(css).toContain('.btn--outline');
  });

  it('defines ghost variant', () => {
    expect(css).toContain('.btn--ghost');
  });

  it('defines danger variant', () => {
    expect(css).toContain('.btn--danger');
  });

  it('defines size variants', () => {
    expect(css).toContain('.btn--xs');
    expect(css).toContain('.btn--sm');
    expect(css).toContain('.btn--md');
    expect(css).toContain('.btn--lg');
  });

  it('handles disabled state', () => {
    expect(css).toContain('[disabled]');
    expect(css).toContain('pointer-events');
  });

  it('handles loading state via aria-busy', () => {
    expect(css).toContain('aria-busy');
  });

  it('defines icon-only variant', () => {
    expect(css).toContain('.btn--icon-only');
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
