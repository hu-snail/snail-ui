# 瀑布流 Waterfall · Web（PC 端）

面向图片 / 信息流的 masonry 容器：`default` 槽里的每个直接子节点都会被包进一个
`.sn-waterfall__item` 盒子，盒子再按 **最短列优先** 分配到 N 列中。每列是一个纵向
flex 容器，列内顺序 = 你的数据顺序（先左到右，再逐层往下），不会像 CSS 多列那样
“先填满第一列再进第二列”。

## 何时使用

- 图片墙、卡片墙、商品 / 信息流等**高度参差**的列表
- 希望列数随容器宽度自适应，而不写测量脚本
- 需要**丝滑滚动**：图片懒加载、晚到的图片不应该让整墙重排

## 代码演示

### 基础用法

<Demo name="waterfall-web-basic" description="默认 3 列；v-for 数据驱动，高度参差不齐。" />

### 图片墙 + 懒加载

<Demo name="waterfall-web-image" description="SnImage 作为子项：width/height 预留空间 + lazy 提前一屏预加载，图片晚到只撑高自己那一列。" />

### 响应式列宽

<Demo name="waterfall-web-responsive" description="设置 min-column-width 后列数跟随容器宽度（进入视口后按实测宽度计算）。" />

### 卡片墙与关闭瀑布流

<Demo name="waterfall-web-card" description="SnCard 作为子项；可切列数，也可用 masonry=false 退化为单列堆叠。" />

## API

### SnWaterfall Props

| 名称             | 类型               | 默认值 | 说明                                                                                                                                                     |
| ---------------- | ------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| columns          | `number`           | `3`    | 逻辑列数，取整到 ≥ 1（小数向下取整，0 / NaN / Infinity 回退为 1）。`min-column-width` 模式下作为**测量前的初始猜测**；`masonry=false` 时忽略             |
| min-column-width | `number \| string` | —      | 最小列宽（数字→px，字符串按 px 解析参与列数计算）。设置后列数按**实测容器宽度**计算（响应式模式）；容器宽度尚未测得（SSR / 首屏）时回退为 `columns` 的值 |
| column-gap       | `number \| string` | `16`   | 列间距（数字→px），通过 `--sn-waterfall-column-gap` 输出为该值                                                                                           |
| row-gap          | `number \| string` | `16`   | 子项间距（数字→px），作为每列的 `row-gap` 输出为 `--sn-waterfall-row-gap`                                                                                |
| masonry          | `boolean`          | `true` | 便捷关闭开关：`false` 时退化为普通单列竖向堆叠（子项恢复 `margin-bottom`，与旧版堆叠行为一致）                                                           |

### SnWaterfall Slots

| 名称    | 参数 | 说明                                                                                                    |
| ------- | ---- | ------------------------------------------------------------------------------------------------------- |
| default | `()` | 瀑布流子项；每个直接子节点（含 `<template v-for>` 展开出的每一项）对应一个 `.sn-waterfall__item` 包裹层 |

### 自定义属性（CSS 变量）

| 名称                        | 默认值 | 说明                         |
| --------------------------- | ------ | ---------------------------- |
| `--sn-waterfall-column-gap` | `16px` | 列间距，可覆盖 prop 单独调参 |
| `--sn-waterfall-row-gap`    | `16px` | 子项纵向间距                 |

### 说明

- **naive-ui 没有瀑布流组件**（其导出列表中没有 `n-waterfall`，`n-grid` 只做等高行布局），
  因此本组件不与 naive-ui 做 1:1 对齐，属于 AGENTS.md §112 允许的显式偏离。
- **布局不是纯 CSS 多列了**：列由 JS 按“最短列优先”分配（`waterfall-assign.ts` 为纯函数，
  有独立单测），列内部由浏览器 flex 排版。这样滚动时没有逐帧 JS 定位，图片加载完成也只会
  撑高自己所在的那一列。
- **已放置的子项永不移列**：新增子项只追加到当前最短列，因此追加数据、图片晚到都不会让
  已经在屏幕上的卡片（及其正在进行的图片请求）移动。代价是列与列之间只保证“尽可能短”、
  不保证最优均衡。
- **子项 `key` 即身份**：`v-for` 的 `:key` 决定它属于哪一列；没有 `key` 时退化为按索引，
  此时往中间插入数据会被当作按下标重排 —— 信息流请务必传 `key`。
- **图片建议同时给出 `width` / `height`**：浏览器会在下载完成前预留等高空间，配合懒加载
  可以把布局跳动降到零；不给尺寸时，容器用 `ResizeObserver` 实测高度来分配**后续**子项。
- **无测量环境**（SSR、无 `ResizeObserver` 的旧浏览器）按 round-robin 均分到各列：
  列宽均衡、阅读顺序从左到右，容器退化为静态均衡布局而不是崩掉。
- 容器渲染 `role="list"`，子项包裹层渲染 `role="listitem"`，列包裹层是
  `role="presentation"`（保持 list 对子项的归属关系）；如需其他语义，可通过
  fallthrough attrs 覆盖根节点角色。
- masonry 模式下列间距由列容器的 `row-gap` 提供，**不再保留尾部间距**（容器底部与最后一
  个子项齐平，更适合无限滚动）；`masonry=false` 时保留旧的 `margin-bottom` 行为。

完整契约见组件 `ai-description.md`。
