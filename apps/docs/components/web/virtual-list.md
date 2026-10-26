# VirtualList 虚拟列表（Web 端）

虚拟列表只渲染可视窗口（含上下 overscan 缓冲）内的行，用全高占位撑起原生滚动条，让万级数据保持流畅滚动。

## 何时使用

- 长列表 / 日志流 / 大数据表格行的性能优化（数百到数万行）。
- 行高固定时用 `item-size` 直接定位；行高随内容变化时开启 `item-resizable` 动态测高。
- 需要自定义行内容（`item` 插槽）并保留原生滚动体验（键盘滚动、滚动条语义）。

## 代码演示

### 基础用法

1000 条数据 + 32px 固定行高：视口高度由 `visible-height` 固定，上下各多渲染 `overscan` 行作为缓冲，行内容经 `item` 插槽渲染。

<Demo name="virtual-list-web-basic" description="固定 item-size + visible-height + overscan + item 插槽。" />

### 动态行高

开启 `item-resizable` 后，已渲染的行由 ResizeObserver 测高并重排前缀和，未测量的行回退到 `item-size` 估算；内容长短不一时滚动条总高度随测量结果增长。

<Demo name="virtual-list-web-resizable" description="itemResizable 动态测高，行高随内容自适应。" />

### 滚动回显与 overscan 缓冲

两个列表并置对照 `overscan` 的影响，并通过 `scroll` 事件与 `update:scroll-top` 回显滚动偏移：`scroll` 为容器原生高频事件，`update:scroll-top` 经 rAF 节流后提交。

<Demo name="virtual-list-web-scroll" description="scroll / update:scroll-top 实时回显 + overscan 0 与 12 对照。" />

## API

### Props

| 名称           | 类型                                                 | 默认值      | 说明                                                        |
| -------------- | ---------------------------------------------------- | ----------- | ----------------------------------------------------------- |
| items          | `Array<Record<string, unknown> \| string \| number>` | `[]`        | 完整数据列表，仅渲染可视窗口内的行。                        |
| item-size      | `number`                                             | `30`        | 固定行高（px），同时作为未测量行的估算高度。                |
| item-resizable | `boolean`                                            | `false`     | 用 ResizeObserver 测量已渲染行高并按测量结果重排。          |
| key-field      | `string`                                             | `'value'`   | 对象条目取渲染 key 的字段名；字段缺失时回退为行下标。       |
| overscan       | `number`                                             | `3`         | 视口上下额外渲染的行数，用于吸收快速滚动。                  |
| visible-height | `number \| undefined`                                | `undefined` | 固定视口高度（px）；未提供时测量容器自身高度（默认 100%）。 |

### Events

| 名称              | 参数                  | 说明                                               |
| ----------------- | --------------------- | -------------------------------------------------- |
| scroll            | `(event: Event)`      | 容器原生滚动事件，每次滚动都会触发。               |
| update:scroll-top | `(scrollTop: number)` | rAF 节流后提交的滚动偏移，用于外部回显或按需加载。 |

### Slots

| 名称 | 参数                                                                   | 说明                                                            |
| ---- | ---------------------------------------------------------------------- | --------------------------------------------------------------- |
| item | `{ item: Record<string, unknown> \| string \| number; index: number }` | 行内容；未提供时字符串 / 数字条目按文本渲染，对象条目渲染为空。 |

### Methods

无。组件未通过 `defineExpose` 暴露实例方法。

行为说明：

- 固定行高按 `index * itemSize` 定位；动态行高维护前缀和并用二分查找定位窗口起点。
- `item-resizable` 仅向下测高：重新测量不会移动已测窗口上方的行。
- `items` 数组整体替换时清空已测高度缓存。
- 渲染 key 取 `key-field` 字段值，保证条目身份稳定可以避免整列表重建 DOM。

## Tokens

| Token    | CSS 变量                      | 用途   |
| -------- | ----------------------------- | ------ |
| 主文本色 | `--sn-web-color-text-primary` | 行文字 |

## 无障碍

- 滚动容器带 `role="list"`，每一行带 `role="listitem"`。
- 容器是可聚焦滚动的原生元素，键盘滚动与读屏滚动条语义由原生滚动容器提供。
- `visible-height` 只固定视口高度，不改变滚动与聚焦行为。

## AI Patch Boundary

| 可安全由 AI 生成                                       | 需要人工确认                                    |
| ------------------------------------------------------ | ----------------------------------------------- |
| `items` 列表内容与 `key-field` 字段名                  | `items` 的分页 / 增量加载策略与数组整体替换时机 |
| `item-size` / `overscan` / `visible-height` 等尺寸参数 | `update:scroll-top` 监听内的数据请求与节流策略  |
| `item-resizable` 开关与文档、demo 中的静态组合用法     | `item` 插槽内的交互控件与异步数据               |

- AI 生成的 JSON Patch 只允许修改以上 Props 数据面，不得注入插槽内容、事件处理器或内部滚动偏移。
- `item-size` 必须为正数；`overscan` 为非负整数。
- 替换 `items` 时保持条目 `key-field` 字段稳定，避免整列表重建 DOM。

完整契约见组件 `ai-description.md`。
