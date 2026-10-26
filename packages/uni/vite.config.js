import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

/**
 * vite build config for @snui/uni (active build, replaces vue-tsc).
 *
 * Mirrors packages/vue-web/vite.config.js. uni-app's component files are
 * standard Vue 3 SFCs (they get auto-registered via easycom in uni-app
 * runtime projects), so the same vite + @vue/compiler-sfc pipeline applies.
 *
 * Pipeline (per package.json `build`):
 *   1. `vite build` — emits dist/index.js (lib ESM, all components inlined)
 *   2. `vue-tsc --emitDeclarationOnly` — emits dist/index.d.ts + per-file
 *                                        .vue.d.ts
 *
 * Output:
 *   .                   → dist/index.js           (SnButton, SnDivider, ...)
 */

export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'SnUIUni',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@snui/tokens', '@snui/tokens-mp'],
      output: {
        entryFileNames: 'index.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        // Same barrel-CSS convention as vue-web: vite emits dist/styles/
        // index.css, copy-styles.mjs concatenates `@snui/tokens-mp/styles`
        // before component CSS so consumers get one barrel.
        assetFileNames: (info) => {
          // vite names extracted CSS after the chunk it came from (e.g.
          // `uni.css` for the shared chunk), but we want a single
          // canonical barrel at dist/styles/index.css. Force all CSS to
          // that path; non-CSS assets fall through to assets/[name][ext].
          if (info.name && info.name.endsWith('.css')) return 'styles/index.css'
          return 'assets/[name][extname]'
        },
      },
    },
  },
  resolve: {
    alias: {
      '@snui/tokens': fileURLToPath(new URL('../tokens/src/index.ts', import.meta.url)),
    },
  },
})