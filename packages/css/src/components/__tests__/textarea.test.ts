import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/textarea.css');
const css = readFileSync(cssPath, 'utf-8');

describe('Textarea CSS component', () => {
  it('defines .textarea base class', () => {
    expect(css).toContain('.textarea');
  });

  it('allows vertical resize', () => {
    expect(css).toContain('resize: vertical');
  });

  it('defines an error state', () => {
    expect(css).toContain('.textarea--error');
  });
});
