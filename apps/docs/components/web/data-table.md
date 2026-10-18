# DataTable · Web（PC 端）

数据表格（对标 n-data-table）。columns 驱动渲染，支持排序、筛选、行选择（多选/单选）、展开行、序号列、总结栏、fixed 列、横向滚动 + 吸顶表头、loading / 空态与内置简化分页。只需展示静态表格请用 [Table](./table)。

## 何时使用

- 有大量结构化数据，需要与列定义解耦地渲染；
- 需要行内排序 / 筛选 / 勾选 / 展开等交互；
- 需要总结栏（合计）或固定列配合横向滚动。

## 基础用法

<Demo name="data-table-web-basic" description="columns + data + render 单元格。" />

## 空态（empty）

<Demo name="data-table-web-empty" description="默认空态 + empty 插槽。" />

## 边框形态（border / single-line / single-column）

<Demo name="data-table-web-border" description="bordered / single-line / single-column / bottom-bordered 组合。" />

## 尺寸（size）

<Demo name="data-table-web-size" description="small / medium / large。" />

## 斑马纹（striped）

<Demo name="data-table-web-striped" description="奇数页行条纹。" />

## 加载中（loading）

<Demo name="data-table-web-loading" description="loading 遮罩 + 内联 SVG spinner。" />

## 行属性（row-props / row-class-name）

<Demo name="data-table-web-row-props" description="rowProps 绑定事件、rowClassName 按行数据上色。" />

## 排序（sorter）

<Demo name="data-table-web-filter-and-sorter" description="非受控排序 + 筛选联动（defaultSortOrder / sorter / filter）。" />

### 自定义排序图标行为（sorter: true）

<Demo name="data-table-web-custom-sorter" description="sorter=true 只渲染图标，排序交给远端。" />

### 受控排序（sortOrder）

<Demo name="data-table-web-controlled-sorter" description="column.sortOrder 受控 + update:sorter。" />

## 筛选（filter）

### 受控筛选（filterOptionValues）

<Demo name="data-table-web-controlled-filter" description="filterOptionValues 受控 + update:filters。" />

## 行选择（selection）

<Demo name="data-table-web-select" description="多选 + disabled 行 + check-all / 半选。" />

### 单选（multiple: false）

<Demo name="data-table-web-select-single" description="radio 式单选，隐藏表头全选。" />

## 展开行（expand）

<Demo name="data-table-web-expand" description="type: expand + renderExpand + default-expanded-row-keys。" />

## 总结栏（summary）

<Demo name="data-table-web-summary" description="summary 返回 value + colSpan。" />

## 固定表头（max-height）

<Demo name="data-table-web-fixed-header" description="max-height 滚动容器 + 吸顶表头。" />

## 固定列（fixed）

<Demo name="data-table-web-fixed-header-column" description="scroll-x + fixed left/right sticky 列。" />

## 自定义标题渲染（title render）

<Demo name="data-table-web-render-header" description="title 传入渲染函数。" />

## 自定义单元格渲染（render）

<Demo name="data-table-web-render-cell" description="render 返回 VNode。" />

## 列类名（className）

<Demo name="data-table-web-custom-style" description="column.className 自定义列样式。" />

## 文本省略（ellipsis）

<Demo name="data-table-web-ellipsis" description="ellipsis + 原生 title 兜底。" />

## 横向滚动（scroll-x）

<Demo name="data-table-web-scroll-x" description="scroll-x 设定内容最小宽度。" />

## 受控分页（pagination）

<Demo name="data-table-web-controlled-page" description="page / page-size 受控 + 尺寸选择器。" />

## API

