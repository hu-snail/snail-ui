import { defineConfig } from 'vitest/config';

/**
 * Docs-side unit tests (the preview shims under `.vitepress/utils`).
 *
 * The `._*` pattern excludes the macOS AppleDouble resource-fork twins that
 * show up on external volumes — same exclusion the uni package uses. The
 * environment is happy-dom because the shims are pure DOM code.
 */
export default defineConfig({
  test: {
    include: ['.vitepress/utils/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/._*'],
    environment: 'happy-dom',
    reporters: ['default'],
  },
});
