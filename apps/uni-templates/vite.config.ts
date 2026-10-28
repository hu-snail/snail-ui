import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import uniPlugin from '@dcloudio/vite-plugin-uni';

// 该版本的 CJS 产物没有 __esModule 标记，ESM 互操作会把整个导出对象当
// default，真正的插件工厂挂在 .default 上 —— 两种形态都兼容。（与 uni-demo 相同）
const uni =
  (uniPlugin as unknown as { default?: () => unknown }).default ??
  (uniPlugin as unknown as () => unknown);

export default defineConfig({
  // GitHub Pages 项目站部署时由 CI 注入（如 /snail-ui-templates/）；本地默认根路径。
  // 小程序端不感知 base；H5 路由 base 由 scripts/build-h5.mjs 写入 manifest。
  base: process.env.UNI_H5_BASE || '/',
  plugins: [uni()],
  resolve: {
    // MP 构建的 chunk 命名按 inputDir 相对路径计算，模块 id 落在工程外会生成
    // `../` 非法 pattern —— 指向工程内的 workspace symlink 路径并保留 symlink
    // 不解析为真实路径（与 uni-demo 一致）。
    preserveSymlinks: true,
    alias: {
      '@snui/uni-src': fileURLToPath(new URL('./node_modules/@snui/uni/src', import.meta.url)),
    },
  },
});
