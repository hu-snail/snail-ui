# 瀑布流 Waterfall · Web（PC 端）

槽位驱动的瀑布流（masonry）容器：`default` 槽里的每个直接子节点都会被包进一个
`.sn-waterfall__item` 盒子，盒子按 CSS 多列布局分配到 N 列中。每一列独立打包，
所以短列不会在高个子项旁边留下空洞（行布局 / grid 会遇到的问题）。

## 何时使用

- 卡片墙、图片墙、商品 / 信息流等**高度参差**的列表
- 希望列数随容器宽度自适应，而不写一行测量脚本
- 不需要「按行对齐」的栅格，只需要「按列填充」的排列

## 代码演示

### 基础用法

<Demo name="waterfall-web-basic" description="默认 3 列；v-for 数据驱动，高度参差不齐。" />

### 响应式列宽

<Demo name="waterfall-web-responsive" description="设置 min-column-width 后改用 column-width，列数跟随容器宽度。" />

### 卡片墙与关闭瀑布流

<Demo name="waterfall-web-card" description="SnCard 作为子项；可切列数，也可用 masonry=false 退化为单列堆叠。" />

## API

### SnWaterfall Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| columns | `number` | `3` | 逻辑列数，输出为 `column-count`；会取整到 ≥ 1 的整数（小数向下取整，0 / NaN / Infinity 回退为 1）。设置 `min-column-width` 或 `masonry=false` 时忽略 |
| min-column-width | `number \| string` | — | 最小列宽（数字→px，字符串原样）。设置后容器改用 `column-width` 而**不是** `column-count`，列数跟随可用宽度（响应式模式），此时 `columns` 被忽略 |
| column-gap | `number \| string` | `16` | 列间距（数字→px），通过 `--sn-waterfall-column-gap` 输出为 `column-gap` |
| row-gap | `number \| string` | `16` | 子项间距（数字→px），作为每个子项盒子的 `margin-bottom` 输出为 `--sn-waterfall-row-gap` |
| masonry | `boolean` | `true` | 便捷关闭开关：`false` 时退化为普通单列竖向堆叠（不输出多列布局相关的 `column-count` / `column-width`） |

### SnWaterfall Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| default | `()` | 瀑布流子项；每个直接子节点（含 `<template v-for>` 展开出的每一项）对应一个 `.sn-waterfall__item` 包裹层 |

### 自定义属性（CSS 变量）

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `--sn-waterfall-column-gap` | `16px` | 列间距，可覆盖 prop 单独调参 |
| `--sn-waterfall-row-gap` | `16px` | 子项纵向间距 |

### 说明

- **naive-ui 没有瀑布流组件**（其导出列表中没有 `n-waterfall`，`n-grid` 只做等高行布局），
  因此本组件不与 naive-ui 做 1:1 对齐，属于 AGENTS.md §112 允许的显式偏离。
  布局手法沿用本仓库文档自己的 demo 卡片墙（`apps/docs/.vitepress/utils/demo-grid.ts` +
  `apps/docs/.vitepress/theme/custom.css` 第 13 节），即 CSS 多列布局。
- 零 JS 测量：不使用 `ResizeObserver`，不监听滚动，窗口变化时由浏览器自行重排；
  代价是子项按**列序**填充（先填满第一列再进第二列），而非自上而下的行序。
- 容器渲染 `role="list"`，子项包裹层渲染 `role="listitem"`；如需其他语义，可通过
  fallthrough attrs 覆盖根节点角色。
- 最后一个子项同样保留 `row-gap` 的底部外边距（与仓库 demo 卡片墙一致，便于追加子项时高度不跳变）；
  需要贴底时可设 `row-gap="0"`。

完整契约见组件 `ai-description.md`。