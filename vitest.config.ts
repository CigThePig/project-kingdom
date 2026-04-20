import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'scripts/audit/**/*.test.ts'],
    environment: 'node',
    // Audit scanner AST/ts-morph cold-start takes several seconds per worker;
    // 5s (vitest default) isn't enough for the tests that touch the
    // writer/reader index or loadCorpus. Bump to 30s so those tests have
    // headroom without needing per-test overrides.
    testTimeout: 30000,
  },
});
