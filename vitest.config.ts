import { defineConfig } from 'vitest/config';

// Workspace vitest config — uses `projects` so each sub-package owns its own
// default-config (cwd-relative `**/*.{test,spec}.{ts,tsx}` include).
//
// When a package needs bespoke setup (jsdom for vue-web, fake-indexeddb for
// ai/runtime inspection, etc.) it adds its own vitest.config.ts. Vitest will
// pick that up automatically via the `projects` glob.
//
// At root, `pnpm test` aggregates all packages. At package level,
// `vitest run` runs only that package's tests.

export default defineConfig({
  test: {
    projects: ['packages/*'],
    reporters: ['default'],
  },
});