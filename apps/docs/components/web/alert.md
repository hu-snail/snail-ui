# Alert 提示（Web 端）

`SnAlert` 是行内反馈条，用于在页面或区块内持续展示一条需要用户注意的信息。

它始终留在文档流里 —— 与「转瞬即逝、浮层展示」的 Toast 定位不同。

## 何时使用

- 需要持续展示一条与当前区块相关的状态信息（权限不足、配额将满、系统维护）。
- 操作结果需要保留在页面上供用户回看，而不是闪过即消失。
- 需要在页面顶部承载一条可关闭的公告。

不适合：需要用户做出决策时，用 `SnDialog`；只是短暂确认操作成功时，用 Toast 类反馈。

## 代码演示

### 基础用法

五种语义类型的配色与内置图标。

<Demo name="alert-web-basic" description="五种 type 的配色与内置图标" />

### 边框控制

`bordered` 开合对照，无边框形态适合嵌进卡片内部。

<Demo name="alert-web-bordered" description="bordered 开合对照" />

### 自定义图标

通过 `icon` 插槽替换类型自带图形。

<Demo name="alert-web-icon" description="icon 插槽自定义图标，并演示 showIcon 门控" />

### 隐藏图标

`showIcon=false` 时收起图标位，正文回收空间。

<Demo name="alert-web-no-icon" description="showIcon=false 的三种排版" />

### 可关闭与拦截

`closable` 关闭按钮，以及 `onClose` 返回 `false` 时拦截关闭。

<Demo name="alert-web-closable" description="closable 关闭按钮 + onClose 返回 false 拦截关闭" />

### 插槽覆盖

`header` / `icon` / `default` 三个插槽覆盖默认渲染。

<Demo name="alert-web-slots" description="header / icon / default 三个插槽覆盖默认渲染" />

### 滚动公告

在正文插槽内承载一条连续滚动的通知。

<Demo name="alert-web-marquee" description="正文插槽内实现无缝横向滚动公告" />

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `''` | 标题。 |
| `type` | `'default' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | 语义类型，驱动配色与默认图标。 |
| `showIcon` | `boolean` | `true` | 是否显示前置类型图标。 |
| `bordered` | `boolean` | `true` | 是否绘制外边框。 |
| `closable` | `boolean` | `false` | 是否渲染关闭按钮。 |
| `onClose` | `() => unknown` | `undefined` | 点击关闭时调用；返回 `false`（或 Promise\<false\>）可**拦截**关闭。 |
| `onAfterLeave` | `() => void` | `undefined` | 离场过渡结束后调用。 |
| `onAfterHide` | `() => void` | `undefined` | **@deprecated**，请使用 `onAfterLeave`。 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `closeClick` | `()` | 关闭按钮被点击（在 `onClose` 拦截判定 resolve 之前）。 |
| `leave` | `()` | 离场过渡结束，节点已移除。 |

### Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `default` | `()` | 正文内容。 |
| `icon` | `()` | 自定义图标，替代内置类型图标。仍受 `showIcon` 约束。 |
| `header` | `()` | 自定义标题，替代 `title` prop。 |

## 类型与图标

`type` 决定底色、文字色与默认图标：

| `type` | 默认图标 | 用途 |
| --- | --- | --- |
| `default` | 无 | 中性提示 |
| `info` | `Info` | 一般说明 |
| `success` | `Check` | 操作成功确认 |
| `warning` | `AlertTriangle` | 需要注意但不阻塞 |
| `error` | `CircleAlert` | 错误 / 失败 |

`showIcon` 默认 `true`；`type="default"` 时没有内置图标，显式传 `showIcon` 也不会渲染。

## 关闭与拦截

`onClose` 允许异步，并且可以**否决**关闭：返回 `false`（或 resolve 为 `false` 的 Promise）时，提示保持挂载。常见用法是在保存请求进行中先拦住关闭：

```ts
function onClose() {
  if (saving.value) return false // 保存中，先别关
  return true
}
```

节点只在离场过渡结束后才被移除，此时触发 `onAfterLeave` 并 emit `leave`。

> **事件名说明**：自有事件命名为 `closeClick` / `leave`，而非 `close` / `afterLeave`。原因是 Vue 会把 emit 的 `close` 映射到 `onClose` prop 监听器，与显式调用叠加会导致回调双触发。

## 无障碍

- 根元素 `role="alert"`，出现时由屏幕阅读器播报。
- 图标容器 `aria-hidden="true"`（纯装饰；类型信息由文案与播报本身承载）。
- 关闭按钮为真实 `<button type="button">`，带 `aria-label="关闭"`。
- 关闭按钮有 `:focus-visible` 焦点环。

## 主题

组件没有 alert 专属 token，配色直接消费语义 token：`--sn-web-color-feedback-info` / `-success` / `-warning` / `-danger`（类型色，底色由它 12% 混白得来）、`--sn-web-color-background-subtle` / `-surface`、`--sn-web-color-text-primary`、`--sn-web-color-border-default`、`--sn-web-focus-ring`。改主题靠覆盖这些 token。

图标列与关闭按钮的高度固定为首行行盒（`1.6em`），图形在其中水平垂直居中；图形尺寸来自 `SnIcon` 的默认 `size`（16px）。覆盖 `.sn-alert` 的 `font-size` 时行盒高度会同步缩放。

## 已知取舍

- 离场动画使用 CSS 淡出替代高度折叠过渡，保留 `visible` 门控与 `onAfterLeave` 时机契约。
- 全局 `bordered` 默认值未建模，`bordered` 逐实例读取。
