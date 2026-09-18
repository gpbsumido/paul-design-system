import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/botanical-text.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('BotanicalText CSS component', () => {
  it('defines the container and canvas', () => {
    expect(css).toContain('.botanical-text');
    expect(css).toContain('.botanical-text__canvas');
  });
});
