# Pagination · Web（PC 端）

分页器：把长列表 / 表格结果拆成多页展示，支持页码省略折叠、快速跳页、每页条数切换与简洁模式。

## 何时使用

- 列表 / 表格数据量超出单屏，需要分批加载与翻页。
- 需要展示总条数（showTotal）或让用户直接跳转到某一页（showQuickJumper）。
- 需要切换每页条数并保持页码语义正确（showSizePicker + pageSizes）。
- 工具栏空间有限时使用简洁模式（simple），只保留前后翻页与当前页输入。

## 代码演示

### 基础用法

`v-model:page` 受控当前页，`showTotal` 显示总条数，`showQuickJumper` 打开跳页输入（回车提交）。

<Demo name="pagination-web-basic" description="v-model:page 受控 + showTotal 总条数 + showQuickJumper 跳页输入。" />

### 条数切换 / 省略号 / 简洁模式

页数超过 `pageSlot`（默认 9）时折叠为「首页 + 当前页邻域 + 尾页 + 省略号」；`showSizePicker` 用下拉切换每页条数；`simple` 收敛为一行；`label` 插槽可自定义页码内容。

<Demo name="pagination-web-picker-simple" description="showSizePicker + pageSizes、pageSlot 省略折叠、simple 简洁模式、label 插槽。" />

## API

### SnPagination Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| page | `number \| undefined` | `undefined` | 当前页（受控）；不传时组件内部维护状态 |
| item-count | `number` | `0` | 数据总条数，用于推导总页数 |
| page-size | `number \| null \| undefined` | `undefined` | 每页条数（受控）；不传时内部维护 |
| default-page | `number` | `1` | 非受控模式的初始页码 |
| default-page-size | `number` | `10` | 非受控模式的初始每页条数 |
| page-count | `number \| undefined` | `undefined` | 显式总页数，优先于 `itemCount / pageSize` 计算 |
| page-sizes | `Array<number \| { label: string; value: number }>` | `[10, 20, 30, 40]` | 条数切换器的选项；纯数字渲染为 `N / 页` |
| show-quick-jumper | `boolean` | `false` | 显示「跳至」输入框，回车 / 失焦提交 |
| show-size-picker | `boolean` | `false` | 显示每页条数下拉（内置 SnSelect） |
| page-slot | `number` | `9` | 页码按钮的最大显示数，超出折叠省略号 |
| show-total | `boolean` | `false` | 显示「共 N 条」 |
| simple | `boolean` | `false` | 简洁模式：上一页 / 页码输入 / 总页数 / 下一页 |
| disabled | `boolean` | `false` | 禁用全部分页控件 |

### SnPagination Events

| Event | 参数 | 说明 |
| --- | --- | --- |
| update:page | `(page: number)` | 页码提交（页码点击 / 跳页输入 / 简洁模式输入） |
| update:page-size | `(pageSize: number)` | 每页条数提交 |

### SnPagination Slots

| Slot | 参数 | 说明 |
| --- | --- | --- |
| prev | — | 上一页按钮的自定义内容（默认箭头图标） |
| next | — | 下一页按钮的自定义内容 |
| prefix | — | 分页器左侧内容 |
| suffix | — | 分页器右侧内容 |
| label | `{ page: number }` | 自定义页码文案 |

省略号仅为静态指示（aria-hidden），不提供悬停快进快退。

## Tokens

| Token | 用途 |
| --- | --- |
| `--sn-web-color-text-secondary` | 基础文字 / 省略号 |
| `--sn-web-color-text-tertiary` | 总条数 / 跳页标签 / 总页数 |
| `--sn-web-color-action-primary` | 当前页高亮（16% 底 + 主色文字） |
| `--sn-web-button-height-small` | 页码项高度（28px 回退） |

## A11y

| 属性 | 说明 |
| --- | --- |
| `role="navigation"` + `aria-label="Pagination"` | 根元素语义 |
| `aria-current="page"` | 当前页按钮 |
| `aria-label="第 N 页" / "上一页" / "下一页"` | 按钮可访问名 |
| 原生 `button` / `input` | 键盘可直接操作；`disabled` 同步原生属性 |

## AI Patch Boundary

- AI 生成的 JSON Patch 只允许修改以上 Props 数据面（如 `page`、`pageSize`、`showTotal`）。
- 不允许通过 Patch 注入事件处理器、插槽内容或组件内部状态。
- `page` / `pageSize` 受控时，组件只上报事件，不自行改值；Patch 应同步修改宿主数据源。
- `pageCount` 与 `itemCount` 同时出现时以 `pageCount` 为准，Patch 二者须保持一致语义。

完整契约见组件 `ai-description.md`。
