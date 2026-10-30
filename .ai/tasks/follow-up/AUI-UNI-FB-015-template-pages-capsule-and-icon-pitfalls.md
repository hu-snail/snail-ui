# AUI-UNI-FB-015 — 模板页三个恢复（商城 / 商品详情 / 图文详情）踩坑记录

任务：`apps/uni-templates/src/subpages/{mall,goods,article}.vue` 按设计稿 1:1 还原，
根组件统一 sn-paging，微信小程序端让位右上角胶囊。

Commit：`3e36afb`（feature/v3-foundations-and-style-packs）

---

## 根因 1：Vite 预打包缓存陈旧 → 运行时 `does not provide an export named 'X'`

**现场**：H5 dev server 打开 `/subpages/mall`、`/subpages/goods` 报
`SyntaxError: The requested module '/node_modules/.vite/deps/@snui_uni-src_components_sn-icon_sn-icon-set.js?v=edaee6b6'
does not provide an export named 'Share2' / 'MapPin' (at mall.vue:28:2)`，
但 `pnpm build:h5` / `build:mp-weixin` 都通过，源文件里这些导出确实存在。

**根因**：`vite.config.ts` 把 `@snui/uni-src` 别名指向 **工程内 node_modules 里的 workspace
symlink**（`preserveSymlinks: true`，为了让 MP 端 chunk 命名落在工程内）。这个路径位于
`node_modules` 下，因此 Vite 的 optimizeDeps 会把它当依赖**预打包**进
`node_modules/.vite/deps/`。该缓存不随**源文件变更**失效 —— 只有依赖清单变化或
`--force` 才重建。于是 `packages/uni/src/components/sn-icon/sn-icon-set.ts` 新增/改动导出后，
dev server 仍在用旧快照，纯 TS 转译（esbuild）不回查命名导出，浏览器才在运行时抛错；
生产构建走 Rollup 会真正解析导出，因此构建期反而能立刻发现（本次即靠 build 发现 3 个
不存在的导入：`CirclePlay` / `ThumbsDown` / `Share2` 归属误判）。

**教训（跨 monorepo + Vite / 同类型工程通用）**：
- 别名指向 `node_modules` 内的 workspace 源 → Vite 必然预打包，源码变更不会自动失效；
- **dev 报“找不到导出”而 build 通过 = 先怀疑预打包缓存**，不是先改代码；
- 判断方法：比对 bundle 里的 `?v=` 哈希是否变化；`rm -rf node_modules/.vite` 后重启即恢复。

**反模式**：在 dev 报错后逐个把 named import 换成默认导入 / 内联图标数据来“绕开”。

**对应代码**：
- `apps/uni-templates/package.json`（`predev:h5` / `predev:mp-weixin` 前置清理缓存）
- `apps/uni-templates/vite.config.ts`（`@snui/uni-src` 别名 + `preserveSymlinks`）

**遗留**：predev 清理是工程级权宜（每次 dev 启动多几秒优化时间）。根治方向是让
optimizeDeps 排除该别名（Vite `optimizeDeps.exclude` 对子路径 specifier 的匹配语义需先验证），
或把别名指向 `node_modules` 之外的路径并同步修 MP chunk 命名 —— 需与 ADR-0005 一起评估。

---

## 根因 2：`IconData` 只渲染 `<path d>`，非 path 图元必须折算

**现场**：补 lucide 图标时直接拷贝上游 `__iconNode`，其中 `circle` / `rect` / `polygon`
元素（如 Sun 的圆心、Bike 的车轮、LayoutGrid 的四个圆角矩形、CirclePlay 的三角）在
`sn-icon.vue` 里**渲染不出来** —— 组件模板是 `<path v-for="(d, i) in icon.paths" :d="d" />`，
`IconData.paths` 只接受 path 的 `d` 字符串。

**根因**：`IconData = { viewBox?: string; paths: string[] }` 是为 tree-shaking 与
MP data-URL 形态收敛过的窄接口（§32/§113.3），不支持任意 SVG 子元素。

**教训**：从 lucide 取图标必须把图元折算成等效 path：
- `circle(cx,cy,r)` → `M{cx-r},{cy}a{r},{r} 0 1,0 {2r},0a{r},{r} 0 1,0 {-2r},0`
- `rect(x,y,w,h,rx)` → 圆角矩形 path（rx=0 时直角 path）
- `polygon(points)` → `M{p0}L{p1}…Z`（注意 lucide 的 points 是空格分隔的坐标对，
  按空白切分会得到 2N 个数字，需两两成对）

**反模式**：把非 path 图元塞进 `paths` 数组（H5 静默丢图元、MP 图片直接缺形状）。

**对应代码**：`apps/uni-templates/src/common/icons.ts`（24 个新图标全部为纯 path）

---

## 未完成：像素级可视验收

本会话无浏览器自动化工具（`mcp__node_repl__js` 不可用），三页只做了
**构建期 + dev 模块解析 + MP 产物静态校验**，未做截图比对。复核方式见
Task Completion Report 的 Validation 小节。
