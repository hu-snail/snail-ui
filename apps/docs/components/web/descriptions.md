# 描述列表 Descriptions · Web（PC 端）

成组的 key/value 明细展示，网格布局，支持多列、跨列与描边。

## 何时使用

- 详情面板、订单摘要等需要成组展示只读字段的场景
- 需要控制总列数、条目跨列数
- 多行内容较多时用描边网格增强可读性

## 代码演示

### 基础用法

<Demo name="descriptions-web-basic" description="默认三列，label 在内容上方。" />

### 总列数

<Demo name="descriptions-web-columns" description="column 控制网格总列数（1 / 2 / 3）。" />

### 跨列

<Demo name="descriptions-web-span" description="SnDescriptionsItem 的 span 让条目占据多列。" />

### label 位置

<Demo name="descriptions-web-placement" description="label-placement：top（默认）/ left。" />

### 描边

<Demo name="descriptions-web-bordered" description="bordered 描边网格，可组合 label-placement / label-align。" />

### 尺寸

<Demo name="descriptions-web-size" description="size：small / medium / large 三档。" />

## API

### SnDescriptions Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| title | `string` | `undefined` | 表格上方的标题，`header` 插槽可覆盖 |
| column | `number` | `3` | 网格总列数 |
| label-placement | `'left' \| 'top'` | `'top'` | label 相对内容的位置 |
| label-align | `'left' \| 'right' \| 'center'` | `'left'` | label 对齐方式 |
| separator | `string` | `':'` | 行内分隔符，仅 `label-placement="left"` 且非 bordered 时生效 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸（字号 + 单元格内边距） |
| bordered | `boolean` | `false` | 是否显示描边网格 |
| label-class | `string` | `undefined` | 应用到所有 label 单元格 / 行内 label 的类名 |
| label-style | `string \| CSSProperties` | `undefined` | 应用到所有 label 单元格 / 行内 label 的样式 |
| content-class | `string` | `undefined` | 应用到所有内容单元格 / 行内内容的类名 |
| content-style | `string \| CSSProperties` | `undefined` | 应用到所有内容单元格 / 行内内容的样式 |

### SnDescriptions Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| default | `()` | `SnDescriptionsItem` 条目列表 |
| header | `()` | 标题内容，覆盖 `title` |

### SnDescriptionsItem Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| label | `string` | `undefined` | 条目 label 文本，`label` 插槽可覆盖 |
| span | `number` | `1` | 条目占据的列数 |
| label-class | `string` | `undefined` | 条目级 label 类名 |
| label-style | `string \| CSSProperties` | `undefined` | 条目级 label 样式 |
| content-class | `string` | `undefined` | 条目级内容类名 |
| content-style | `string \| CSSProperties` | `undefined` | 条目级内容样式 |

### SnDescriptionsItem Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| default | `()` | 条目内容 |
| label | `()` | 条目 label，覆盖 `label` |

布局规则：网格按 `column * 2` 条物理轨道展开；每行最后一个条目自动撑满剩余轨道；`label-placement="top"` 会输出一行隐藏的定宽辅助行。

单元格留白：非描边模式下内容单元格带 12px 横向列间距（与 label 行一致），`label-placement="left"` 的相邻条目不再彼此贴住；描边网格沿用 12px 16px 的单元格内边距（small 8px 12px / large 16px 24px）。

完整契约见组件 `ai-description.md`。
