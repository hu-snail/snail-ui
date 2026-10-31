import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import uniPlugin from '@dcloudio/vite-plugin-uni';

// 该版本的 CJS 产物没有 __esModule 标记，ESM 互操作会把整个导出对象当
// default，真正的插件工厂挂在 .default 上 —— 两种形态都兼容。
const uni =
  (uniPlugin as unknown as { default?: () => unknown }).default ??
  (uniPlugin as unknown as () => unknown);

export default defineConfig({
  // GitHub Pages 项目站部署时由 CI 注入（如 /snail-ui/）；本地默认根路径。
  // 小程序端不感知 base；H5 路由 base 由 scripts/build-h5.mjs 写入 manifest。
  base: process.env.UNI_H5_BASE || '/',
  plugins: [uni()],
  // @snui/uni-src 必须排除出依赖预构建：esbuild 会把包内纯 JS 模块
  // （sn-icon-registry / sn-icon-set 等）收进 .vite/deps 生成第二份模块实例，
  // 而 .vue 组件（sn-input → sn-icon）走源码相对导入——demo 的
  // registerSnIcons 写进预构建副本、组件从源码副本解析，注册表必然 miss，
  // string 图标全部渲染成空盒。排除后两端走同一条源码 URL，实例唯一。
  optimizeDeps: {
    exclude: ['@snui/uni-src', '@snui/templates-src'],
  },
  resolve: {
    // MP 构建的 chunk 命名按 inputDir 相对路径计算（uni-mp-vite
    // createChunkFileNames），模块 id 落在工程外会生成 `../` 非法 pattern。
    // 因此 @snui/uni-src 指向工程内的 workspace symlink 路径，并保留 symlink
    // 不解析为真实路径（packages/uni 物理上在本工程之外）。
    preserveSymlinks: true,
    alias: {
      // demo 源沿用的两个包源别名（与 apps/docs 相同定义），
      // 使 fork 进来的 demo 源码零改写即可在真实 uni 编译器下构建。
      '@snui/uni-src': fileURLToPath(new URL('./node_modules/@snui/uni/src', import.meta.url)),
      '@snui/templates-src': fileURLToPath(
        new URL('./node_modules/@snui/templates/src', import.meta.url),
      ),
    },
  },
});
