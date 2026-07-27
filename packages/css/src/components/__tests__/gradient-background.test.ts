import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/gradient-background.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('GradientBackground CSS component', () => {
  it('paints a scalable gradient image', () => {
    expect(css).toContain('.gradient-bg');
    expect(css).toContain('background-image');
    expect(css).toContain('background-size');
  });

  it('animates the gradient with a flow keyframe', () => {
    expect(css).toContain('@keyframes');
    expect(css).toContain('background-position');
  });

  it('only animates when motion is allowed', () => {
    expect(css).toContain('prefers-reduced-motion: no-preference');
    expect(css).toContain("[data-animate='true']");
  });

  it('falls back to token colours by default', () => {
    expect(css).toContain('--paul-color-primary');
  });
});
