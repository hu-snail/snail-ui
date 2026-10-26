# Pagination 分页器（Web 端）

分页器把长列表与表格结果拆成多页展示，负责页码省略折叠、快速跳页、每页条数切换与简洁模式。

## 何时使用

- 列表 / 表格数据量超出单屏，需要分批翻页。
- 需要向用户交代结果总量（`show-total`），或让用户直接跳到某一页（`show-quick-jumper`）。
- 需要切换每页条数并保持总页数语义正确（`show-size-picker` + `page-sizes`）。
- 工具栏空间有限，只保留前后翻页与当前页输入（`simple`）。

## 代码演示

### 基础用法

受控基本形态：`v-model:page` 绑定当前页，`item-count` 推导总页数，`show-total` 显示「共 N 条」，`show-quick-jumper` 打开跳页输入（回车 / 失焦提交并把越界值收敛到合法范围）。

<Demo name="pagination-web-basic" description="v-model:page 受控 + item-count 推导页数 + show-total 总条数 + show-quick-jumper 跳页输入。" />

### 快速跳转与每页条数

跳页输入与条数下拉组合使用：两者分别提交 `update:page` 与 `update:page-size`，宿主把回写的值渲染在下方，验证受控回显链路；条数切换后总页数由 `item-count / page-size` 重新推导。

<Demo name="pagination-web-jumper" description="show-quick-jumper + show-size-picker 组合，页码与每页条数变化实时回显。" />

### 每页条数档位与数据量联动

`page-sizes` 使用 `{ label, value }` 形式给出自定义档位文案（10 / 20 / 50 / 100）；宿主切换数据总量时把页码重置回第 1 页，页码在总页数收敛后始终落在合法区间内。

<Demo name="pagination-web-pagesize" description="label/value 形式的 page-sizes 档位 + 数据总量切换时页码收敛。" />

### 省略折叠、简洁模式与页码插槽

三个并置形态：总页数超出 `page-slot` 时折叠为「首页 + 当前页邻域 + 尾页 + 省略号」；`simple` 收敛成一行（上一页 / 页码输入 / 总页数 / 下一页）；`label` 插槽自定义页码按钮内部文案。

<Demo name="pagination-web-picker-simple" description="省略折叠、simple 简洁模式、label 插槽三种形态并置。" />

### 省略折叠与禁用态

对照 `page-slot` 的影响：默认 9 时 8 页全部平铺，收窄为 5 时首尾保留、中间折叠出省略号；`disabled` 置位后页码、跳页输入与条数下拉全部不可操作，也不会再提交事件。

<Demo name="pagination-web-disabled" description="page-slot 折叠省略号对照 + disabled 整体禁用。" />

## API

### Props

| 名称              | 类型                                                | 默认值             | 说明                                                                                     |
| ----------------- | --------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------- |
| page              | `number \| undefined`                               | `undefined`        | 当前页。`undefined` 为不受控模式，由 `default-page` 初始化；越界值收敛到 `[1, 总页数]`。 |
| item-count        | `number`                                            | `0`                | 数据总条数，`page-count` 未提供时用于推导总页数。                                        |
| page-size         | `number \| null \| undefined`                       | `undefined`        | 每页条数。`undefined` / `null` 回退到内部状态（由 `default-page-size` 初始化）。         |
| default-page      | `number`                                            | `1`                | 不受控模式的初始页码。                                                                   |
| default-page-size | `number`                                            | `10`               | 不受控模式的初始每页条数。                                                               |
| page-count        | `number`                                            | `undefined`        | 显式总页数，优先级高于 `item-count / page-size` 推导结果。                               |
| page-sizes        | `Array<number \| { label: string; value: number }>` | `[10, 20, 30, 40]` | 条数下拉的选项；纯数字渲染为 `N / 页`。                                                  |
| show-quick-jumper | `boolean`                                           | `false`            | 显示「跳至」输入框，回车 / 失焦提交；简洁模式下不渲染。                                  |
| show-size-picker  | `boolean`                                           | `false`            | 显示每页条数下拉。                                                                       |
| page-slot         | `number`                                            | `9`                | 页码按钮的最大数量，总页数超出时折叠省略号。                                             |
| show-total        | `boolean`                                           | `false`            | 显示「共 N 条」。                                                                        |
| simple            | `boolean`                                           | `false`            | 简洁模式：上一页 / 页码输入 / 总页数 / 下一页，不渲染页码列表与跳页输入。                |
| disabled          | `boolean`                                           | `false`            | 禁用全部控件；禁用期间的交互不提交事件。                                                 |

