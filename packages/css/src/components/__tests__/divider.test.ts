import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/divider.css');
const css = readFileSync(cssPath, 'utf-8');

describe('Divider CSS component', () => {
  it('defines the base class', () => {
    expect(css).toContain('.divider');
  });

  it('defines the vertical variant', () => {
    expect(css).toContain('.divider--vertical');
  });
});
