# Popover 气泡卡片 · Web 端

`SnPopover` 是锚定在触发元素上的悬浮卡片：带标题区与内容区，悬停、点击或聚焦时在触发元素旁边弹出，空间不足时自动翻转。

## 何时使用

- 需要在不离开当前页面的前提下展示一段结构化说明（标题 + 正文）。
- 图标按钮、表格操作需要承载较丰富的辅助内容，简单文字提示不够用时。
- 内容本身需要交互（链接、小段表单）时，用气泡卡片承载。

## 代码演示

### 基础用法

默认悬停触发。`header` 提供标题区，`content` 提供正文；`show-arrow` 打开指示箭头并可切换常用方位。

<Demo name="popover-web-basic" description="hover 触发、标题 + 正文、箭头与常用方位" />

### 触发方式与受控模式

`click` 触发点击切换、点击外部关闭；`manual` 配合 `v-model:show` 由外部状态完全接管显示。

<Demo name="popover-web-trigger" description="click 触发与 manual + v-model:show 受控" />

### 十二个方位

四个主方向各带 `start` / 居中 / `end` 三种对齐，共十二个 `placement`，空间不足时自动翻转到对侧。

<Demo name="popover-web-placement" description="十二个 placement 实时切换 + 视口翻转" />

### 弹出时序

`delay` 控制打开延迟（数组形式可分别指定打开 / 关闭），`duration` 控制关闭延迟，用于抑制指针划过时的误触发。

<Demo name="popover-web-delay" description="默认时序、慢速弹出与非对称 [打开, 关闭] 延迟" />

### 宽度控制

`width="trigger"` 让气泡与触发器等宽，数值 `width` 给出固定像素宽度，适合承载整段说明文字。

<Demo name="popover-web-width" description="width=&quot;trigger&quot; 与固定数值宽度对照" />

### 长内容滚动

`scrollable` 在正文超过高度上限时开启内部滚动，`content-style` 可以覆盖默认的最大高度。

<Demo name="popover-web-scrollable" description="scrollable 与 content-style maxHeight 的长内容滚动" />

### 自定义标题与正文

`#header` / `#content` 插槽可以放入图标、段落、按钮等任意内容，且优先于同名的 `header` / `content` prop。

<Demo name="popover-web-slots" description="SnIcon 标题 + 说明与操作按钮的富内容插槽" />

## API

### Props

| 名称                  | 类型                                                                                                                                                                 | 默认值      | 说明                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| show                  | `boolean`                                                                                                                                                            | `undefined` | 是否显示。`undefined` 为不受控模式，由内部状态维护。                                        |
| default-show          | `boolean`                                                                                                                                                            | `false`     | 不受控模式下的初始显示状态。                                                                |
| trigger               | `'hover' \| 'click' \| 'focus' \| 'manual'`                                                                                                                          | `'hover'`   | 触发方式。`'manual'` 下只由 `show` 控制。                                                   |
| placement             | `'top-start' \| 'top' \| 'top-end' \| 'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end' \| 'left-start' \| 'left' \| 'left-end'` | `'top'`     | 请求的弹出方位，空间不足时可翻转。                                                          |
| delay                 | `number \| [number, number]`                                                                                                                                         | `100`       | 打开延迟（ms）；传数组时第二项覆盖关闭延迟。                                                |
| duration              | `number`                                                                                                                                                             | `100`       | 关闭延迟（ms）。                                                                            |
| show-arrow            | `boolean`                                                                                                                                                            | `false`     | 是否显示指向触发元素的箭头。                                                                |
| arrow                 | `boolean`                                                                                                                                                            | `true`      | `show-arrow` 的布尔别名，两者都为真时才渲染箭头。                                           |
| arrow-point-to-center | `boolean`                                                                                                                                                            | `false`     | 箭头是否指向气泡中心而非触发元素边缘。                                                      |
| arrow-class           | `string`                                                                                                                                                             | `undefined` | 箭头元素的类名。                                                                            |
| arrow-style           | `CSSProperties`                                                                                                                                                      | `undefined` | 箭头元素的行内样式。                                                                        |
| header                | `string`                                                                                                                                                             | `''`        | 标题区文本，可用 `#header` 插槽覆盖。                                                       |
| content               | `string`                                                                                                                                                             | `''`        | 正文文本，可用 `#content` 插槽覆盖。                                                        |
| disabled              | `boolean`                                                                                                                                                            | `false`     | 是否禁用弹出。                                                                              |
| raw                   | `boolean`                                                                                                                                                            | `false`     | 是否移除内置卡片样式，交由调用方绘制气泡外观。                                              |
| animated              | `boolean`                                                                                                                                                            | `true`      | 是否使用进出场动画。                                                                        |
| overlap               | `boolean`                                                                                                                                                            | `false`     | 是否覆盖触发元素而非并排显示。                                                              |
| scrollable            | `boolean`                                                                                                                                                            | `false`     | 正文超出高度上限时是否在内部滚动。                                                          |
| display-directive     | `'if' \| 'show'`                                                                                                                                                     | `'if'`      | `'if'` 关闭后卸载节点；`'show'` 保留节点并切换 `display`。                                  |
| flip                  | `boolean`                                                                                                                                                            | `true`      | 空间不足时是否自动翻转到对侧。                                                              |
| keep-alive-on-hover   | `boolean`                                                                                                                                                            | `true`      | `hover` 触发时，指针移入气泡是否保持显示。                                                  |
| width                 | `number \| 'trigger'`                                                                                                                                                | `undefined` | 宽度。`'trigger'` 表示与触发元素等宽，数值为固定像素宽度（卡片自身 280px 的上限仍然生效）。 |
| to                    | `string \| HTMLElement \| false`                                                                                                                                     | `'body'`    | 弹层挂载容器。`false` 表示原地渲染。                                                        |
| z-index               | `number`                                                                                                                                                             | `undefined` | 显式层级。                                                                                  |
| content-class         | `string`                                                                                                                                                             | `undefined` | 内容区域的类名。                                                                            |
| content-style         | `CSSProperties`                                                                                                                                                      | `undefined` | 内容区域的行内样式。                                                                        |
| on-clickoutside       | `(e: MouseEvent) => void`                                                                                                                                            | `undefined` | 点击弹层与触发元素外部时调用。                                                              |

