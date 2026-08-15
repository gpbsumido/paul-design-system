import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  '..',
);

const read = (p: string) => readFileSync(resolve(repoRoot, p), 'utf-8');

/**
 * The root version and the changelog must agree.
 *
 * They drifted, and the way they drifted is the interesting part: every package
 * version is bumped in the feature branch, but the root version was only ever
 * bumped on the release branch. A release branch merges into `main` and nothing
 * carries it back, so `develop` fell one behind on every release — 0.2.31 while
 * `main` was on 0.2.33.
 *
 * The tempting fix was a workflow that back-merges `main` into `develop` after
 * a release. That reconciles two branches after the fact, when the mistake is
 * visible on one branch on its own: `develop` was carrying a changelog that
 * said 0.2.33 above a package.json that said 0.2.31. Nothing about that needs a
 * second branch to notice.
 *
 * So the rule is simply that a repo states one version, and it is checked where
 * the mistake is made rather than where it is eventually discovered.
 */
describe('release consistency', () => {
  it('has the root version matching the newest changelog entry', () => {
    const version = JSON.parse(read('package.json')).version as string;
    const heading = read('CHANGELOG.md')
      .split('\n')
      .find((l) => l.startsWith('## '));

    expect(heading).toBeDefined();
    expect(heading).toContain(version);
  });

  it('gives every published package a version', () => {
    for (const pkg of ['css', 'react', 'tokens']) {
      const json = JSON.parse(read(`packages/${pkg}/package.json`));
      expect(json.version, `${pkg} has no version`).toMatch(/^\d+\.\d+\.\d+/);
    }
  });
});
