import { useEffect, useState } from 'react';

/**
 * Tracks `prefers-reduced-motion`. Defaults to false so the server and the
 * first client render agree (SSR-stable), then updates once mounted. Shared by
 * every motion-driven component so they honour the preference identically.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return;
    }
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Microtask defer keeps the effect from setting state synchronously.
    queueMicrotask(() => setReduced(query.matches));
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return reduced;
}
