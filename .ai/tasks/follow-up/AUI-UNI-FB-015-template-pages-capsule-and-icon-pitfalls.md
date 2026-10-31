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

---

## 根因 4：页面 `class` 挂在 snui 组件根节点 → 小程序端样式全丢

**现场**：模板页给 `<SnCell class="goods-card">`、`<SnProgress class="xxx">`
等组件根节点挂页面 class 并在页面 `<style>` 里写规则。H5 端正常（Vue scoped
CSS 会把父作用域 id 打到子组件根节点），微信小程序端整条规则失效。

**根因**：mp-weixin 产物组件 json 无 `styleIsolation`（默认 `isolated`），页面
wxss 与组件内部节点隔离；页面 class 无论是直接 `class` 还是组件转发的
`custom-class`，其样式声明都留在页面 wxss 里，够不到组件内部/根节点。
uni-demo 全库 0 处 `class` 挂组件、995 处 `custom-class`/`custom-style` 的
约定即由此而来。

**教训**：

- 跨端样式定制走 `custom-style`（内联样式，不受 wxss 隔离影响），或组件
  暴露的 CSS 变量令牌（`--sn-mp-*`，随 custom-style 下发后向内级联）。
- 需要改组件内部文字颜色时用令牌（如 `--sn-mp-color-text-primary`），不要
  用 `custom-title-class` + 页面 CSS —— 同样过不了隔离。

**反模式**：`<SnCard class="my-card">` + 页面样式表 `.my-card { ... }`。

**适用范围**：所有 uni-app 多端项目（小程序端）。

**对应代码**：apps/uni-templates/src/subpages/{mall,goods,article}.vue（已修）；
遗留：`subpages/address.vue:34`、`subpages/form.vue:47` 仍是 `class` 挂
`<SnButton>`（先于本任务存在，待单独 task 修复）。

---

## 根因 5：设计稿图标系统是 Material 实心字形，`IconData` 原本只能描边渲染

**现场**：三个设计稿（商城 / 商品详情 / 图文详情）全部使用 Material Symbols
（HTML 里 `material-symbols-outlined`，金刚区另加 `FILL 1`）。模板最初用
lucide 近似字形 + `SnIcon` 默认描边渲染，tabbar/金刚区与设计稿明显不符。

**根因**：`IconData` 只有 `viewBox` + `paths`，`SnIcon` 固定
`fill="none" + stroke`。Material 字形的 path 是**实心轮廓面**，描边渲染会
画出双线空壳。已为 `IconData` 增加**可选** `render: 'stroke' | 'fill'`
（默认 `'stroke'`，存量图标零变化），uni-x 补丁同步按 fill 生成 data URL。

**教训**：接到"图标不像"先确认设计稿的图标**系统**（字体族 + FILL 轴），
再决定是换数据还是换渲染模式；字形近似替代解决不了系统性偏差。

**对应代码**：packages/uni/src/components/sn-icon/sn-icon.vue（IconData.render）
、apps/uni-templates/src/common/material-icons.ts（设计稿字形集，命名 =
设计稿 glyph 名）。

## 根因 6：sn-tabbar-item 激活色只染文字、图标尺寸硬编码 44px

**现场**：页面传 `active-color="#1b1b1c"` 后标签变深色，图标仍是主题蓝
（`--sn-mp-color-action-primary`）；且图标视觉上比设计稿大一倍。

**根因**：
1. 解析出的激活/未激活色只内联在 `<text>` 上，图标（`currentColor` 描边）
   继承的是根节点的令牌色 → 已改为把颜色内联到 item 根节点，图标随
   `currentColor` 一并解析。
2. 图标 `:size="44"` 是数字 → `SnIcon` 按 **px** 解释；750 画布下应为
   48rpx（= 24px）。回归测试守住了「必须 rpx」。

**对应代码**：packages/uni/src/components/sn-tabbar/sn-tabbar-item.vue。

## 根因 7：sn-cell-group 缺 box-sizing，width:100% + 内联 padding 溢出视口

**现场**：商品详情履约卡在 group 上内联 `margin + padding` 后，卡片右缘
冲出屏幕，行内容贴边（用户截图"右侧没有间距"）。

**根因**：`.sn-cell-group { width: 100% }` 无 `box-sizing: border-box`，
页面传入 padding 后内容盒 = 100% 宽 → 整体超出视口。已补 `border-box`
（与 sn-cell 一致）；页面侧把 margin/圆角/阴影移到外层壳 view，group 只
管承载行。

**对应代码**：packages/uni/src/components/sn-cell/sn-cell-group.vue；
apps/uni-templates/src/subpages/goods.vue（.goods-fulfil 壳）。

## 附带修复

- `sn-tabs` 激活横条颜色曾固定 `--sn-mp-color-action-primary`，`color`
  prop 只染文字 → 横条现跟随 `color`（空值回落令牌）。
- 页面误用 `custom-title-class` 设标题**列宽**（该 class 落在标题文字上 →
  "选择"竖排折行）→ 改用组件契约 `title-width`。
- 设计稿履约/SKU 行的省略与不收缩（`truncate` + `shrink-0`）已在页面样式
  落实：`.goods-row__value--ellipsis`、SnTag `flex-shrink: 0`。
