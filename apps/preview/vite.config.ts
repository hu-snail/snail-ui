import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    // Per AUI-PRD-v3.0 + ADR-0002, preview app supports modern evergreen browsers.
    // Setting target to es2022 enables top-level await in transformed output
    // (vue-tsc emits TLA in some module patterns).
    target: 'es2022',
  },
  server: {
    port: 5173,
    open: true,
  },
})