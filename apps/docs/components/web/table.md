# Table · Web（PC 端）

简单表格（对标 n-table）。你写 `thead/tbody/tr/th/td`，组件负责外层 `<table>` 容器、合并边框网格、表头底色与斑马纹。需要排序/筛选/选择请用 [DataTable](./data-table)。

## 何时使用

- 展示简单的静态分区数据；
- 单元格内容由调用方完全掌控（含合并、嵌套结构）。

## 基础用法

<Demo name="table-web-basic" description="默认合并边框 + 表头底色。" />

## 边框（bordered / bottom-bordered）

<Demo name="table-web-bordered" description="外框边框；bordered 为 true 时 bottom-bordered 无效。" />

## 尺寸（size）

<Demo name="table-web-size" description="small / medium / large（padding 6/12/12px）。" />

## 单列边框（single-column）

<Demo name="table-web-single-column" description="只保留行分割线。" />

## 列分割线（single-line）

<Demo name="table-web-single-line" description="single-line 默认 true；设为 false 恢复列分割线。" />

## 斑马纹（striped）

<Demo name="table-web-striped" description="偶数行条纹底色。" />

## API

### SnTable Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| bordered | `boolean` | `true` | 是否显示外框边框 |
| bottom-bordered | `boolean` | `true` | 表格底部是否有边框（bordered 为 true 时无效） |
| single-column | `boolean` | `false` | 不显示行分割线（单元格无下边线） |
| single-line | `boolean` | `true` | 不显示列分割线（单元格无右边线） |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 表格尺寸 |
| striped | `boolean` | `false` | 是否使用斑马线条纹 |

事件：无；Slots：`default`（使用者自行编写 thead/tbody）。

完整契约见组件 `ai-description.md`。
