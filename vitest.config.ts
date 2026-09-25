import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.ts'],
    // Tests must not depend on the developer machine timezone.
    env: { TZ: 'UTC' },
    // vmForks pool shares the module registry correctly on Node 24 / Windows,
    // preventing the @vitest/runner suite-context split-instance problem.
    pool: 'vmForks',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});