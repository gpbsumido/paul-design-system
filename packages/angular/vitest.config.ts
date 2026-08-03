import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // The chart geometry is pure TS — no DOM or Angular runtime needed.
    environment: 'node',
    globals: true,
    include: ['src/__tests__/**/*.test.ts'],
  },
});
