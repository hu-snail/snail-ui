# Dialog 对话框（Web 端）

`SnDialog` 是对话框的**面板** —— 一张带标题、类型图标、正文与底部按钮行的卡片。

典型场景：二次确认、危险操作告警、结果反馈。

## 何时使用

- 需要用户明确确认某个操作，且操作有后果（删除、提交、覆盖）。
- 需要呈现一段需要用户专注阅读的反馈信息。
- 需要用户在当前流程中做出二选一或三选一的决策。

不适合：仅呈现信息、无需用户响应时，用 `SnAlert`；需要承载复杂表单或多步流程时，用 `SnDrawer`。

## 面板不是遮罩：这个边界很重要

对话框被拆成两层，`SnDialog` 只负责其中一层：

| 层       | 职责                                      | 本库           |
| -------- | ----------------------------------------- | -------------- |
| **卡片** | 标题 / 正文 / 按钮 / 类型图标             | ✅ `SnDialog`  |
| **遮罩** | mask、teleport、焦点陷阱、`width`、滚动锁 | ⏳ 独立 WBS 项 |

所以 `SnDialog` 自身：

- 根元素是 `aria-modal="false"` —— 它不持有遮罩与焦点陷阱，声称模态是错的。
- 没有 `width` / `max-height` / 滚动容器 —— 这些属于 overlay 包装层。
- 没有 `show` / `onUpdate:show` —— 可见性归宿主 overlay 管。

你可以把它直接丢进任意 overlay 里使用。

## 代码演示

### 基础用法

默认面板 + 两个按钮，事件回显。

<Demo name="dialog-web-basic" description="默认面板 + 两个按钮，事件回显" />

### 类型与布局

五种 `type` 的类型图标与配色，以及 `iconPlacement` 的左右两种布局。

<Demo name="dialog-web-types" description="五种 type 的图标与配色 + 两种 iconPlacement" />

### 异步确认

确认按钮在异步任务完成前保持加载态。

<Demo name="dialog-web-async" description="loading 态下的异步确认流程" />

### 自定义操作区

用 `action` 插槽完全接管底部按钮行。

<Demo name="dialog-web-action" description="action 插槽替换内置按钮，承载三选一决策" />

### 无边框与隐藏图标

`bordered` 与 `showIcon` 的组合效果对照。

<Demo name="dialog-web-borderless" description="边框开合与图标显隐的并排对照" />

### 插槽全接管

标题、正文、图标、关闭按钮全部由插槽提供。

<Demo name="dialog-web-slots" description="header / default / icon / close 四个插槽同时使用" />

### 受控显示

显示状态由父组件持有，组件只发事件。

<Demo name="dialog-web-controlled" description="v-model:show 受控模式与事件流回显" />

## API

### Props

