# 0008 — `@snui/admin-layout`：多布局风格（按布局独立入口 + 共享件 + 按需样式）

## Status

Accepted（Human 直接指令：新增 `classic` 经典企业后台布局风格；要求「每种布局 = 独立入口 +
独立样式文件、按需加载」，且各风格复用同一批共享件）

## Date

2026-11-03

## Context

ADR-0006 建立了 `@snui/admin-layout`：**单入口** barrel（`src/index.ts` → `dist/index.js`）
+ **单一样式表**（`assetFileNames` 把 SFC 样式固定输出成 `dist/styles/index.css`），
`SnProLayout` 提供 side / top / mix / dual 四形态壳。

新需求：

1. 新增第二种布局风格 `classic`（经典企业后台）：左侧栏 = 顶部品牌 + 「菜单分类 + 子菜单」
   + 底部用户卡片；右侧 = 浅色通屏内容区，顶部通栏放面包屑 + 模块大标题，右上角
   搜索 / 消息通知 / 宿主动作插槽；侧栏可折叠；
2. 布局风格**不止一种**，且要求**每种风格是独立入口 + 独立样式文件，按需加载**——
   只引一种风格时，产物里不应带上另一种风格的壳与样式；
3. 多种风格**复用共享件**（logo / 菜单检索 / 消息通知 / 用户卡片），差异只在「壳」。

约束：additive（不改既有公开导出名、不移动既有文件）；消费方 `apps/admin-basic`
（`SnProLayout` + `@snui/admin-layout/styles`）与 `apps/docs`（`/styles` + 6 个 demo）必须
继续可用；包边界不变（ADR-0006：不做鉴权 / 请求 / store / 路由注册）。

## Options

1. **单入口 + 全量样式**（只加组件，不做入口拆分）——最省事，但违背「按需加载」诉求：
   引 classic 也会带上四形态壳与设置抽屉的代码和样式；
2. **一次构建、多个 `lib.entry` + `cssCodeSplit: true`**——JS 能按入口分割，但 Rollup 会把
   多个入口共享的模块提升到**共享 chunk**，其 CSS 也一并进共享样式表；于是
   `styles/pro-classic.css` 会**静默缺少**共享件（logo / 搜索 / 通知 / 用户卡片）的规则，
   表现为「样式部分失效」这类难查的问题；
3. **每个入口一次独立构建**（`scripts/build-entries.mjs` 逐入口调用 `vite build()`，
   `cssCodeSplit: false`），并保留 barrel 入口产出全量样式。

## Decision

采用方案 3：

- 新增 `classic` 风格：`src/pro-classic/SnProLayoutClassic.vue` + `sn-pro-classic-types.ts`
  + `index.ts`（子入口）+ `ai-description.md`；
- 新增共享件：`src/pro-search/SnProSearch.vue`、`src/pro-notice/SnProNotice.vue`、
  `src/pro-user/SnProUser.vue`，以及纯函数 `src/menu/sn-menu-search.ts`
  （`searchMenuOptions`）；
- `src/pro-layout/index.ts` 作为既有四形态壳的独立入口（文件不移动、不重命名）；
- `vite.config.js` 改为 `layoutEntryConfig({ entry, entryName, cssFile, emptyOutDir })`
  工厂 + `layoutEntryConfigs` 表；`scripts/build-entries.mjs` 对每个入口各跑一次
  `build()`（`configFile: false` + `root`）；
- `package.json` `exports` 新增 `./layouts/standard`、`./layouts/standard/style.css`、
  `./layouts/classic`、`./layouts/classic/style.css`；`.` 与 `./styles` 原样保留（向后兼容）；
- 产物：`dist/index.js` + `dist/styles/index.css`（全量，barrel）、
  `dist/pro-layout/index.js` + `dist/styles/pro-layout.css`、
  `dist/pro-classic/index.js` + `dist/styles/pro-classic.css`。

## Reason

方案 2 的核心风险不是体积而是**正确性**：共享模块被提升后，单风格样式表会缺少共享件规则，
且这种缺失只在运行时表现为局部样式错乱，很难在构建日志里发现。逐入口独立构建让每张
`style.css` **自包含**（经产物核对：`pro-classic.css` 含 logo / search / notice / user /
classic 规则、不含 header / sider / tabbar / settings；`pro-layout.css` 反之），
语义简单、可验证。

## Trade-offs

- **共享件按入口重复**：每个子入口是独立 JS 产物（无共享 chunk），两种风格同时引入时
  共享件各存一份。只引一种风格时零成本；因此在 README 与文档站写明「两个都用 → 引
  barrel + 全量样式更划算」；
- **构建时间 ≈ 入口数 × 单次**（当前 3 个入口，实测 12.4s + 1.7s + 2.0s）；
- **程序化 build 必须 `configFile: false`**：否则 Vite 会自动加载 `vite.config.js`，
  与传入的配置叠加导致 `@vitejs/plugin-vue` 注册两次，编译产物被二次解析并报
  `At least one <template> or <script> is required in a single file component`。
  该行是「载重件」，不是可有可无的清理；
- **`classic` 不做设置抽屉**：四形态卡片对单形态壳无意义，`showSettings` 系 props 不进
  classic（Out of scope；将来若需要，另设经典风格自己的偏好面板）；
- 未做：admin-basic 切换到新风格、英文 demo 影子、真实换肤、其它新风格。

## Consequences

- 公开面新增：`SnProLayoutClassic` / `SnProSearch` / `SnProNotice` / `SnProUser` /
  `searchMenuOptions` 及类型；既有导出名与 `@snui/admin-layout/styles` 语义不变；
- 文档站新增「布局风格」章节（zh + en）：按风格的结构表、独立引入与样式加载示例、
  live demo（`pro-layout-web-classic` / `pro-layout-web-search`）；
- 测试：新增 `sn-menu-search` / `SnProSearch` / `SnProNotice` / `SnProUser` /
  `SnProLayoutClassic` 共 5 个文件，包内由 7 文件 76 测试 → 12 文件 167 测试；
- 后续新增布局风格的成本 = 一个 `src/pro-<style>/` 目录 + 入口表里加一行；共享件复用，
  差异只在壳。
