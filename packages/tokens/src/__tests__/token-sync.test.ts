import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { colors, semanticColors } from '../colors.js';
import { typography } from '../typography.js';

/**
 * build.mjs re-declares every colour as its own literal, with a "keep in sync"
 * comment and nothing enforcing it. That copy is what generates tokens.css, so a
 * drift means TS consumers get one palette and every CSS consumer gets another —
 * silently, because both halves still build. This is the enforcement.
 */

const buildSource = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), '../../build.mjs'),
  'utf-8',
);

/** Slice a top-level `const <name> = { ... };` object literal out of the source. */
function literal(name: string): string {
  const start = buildSource.indexOf(`const ${name} = {`);
  if (start === -1) throw new Error(`build.mjs has no "const ${name} = {"`);
  const open = buildSource.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < buildSource.length; i += 1) {
    if (buildSource[i] === '{') depth += 1;
    if (buildSource[i] === '}') {
      depth -= 1;
      if (depth === 0) return buildSource.slice(open, i + 1);
    }
  }
  throw new Error(`unbalanced braces reading ${name} from build.mjs`);
}

const evaluate = (text: string, scope: Record<string, unknown> = {}) => {
  const keys = Object.keys(scope);
  return new Function(...keys, `return ${text};`)(...keys.map((k) => scope[k])) as unknown;
};

const buildColors = evaluate(literal('colors')) as typeof colors;
const buildSemantic = evaluate(literal('semanticColors'), {
  colors: buildColors,
}) as typeof semanticColors;
const buildFontFamily = evaluate(literal('fontFamily')) as Record<string, string>;

describe('build.mjs mirrors the token sources', () => {
  it('declares the same colour ramps as colors.ts', () => {
    expect(buildColors).toEqual(colors);
  });

  it('declares the same semantic colours as colors.ts', () => {
    expect(buildSemantic).toEqual(semanticColors);
  });

  it('declares the same font families as typography.ts', () => {
    expect(buildFontFamily).toEqual(typography.fontFamily);
  });
});
