import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/click-spark.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('ClickSpark CSS component', () => {
  it('defines the base class and ray keyframes', () => {
    expect(css).toContain('.click-spark');
    expect(css).toContain('.click-spark__ray');
    expect(css).toContain('@keyframes paul-spark-ray');
  });

  it('respects reduced motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
