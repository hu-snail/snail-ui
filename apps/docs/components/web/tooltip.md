# Tooltip 工具提示（Web 端）

`SnTooltip` 是 `@snui/vue-web` 的悬浮提示组件。鼠标移入目标时显示文字提示，移开消失。支持 hover / click / focus 三种触发方式，受控 / 非受控两种状态管理，以及自动 boundary detection + teleport to body。

按 AGENTS.md §112，prop 名 + slot + event 全部对齐 [naive-ui `n-tooltip`](https://www.naiveui.com/zh-CN/light/components/tooltip)。

## 实时预览

<Demo name="tooltip-web-basic" description="基础 hover 触发 + 4 个 placement" />

<Demo name="tooltip-web-controlled" description="受控 (v-model:show) + 点击触发" />

<Demo name="tooltip-web-content-slot" description="content slot 富文本 / 自定义内容" />

## 基础用法

```ts
import { SnTooltip } from '@snui/vue-web'
```

```html
<SnTooltip content="Ideas">
  <button class="sn-fab">💡</button>
</SnTooltip>
```

默认触发方式是 `hover` —— 鼠标进入 trigger 区域显示提示，离开后延迟关闭（默认 100ms 关闭延迟，避免鼠标从 trigger 滑向 popover 时的闪烁）。

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `show` | `boolean \| undefined` | `undefined` | 受控显示状态。`undefined` 走非受控（内部 state）。 |
| `defaultShow` | `boolean` | `false` | 非受控初始状态。 |
| `trigger` | `'hover' \| 'click' \| 'focus' \| 'manual'` | `'hover'` | 触发方式。`'manual'` 关闭所有自动行为，只用 `show` 控制。 |
| `placement` | `'top-start' \| 'top' \| 'top-end' \| ...` | `'top'` | 12 个方向（top/right/bottom/left × start/center/end）。 |
| `delay` | `number \| [number, number]` | `100` | 单一数字 = 开/闭同延迟；数组 = `[open, close]` 非对称延迟。 |
| `arrow` | `boolean` | `true` | 是否显示方向箭头。 |
| `content` | `string` | `''` | popover 文本内容，也可以走 `#content` slot。 |
| `wrapped` | `boolean` | `true` | 是否把 trigger 套一层 `<span>`（默认套，方便接 mouseenter）。设 `false` 时消费方自己写 trigger。 |
| `disabled` | `boolean` | `false` | 完全禁用显示。 |

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | trigger 元素 |
| `content` | popover 内容（覆盖 `content` prop） |

### Events

| 名称 | 载荷 | 触发时机 |
| --- | --- | --- |
| `update:show` | `(show: boolean)` | 显示状态变化（v-model:show） |
| `show` | `()` | 每次显示时触发 |
| `hide` | `()` | 每次隐藏时触发 |

### 模板方法（`ref` 暴露）

```ts
type SnPopoverExposed = {
  show: () => void
  hide: () => void
  isShown: () => boolean
}
```

```html
<SnTooltip ref="tip" content="x">
  <button @click="tip?.show()">×</button>
</SnTooltip>
```

## 无障碍

- popover 容器 `<div role="tooltip">` —— 屏幕阅读器在 trigger focus 后会朗读提示内容
- popover 通过 `<Teleport to="body">` 渲染，避免任何 `overflow: hidden` 父容器把提示裁掉
- popover 默认 `pointer-events: auto`，trigger 和 popover 之间的间隙有 hover bridge，避免鼠标穿过空隙导致 popover 闪烁关闭

## 相关

- [`SnMenu` popButton 模式](/components/web/menu) —— 圆形按钮组里每项都套一个 SnTooltip 显示文字
- [naive-ui n-tooltip](https://www.naiveui.com/zh-CN/light/components/tooltip) —— 参考实现