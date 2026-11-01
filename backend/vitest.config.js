import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      // Inicialização de porta é verificada separadamente, fora dos testes unitários.
      exclude: ['src/server.js'],
      reportsDirectory: 'coverage',
      reporter: ['text', 'html', 'lcov'],
      thresholds: { lines: 70, functions: 70, statements: 70, branches: 70 },
    },
  },
});
