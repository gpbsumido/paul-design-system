import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/tilt-card.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('TiltCard CSS component', () => {
  it('gives the wrapper a 3D perspective', () => {
    expect(css).toContain('.tilt-card');
    expect(css).toContain('perspective');
  });

  it('rotates the inner element from tilt custom properties', () => {
    expect(css).toContain('.tilt-card__inner');
    expect(css).toContain('rotateX(var(--paul-tilt-x');
    expect(css).toContain('rotateY(var(--paul-tilt-y');
  });

  it('defines a pointer-tracking glare highlight', () => {
    expect(css).toContain('.tilt-card__glare');
    expect(css).toContain('--paul-glare-x');
    expect(css).toContain('radial-gradient');
  });

  it('flattens the tilt under prefers-reduced-motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });

  it('uses design tokens for motion', () => {
    expect(css).toContain('--paul-');
  });
});
