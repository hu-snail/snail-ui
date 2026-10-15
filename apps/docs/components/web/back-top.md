# BackTop 回到顶部（Web 端）

`SnBackTop` 是滚动超过阈值后浮出的「回到顶部」按钮，点击后带平滑动画滚回容器顶部。props 与语义按 [naive-ui `n-back-top`](https://www.naiveui.com/zh-CN/light/components/back-top) 1:1 对齐（AGENTS.md §112）。

典型场景：长文章页、商品列表页、帮助文档。

## 实时预览

<Demo name="back-top-web-basic" description="滚动超过 200px 后出现，点击滚回顶部" />

<Demo name="back-top-web-control" description="自定义插槽内容 + 受控 show + 不同偏移" />

## 基础用法

```ts
import { SnBackTop } from '@snui/vue-web'
import '@snui/tokens-web/styles'
```

```html
<SnBackTop :right="40" :bottom="40" :visibility-height="200" />
```

滚动位置达到 `visibilityHeight`（默认 `180`，含等于）时按钮出现，退回该阈值以下时隐藏。

## 受控显示

默认不受控 —— 组件自己根据滚动位置决定显隐。传入 `show` 即变为受控，此时滚动位置不再影响显隐：

```html
<SnBackTop v-model:show="visible" />
```

```ts
const visible = ref(false)
```

不受控时，显隐变化会触发 `update:show`（初始测量不会触发，只在挂载后的变化时触发）。

## 滚动容器

默认监听 `document`。指向任意滚动容器用 `listenTo`：

```html
<SnBackTop :listen-to="() => scrollRef" :visibility-height="120" />
```

`listenTo` 接受 `string` 选择器、`HTMLElement` / `Document`，或返回元素的 getter 函数。不传时会自动向上查找最近的可滚动祖先。

## 自定义内容

```html
<SnBackTop>
  <span>顶部</span>
</SnBackTop>
```

`default` 插槽替代内置的箭头图标。

## API

### SnBackTop Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `show` | `boolean` | `undefined` | 受控显隐（`v-model:show`）；不传则由滚动位置驱动 |
| `right` | `string \| number` | `40` | 距视口右侧的距离 |
| `bottom` | `string \| number` | `40` | 距视口底部的距离 |
| `to` | `HTMLElement \| string` | `'body'` | 渲染目标元素，为 API 对齐保留 |
| `visibilityHeight` | `number` | `180` | 滚动超过多少像素后出现 |
| `listenTo` | `string \| HTMLElement \| Document \| (() => HTMLElement \| Document)` | `undefined` | 监听的滚动容器；不传时自动检测最近可滚动祖先 |
| `target` | `() => HTMLElement` | `undefined` | **@deprecated**，请使用 `listenTo` |
| `onUpdateShow` | `(value: boolean) => void` | `undefined` | 显隐变化时调用 |
| `onShow` | `() => void` | `undefined` | **@deprecated**，请使用 `onUpdate:show` |
| `onHide` | `() => void` | `undefined` | **@deprecated**，请使用 `onUpdate:show` |

### SnBackTop Events

| 名称 | 载荷 | 触发时机 |
| --- | --- | --- |
| `update:show` | `boolean` | 不受控模式下显隐发生变化 |

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 自定义按钮内容，替代内置箭头图标 |

### Exposed

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `scrollToTop` | `() => void` | 以编程方式滚回容器顶部 |

## 无障碍

- 渲染真实 `<button type="button">`，带 `aria-label="回到顶部"`，可键盘触发并被屏幕阅读器播报
- `:focus-visible` 绘制可见焦点环
- 用于探测滚动容器的隐藏占位元素为 `display: none` + `aria-hidden="true"`，永不暴露
- 内置箭头为装饰性内容，可访问名称来自 `aria-label`；自定义 `default` 插槽无需自带标签

## 与 n-back-top 的差异（§112 future markers）

- 图标用 lucide 的 `ChevronsUp`，而非 naive-ui 内联的 `BackTopIcon` SVG —— 与本库图标策略一致（同 `SnAlert` 的类型图标处理）。
- 原生内联渲染；naive-ui 生产构建会通过 `VLazyTeleport` 投送到 `to`。`to` prop 为 API 对齐而保留。
- 按钮几何尺寸（`44px` 见方、`22px` 圆角）与 `box-shadow` 为硬编码值，未接入 `BackTopTheme`（`self.width` / `self.height` / `self.borderRadius` / `self.boxShadow`…），SnConfigProvider 尚未建模。
- 未建模 naive-ui 的「锁定 `<html>` 滚动条宽度补偿」（其 `right` 计算中的 `lockHtmlScrollRightCompensationRef`）。
- 未复刻 `fade-in-scale-up-transition` 与首次绘制的 `--transition-disabled` 抑制，改用普通淡出。

## 相关

- [`SnAffix`](/components/web/affix) —— 固定单块内容而非回到顶部
- [`SnAnchor`](/components/web/anchor) —— 页内章节导航
