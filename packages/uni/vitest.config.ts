import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { createRequire } from 'node:module';

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
    coverage: {
      provider: 'v8',
      include: ['src/components/**/*.{ts,vue}'],
      // Type-only modules and registration side-effect files carry no runtime
      // branches worth counting; the mp host shims are exercised via components.
      exclude: [
        'src/components/**/*-types.ts',
        'src/components/**/sn-icon-registry.ts',
        'src/**/*.{test,spec}.ts',
        'src/**/._*',
      ],
      reporter: ['text', 'text-summary', 'lcov'],
      reportsDirectory: 'coverage',
      // Workspace 里常有并行任务的 WIP 测试在失败，报告必须照常产出才能做缺口分析
      reportOnFailure: true,
      // Floor set just under the measured baseline (lines 97.7 / branch 89.4 /
      // funcs 96.2) so a regression trips CI without flagging noise from
      // components still under construction by another task.
      thresholds: {
        lines: 97,
        branches: 88,
        functions: 95,
        statements: 97,
      },
    },
  },
});
