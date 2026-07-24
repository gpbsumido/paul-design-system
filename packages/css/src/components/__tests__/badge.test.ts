import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/badge.css');
const css = readFileSync(cssPath, 'utf-8');

describe('Badge CSS component', () => {
  it('defines .badge base class', () => {
    expect(css).toContain('.badge');
    expect(css).toContain('inline-flex');
    expect(css).toContain('align-items');
    expect(css).toContain('justify-content');
    expect(css).toContain('border-radius');
  });

  it('defines .badge--success variant', () => {
    expect(css).toContain('.badge--success');
  });

  it('defines .badge--warning variant', () => {
    expect(css).toContain('.badge--warning');
  });

  it('defines .badge--error variant', () => {
    expect(css).toContain('.badge--error');
  });

  it('defines .badge--info variant', () => {
    expect(css).toContain('.badge--info');
  });

  it('defines .badge--dot variant', () => {
    expect(css).toContain('.badge--dot');
    expect(css).toContain('8px');
  });

  it('defines .badge--starburst variant', () => {
    expect(css).toContain('.badge--starburst');
    expect(css).toContain('clip-path');
  });

  it('uses design tokens', () => {
    expect(css).toContain('--paul-');
  });
});