### SnDataTable Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| columns | `DataTableColumn[]` | `[]` | 列定义（基础列 / selection / expand / index），类型见下方 Column 说明 |
| data | `object[]` | `[]` | 行数据 |
| row-key | `(row) => string \| number` | — | 行 key 取值函数（缺省取 `row.key`） |
| row-props | `(row, index) => HTMLAttributes` | — | 行上的额外属性 |
| row-class-name | `string \| (row, index) => string` | — | 行类名 |
| striped | `boolean` | `false` | 斑马条纹 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸（th/td padding 8/12/12px） |
| bordered | `boolean` | `true` | 是否显示外框边框 |
| bottom-bordered | `boolean` | `true` | 是否显示底边（bordered 为 true 时无效） |
| single-line | `boolean` | `true` | 是否不显示列分割线 |
| single-column | `boolean` | `false` | 是否不显示行分割线 |
| loading | `boolean` | `false` | 显示加载态（遮罩 + spinner，阻断勾选/分页） |
| scroll-x | `number \| string` | — | 表格内容最小宽度（横向滚动） |
| max-height | `number \| string` | — | 表格内容最大高度（吸顶表头，table-layout 固定为 fixed） |
| summary | `(pageData) => SummaryRow \| SummaryRow[]` | — | 总结栏数据（value + colSpan） |
| summary-placement | `'top' \| 'bottom'` | `'bottom'` | 总结栏位置 |
| checked-row-keys | `Array<string \| number>` | — | 选中的行 key（v-model:checked-row-keys） |
| default-checked-row-keys | `Array<string \| number>` | `[]` | 非受控默认选中 key |
| expanded-row-keys | `Array<string \| number>` | — | 展开行 key（v-model:expanded-row-keys） |
| default-expanded-row-keys | `Array<string \| number>` | `[]` | 非受控默认展开 key |
| pagination | `false \| object` | `false` | 简化分页条配置（见下） |

### DataTableColumn（列类型）

基础列：`key`（必填）、`title`（string | 渲染函数）、`align` / `titleAlign`、`width` / `minWidth` / `maxWidth`、`fixed`（`'left' | 'right'`，sticky 实现）、`sorter`（`'default' | 比较函数 | true`）、`defaultSortOrder`、`sortOrder`（受控）、`filter`（`'default' | 函数 | true`）、`filterOptions`、`filterMultiple`（默认 `true`）、`filterMode`（`'or' | 'and'`，默认 `'or'`）、`filterOptionValues` / `filterOptionValue`（受控）、`defaultFilterOptionValues` / `defaultFilterOptionValue`、`ellipsis`、`render(row, rowIndex)`、`className`。

特殊列：

| type | 专属字段 | 说明 |
| --- | --- | --- |
| `'selection'` | `multiple`（默认 `true`）、`disabled(row)` | 勾选列；单选模式隐藏表头全选 |
| `'expand'` | `renderExpand(row, index)`、`expandable(row)` | 展开列 |
| `'index'` | `title` | 序号列（页内 1 起编号；naive 无此类型，为 sn 扩展） |

### DataTablePagination（内置简化分页）

`page` / `defaultPage` / `pageSize` / `defaultPageSize` / `itemCount` / `pageCount` / `showSizePicker` / `pageSizes` / `onChange(page)` / `onUpdatePageSize(pageSize)`。内置分页为简化实现（页码窗口 + 上下页 + 原生 select 页大小 + 总数前缀），SnPagination 独立组件为 future marker（AUI-WEB-DATA-008）。

### 事件

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| update:checked-row-keys | `(keys, rows, { row, action })` | 勾选变化；action ∈ check / uncheck / checkAll / uncheckAll |
| update:expanded-row-keys | `(keys)` | 展开变化 |
| update:filters | `(filters, column)` | 筛选提交 |
| update:sorter | `(DataTableSortState \| null)` | 表头排序点击（descend → ascend → false 循环） |
| update:page | `(page)` | 页码变化 |
| update:page-size | `(pageSize)` | 页大小变化 |

### Slots

| 名称 | 说明 |
| --- | --- |
| empty | 覆盖默认「无数据」空态 |

完整契约见组件 `ai-description.md`。

## 已知差异 / 未实现（future marker）

单表格容器 + sticky 表头（非 naive 双表滚动同步）；筛选浮层为内联面板（点击外部关闭）；ellipsis 用原生 title 兜底；未实现：virtual-scroll、flex-height、可拖拽列宽、树形数据、ellipsis tooltip 浮层、remote 数据、CSV 导出、实例方法（sort/filter/page 等）。
