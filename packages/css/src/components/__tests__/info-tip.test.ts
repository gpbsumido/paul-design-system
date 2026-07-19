import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/info-tip.css');
const css = readFileSync(cssPath, 'utf-8');

describe('InfoTip CSS component', () => {
  it('defines .info-tip base class', () => {
    expect(css).toContain('.info-tip');
  });

  it('has a focus-visible state', () => {
    expect(css).toContain('.info-tip:focus-visible');
  });
});
