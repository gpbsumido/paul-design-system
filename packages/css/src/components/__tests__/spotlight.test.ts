import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../components/spotlight.css',
);
const css = readFileSync(cssPath, 'utf-8');

describe('Spotlight CSS component', () => {
  it('clips the glow to the container', () => {
    expect(css).toContain('.spotlight');
    expect(css).toContain('overflow: hidden');
    expect(css).toContain('position: relative');
  });

  it('paints a cursor-tracked radial glow', () => {
    expect(css).toContain('.spotlight__glow');
    expect(css).toContain('radial-gradient');
    expect(css).toContain('--paul-spotlight-x');
    expect(css).toContain('--paul-spotlight-y');
  });

  it('layers content above the glow', () => {
    expect(css).toContain('.spotlight__content');
  });

  it('reveals the glow only while active', () => {
    expect(css).toContain('.spotlight[data-active]');
  });

  it('uses design tokens for motion', () => {
    expect(css).toContain('--paul-');
  });

  it('glows in the brand colour when nothing overrides it', () => {
    // The fallback is what most consumers actually get, so it has to be the
    // design system's own colour rather than stock Tailwind blue-500.
    expect(css).not.toContain('rgb(59 130 246');
    expect(css).toContain('var(--paul-spotlight-color, rgb(33 155 132 / 0.25))');
  });
});
