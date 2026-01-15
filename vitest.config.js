import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['server/__tests__/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'json-summary'],
      reportsDirectory: './coverage/backend',
      include: ['server/**/*.js'],
      exclude: [
        'server/__tests__/**',
        'server/index.js', // Exclude server entry point (just connects to DB)
        '**/node_modules/**',
      ],
      // Coverage thresholds for backend
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
      all: true,
      skipFull: false,
    },
  },
})
