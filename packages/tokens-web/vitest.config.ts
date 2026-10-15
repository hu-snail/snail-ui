import { defineConfig } from 'vitest/config';

// Per-package vitest config. Overrides root vitest workspace inheritance
// so each package uses its own cwd-relative include (avoids root config leaking in).
// Also excludes macOS AppleDouble metadata files (._*) created on non-APFS volumes.

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/._*'],
    environment: 'node',
    reporters: ['default'],
  },
});
