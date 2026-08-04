import 'vitest';
import type { AxeMatchers } from 'vitest-axe/matchers';

/**
 * `expect.extend(matchers)` adds vitest-axe's matchers at runtime but not to the
 * type of `expect`. Without this, every `toHaveNoViolations()` in a11y.spec.ts
 * is a type error even though the assertion works.
 */
declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion<T = any> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