### Events

| 名称             | 参数                 | 说明                                             |
| ---------------- | -------------------- | ------------------------------------------------ |
| update:page      | `(page: number)`     | 页码提交（页码点击 / 跳页输入 / 简洁模式输入）。 |
| update:page-size | `(pageSize: number)` | 每页条数提交（条数下拉选择）。                   |

### Slots

| 名称   | 参数               | 说明                                       |
| ------ | ------------------ | ------------------------------------------ |
| prev   | —                  | 上一页按钮内容，替换默认的左箭头图标。     |
| next   | —                  | 下一页按钮内容，替换默认的右箭头图标。     |
| prefix | —                  | 分页器左侧内容。                           |
| suffix | —                  | 分页器右侧内容。                           |
| label  | `{ page: number }` | 页码按钮内部文案；省略号标记不经过该插槽。 |

### Methods

无。组件未通过 `defineExpose` 暴露实例方法，全部交互经 Props + Events 完成。

行为说明：

- 省略号是静态指示（`aria-hidden`），不提供悬停快进 / 快退。
- `page` / `page-size` 受控时组件只上报事件，不自行改值。
- 简洁模式下 `show-quick-jumper` 不生效，`show-total` 仍在分页器左侧渲染。

## Tokens

| Token        | CSS 变量                        | 用途                                  |
| ------------ | ------------------------------- | ------------------------------------- |
| 次级文字色   | `--sn-web-color-text-secondary` | 默认页码 / 省略号                     |
| 三级文字色   | `--sn-web-color-text-tertiary`  | 总条数 / 跳页标签 / 总页数            |
| 主操作色     | `--sn-web-color-action-primary` | 当前页高亮（16% 主色底 + 主色文字）   |
| 小号按钮高度 | `--sn-web-button-height-small`  | 页码项与省略号的最小宽高（回退 28px） |

## 无障碍

- 根元素带 `role="navigation"` 与 `aria-label="Pagination"`。
- 当前页按钮带 `aria-current="page"`，渲染为「第 N 页」的可访问名。
- 前后翻页按钮带「上一页」/「下一页」标签；跳页输入带说明性 `aria-label`，简洁模式的输入带「当前页码，共 N 页」。
- 页码与翻页使用原生 `button`，跳页与简洁输入使用原生 `input`，键盘可直接操作；`disabled` 同步到原生属性。
- 省略号标记为装饰元素（`aria-hidden`），不被读屏播报。

## AI Patch Boundary

| 可安全由 AI 生成                                                              | 需要人工确认                                                   |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `page` / `page-size` / `page-count` / `item-count` 等数据面绑定               | 受控 `v-model:page` 与宿主数据源的同步策略（列表重新拉取时机） |
| `show-total` / `show-quick-jumper` / `show-size-picker` / `simple` 等展示开关 | 切换每页条数后是否把页码重置回第 1 页                          |
| `page-sizes` 档位文案与静态 `page-slot` 取值                                  | `label` / `prefix` / `suffix` 等插槽内容与事件处理器           |
| 文档、demo 中的静态组合用法                                                   | 分页变化触发的数据请求                                         |

- AI 生成的 JSON Patch 只允许修改以上 Props 数据面，不得注入事件处理器、插槽内容或组件内部状态。
- `page-count` 与 `item-count` 同时出现时以 `page-count` 为准，Patch 二者须保持一致语义。

完整契约见组件 `ai-description.md`。
