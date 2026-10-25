import { defineConfig } from 'vitest/config';

// This repo lives on a macOS external volume that litters AppleDouble `._*`
// resource-fork files next to real sources; they must never be picked up as tests.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/._*'],
  },
});
