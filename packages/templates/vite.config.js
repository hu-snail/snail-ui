import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

/**
 * vite build config for @snui/templates.
 *
 * Mirrors packages/vue-web/vite.config.js — vite (not vue-tsc) runs the build
 * because only @vue/compiler-sfc substitutes the `<script setup>` macros
 * (defineOptions / defineProps / withDefaults / defineEmits) into runtime
 * calls. Emitting raw macro source would crash every ESM consumer.
 *
 * On-demand loading is the point of this package, so the build is MULTI-ENTRY:
 * every template gets its own chunk under dist/web/ or dist/uni/. A consumer
 * importing `@snui/templates/web/model-config` pulls that page alone instead
 * of the whole library. The barrel entries (`web/index`, `uni/index`) are
 * convenience re-exports for consumers that want everything.
 *
 * Pipeline (per package.json `build`):
 *   1. `vite build` — emits dist/{web,uni}/*.js (lib ESM, shared deps split
 *                     into chunks/) + dist/styles/index.css
 *   2. `vue-tsc --emitDeclarationOnly` — emits dist/** d.ts declarations
 *   3. `node ./scripts/copy-styles.mjs` — prepends the token cascade to
 *      dist/styles/index.css so `@snui/templates/styles` is self-sufficient
 */

const entry = {
  index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
  'web/index': fileURLToPath(new URL('./src/web/index.ts', import.meta.url)),
  'web/chat': fileURLToPath(new URL('./src/web/chat.ts', import.meta.url)),
  'web/prompt': fileURLToPath(new URL('./src/web/prompt.ts', import.meta.url)),
  'web/message-list': fileURLToPath(new URL('./src/web/message-list.ts', import.meta.url)),
  'web/model-config': fileURLToPath(new URL('./src/web/model-config.ts', import.meta.url)),
  'uni/index': fileURLToPath(new URL('./src/uni/index.ts', import.meta.url)),
  'uni/chat': fileURLToPath(new URL('./src/uni/chat.ts', import.meta.url)),
  'uni/message-list': fileURLToPath(new URL('./src/uni/message-list.ts', import.meta.url)),
}

export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    lib: {
      entry,
      name: 'SnUITemplates',
      formats: ['es'],
    },
    rollupOptions: {
      // Both ends' component libraries stay external: the consumer app already
      // installs the end it targets, and bundling them twice would duplicate
      // Vue component instances across the app / template boundary.
      external: ['vue', '@snui/vue-web', '@snui/uni', '@snui/tokens'],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        // All extracted CSS lands at dist/styles/index.css; copy-styles.mjs
        // then prepends the token cascade onto that same file.
        assetFileNames: (info) => {
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
