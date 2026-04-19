import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'scripts/audit/**/*.test.ts'],
    environment: 'node',
  },
});
