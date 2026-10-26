# Table 表格（uni 端 / 移动端）

`sn-table` 是 `@snui/uni`（移动端 / 小程序 / H5）的数据表格：表头、边框、斑马纹、索引列、可排序表头与左固定列。基于 easycom 自动注册（`components/sn-table/sn-table.vue` → `<sn-table>`，`sn-table-column.vue` → `<sn-table-column>`），样式几何值走 `rpx`。

横滚由 `<scroll-view scroll-x>` 承担；传 `height` 打开纵向滚动，`fixed-header` 在滚动时固定表头。列通过 `sn-table-column` 子组件声明，容器用 provide/inject 收集，因此**列顺序 = DOM 顺序**。

## 基础用法

`data` 是行数组，列由 `sn-table-column` 的 `prop` / `label` 声明。`index` 打开序号列，`sortable` 让表头可点（`none → asc → desc`），组件**不重排数据**，只把顺序通过 `sort-method` 报给宿主。

<Demo name="table-mp-basic" description="索引列 + 可排序表头 + 固定高度 / 固定表头 / 左固定列。" />

## 单元格与空态

- `ellipsis` 让单元格文本两行省略
- `value` 插槽可完全自定义某列单元格，参数为 `{ row, index }`
- 无数据时渲染内置「暂无数据」行，`empty` 插槽可替换
- `border` / `stripe` 分别控制边框与斑马纹

<Demo name="table-mp-cell" description="两行省略、value 插槽渲染 sn-tag、内置空态。" />

## 边框、斑马纹与表头

- `border` / `stripe` 分别控制单元格边框与斑马纹
- `showHeader=false` 隐藏表头，只留数据行
- `index` 传对象可自定义序号列表头 / 宽度 / 对齐（`{ label, width, align }`）
- `customClass` / `customStyle` 作用于表格根节点

<Demo name="table-mp-style" description="border / stripe 开关、index 配置对象、show-header 关闭，以及 customClass / customStyle。" />

## 未实现能力

以下 wd-table 属性**未声明**（CONTRIBUTING §2.2：不实现的能力不出现）：

| 属性 | 原因 |
| --- | --- |
| `virtual` / `row-height` / `buffer` | 可靠的虚拟滚动需要 `scroll-top` 与逐行高度测量，而 `<scroll-view>` 在微信 / 支付宝 / H5 上报的滚动偏移并不一致。本组件渲染全部行以保证各端行为一致；大数据量请配合 `height` + `fixed-header` 使用 |
| `span-method` | 跨端 `rowspan` / `colspan` 会打乱按列宽计算的固定列偏移 |

## Props（`sn-table`）

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `Record<string, unknown>[]` | `[]` | 表格数据源 |
| `border` | `boolean` | `true` | 是否显示边框 |
| `stripe` | `boolean` | `true` | 是否显示斑马纹 |
| `height` | `string \| number` | `undefined` | 最大高度（数字按设计稿 px）；设置后开启纵向滚动 |
| `showHeader` | `boolean` | `true` | 是否显示表头 |
| `ellipsis` | `boolean` | `false` | 单元格文本两行省略 |
| `index` | `boolean \| SnTableIndexConfig` | `false` | 是否显示索引列；对象可自定义 `label` / `width` / `align` |
| `fixedHeader` | `boolean` | `true` | 是否固定表头（`position: sticky`） |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 根节点自定义样式 |

## Props（`sn-table-column`）

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `prop` | `string` | `''` | 列对应的数据字段名 |
| `label` | `string` | `''` | 列标题 |
| `width` | `string \| number` | `100` | 列宽（数字按设计稿 px） |
| `sortable` | `boolean` | `false` | 是否开启排序 |
| `fixed` | `boolean` | `false` | 是否固定当前列（仅支持固定在左侧） |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | 内容对齐方式 |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `sort-method` | 点击可排序列表头后触发 | `{ prop, label, order }` |
| `row-click` | 点击表格行时触发 | `{ rowIndex, row }` |

## Slots

| 插槽名 | 所属组件 | 说明 |
| --- | --- | --- |
| `default` | `sn-table` | 列声明（`sn-table-column` 子组件） |
| `empty` | `sn-table` | 替换内置空态行 |
| `value` | `sn-table-column` | 自定义单元格内容，参数 `{ row, index }` |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| `--sn-mp-color-background-elevated` | 表格底盘 |
| `--sn-mp-color-background-subtle` | 表头背景 |
| `--sn-mp-color-background-soft` | 斑马纹背景 |
| `--sn-mp-color-border-subtle` | 单元格边框 |
| `--sn-mp-color-text-primary` | 正文颜色 |
| `--sn-mp-color-text-secondary` | 表头文字 |
| `--sn-mp-color-text-tertiary` | 空态文字 |
| `--sn-mp-color-text-disabled` | 未激活排序箭头 |
| `--sn-mp-color-action-primary` | 激活排序箭头 |
| `--sn-mp-font-size-sm` | 单元格字号 |
| `--sn-mp-font-weight-semibold` | 表头字重 |
| `--sn-mp-font-line-height-normal` | 单元格行高 |
| `--sn-mp-spacing-1` / `--sn-mp-spacing-3` / `--sn-mp-spacing-4` / `--sn-mp-spacing-10` | 表头间隙 / 单元格内边距 / 空态内边距 |
| `--sn-mp-radius-lg` | 表格圆角 |

## 无障碍

- 根节点 `role="table"`；表头单元格 `role="columnheader"`，正文单元格 `role="cell"`，行 `role="row"`
- 可排序表头挂 `aria-sort`（`ascending` / `descending` / `none`）
- 排序箭头 `aria-hidden="true"`，状态由 `aria-sort` 承担
- 行点击是纯指针交互；是否需要键盘可达由宿主决定

## 暗色模式

底盘、表头、斑马纹、边框与文字全部走 `--sn-mp-color-*` 语义色，都在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：

## 相关

- 分页：[`sn-pagination`](/components/uni/pagination)
- 空态插画：[`sn-empty`](/components/uni/empty)
- 加载态：[`sn-loading`](/components/uni/loading)
