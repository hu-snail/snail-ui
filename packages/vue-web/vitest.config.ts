import { defineConfig } from 'vitest/config';
import { createRequire } from 'node:module';

// Per-package vitest config. Overrides root vitest workspace inheritance
// so each package uses its own cwd-relative include (avoids root config leaking in).
// Also excludes macOS AppleDouble metadata files (._*) created on non-APFS volumes.
//
// `resolve.alias['vue']` — under pnpm's strict isolation store, Vite/Vitest's
// default resolver cannot locate `vue` even when it is installed (vue lives
// inside `node_modules/.pnpm/vue@3.5.43_*/node_modules/vue/`, not at the
// package's direct node_modules). Aliasing to vue's explicit ESM bundler
// entry bypasses the resolver and lets vitest load the module.
//
// We use `createRequire(import.meta.url).resolve(...)` instead of
// `import.meta.resolve(...)` because vitest compiles this config to a
// temporary `.timestamp.mjs` file before evaluation, and that compiled
// file's ESM resolver does not see pnpm's `vue` dependency — but CJS
// resolution via createRequire does, since CJS walks the real node_modules.

const require = createRequire(import.meta.url);
const vueEsmEntry = require.resolve('vue/dist/vue.esm-bundler.js');

export default defineConfig({
  resolve: {
    alias: {
      vue: vueEsmEntry,
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/._*'],
    // happy-dom provides a lightweight DOM for Renderer.test.ts (real mount +
    // DOM assertions). Other unit tests (registry / button) stay DOM-light.
    environment: 'happy-dom',
    reporters: ['default'],
  },
});