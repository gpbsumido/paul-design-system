import { describe, it, expect, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PaulReducedMotion } from '../prefers-reduced-motion';

/** Replaces matchMedia with one reporting the given preference. */
export function stubReducedMotion(matches: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = [];
  const query = {
    matches,
    addEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => listeners.push(fn),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => query),
  );
  return {
    /** Fire a preference change the way the OS would. */
    change(next: boolean) {
      query.matches = next;
      listeners.forEach((fn) => fn({ matches: next } as MediaQueryListEvent));
    },
  };
}

afterEach(() => vi.unstubAllGlobals());

/** Mirrors packages/react/src/usePrefersReducedMotion.ts. */
describe('PaulReducedMotion', () => {
  const read = () => TestBed.inject(PaulReducedMotion).reduced();

  it('reports the current preference', () => {
    stubReducedMotion(true);
    expect(read()).toBe(true);
  });

  it('reports false when the preference is not set', () => {
    stubReducedMotion(false);
    expect(read()).toBe(false);
  });

  it('follows a preference change', () => {
    const media = stubReducedMotion(false);
    const service = TestBed.inject(PaulReducedMotion);
    expect(service.reduced()).toBe(false);
    media.change(true);
    expect(service.reduced()).toBe(true);
  });

  it('is false when matchMedia is unavailable', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(read()).toBe(false);
  });
});
