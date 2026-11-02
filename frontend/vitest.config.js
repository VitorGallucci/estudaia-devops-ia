import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      // Bootstrap de duas importações verificado no navegador, sem lógica própria.
      exclude: ['src/main.js'],
      reportsDirectory: 'coverage',
      reporter: ['text', 'html', 'lcov'],
      thresholds: { lines: 70, functions: 70, statements: 70, branches: 70 },
    },
  },
});
