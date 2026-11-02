import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { SnUIResolver } from '@snui/vue-web/resolver';

// UI components auto-import: <SnButton> etc. resolve on use — no per-page
// imports. dts is committed so `pnpm typecheck` works on a fresh clone.
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [SnUIResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
