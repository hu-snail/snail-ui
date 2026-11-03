# 0007 — 图表能力：新增 `@snui/echarts` 集成层包（基于 Apache ECharts）

## Status

Accepted（Human 直接指令：在 `packages/` 下新增 echarts 包，基于 echarts 深度集成二开）

## Date

2026-11-03

## Context

`@snui/vue-web` 是 naive-ui 对齐的原子组件库（§112），提供了一个手工实现的
`SnHeatmap`（AUI-WEB-DD-008）。热力图之外，业务侧还需要折线 / 柱状 / 饼 /
雷达 / 仪表盘 / 地图等完整图表能力。参考库 naive-ui 没有图表组件，WBS 里也
没有图表条目，因此这不是「补齐参考库缺口」，而是**新增一条产品线**。

用户诉求（原文要点）：

1. 在 `packages/` 下新建 echarts 包，**基于 echarts 做深度集成二开**；
2. 使用该组件的项目依赖 echarts 插件（peer），同时依赖 snail-ui 的 vue-web；
3. 支持**主题色配置**（跟随 token 体系，而不是各业务自己写死颜色）；
4. **图标配置一体化** —— 图例 / 系列符号 / 工具箱图标在一处配置；
5. 支持**布局配置**（内边距、图例位置、标题、dataZoom、坐标轴开闭）；
6. 支持**深度自定义**，包括 tooltip 这类工具（默认工具提示要能换成自己的）。

## Options

1. 把图表组件下沉进 `@snui/vue-web` —— 拒绝：vue-web 是 naive-ui 对齐的原子
   组件库（§112），echarts 不在其参考库内；而且 charts 需要 echarts 作为
   peer 依赖，把一个可选的大依赖塞进原子库会污染所有消费者的依赖树；
2. 塞进 `@snui/templates` —— 拒绝：templates 是页面模板粒度，图表是可复用
   能力层，与模板的发布节奏与样式管线都不同；
3. 新增 `@snui/echarts` 包 —— **采纳**：与 `@snui/layout` 同级的组装层包，
   依赖方向 `echarts → vue-web → tokens`，无环。

## Decision

- 包名 `@snui/echarts`（目录 `packages/echarts`），组件前缀 `Sn*`：核心导出
  `SnChart`（`SnChart.vue`），插件默认导出 `SnUIECharts`；
- **echarts 是 peerDependency**（`^5.6.0 || ^6.0.0`），devDependency 装
  `echarts@^5.6.0` 供本包自测；`vite.config.js` 把 `vue` /
  `@snui/vue-web` / `echarts`（含 `echarts/*` 子路径）全部 external，宿主
  拥有 echarts 版本、模块注册与最终体积；
- 双入口：
  - `@snui/echarts` — Vue 层（`SnChart` + install 插件 + core 再导出）；
  - `@snui/echarts/core` — **框架无关层**（theme / layout / icons /
    tooltip / option 合并），运行时不 import Vue、不 import echarts
    （echarts 仅 `import type`），可被 Node 侧 option 生成器复用；
- **主题**（`theme.ts`）：把 `--sn-web-*` 令牌翻译成 ECharts theme 对象。
  两种取色来源：
  - `colorSource: 'tokens'`（组件默认）—— 颜色是 `var(--sn-web-*)` 引用，
    画布按元素级联解析，`<html data-theme>` 或 Style Pack 切换后无需重建
    option 即重绘；
  - `colorSource: 'resolved'` —— 用 `resolveTokenColors()` 从 DOM 级联读出
    字面量，用于导出图片 / SSR / 非 DOM 宿主。
  暴露 `theme` prop（`palette` / `colorPrimary` / `colorSuccess` /
  `colorWarning` / `colorDanger` / `colorInfo` / 文本色 / 字体 / 字号 /
  `themeOverrides` 逃生口）；
- **布局**（`layout.ts`）：5 个预设 `default` / `compact` / `spacious` /
  `fullscreen` / `minimal`，`layout` prop 接预设名**或**局部配置对象
  （对象从 `default` 起步，只覆盖给出的字段）；
- **图标**（`icons.ts`）：内置一组**填充型** `path://` 字形（图表类型 +
  工具箱动作 + 通用符号），并支持宿主 `registerChartIcons()` 注册
  `path` / `svg` / `image`。`icons` prop 一处配置 `legend` / `symbol` /
  `toolbox` / `seriesType` / `title`；
- **tooltip**（`tooltip.ts` + `SnChart.vue`）：默认渲染**组件自己的 DOM
  tooltip**（token 样式、跟随宿主字体与主题、支持 `tooltip` slot 完全接管），
  同时把 ECharts 自带 tooltip 关掉；`tooltip.mode: 'native'` 回退到 ECharts
  原生 tooltip（仅套主题 + 统一文本 formatter）；
- 包标记 `@experimental`（§79），Public API 未冻结。

## Reason

- 把「取色 — 布局 — 图标 — 提示」抽象成四个纯函数模块，是因为它们都能被
  非 Vue 场景复用（AI 生成 option、构建期出图、Studio 预览）；Vue 层只负责
  实例生命周期与 DOM。这也让 §112 的「参考库」约束自然落在「对齐 ECharts
  自身的 option 契约」上，而不是去抄另一个 UI 库的图表 API；
- echarts 走 peer 是体积与版本控制的必然：包装层 41.5KB（core，含全部预设
  与字形）远小于 echarts 本体，把 echarts 塞进 dependency 会让每个消费者
  都无法 tree-shake 自己的图表模块集。

## Trade-offs

- **主题按 init 绑定**：ECharts 的 `setTheme` 私有且已废弃，因此 `theme`
  或主题模式变化时组件 dispose + 重新 init（`colorSource: 'tokens'` 下
  纯色值变化不需要重建，因为 CSS 变量由级联解析）；
- **tooltip 不走 Teleport**：DOM tooltip 留在图表容器内，好处是继承容器的
  CSS 级联、不会被容器 `overflow: hidden` 裁掉；代价是极端位置的浮层可能
  被容器边界约束（`offset` + `followPointer` 可调）；
- **描边式（stroke）图标不能直接用**：ECharts 画填充路径，故内置字形全部是
  填充型；`svgToPathData()` 只收几何标签（path / circle / ellipse / rect /
  polygon / polyline），渐变、滤镜、`<use>`、文本一律丢弃（填充错误的图形
  比不画更糟）；
- **测试用 SVG renderer**：happy-dom 无 canvas 2D 上下文，组件测试以
  `renderer: 'svg'` 跑；canvas 路径在真实环境覆盖（导出 PNG/JPG）。

## Consequences

- 文档站 / `apps/` 的图表接入属于 follow-up，不在本任务；
- 后续如要支持 uni-app 端图表，必须另开包并复用 `core` 层（`@snui/uni`
  不能 import `@snui/echarts` 的 Vue 层，§59 平台边界）；
- `SnHeatmap` 保持现状（naive-ui 对齐 + 零依赖），与 `@snui/echarts` 的
  关系是：热力图是原子展示组件，本包是图表引擎集成层，二者不互相替代。