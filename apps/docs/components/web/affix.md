# Affix 固钉（Web 端）

`SnAffix` 把内容吸附在视口（或自定义滚动容器）的顶部/底部，滚动回阈值以上时自动释放。props 与语义按 [naive-ui `n-affix`](https://www.naiveui.com/zh-CN/light/components/affix) 1:1 对齐（AGENTS.md §112）。

典型场景：表格吸顶表头、侧边栏固定操作区、长表单的「保存」工具条。

## 实时预览

<Demo name="affix-web-basic" description="吸附在自定义滚动容器顶部的工具条" />

<Demo name="affix-web-position" description="position 为 fixed / absolute 的差异" />

## 基础用法

```ts
import { SnAffix } from '@snui/vue-web'
import '@snui/tokens-web/styles'
```

```html
<SnAffix :trigger-top="80" :top="80">
  <SnButton type="primary">固定在顶部</SnButton>
</SnAffix>
```

`triggerTop` 是**何时**开始吸附，`top` 是吸附后**停在哪里**。两者常取同一个值；只传其中一个时另一个会回退到它：

```html
<!-- 等价写法 -->
<SnAffix :top="80">…</SnAffix>
```

底部吸附用 `bottom` / `triggerBottom`：

```html
<SnAffix :trigger-bottom="0" :bottom="0">…</SnAffix>
```

上下条件可同时生效 —— 只要满足其中之一即视为已吸附。

## 滚动容器

默认监听 `document`。传入 `listenTo` 可指向任意滚动容器：

```html
<SnAffix :listen-to="() => scrollRef" :trigger-top="0" :top="0">…</SnAffix>
```

`listenTo` 接受 `string` 选择器、`HTMLElement` / `Document`，或返回元素的 getter 函数。

## 释放时机

释放是**带滞回**的：一旦吸附，元素会保持吸附，直到滚动位置越过**吸附发生时记录下的滚动位置**，而不是等矩形回到阈值以外。这样避免了阈值边界上的抖动。

## API

### SnAffix Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `listenTo` | `string \| HTMLElement \| Document \| (() => HTMLElement \| Document)` | `document` | 监听的滚动容器 |
| `top` | `number` | `undefined` | 吸附时距视口顶部的偏移 |
| `bottom` | `number` | `undefined` | 吸附时距视口底部的偏移 |
| `triggerTop` | `number` | `undefined` | 顶部吸附的触发阈值；缺省回退到 `top` |
| `triggerBottom` | `number` | `undefined` | 底部吸附的触发阈值；缺省回退到 `bottom` |
| `position` | `'fixed' \| 'absolute'` | `'fixed'` | `fixed` 脱离文档流；`absolute` 保留占位 |
| `offsetTop` | `number` | `undefined` | **@deprecated**，请使用 `triggerTop` |
| `offsetBottom` | `number` | `undefined` | **@deprecated**，请使用 `triggerBottom` |
| `target` | `() => HTMLElement` | `undefined` | **@deprecated**，请使用 `listenTo` |

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 需要吸附的元素 |

### Exposed

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `affixed` | `ComputedRef<boolean>` | 当前是否处于吸附状态 |

## 无障碍

- 包裹层纯布局，不带 role / `aria-*`，插槽内容自身的语义得以保留
- 吸附是「重新定位」而非「重建节点」，因此滚动过程中焦点不会丢失
- 包裹可交互元素（如按钮）时它仍可聚焦、可操作

## 与 n-affix 的差异（§112 future markers）

- 吸附元素的 `z-index` 固定为 `10`。naive-ui 通过主题 token（`boxShadow` / `color` / `width` 等）暴露这些值，SnConfigProvider 尚未建模。
- `position` 逐实例读取，未建模 `n-config-provider` 的全局默认值。

## 相关

- 需要「滚动时固定整块导航」可直接用 [`SnAnchor`](/components/web/anchor) 的 `affix` 属性
