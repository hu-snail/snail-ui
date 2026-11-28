import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const vueEsmEntry = require.resolve('vue/dist/vue.esm-bundler.js');

/**
 * Unit tests run against plain SFC sources outside the uni compiler, so the
 * `#ifdef` conditional-compilation comments are inert comments there. When a
 * template carries BOTH an MP-WEIXIN branch and its #ifndef complement, both
 * render and every node-count / class assertion double-counts. Tests take the
 * H5 perspective: MP-WEIXIN-only branches are stripped and #ifndef MP-WEIXIN
 * wrappers unwrap. (#ifdef MP blocks stay — they are inside v-else-if chains
 * and mutually exclusive with the H5 branch by construction.)
 *
 * SCRIPT-level `// #ifdef MP-WEIXIN` blocks strip too: inert comments would
 * otherwise leave the guarded assignments LIVE (a platform flag like
 * `let isMpWeixin = false; // #ifdef MP-WEIXIN isMpWeixin = true; #endif`
 * reads true in every test and the H5 branch's v-else never renders).
 */
function stripMpWeixinBranches(): {
  name: string;
  transform(code: string, id: string): { code: string; map: null } | undefined;
} {
  return {
    name: 'strip-mp-weixin-ifdef',
    transform(code, id) {
      if (!id.endsWith('.vue') || !code.includes('#ifdef MP-WEIXIN')) return undefined;
      const stripped = code
        .replace(/^[ \t]*\/\/\s*#ifdef MP-WEIXIN[ \t]*\n[\s\S]*?^[ \t]*\/\/\s*#endif[ \t]*$\n?/gm, '')
        .replace(/<!--\s*#ifdef MP-WEIXIN\s*-->[\s\S]*?<!--\s*#endif\s*-->/g, '')
        .replace(/<!--\s*#ifndef MP-WEIXIN\s*-->/g, '')
        .replace(/<!--\s*#endif\s*-->/g, '');
      return { code: stripped, map: null };
    },
  };
}

export default defineConfig({
  plugins: [stripMpWeixinBranches(), vue()],
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
