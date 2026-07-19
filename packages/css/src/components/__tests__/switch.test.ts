import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/switch.css');
const css = readFileSync(cssPath, 'utf-8');

describe('Switch CSS component', () => {
  it('defines the track and thumb', () => {
    expect(css).toContain('.switch');
    expect(css).toContain('.switch__thumb');
  });

  it('defines the on state', () => {
    expect(css).toContain('.switch--on');
  });
});
