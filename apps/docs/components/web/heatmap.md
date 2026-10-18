# 热力图 Heatmap

以周为列、周几为行，用颜色深浅展示一段时间内的活跃度的贡献图组件。

## 何时使用

- 需要展示连续数周 / 数月的行为密度（打卡、提交、活跃度）时。
- 需要按颜色档位对比数值大小，并配合图例说明时。
- 数据加载中需要占位骨架时。

## 代码演示

### 基础用法

传入 `data`（`{ timestamp, value }` 列表），自动按周对齐补齐网格；可切换周标签、月份标签与颜色指示器。

<Demo name="heatmap-web-basic" description="数据 + 周/月份标签 + 指示器开关 + 尺寸。" />

### 自定义颜色

通过 `active-colors`（从浅到深）与 `minimum-color` 自定义色阶，优先于内置色系。

<Demo name="heatmap-web-colors" description="active-colors / minimum-color 自定义。" />

### 插槽用法

`footer` 自定义左侧信息，`indicator` 整块替换右侧指示器，`indicator-leading-text` / `indicator-trailing-text` 覆写指示器两端文本。

<Demo name="heatmap-web-slots" description="footer / indicator / 指示器文本插槽。" />

### 悬浮提示

`tooltip` 开启每格悬浮提示（1:1 对齐 n-heatmap，默认 `false`）：`true` 使用默认浮层（内容「YYYY-MM-DD：数值」），对象形式透传 `content / placement / showArrow / delay / style / class`（均为可选）。

<Demo name="heatmap-web-tooltip" description="tooltip 开关。" />

`tooltip` 插槽接收格子数据对象（同 n-heatmap `DayRect`：`{ timestamp, value, color, dayOfWeek, rowIndex, colIndex }`），可完全自定义浮层内容。

<Demo name="heatmap-web-tooltip-slot" description="tooltip 插槽自定义内容。" />

### 内置色系

`color-theme` 提供 `green` / `blue` / `orange` / `purple` / `red` 五档内置色系。

<Demo name="heatmap-web-themes" description="五种内置 color-theme。" />

## API

### SnHeatmap Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| data | `Array<{ timestamp: number, value?: number \| null }>` | `undefined` | 数据源；范围内缺失日期补 0，范围外日期留空 |
| loading-data | `Array<{ timestamp: number, value?: number \| null }>` | `undefined` | 加载中展示的数据 |
| active-colors | `string[]` | `undefined` | 自定义色阶（从浅到深），优先于内置色系 |
| minimum-color | `string` | `undefined` | 自定义最小档颜色 |
| color-theme | `'green' \| 'blue' \| 'orange' \| 'purple' \| 'red'` | `undefined` | 内置色系 |
| fill-calendar-leading | `boolean` | `false` | 数据首日之前的空白格填 0（默认留空） |
| first-day-of-week | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` | 周开始日，0 = 周一 |
| loading | `boolean` | `false` | 加载态；无 loading-data 时展示 7 × 53 骨架 |
| show-color-indicator | `boolean` | `true` | 底部颜色指示器 |
| show-week-labels | `boolean` | `true` | 左侧周标签 |
| show-month-labels | `boolean` | `true` | 顶部月份标签 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸（格子 10 / 11 / 12px） |
| tooltip | `boolean \| SnHeatmapTooltipConfig` | `false` | 每格悬浮提示（SnTooltip 包裹，`false` 不渲染任何浮层）；`true` 用默认内容「YYYY-MM-DD：数值」，对象形式透传 `content`（无插槽时的文本）/ `placement`（默认 `'top'`）/ `showArrow`（默认 `true`）/ `delay`（默认 `100`）/ `style` / `class` |
| x-gap | `number \| string` | `undefined` | 覆写垂直（行）方向间距（border-spacing 第二值，同参考实现） |
| y-gap | `number \| string` | `undefined` | 覆写水平（列）方向间距（border-spacing 第一值，同参考实现） |

### SnHeatmap Events

无。

### SnHeatmap Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| footer | — | 底部左侧信息区 |
| indicator | — | 整块替换右侧指示器 |
| indicator-leading-text | — | 指示器起始文本（默认「少」） |
| indicator-trailing-text | — | 指示器结束文本（默认「多」） |
| tooltip | 格子数据对象 `{ timestamp, value, color, dayOfWeek, rowIndex, colIndex }` | 自定义每格悬浮内容（同 n-heatmap `DayRect`，`dayOfWeek` 0 = 周日） |

### 行为说明

- 网格固定 7 行（行 = 周几），列 = 自然周；输入数据会先排序再对齐补格。
- 色阶 5 档：值 ≤ 0 映射最浅档，其余按 `值 / 最大值` 分档；最大值取自数据。
- 月份标签按列首格所属月份合并，覆盖不足 3 周的月份不显示。
- 显式 `value: null` 的格子渲染为空白格；`value: 0` 渲染最浅色。
- `tooltip` 开启时每格包一层悬浮浮层（懒渲染：未 hover 不挂载浮层内容）；`loading` 中不渲染浮层（同 n-heatmap）。

完整契约见组件 `ai-description.md`。
