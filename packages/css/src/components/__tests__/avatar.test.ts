import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/avatar.css');
const css = readFileSync(cssPath, 'utf-8');

describe('Avatar CSS component', () => {
  it('defines .avatar base class', () => {
    expect(css).toContain('.avatar');
    expect(css).toContain('inline-flex');
    expect(css).toContain('align-items');
    expect(css).toContain('justify-content');
    expect(css).toContain('border-radius');
    expect(css).toContain('overflow');
  });

  it('defines .avatar--sm size', () => {
    expect(css).toContain('.avatar--sm');
    expect(css).toContain('24px');
  });

  it('defines .avatar--md size', () => {
    expect(css).toContain('.avatar--md');
    expect(css).toContain('32px');
  });

  it('defines .avatar--lg size', () => {
    expect(css).toContain('.avatar--lg');
    expect(css).toContain('48px');
  });

  it('defines .avatar--xl size', () => {
    expect(css).toContain('.avatar--xl');
    expect(css).toContain('64px');
  });

  it('defines .avatar--fallback variant', () => {
    expect(css).toContain('.avatar--fallback');
    expect(css).toContain('text-transform');
    expect(css).toContain('uppercase');
  });

  it('styles avatar images', () => {
    expect(css).toContain('.avatar img');
    expect(css).toContain('object-fit');
  });

  it('uses design tokens', () => {
    expect(css).toContain('--paul-');
  });
});
