# Popover 气泡卡片 · Web 端

`SnPopover` 是锚定在触发元素上的悬浮卡片：带标题区与内容区，悬停、点击或聚焦时在触发元素旁边弹出，空间不足时自动翻转。

## 何时使用

- 需要在不离开当前页面的前提下展示一段结构化说明（标题 + 正文）。
- 图标按钮、表格操作需要承载较丰富的辅助内容，简单文字提示不够用时。
- 内容本身需要交互（链接、小段表单）时，用气泡卡片承载。

## 代码演示

### 基础用法

默认悬停触发。`header` 提供标题区，`content` 提供正文；`show-arrow` 打开指示箭头，`placement` 指定十二个方位。

<Demo name="popover-web-basic" description="hover 触发、标题 + 正文、箭头与方位" />

### 触发方式与受控模式

`click` / `manual` 触发对照；`manual` 模式配合 `v-model:show` 完全接管显示状态。

<Demo name="popover-web-trigger" description="click 与 manual + v-model:show 受控" />

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| show | `boolean` | `undefined` | 是否显示。`undefined` 为不受控模式。 |
| default-show | `boolean` | `false` | 不受控模式下的初始显示状态。 |
| trigger | `'hover' \| 'click' \| 'focus' \| 'manual'` | `'hover'` | 触发方式。`'manual'` 时只由 `show` 控制。 |
| placement | `'top-start' \| 'top' \| 'top-end' \| 'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end' \| 'left-start' \| 'left' \| 'left-end'` | `'top'` | 弹出方位。 |
| delay | `number \| [number, number]` | `100` | 打开延迟（ms）。传数组时第二项覆盖关闭延迟。 |
| duration | `number` | `100` | 关闭延迟（ms）。 |
| show-arrow | `boolean` | `false` | 是否显示箭头。 |
| arrow | `boolean` | `true` | `show-arrow` 的别名；两者都为真时才渲染箭头。 |
| arrow-point-to-center | `boolean` | `false` | 箭头是否指向气泡中心而非触发器边缘。 |
| arrow-class | `string` | `undefined` | 箭头元素的类名。 |
| arrow-style | `CSSProperties` | `undefined` | 箭头元素的样式。 |
| header | `string` | `''` | 标题区文本。 |
| content | `string` | `''` | 内容区文本。 |
| disabled | `boolean` | `false` | 是否禁用弹出。 |
| raw | `boolean` | `false` | 是否移除内置卡片样式，交由调用方绘制。 |
| animated | `boolean` | `true` | 是否使用进出场动画。 |
| overlap | `boolean` | `false` | 是否覆盖触发器而非并排。 |
| scrollable | `boolean` | `false` | 内容超出高度时是否可滚动。 |
| display-directive | `'if' \| 'show'` | `'if'` | `'if'` 关闭后卸载；`'show'` 保留节点并切换 `display`。 |
| flip | `boolean` | `true` | 空间不足时是否自动翻转到对侧。 |
| keep-alive-on-hover | `boolean` | `true` | `hover` 触发时，指针移入气泡是否保持显示。 |
| width | `number \| 'trigger'` | `undefined` | 宽度。`'trigger'` 表示与触发器等宽。 |
| to | `string \| HTMLElement \| false` | `'body'` | 弹层挂载容器。`false` 表示原地渲染。 |
| z-index | `number` | `undefined` | 层级。 |
| content-class | `string` | `undefined` | 内容区域的类名。 |
| content-style | `CSSProperties` | `undefined` | 内容区域的样式。 |
| on-clickoutside | `(e: MouseEvent) => void` | `undefined` | 点击弹层与触发器外部时调用。 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `update:show` | `boolean` | 显示状态变化（受控模式下触发）。 |
| `show` | `()` | 弹层出现。 |
| `hide` | `()` | 弹层隐藏。 |

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 触发元素。 |
| `header` | 标题区内容，优先于 `header` prop。 |
| `content` | 内容区内容，优先于 `content` prop。 |

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
| 主文本色 | `--sn-web-color-text-primary` | 标题与正文文本 |

## 无障碍

- 弹层元素带 `role="dialog"` 与 `aria-modal="false"`（不劫持焦点的非模态弹层）。
- 触发器包裹元素带 `aria-expanded` 与 `aria-haspopup="dialog"`。
- 箭头为装饰性元素，`aria-hidden="true"`。

## AI Patch Boundary

| 可安全由 AI 生成 | 需要人工确认 |
| --- | --- |
| `content` / `header` 文案与静态 `placement`、`trigger`、`show-arrow` 等展示参数 | `show` 的受控绑定（`v-model:show` 涉及页面状态流向） |
| `content-class` / `content-style` 等样式挂点（需基于既有 token） | `on-clickoutside` / 命令式 `show()` / `hide()` 等事件与命令式调用逻辑 |
| 文档、demo 中静态组合用法 | 在弹层内嵌套复杂交互组件（表单、表格）的方案 |

完整契约见组件 `ai-description.md`。
