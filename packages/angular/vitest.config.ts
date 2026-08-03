import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  test: {
    projects: [
      {
        // The chart geometry is pure TS — no DOM or Angular runtime needed.
        // Kept on `node` so it can never quietly grow a DOM dependency.
        test: {
          name: 'geometry',
          environment: 'node',
          globals: true,
          include: ['src/__tests__/**/*.test.ts'],
        },
      },
      {
        // Component render tests: real templates through Angular's TestBed.
        // The Angular compiler plugin is what makes signal inputs bindable —
        // plain esbuild transpiles the decorator but drops `input()` metadata,
        // so `setInput` silently no-ops without it.
        plugins: [angular()],
        test: {
          name: 'render',
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./test-setup.ts'],
          include: ['src/__tests__/**/*.spec.ts'],
        },
      },
    ],
  },
});
