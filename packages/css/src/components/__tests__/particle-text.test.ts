import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/particle-text.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('ParticleText CSS component', () => {
  it('defines the container and canvas', () => {
    expect(css).toContain('.particle-text');
    expect(css).toContain('.particle-text__canvas');
  });
});
