import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { createRequire } from 'node:module';

// Per-package vitest config. Mirrors packages/vue-web: resolves the
// bundler-ready vue build and registers @vitejs/plugin-vue so `.vue` SFCs
// compile in tests. Also excludes macOS AppleDouble metadata files (._*)
// created on non-APFS volumes.

const require = createRequire(import.meta.url);
const vueEsmEntry = require.resolve('vue/dist/vue.esm-bundler.js');

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      vue: vueEsmEntry,
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/._*'],
    environment: 'happy-dom',
    reporters: ['default'],
  },
});
