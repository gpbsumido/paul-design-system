import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, walk, generate } from 'css-tree';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const entry = readFileSync(resolve(root, 'components.css'), 'utf8');
const imports = [...entry.matchAll(/@import\s+'([^']+)'/g)].map(match => match[1]);
describe('component corner coverage', () => {
  it('ships a deliberate corner shape beside every radius through the components-only entry', () => {
    const missing: string[] = [];
    for (const file of imports) {
      walk(parse(readFileSync(resolve(root, file), 'utf8')), { visit: 'Rule', enter(rule) {
        const declarations = rule.block.children.toArray().filter(node => node.type === 'Declaration');
        const radius = declarations.find(node => node.property === 'border-radius');
        if (!radius) return;
        const shape = declarations.find(node => node.property === 'corner-shape');
        if (!shape) missing.push(`${file}: ${generate(rule.prelude)}`);
        else if (/50%|9999px|radius-full/.test(generate(radius.value))) expect(generate(shape.value)).toBe('round');
      }});
    }
    expect(missing).toEqual([]);
  });
});
