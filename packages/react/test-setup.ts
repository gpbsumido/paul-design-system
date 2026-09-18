import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement ResizeObserver; components that observe their own
// size (DriftWall) need it present. A no-op is enough for unit tests.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}
