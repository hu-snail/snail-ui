# Dialog 对话框（Web 端）

`SnDialog` 是对话框的**面板** —— 一张带标题、类型图标、正文与底部按钮行的卡片。props 与语义按 [naive-ui `n-dialog`](https://www.naiveui.com/zh-CN/light/components/dialog) 1:1 对齐（AGENTS.md §112）。

典型场景：二次确认、危险操作告警、结果反馈。

## 面板不是遮罩：这个边界很重要

naive-ui 把「对话框」拆成两层：

| 层 | 上游实现 | 本库 |
|---|---|---|
| **卡片**（标题 / 正文 / 按钮） | `n-dialog` | ✅ `SnDialog` |
| **遮罩**（modal mask、`VLazyTeleport`、焦点陷阱、`width`、滚动锁） | `useDialog()` → `DialogProvider` | ⏳ 独立 WBS 项 |

所以 `SnDialog` 自身：

- 根元素是 `aria-modal="false"` —— 它不持有遮罩与焦点陷阱，声称模态是错的。
- 没有 `width` / `max-height` / 滚动容器 —— 这些在上游位于 provider/overlay 包装层。
- 没有 `show` / `onUpdate:show` —— 可见性归宿主 overlay 管，与上游 `show` 挂载在 dialog *reference* 上一致。

你可以把它直接丢进任意 overlay 里使用。

## 实时预览

<Demo name="dialog-web-basic" description="默认面板 + 两个按钮，事件回显" />

<Demo name="dialog-web-types" description="五种 type 的图标与配色 + 两种 iconPlacement" />

## 基础用法

```ts
import { SnDialog } from '@snui/vue-web'
import '@snui/tokens-web/styles'
```

```html
<SnDialog
  title="确认删除"
  content="删除后该应用及其全部页面将无法恢复。"
  positive-text="删除"
  negative-text="取消"
  @positive-click="onPositive"
  @negative-click="onNegative"
  @close="onClose"
/>
```

## 事件

| 事件 | 载荷 | 触发时机 |
|---|---|---|
| `positive-click` | `MouseEvent` | 确认按钮被点击。 |
| `negative-click` | `MouseEvent` | 取消按钮被点击。 |
| `close` | `()` | 关闭按钮被点击。 |

## 按钮行的出现规则

底部按钮行**只在有东西可放时才渲染**：`action` 插槽、或 `positiveText`、或 `negativeText`，三者命中其一即可。

按钮行缺席时，正文会带上 `sn-dialog__content--last` 并去掉下边距 —— 复刻上游 `actionNode ? '' : 'content--last'`。

## 按钮语义

- **顺序**：取消（negative）在前，确认（positive）在后。
- **确认按钮的 type** 跟随对话框 `type`，`default` 回退到 `primary`。
- **取消按钮永远不被 `type` 染色**（上游不给它传 `type`），保持 ghost。
- **`loading` 只作用于确认按钮** —— 同时进入 loading 与 disabled，取消按钮不受影响。

## 类型与图标

```html
<SnDialog type="warning" title="警告" content="..." />
<SnDialog type="success" title="成功" content="..." />
```

图标配色复刻上游 `createKey('iconColor', type)`：`info` / `success` / `warning` / `error` 各用专属 token，而 **`default` 用基础 `icon-color` token**（primary），不是 info 那个。

## iconPlacement

默认 `left` —— 图标内联在标题左侧。

改成 `top` 后，图标被抬进独立的居中行，图标与关闭按钮的边距切到 `*IconTop` 变体，标题 / 正文 / 按钮行全部居中。

```html
<SnDialog icon-placement="top" type="success" title="上传完成" />
```

注意：`icon` 插槽同样受 `showIcon` 约束 —— 上游只构造一个 `showIcon ? … : null` 的图标节点、两种布局复用同一个节点，插槽绕不过这道闸。

## 插槽

| 名称 | 说明 |
|---|---|
| `default` | 正文内容，替代 `content`。 |
| `header` | 标题行，替代 `title`。 |
| `icon` | 类型图标，替代内置图形。**仍受 `showIcon` 约束。** |
| `action` | 按钮行，完全替代内置按钮。 |
| `close` | 关闭按钮，替代内置图形。 |

## 关闭按钮

`closable` 默认 `true`。`closeFocusable` 控制键盘可达性：默认 `false` 时 `tabindex="-1"`（可点击但不进 tab 序）；设为 `true` 则 `tabindex="0"`。

## 无障碍

- 根元素 `role="dialog"` + 显式 `aria-modal="false"`。
- 关闭按钮是真实的 `<button type="button">`，带 `aria-label="关闭"` 与 `:focus-visible` 焦点环。
- 图标是装饰性的 —— 语义由标题与正文文字承载。

以下属于 provider 项，**不在本组件范围内**：焦点陷阱、初始焦点、`Escape` 关闭、关闭后焦点归还、`aria-labelledby` 关联标题、背景 `aria-hidden`。

## 主题

整块 token 面都落在样式表里（`--sn-web-dialog-*`），组件**不输出任何内联主题样式** —— 改主题靠覆盖 token。唯一的内联样式是图标颜色，因为它必须随 `type` 在运行时变化。

## 已知取舍（§112 future markers）

- `DialogProvider` / `useDialog()`（遮罩、`VLazyTeleport`、焦点陷阱、滚动锁、`width`、`transform-origin`）为**独立 WBS 项**，本组件只是它承载的卡片。
- 上游的 `rtl` 处理未建模（SnConfigProvider 尚未暴露 Dialog 级 `iconPlacement` 默认值）。
- 过渡使用朴素的 CSS `0.3s ease`，而非上游的 `cubicBezierEaseInOut` token —— tokens 包目前没有 motion/easing 别名可消费。
