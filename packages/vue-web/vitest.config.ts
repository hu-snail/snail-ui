import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { createRequire } from 'node:module';

// Per-package vitest config. Mirrors the v1 strategy (vue resolve alias +
// AppleDouble exclusion) and additionally registers `@vitejs/plugin-vue` so
// `.vue` files compile in tests.

const require = createRequire(import.meta.url);
const vueEsmEntry = require.resolve('vue/dist/vue.esm-bundler.js');
// The `vue` alias is prefix-matched, so `vue/server-renderer` (used by the
// SSR smoke tests) would otherwise resolve into the bundler entry path and
// fail. Alias the subpath explicitly — order matters (more specific first).
const vueServerRendererEntry = require.resolve('vue/server-renderer');

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'vue/server-renderer': vueServerRendererEntry,
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
