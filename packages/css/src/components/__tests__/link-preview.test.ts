import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/link-preview.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('LinkPreview CSS component', () => {
  it('defines the link and floating card', () => {
    expect(css).toContain('.link-preview');
    expect(css).toContain('.link-preview__card');
  });

  it('respects reduced motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
