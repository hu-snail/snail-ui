# AUI-UNI-FB-016 — sn-waterfall 在小程序端插槽内容不渲染（函数式组件不可编译为 WXML）

- 状态：FIXED（MP 用 CSS multi-column 降级）
- 组件：`packages/uni/src/components/sn-waterfall/sn-waterfall.vue`
- 类型：渲染缺陷（MP 编译器限制），API 无变更，显式降级（AGENTS.md §85）

## 现场

微信开发者工具实测（uni-demo mp-weixin 构建）：瀑布流页四个 demo 全部只有标题、没有内容。DOM 探针：`.sn-waterfall` 0 个、`.wall-card` 0 个——组件根节点都没渲染出来。

## 根因（编译产物取证）

源码模板 `<ItemNode :node="entry.node" />` 中 `ItemNode` 是 **setup 内的局部函数式组件**（`const ItemNode = (renderProps) => renderProps.node`，用于渲染捕获的插槽 VNode）。classic uni-app MP 编译器无法把这种组件编译为 WXML 子组件：

```text
编译产物 sn-waterfall.js：
  Math||ItemNode();          ← 守卫引用 ItemNode，但 chunk 内没有它的定义/懒加载 import
  <item-node .../> 输出在 WXML
编译产物 sn-waterfall.json：
  usingComponents: {}        ← item-node 从未注册
```

微信运行时对未注册的自定义元素**整树静默丢弃**——WXML 里 `<item-node>` 的内容（即全部插槽条目）不渲染。对照正常组件（sn-tooltip）：`Math||t(); const t = ()=>"../sn-icon/sn-icon.js"` 有懒加载 import + `usingComponents: {"sn-icon": ...}` 注册，成对出现。

H5 / uni-app x 不走这条 WXML 编译路径，所以 H5 预览正常——与 FB-012 同款「只坏在小程序」的漏测形态。该缺陷自 sn-waterfall 引入（0eba4ac5）即存在，非回归。

## 修法

MP 分支（`#ifdef MP`）改用原生 `<slot>` 透传 + CSS multi-column 布局降级：

```vue
<!-- #ifdef MP -->
<view class="sn-waterfall__css-columns" :style="cssColumnsStyle">
  <slot />
</view>
<!-- #endif -->
```

- `column-count` 来自现有 `columnCount` computed（含 `minColumnWidth` 响应式列数），`masonry: false` 时为 1（保持 stacked 语义）。
- `break-inside: avoid` 防止卡片被劈开两列；行距沿用 `--sn-waterfall-row-gap`。
- H5 / App（`#ifndef MP`）维持 JS 放置：最短列优先、懒加载不抖动、增量测量（性能模型不变）。

**显式降级差异**（§85，非 silent）：CSS columns 纵向填充（先填满第一列），不感知条目高度，首列可能先满；无 JS 测量开销。头注释已登记。

## Regression Test

- 现有 51 条 sn-waterfall 测试全过。纯 vue 测试环境无条件编译，两个分支同时渲染；`shows fresh slot content` 测试改用既有 `columnTexts` helper（scoped 到 JS 放置列），并加注释说明为何不能 unscoped 查询 `.entry`。
- 实机验证：微信开发者工具瀑布流页四 demo 渲染出图片墙。

## 编译器契约（跨任务复用）

MP 模板不能渲染「变量持有的 VNode」：函数式组件、`<component :is>`、render 函数返回的 VNode 都不可编译。既有先例：sn-table 自定义单元格（ADR-0005）。凡是「把 slot VNode 捕获到变量再转发渲染」的组件在 MP 端都需要显式降级分支——新增此类组件时必须先问：MP 上这个子树如何渲染？

## Memory Entry（跨项目）

### uni-app MP 不支持函数式/动态组件渲染 VNode 变量 (2026-11-16)
Type: gotcha
**坑**: 组件在微信小程序上整棵子树静默不渲染，H5/uni-app x 正常；编译产物 `usingComponents` 为空但 WXML 引用了自定义元素。
**根因**: MP 编译器把模板编译为 WXML + 注册组件表；函数式组件（setup 内 `const X = (props) => vnode`）与 `<component :is>` 没有对应的 WXML 编译目标，引用直接落空。
**教训**: 跨端组件模板只允许「编译期确定的组件树」；需要转发 VNode 时在 MP 端用原生 `<slot>` 透传 + 布局降级（CSS columns / 静态结构），或 `#ifdef MP` 走文本等降级渲染。
**反模式**: `<FnNode :node="capturedVNode" />`（FnNode 为局部函数式组件）。
**适用范围**: 跨项目（classic uni-app Vue3 MP；uni-app x vapor 另测）。
**对应代码**: packages/uni/src/components/sn-waterfall/sn-waterfall.vue (MP template branch)
