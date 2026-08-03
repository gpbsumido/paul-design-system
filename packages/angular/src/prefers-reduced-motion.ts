import { Injectable, DestroyRef, inject, signal } from '@angular/core';

/**
 * Tracks `prefers-reduced-motion`, the Angular twin of the React
 * `usePrefersReducedMotion` hook. Rendering on the server (or anywhere without
 * `matchMedia`) reports false, so the first render is stable.
 *
 * Provided in root: the query and its listener are shared by every motion
 * component instead of each one attaching its own.
 */
@Injectable({ providedIn: 'root' })
export class PaulReducedMotion {
  private readonly state = signal(false);

  /** True when the user has asked for reduced motion. */
  readonly reduced = this.state.asReadonly();

  constructor() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.state.set(query.matches);

    const onChange = (event: MediaQueryListEvent) => this.state.set(event.matches);
    query.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => query.removeEventListener('change', onChange));
  }
}
