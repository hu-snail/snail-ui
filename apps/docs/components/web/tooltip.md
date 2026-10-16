# Tooltip 文字提示（Web 端）

`SnTooltip` 是轻量的悬浮提示：鼠标悬停、点击或聚焦时，在触发元素旁边弹出一小段说明文字。

## 何时使用

- 图标按钮、缩写字段需要补充说明文字。
- 截断的文本需要展示完整内容。
- 需要为不常用的操作提供一句提示，但不想占用固定空间。

不适合：内容需要用户交互（表单、按钮）时，用 `SnPopover` 类组件；信息本身需要一直可见时，直接写在页面上。

## 代码演示

### 基础用法

十二个方位中的常用几个。

<Demo name="tooltip-web-basic" description="八方位 placement 基础演示" />

### 触发方式

`hover` / `click` / `focus` / `manual` 四种触发手势。

<Demo name="tooltip-web-trigger" description="四种 trigger 手势对照" />

### 事件回调

`show` / `hide` / `update:show` 与外部点击回调。

<Demo name="tooltip-web-event" description="事件流回显与 onClickoutside" />

### 全部方位

十二个 placement 在同一舞台上对照。

<Demo name="tooltip-web-placement" description="十二方位全览" />

### 外观控制

箭头、内容样式、宽度与动画开关。

<Demo name="tooltip-web-appearance" description="箭头 / 内容样式 / 宽度 / 动画的组合" />

### 富文本内容

用 `content` 插槽承载结构化内容。

<Demo name="tooltip-web-content-slot" description="content 插槽承载多行富文本" />

### 受控显示

用 `show` 完全接管显示状态。

<Demo name="tooltip-web-controlled" description="v-model:show 受控模式" />

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `show` | `boolean` | `undefined` | 是否显示。`undefined` 为不受控模式。 |
| `defaultShow` | `boolean` | `false` | 不受控模式下的初始显示状态。 |
| `trigger` | `'hover' \| 'click' \| 'focus' \| 'manual'` | `'hover'` | 触发方式。`'manual'` 时只由 `show` 控制。 |
| `placement` | `'top-start' \| 'top' \| 'top-end' \| 'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end' \| 'left-start' \| 'left' \| 'left-end'` | `'top'` | 弹出位置。 |
| `content` | `string` | `''` | 提示文字。 |
| `delay` | `number \| [number, number]` | `100` | 打开延迟（ms）。传数组时第二项覆盖关闭延迟。 |
| `duration` | `number` | `100` | 关闭延迟（ms）。 |
| `arrow` | `boolean` | `true` | 是否显示箭头。 |
| `arrowPointToCenter` | `boolean` | `false` | 箭头是否指向气泡中心而非触发器边缘。 |
| `arrowClass` | `string` | `undefined` | 箭头元素的类名。 |
| `arrowStyle` | `CSSProperties` | `undefined` | 箭头元素的样式。 |
| `contentClass` | `string` | `undefined` | 内容区域的类名。 |
| `contentStyle` | `CSSProperties` | `undefined` | 内容区域的样式。 |
| `displayDirective` | `'if' \| 'show'` | `'if'` | `'if'` 关闭后卸载；`'show'` 保留节点并切换 `display`。 |
| `animated` | `boolean` | `true` | 是否使用进出场动画。 |
| `raw` | `boolean` | `false` | 是否移除内置气泡样式，交由调用方绘制。 |
| `scrollable` | `boolean` | `false` | 内容超出高度时是否可滚动。 |
| `flip` | `boolean` | `true` | 空间不足时是否自动翻转到对侧。 |
| `overlap` | `boolean` | `false` | 是否覆盖触发器而非并排。 |
| `keepAliveOnHover` | `boolean` | `true` | `hover` 触发时，指针移入气泡是否保持显示。 |
| `width` | `number \| 'trigger'` | `undefined` | 宽度。`'trigger'` 表示与触发器等宽。 |
| `to` | `string \| HTMLElement \| false` | `'body'` | 弹层的挂载容器。`false` 表示原地渲染。 |
| `zIndex` | `number` | `undefined` | 层级。 |
| `disabled` | `boolean` | `false` | 是否禁用弹出。 |
| `wrapped` | `boolean` | `true` | 是否用一层 `<span>` 包裹触发内容以承载指针事件。 |
| `onClickoutside` | `(e: MouseEvent) => void` | `undefined` | 点击外部时调用。 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `update:show` | `boolean` | 显示状态变化。 |
| `show` | `()` | 弹层出现。 |
| `hide` | `()` | 弹层隐藏。 |

### Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `default` | `(scope)` | 触发元素。`wrapped` 为 `false` 时通过 scope 注入 `triggerRef`。 |
| `content` | `()` | 气泡内容，替代 `content` prop。 |

### Methods

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `show` | `() => void` | 命令式显示。 |
| `hide` | `() => void` | 命令式隐藏。 |
| `isShown` | `() => boolean` | 读取当前显示状态。 |

## 打开与关闭时机

`delay` 与 `duration` 分别控制两侧的延迟，默认各 100ms：

- `delay` 只在打开时生效，避免指针划过时闪烁。
- `duration` 只在关闭时生效。

`delay` 传 `[open, close]` 数组时，第二项会覆盖 `duration`，方便为同一实例配置不对称的延迟。

## 定位与翻转

弹层渲染到 `body`（可用 `to` 改），因此不会被父级的 `overflow: hidden` 裁切。

定位基于触发器的实际位置计算。当指定方向空间不足时，`flip`（默认 `true`）会让弹层翻到对侧。箭头会跟随触发器的中点，并在气泡边缘内收敛，不会飘出边界。

`overlap` 让气泡压在触发器上；`width="trigger"` 把气泡宽度对齐触发器。

## 显示与卸载

`displayDirective` 决定关闭后弹层的去留：`'if'` 直接卸载，`'show'` 保留节点只切换 `display` —— 后者适合气泡内有需要保留的状态（滚动位置、输入内容）。

## 无障碍

- 弹层元素带 `role="tooltip"`。
- 箭头为装饰性元素，`aria-hidden="true"`。
- 内容不应承载交互操作 —— 提示类元素通常在失焦后即消失。

## 主题

组件消费 `--sn-web-color-tooltip-background` 与文本色 token。`raw` 为 `true` 时移除全部内置视觉，交由调用方绘制。

## 已知取舍

- 进出场动画使用固定曲线与 180ms 时长，尚未接入 motion token。
- 未实现 `x` / `y` 手动定位（上游为显式坐标控制）。
- 未实现 `xScrollable` 等同族滚动条参数。
