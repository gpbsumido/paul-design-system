import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const componentsDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Stylesheets for controls a finger has to hit.
 *
 * Listed explicitly rather than inferred: a stylesheet mentioning `cursor:
 * pointer` is not necessarily a control, and a control is not always obvious
 * from its declarations. An explicit list means adding an interactive component
 * is a deliberate decision to answer this or not.
 */
const INTERACTIVE = [
  'button.css',
  'icon-button.css',
  'input.css',
  'select.css',
  'switch.css',
  'textarea.css',
  'chip.css',
];

const read = (name: string) =>
  readFileSync(resolve(componentsDir, name), 'utf-8');

describe('touch targets', () => {
  it.each(INTERACTIVE)(
    '%s answers pointer: coarse with a size floor',
    (name) => {
      const css = read(name);
      expect(css).toContain('pointer: coarse');
      // The block has to actually set a size, not merely exist.
      const block = css.slice(css.indexOf('pointer: coarse'));
      expect(block).toMatch(/min-(height|width)|height|width/);
    },
  );

  it('keeps every interactive stylesheet on the list', () => {
    // A new interactive component should force a decision here rather than
    // shipping with whatever size looked right on a desktop.
    const present = readdirSync(componentsDir).filter((f) => f.endsWith('.css'));
    INTERACTIVE.forEach((name) => expect(present).toContain(name));
  });

  it('ships the utilities a consumer needs for the cases it cannot fix', () => {
    // Some controls genuinely cannot grow — a swatch, a HUD button over a 3D
    // view. The package should hand consumers the escape hatch rather than
    // making each of them invent it.
    const utils = readFileSync(
      resolve(componentsDir, '..', 'utilities', 'touch.css'),
      'utf-8',
    );
    expect(utils).toContain('.paul-touch-min');
    expect(utils).toContain('.paul-touch-target');
    expect(utils).toContain('pointer: coarse');
  });
});