### Events

| 名称          | 参数      | 说明                                     |
| ------------- | --------- | ---------------------------------------- |
| `update:show` | `boolean` | 显示状态变化，配合 `v-model:show` 使用。 |
| `show`        | `()`      | 弹层出现时触发。                         |
| `hide`        | `()`      | 弹层隐藏时触发。                         |

### Slots

| 名称      | 说明                                   |
| --------- | -------------------------------------- |
| `default` | 触发元素，即弹出时锚定可见的目标节点。 |
| `header`  | 标题区内容，优先于 `header` prop。     |
| `content` | 正文内容，优先于 `content` prop。      |

### Methods

| 名称      | 类型            | 说明                                       |
| --------- | --------------- | ------------------------------------------ |
| `show`    | `() => void`    | 命令式显示，受 `disabled` 约束。           |
| `hide`    | `() => void`    | 命令式隐藏。                               |
| `isShown` | `() => boolean` | 读取当前生效的显示状态（含受控与不受控）。 |

## Tokens

| Token      | CSS 变量                            | 用途           |
| ---------- | ----------------------------------- | -------------- |
| 背景表面色 | `--sn-web-color-background-surface` | 卡片与箭头填充 |
| 弱边框色   | `--sn-web-color-border-subtle`      | 卡片与箭头描边 |
| 卡片阴影   | `--sn-web-card-shadow`              | 卡片投影       |
| 主文本色   | `--sn-web-color-text-primary`       | 标题与正文文本 |

## 无障碍

- 弹层元素带 `role="dialog"` 与 `aria-modal="false"`（不劫持焦点的非模态弹层）。
- 触发元素包裹层带 `aria-expanded` 与 `aria-haspopup="dialog"`。
- 箭头为装饰性元素，带 `aria-hidden="true"`。
- 键盘可达：触发元素可聚焦，`focus` 触发方式下聚焦即弹出；`manual` 模式下由业务自行提供打开入口。

## AI Patch Boundary

| 可安全由 AI 生成                                                                | 需要人工确认                                                          |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `content` / `header` 文案与静态 `placement`、`trigger`、`show-arrow` 等展示参数 | `show` 的受控绑定（`v-model:show` 涉及页面状态流向）                  |
| `content-class` / `content-style` 等样式挂点（需基于既有 token）                | `on-clickoutside` / 命令式 `show()` / `hide()` 等事件与命令式调用逻辑 |
| 文档、demo 中静态组合用法                                                       | 在弹层内嵌套复杂交互组件（表单、表格）的方案                          |

完整契约见组件 `ai-description.md`。
