# Alert 提示（Web 端）

`SnAlert` 是 `@snui/vue-web`（PC 桌面端）的行内反馈条。五种语义类型（`default` / `info` / `success` / `warning` / `error`）、可关闭、支持异步关闭拦截，props 与语义按 [naive-ui `n-alert`](https://www.naiveui.com/zh-CN/light/components/alert) 1:1 对齐（AGENTS.md §112）。

它始终留在文档流里 —— 与「转瞬即逝、浮层展示」的 Toast 定位不同。

## 实时预览

<Demo name="alert-web-types" description="五种 type 的配色与内置图标" />

<Demo name="alert-web-title-bordered" description="title + bordered=false 的裸样式对照" />

<Demo name="alert-web-closable" description="closable 关闭按钮 + onClose 返回 false 拦截关闭" />

<Demo name="alert-web-slots" description="header / icon / default 三个插槽覆盖默认渲染" />

## 基础用法

```ts
import { SnAlert } from '@snui/vue-web'
import '@snui/tokens-web/styles'
```

```html
<SnAlert type="warning" title="注意">
  磁盘剩余空间不足 10%，请及时清理。
</SnAlert>
```

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

```html
<SnAlert type="info" closable @close-click="onClick">
  这条提示可以被关闭。
</SnAlert>
```

`onClose` 允许异步，并且可以**否决**关闭：返回 `false`（或 resolve 为 `false` 的 Promise）时，提示保持挂载。常见用法是在保存请求进行中先拦住关闭：

```ts
function onClose() {
  if (saving.value) return false // 保存中，先别关
  return true
}
```

节点只在离场过渡结束后才被移除，此时触发 `onAfterLeave` 并 emit `leave`。

> **事件名说明**：`onClose` / `onAfterLeave` 是按 §112 必须保留的 prop 名。为确保这两个回调只触发一次，对应的自定义事件命名为 `closeClick` / `leave`（Vue 会把 emit 的 `close` 映射到 `onClose` prop 监听器，与显式调用叠加会导致双触发）。

## 自定义内容

```html
<SnAlert type="success" :show-icon="false">
  <template #header>部署完成</template>
  共 <strong>12</strong> 个服务已更新到 <code>v1.4.0</code>。
</SnAlert>
```

- `header` 插槽替代 `title` prop
- `icon` 插槽替代内置的类型图标
- `default` 插槽为正文内容

## API

### SnAlert Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `''` | 标题 |
| `showIcon` | `boolean` | `true` | 是否显示前置类型图标 |
| `type` | `'info' \| 'warning' \| 'error' \| 'success' \| 'default'` | `'default'` | 语义类型，驱动配色与默认图标 |
| `bordered` | `boolean` | `true` | 是否绘制外边框 |
| `closable` | `boolean` | `false` | 是否渲染关闭按钮 |
| `onClose` | `() => unknown` | `undefined` | 点击关闭时调用；返回 `false`（或 Promise\<false\>）可**拦截**关闭 |
| `onAfterLeave` | `() => void` | `undefined` | 离场过渡结束后调用 |
| `onAfterHide` | `() => void` | `undefined` | **@deprecated**，请使用 `onAfterLeave` |

### SnAlert Events

| 名称 | 载荷 | 触发时机 |
| --- | --- | --- |
| `closeClick` | `()` | 关闭按钮被点击（在 `onClose` 拦截判定 resolve 之前） |
| `leave` | `()` | 离场过渡结束，节点已移除 |

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 正文内容 |
| `icon` | 自定义图标，替代内置类型图标 |
| `header` | 自定义标题，替代 `title` prop |

## 无障碍

- 根元素 `role="alert"`，出现时由屏幕阅读器播报
- 图标容器 `aria-hidden="true"`（纯装饰；类型信息由文案与播报本身承载）
- 关闭按钮为真实 `<button type="button">`，带 `aria-label="关闭"`
- 关闭按钮有 `:focus-visible` 焦点环

## 与 n-alert 的差异（§112 future markers）

- n-alert 的离场动画是 `NFadeInExpandTransition`（高度折叠）。本实现保留 `visible` 门控与 `onAfterLeave` 时机契约，但用 CSS 淡出替代，不引入 naive-ui 内部 transition 模块。
- `n-config-provider` 下发的全局 `mergedBordered` 暂未建模，`bordered` 逐实例读取（SnConfigProvider 尚未暴露全局 bordered 默认值）。

## 相关

- 与 [`SnCard`](/components/web/card) 搭配可做页面级通知区；表单校验失败常用 [`SnForm`](/components/web/form) 自带反馈
