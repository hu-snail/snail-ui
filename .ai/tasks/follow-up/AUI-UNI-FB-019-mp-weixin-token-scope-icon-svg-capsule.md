# AUI-UNI-FB-019 — 微信小程序端组件总览三连修（token 作用域 / SVG 图标 / 胶囊）

任务：`apps/uni-demo` 微信小程序总览页图标空白、组件详情页样式全丢、首页头部被胶囊
遮挡。参照 `apps/uni-demo-x` 的 App 端 `<image>` 方案修复。

## 根因 1：`:root` 在 WXSS 里不存在 → 全部组件 token 失效

**现场**：小程序详情页组件只剩布局（间距/圆角/背景/文字色全丢），H5 正常。
`app.wxss` 里 token 都在 `:root { --aui-* / --sn-mp-* }`。

**根因**：WXSS 的根节点是 `page`，没有 `<html>`；`:root` 规则被静默忽略。`--aui-*`
与 `--sn-mp-*` 均未定义，所有 `var(--sn-mp-*)` 在计算值阶段失效。App.vue 里
demo 自己的 `--demo-*` 恰好写在 `page` 上，所以页面骨架看起来“有样式”，掩盖了
组件库 token 全丢。

**修复**：两个 token 静态样式表与 `renderSnMpStyles()` 的光色块选择器改为
`:root,\npage`——H5 继续命中 `:root`，MP 命中 `page`（自定义属性沿 DOM 继承
进自定义组件）。dark 块仍只挂 `.sn-theme-dark`，不得加 `page` 复合选择器
（uni-h5 postcss 会把含 `page` 的规则无条件提升到 `body`，会污染浅色）。

**回归**：`packages/tokens/src/static-css.test.ts`、
`packages/tokens-mp/src/variables.test.ts` 各加一条断言选择器包含 `page`。

## 根因 2：WXML 没有 `<svg>` 元素 → IconData 图标全空白

**现场**：总览页卡片图标、按钮/导航图标在小程序端是空白盒；控制台报
`Some selectors are not allowed in component wxss ... svg`。

**根因**：uni-app 把模板里的 `<svg>` / `<path>` 原样编译进 WXML，微信将其当作
未知自定义组件（无 `usingComponents` 映射），渲染为空；组件 wxss 里的
`.sn-icon svg` 标签选择器也被 WXSS 拒绝。

**修复**：`sn-icon` 新增 `sn-icon-mp.ts`：
- MP 分支用 `<image mode="aspectFit" :src="iconDataUrl">`，把 IconData 光栅化为
  `data:image/svg+xml;base64,...`（微信无 `btoa`，内置 ASCII base64；base64 比
  `;utf8,` + `encodeURIComponent` 在真机上更稳）。
- data URL 是独立 SVG 文档，`currentColor` / `var()` 无法穿透：挂载后用
  `createSelectorQuery().in(proxy).select('.sn-icon').fields({ computedStyle:
  ['color'] })` 读真实级联色并烘焙；失败保留 `#1a1a1a` ink（绝不空白），
  一次 50ms 重试 + 竞态序号 + 卸载清 timer。
- H5 分支保持 inline `<svg>`；两条分支用 `#ifndef MP` / `#ifdef MP` 条件编译
  二选一，`v-else-if` 链在各自产物里连续。
- `.sn-icon svg` 改为类选择器 `.sn-icon__svg`（svg 与 image 共用），消除 WXSS
  标签选择器告警。

**回归**：`sn-icon-mp.test.ts` 覆盖 data URL 解码、fill/stroke、viewBox 回退、
WXML 安全字符、颜色 reader 的 NodeInfo / 数组 / JSON 三种形态；MP 产物
`sn-icon.wxml` 已人工核对为 `<image>` 且无 `<svg>`。

## 根因 3：首页 `#top` 只认 `--status-bar-height` + 操作区不让位胶囊

**现场**：小程序总览页标题贴状态栏，风格包/语言/主题按钮被右上角胶囊压住。

**根因**：`--status-bar-height` 只在 H5/App 有值，WXSS 中缺失（fallback 0）；
首页也没有为胶囊宽度预留右侧空间。

**修复**：新增共享 `packages/uni/src/utils/capsule.ts`（`getSystemInfoSync` +
`getMenuButtonBoundingClientRect`，MP-WEIXIN 才读胶囊；H5/App 归零）：
- 首页 `#top` 用真实 `statusBarHeight` px 做顶部留白；
- 检测到胶囊时品牌独占首行（`flex: 1 0 100%`），操作区换行到胶囊下方的第二行，
  右对齐到页面边缘；H5 不换行、版式不变。
- `apps/uni-templates` 三个模板页改 import 同一 util，删除重复的
  `src/common/capsule.ts`。

**回归**：`packages/uni/src/utils/capsule.test.ts` 覆盖无系统信息、正常胶囊、
低置胶囊（行高变高）、畸形 rect、缓存。

## 教训

- **跨端设计 token 必须同时声明 `:root` 与 `page`**；只写 `:root` 的样式表在
  MP 端必然“布局在、颜色全丢”。
- **WXML 不是 HTML**：`<svg>` / `<path>` 不是内置元素。图标数据要么转 data URL
  `<image>`，要么 iconfont。`currentColor` 不能跨 image 边界。
- **`--status-bar-height` 在 WXSS 不可用**；自定义导航必须用
  `getSystemInfoSync().statusBarHeight` + 胶囊 rect。
- 只在 H5 验证会漏掉上述三类问题；MP 产物需检查 `app.wxss` 选择器与
  `sn-icon.wxml` 实际标签。
