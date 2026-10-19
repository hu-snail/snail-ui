# Popconfirm 气泡确认框 · Web 端

`SnPopconfirm` 是轻量的二次确认弹层：点击触发元素后弹出带警示图标、说明文字与「取消 / 确定」按钮的小卡片，用于替换打断感更强的模态对话框。

## 何时使用

- 删除、下线、清空等不可逆操作前需要用户确认。
- 操作的影响范围小，不值得弹出整个对话框时。
- 需要在确认前向用户说明后果的一句话场景。

## 代码演示

### 基础用法

点击触发，默认文案为「取消 / 确定」，确认按钮为主色。`on-positive-click` 返回 `false`（或 `Promise<false>`）可以阻止关闭。

<Demo name="popconfirm-web-basic" description="默认确认框、自定义文案、自定义图标与阻止关闭" />

### 异步确认

回调返回 Promise 时，弹层在 Promise 结束前保持打开；解析为 `false` 则不关闭，适合先请求后关闭的流程。

<Demo name="popconfirm-web-async" description="Promise 回调：等待期间保持打开，失败不关闭" />

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| show | `boolean` | `undefined` | 是否显示。`undefined` 为不受控模式。 |
| default-show | `boolean` | `false` | 不受控模式下的初始显示状态。 |
| trigger | `'hover' \| 'click' \| 'focus' \| 'manual'` | `'click'` | 触发方式。 |
| placement | `'top-start' \| 'top' \| 'top-end' \| 'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end' \| 'left-start' \| 'left' \| 'left-end'` | `'top'` | 弹出方位。 |
| delay | `number \| [number, number]` | `100` | 打开延迟（ms）。 |
| duration | `number` | `100` | 关闭延迟（ms）。 |
| show-arrow | `boolean` | `false` | 是否显示箭头。 |
| arrow-point-to-center | `boolean` | `false` | 箭头是否指向气泡中心。 |
| arrow-class / arrow-style | `string` / `CSSProperties` | `undefined` | 箭头元素的类名 / 样式。 |
| content | `string` | `''` | 确认说明文字。 |
| icon | `IconComponent` | 内置警示图标 | 前置图标组件，默认以警示色渲染。 |
| show-icon | `boolean` | `true` | 是否显示前置图标区。 |
| negative-text | `string` | `'取消'` | 取消按钮文案。 |
| positive-text | `string` | `'确定'` | 确认按钮文案。 |
| negative-button-props | `Record<string, unknown>` | `undefined` | 透传给取消按钮的额外 props。 |
| positive-button-props | `Record<string, unknown>` | `undefined` | 透传给确认按钮的额外 props。 |
| on-positive-click | `(e: MouseEvent) => boolean \| Promise<boolean> \| void` | `undefined` | 点击确认时调用；返回 `false` 或解析为 `false` 的 Promise 时不关闭。 |
| on-negative-click | `(e: MouseEvent) => boolean \| Promise<boolean> \| void` | `undefined` | 点击取消时调用；阻止关闭语义同上。 |
| disabled | `boolean` | `false` | 是否禁用弹出。 |
| display-directive | `'if' \| 'show'` | `'if'` | 关闭后卸载或保留节点。 |
| flip | `boolean` | `true` | 空间不足时是否翻转。 |
| keep-alive-on-hover | `boolean` | `true` | 指针移入气泡是否保持显示。 |
| animated | `boolean` | `true` | 是否使用进出场动画。 |
| width | `number \| 'trigger'` | `undefined` | 宽度。 |
| to | `string \| HTMLElement \| false` | `'body'` | 弹层挂载容器。 |
| z-index | `number` | `undefined` | 层级。 |
| content-class / content-style | `string` / `CSSProperties` | `undefined` | 内部容器的类名 / 样式。 |
| on-clickoutside | `(e: MouseEvent) => void` | `undefined` | 点击外部时调用。 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `update:show` | `boolean` | 显示状态变化。 |
| `positive-click` | `MouseEvent` | 点击确认按钮（与 `on-positive-click` 等价）。 |
| `negative-click` | `MouseEvent` | 点击取消按钮（与 `on-negative-click` 等价）。 |

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 触发元素。 |
| `icon` | 前置图标区，替换内置图标与 `icon` prop。 |
| `action` | 按钮区，替换内置的两个按钮。 |

### Methods

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `show` | `() => void` | 命令式显示。 |
| `hide` | `() => void` | 命令式隐藏。 |
| `isShown` | `() => boolean` | 读取当前显示状态。 |

## Tokens

| Token | CSS 变量 | 用途 |
| --- | --- | --- |
| 背景表面色 | `--sn-web-color-background-surface` | 卡片与箭头填充 |
| 弱边框色 | `--sn-web-color-border-subtle` | 卡片与箭头描边 |
| 卡片阴影 | `--sn-web-card-shadow` | 卡片投影 |
| 主文本色 | `--sn-web-color-text-primary` | 说明文字 |
| 警示反馈色 | `--sn-web-color-feedback-warning` | 默认图标颜色 |

## 无障碍

- 弹层元素带 `role="dialog"` 与 `aria-modal="false"`。
- 触发器包裹元素带 `aria-expanded` 与 `aria-haspopup="dialog"`。
- 图标区为装饰元素（`aria-hidden`）；两个操作按钮是带可见文字的真实按钮，可 Tab 聚焦、回车触发。

## AI Patch Boundary

| 可安全由 AI 生成 | 需要人工确认 |
| --- | --- |
| `content` 文案、`positive-text` / `negative-text` 文案与静态 `placement` | `on-positive-click` / `on-negative-click` 回调内的业务请求与关闭策略 |
| `show-icon` / `icon` 等展示开关 | 返回 `Promise<false>` 阻止关闭等失败回滚逻辑 |
| 文档、demo 中静态组合用法 | `v-model:show` 受控绑定与外部状态联动 |

完整契约见组件 `ai-description.md`。
