import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/folder-float.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('FolderFloat CSS component', () => {
  it('defines the folder, chips, and bob keyframes', () => {
    expect(css).toContain('.folder-float');
    expect(css).toContain('.folder-float__chip');
    expect(css).toContain('@keyframes paul-folder-bob');
  });

  it('respects reduced motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });
});