| 名称                  | 类型                                                       | 默认值      | 说明                                                  |
| --------------------- | ---------------------------------------------------------- | ----------- | ----------------------------------------------------- |
| `show`                | `boolean \| undefined`                                     | `undefined` | 是否显示。`undefined` 为不受控模式。                  |
| `type`                | `'default' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | 语义类型，决定图标与强调色。                          |     | `title` | `string` | `undefined` | 标题文字。 |
| `content`             | `string`                                                   | `undefined` | 正文文字。                                            |
| `icon`                | `Component`                                                | `undefined` | 自定义类型图标，仍受 `showIcon` 约束。                |
| `iconPlacement`       | `'left' \| 'top'`                                          | `'left'`    | 图标位置。`top` 时标题、正文、按钮行全部居中。        |
| `closable`            | `boolean`                                                  | `true`      | 是否显示关闭按钮。                                    |
| `closeFocusable`      | `boolean`                                                  | `false`     | 关闭按钮是否进入 tab 序。`false` 时 `tabindex="-1"`。 |
| `showIcon`            | `boolean`                                                  | `true`      | 是否显示类型图标。                                    |
| `bordered`            | `boolean`                                                  | `false`     | 是否显示边框。                                        |
| `loading`             | `boolean`                                                  | `false`     | 确认按钮是否进入加载态（同时 disabled）。             |
| `positiveText`        | `string`                                                   | `undefined` | 确认按钮文字。                                        |
| `negativeText`        | `string`                                                   | `undefined` | 取消按钮文字。                                        |
| `positiveButtonProps` | `object`                                                   | `undefined` | 透传给确认按钮的属性。                                |
| `negativeButtonProps` | `object`                                                   | `undefined` | 透传给取消按钮的属性。                                |
| `titleClass`          | `string`                                                   | `undefined` | 标题行类名。                                          |
| `titleStyle`          | `string \| object`                                         | `undefined` | 标题行样式。                                          |
| `contentClass`        | `string`                                                   | `undefined` | 正文行类名。                                          |
| `contentStyle`        | `string \| object`                                         | `undefined` | 正文行样式。                                          |
| `actionClass`         | `string`                                                   | `undefined` | 按钮行类名。                                          |
| `actionStyle`         | `string \| object`                                         | `undefined` | 按钮行样式。                                          |

### Events

| 名称             | 参数         | 说明             |
| ---------------- | ------------ | ---------------- |
| `positive-click` | `MouseEvent` | 确认按钮被点击。 |
| `negative-click` | `MouseEvent` | 取消按钮被点击。 |
| `close`          | `()`         | 关闭按钮被点击。 |
| `update:show`    | `boolean`    | 显示状态变化。   |

### Slots

| 名称      | 参数 | 说明                                               |
| --------- | ---- | -------------------------------------------------- |
| `default` | `()` | 正文内容，替代 `content`。                         |
| `header`  | `()` | 标题行，替代 `title`。                             |
| `icon`    | `()` | 类型图标，替代内置图形。**仍受 `showIcon` 约束。** |
| `action`  | `()` | 按钮行，完全替代内置按钮。                         |
| `close`   | `()` | 关闭按钮，替代内置图形。                           |

## 按钮行的出现规则

底部按钮行**只在有东西可放时才渲染**：`action` 插槽、或 `positiveText`、或 `negativeText`，三者命中其一即可。

按钮行缺席时，正文会去掉下边距（带 `sn-dialog__content--last`）。

## 按钮语义

- **顺序**：取消（negative）在前，确认（positive）在后。
- **确认按钮的 type** 跟随对话框 `type`，`default` 回退到 `primary`。
- **取消按钮永远不被 `type` 染色**，保持 ghost。
- **`loading` 只作用于确认按钮** —— 同时进入 loading 与 disabled，取消按钮不受影响。

## 类型与图标配色

`info` / `success` / `warning` / `error` 各用专属 token，而 **`default` 用基础 `icon-color` token**（primary）。

`default` 是本库的扩展类型 —— 它不表达具体语义，仅提供一个中性面板。

## 关闭按钮

`closable` 默认 `true`。`closeFocusable` 控制键盘可达性：默认 `false` 时 `tabindex="-1"`（可点击但不进 tab 序）；设为 `true` 则 `tabindex="0"`。

## 无障碍

- 根元素 `role="dialog"` + 显式 `aria-modal="false"`。
- 关闭按钮是真实的 `<button type="button">`，带 `aria-label="关闭"` 与 `:focus-visible` 焦点环。
- 图标是装饰性的 —— 语义由标题与正文文字承载。

以下属于 overlay 层职责，**不在本组件范围内**：焦点陷阱、初始焦点、`Escape` 关闭、关闭后焦点归还、`aria-labelledby` 关联标题、背景 `aria-hidden`。

## 主题

整块 token 面都落在样式表里（`--sn-web-dialog-*`），组件**不输出任何内联主题样式** —— 改主题靠覆盖 token。唯一的内联样式是图标颜色，因为它必须随 `type` 在运行时变化。

## 已知取舍

- 遮罩层（mask、teleport、焦点陷阱、滚动锁、`width`、`transform-origin`）为**独立 WBS 项**，本组件只是它承载的卡片。
- 全局 `iconPlacement` 默认值未建模。
- 过渡使用 CSS `0.3s ease`，尚未接入 motion token。
