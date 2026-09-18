import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const basePath = resolve(dirname(fileURLToPath(import.meta.url)), '../../base.css');
const css = readFileSync(basePath, 'utf-8');

describe('squircle corners', () => {
  it('applies corner-shape: squircle as a base rule, so every rounded corner is continuous', () => {
    expect(css).toMatch(/corner-shape:\s*squircle/);
  });
});
