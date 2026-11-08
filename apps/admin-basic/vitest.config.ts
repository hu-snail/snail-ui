import { defineConfig } from 'vitest/config';

// App-level unit tests are pure-function suites (dynamic-route mapping,
// theme color math, response envelope guard, i18n key parity) — node env.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // macOS AppleDouble shadow files (._foo.test.ts) on this volume must not
    // run as duplicate suites.
    exclude: ['**/node_modules/**', '**/dist/**', '**/._*'],
  },
});
