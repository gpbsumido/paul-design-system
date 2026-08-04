import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as csstree from 'css-tree';

const componentsDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const files = readdirSync(componentsDir)
  .filter((f) => f.endsWith('.css'))
  .map((f) => ({ name: basename(f), css: readFileSync(resolve(componentsDir, f), 'utf-8') }));

/** Keyframe names an `animation` / `animation-name` declaration refers to. */
function keyframeNames(value: csstree.Value | csstree.Raw): string[] {
  const names: string[] = [];
  csstree.walk(value, {
    visit: 'Identifier',
    enter(node) {
      names.push(node.name);
    },
  });
  return names;
}

interface Animated {
  /** Keyframes referenced outside any reduced-motion block. */
  normal: string[];
  /** Keyframes referenced inside a `prefers-reduced-motion: reduce` block. */
  reduced: string[];
  /** Declarations inside the reduced block, whatever their property. */
  reducedProps: string[];
}

function keyframesIn(css: string): { names: string[]; props: string[] } {
  const names: string[] = [];
  const props: string[] = [];
  csstree.walk(csstree.parse(css), {
    visit: 'Declaration',
    enter(node) {
      props.push(node.property);
      if (node.property === 'animation' || node.property === 'animation-name') {
        names.push(...keyframeNames(node.value));
      }
    },
  });
  return { names, props };
}

function analyse(css: string): Animated {
  // Slice the reduced-motion blocks out by source position and analyse the two
  // halves separately. Walking with `this.atrule` reports the nearest at-rule,
  // which inside `@layer components { @media … { … } }` is not reliably the
  // media query — and getting that wrong makes this guard pass vacuously.
  const ast = csstree.parse(css, { positions: true });
  const ranges: Array<[number, number]> = [];

  csstree.walk(ast, {
    visit: 'Atrule',
    enter(node) {
      // The prelude parses to an AtrulePrelude, not a Raw, so generate it back
      // to text rather than reading `.value` off a node that doesn't have one.
      const prelude = node.prelude ? csstree.generate(node.prelude) : '';
      if (node.name === 'media' && /prefers-reduced-motion/.test(prelude) && node.loc) {
        ranges.push([node.loc.start.offset, node.loc.end.offset]);
      }
    },
  });

  const reducedCss = ranges.map(([from, to]) => css.slice(from, to)).join('\n');
  let normalCss = css;
  for (const [from, to] of [...ranges].reverse()) {
    normalCss = normalCss.slice(0, from) + normalCss.slice(to);
  }

  const reduced = reducedCss ? keyframesIn(reducedCss) : { names: [], props: [] };
  return {
    normal: keyframesIn(normalCss).names,
    reduced: reduced.names,
    reducedProps: reduced.props,
  };
}

const animated = files
  .map((f) => ({ ...f, analysis: analyse(f.css) }))
  .filter((f) => f.analysis.normal.length > 0);

describe('reduced motion', () => {
  it('finds the animated components', () => {
    // A guard on the guard: if this ever drops to zero the tests below pass
    // vacuously and stop protecting anything.
    expect(animated.length).toBeGreaterThan(0);
  });

  it.each(animated.map((f) => f.name))('%s answers prefers-reduced-motion', (name) => {
    const file = animated.find((f) => f.name === name)!;
    expect(file.css, `${name} animates but never mentions prefers-reduced-motion`).toContain(
      'prefers-reduced-motion',
    );
    expect(
      file.analysis.reducedProps.length,
      `${name} has an empty prefers-reduced-motion block`,
    ).toBeGreaterThan(0);
  });

  it('never keeps a rotating animation under reduced motion', () => {
    // Rotation is the vestibular trigger. Slowing it down is not answering the
    // preference — that is what the spinner used to do (0.6s → 1.5s) and it
    // still spun. Any component that keeps an animation here must switch to a
    // different keyframe, not reuse the one it spins with.
    for (const file of animated) {
      const rotating = file.analysis.normal.filter((n) => /rotate|spin/i.test(n));
      for (const name of rotating) {
        expect(
          file.analysis.reduced,
          `${file.name} still runs ${name} under reduced motion`,
        ).not.toContain(name);
      }
    }
  });

  it('spinner swaps rotation for a pulse rather than stopping dead', () => {
    // The component renders role="status" with a name, so assistive tech is
    // told regardless. This is about sighted users: a spinner frozen solid is
    // indistinguishable from one that has hung, so the reduced branch keeps a
    // non-rotating signal.
    const spinner = animated.find((f) => f.name === 'spinner.css')!;
    expect(spinner.analysis.normal).toContain('paul-spinner-rotate');
    expect(spinner.analysis.reduced).toContain('paul-spinner-pulse');
    expect(spinner.analysis.reduced).not.toContain('paul-spinner-rotate');
  });
});
