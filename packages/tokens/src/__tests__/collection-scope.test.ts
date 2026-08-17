import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const repoRoot = resolve(packageRoot, '..', '..');

/**
 * The suite may only ever collect tests from `src/`.
 *
 * This package compiles to `build/`, and for a while it compiled its own tests
 * along with everything else. Vitest's default exclude list covers `dist/` but
 * not `build/`, so the compiled copies were collected too and every tokens test
 * ran twice. A clean checkout reported 4 files and 42 tests, the same command
 * after a build reported 8 and 84.
 *
 * The doubled count was the harmless half. What the run means changed with it:
 * the second copy is compiled output, so it can pass while the source it came
 * from would fail, and whether it ran at all depended on whether somebody had
 * built first. A suite whose result turns on the state of a gitignored
 * directory is not reporting on the code any more.
 *
 * So this asks vitest what it collected rather than re-deriving the glob here.
 * Re-deriving it would only prove that two copies of my own guess agree, and
 * the thing that went wrong was a real default I had not read.
 */
describe('test collection scope', () => {
  it('collects no test file from outside src/', () => {
    const listed = execFileSync(
      resolve(repoRoot, 'node_modules', '.bin', 'vitest'),
      ['list', '--filesOnly', '--json'],
      { cwd: packageRoot, encoding: 'utf-8', timeout: 120_000 },
    );

    const collected = (JSON.parse(listed) as ReadonlyArray<{ file: string }>).map(
      (entry) => relative(packageRoot, entry.file),
    );

    expect(collected.length).toBeGreaterThan(0);

    const strays = collected.filter((file) => !file.startsWith(`src${sep}`));
    expect(strays, `collected from outside src/: ${strays.join(', ')}`).toEqual(
      [],
    );
  });
});
