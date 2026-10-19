# VirtualList · Web（PC 端）

虚拟滚动列表：只渲染可视窗口内（含上下 overscan）的行，用全高占位撑起原生滚动条，支撑万级数据流畅滚动。

## 何时使用

- 长列表 / 日志流 / 大数据表格行的性能优化（数百到数万行）。
- 行高固定时用 `itemSize` 直接定位；行高随内容变化时开启 `itemResizable` 动态测高。
- 需要自定义行内容（`item` 插槽）并保持原生滚动体验（键盘滚动、滚动条语义）。

## 代码演示

### 基础用法（固定行高）

1000 行数据、32px 固定行高，只渲染可视窗口 + overscan 行。

<Demo name="virtual-list-web-basic" description="固定 itemSize + visibleHeight + item 插槽。" />

### 动态行高（itemResizable）

开启 `itemResizable` 后，已渲染行由 ResizeObserver 测高并重排前缀和；未测量行回退到 `itemSize` 估算。

<Demo name="virtual-list-web-resizable" description="itemResizable 动态测高，行高随内容自适应。" />

## API

### SnVirtualList Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| items | `Array<Record<string, unknown> \| string \| number>` | `[]` | 完整数据列表，仅渲染可视窗口 |
| item-size | `number` | `30` | 固定行高（px），同时作为未测量行的估算高度 |
| item-resizable | `boolean` | `false` | 用 ResizeObserver 测量已渲染行高并重排 |
| key-field | `string` | `'value'` | 对象条目取渲染 key 的字段名 |
| overscan | `number` | `3` | 视口上下额外渲染的行数 |
| visible-height | `number \| undefined` | `undefined` | 固定视口高度（px）；不传时测量容器自身高度（默认 100%） |

### SnVirtualList Events

| Event | 参数 | 说明 |
| --- | --- | --- |
| scroll | `(event: Event)` | 容器原生滚动事件 |
| update:scroll-top | `(scrollTop: number)` | rAF 节流后提交的滚动偏移 |

### SnVirtualList Slots

| Slot | 参数 | 说明 |
| --- | --- | --- |
| item | `{ item, index }` | 行内容；未提供时原始值渲染为文本 |

行为说明：

- 固定行高按 `index * itemSize` 定位；动态行高维护前缀和 + 二分查找。
- `itemResizable` 仅支持向下测高：重新测量不会移动已测窗口上方的行。
- `items` 数组整体替换时清空已测高度缓存。

## Tokens

| Token | 用途 |
| --- | --- |
| `--sn-web-color-text-primary` | 行文字 |

## A11y

| 属性 | 说明 |
| --- | --- |
| `role="list"` | 滚动容器 |
| `role="listitem"` | 每一行 |
| 原生滚动容器 | 键盘滚动 / 屏幕阅读器滚动条语义免费获得 |

## AI Patch Boundary

- AI 生成的 JSON Patch 只允许修改以上 Props 数据面（如 `items`、`itemSize`、`overscan`）。
- 不允许通过 Patch 注入插槽内容、事件处理器或内部滚动偏移。
- `itemSize` 必须为正数；`overscan` 为非负整数。
- 替换 `items` 时保持条目 `keyField` 字段稳定，避免整列表重建 DOM。

完整契约见组件 `ai-description.md`。
