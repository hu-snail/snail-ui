# Transfer 穿梭框（Web 端）

穿梭框用左右两个面板呈现候选项与已选项，配合全选表头、四个移动按钮与面板内搜索完成批量勾选迁移。

## 何时使用

- 从候选集合中批量挑选若干项：权限分配、部门选择、字段筛选。
- 需要一次性全部迁移（单箭头移动勾选项，双箭头移动全部可移动项）。
- 候选数量较多，需要按面板标题搜索过滤（`filterable`）。
- 部分条目只读不可迁移（选项级 `disabled`）。

## 代码演示

### 基础用法

`v-model:value` 绑定已选值数组，目标面板按 `value` 顺序回显；面板表头勾选框支持全选与半选态，单箭头迁移已勾选项，双箭头迁移全部可移动项。

<Demo name="transfer-web-basic" description="v-model:value 双面板穿梭 + 已选顺序回显。" />

### 搜索过滤与面板标题

`filterable` 打开两侧搜索框，`source-filter-placeholder` / `target-filter-placeholder` 分别定制占位文案，`source-title` / `target-title` 定制面板标题；选项级 `disabled` 的锁定项置灰且不参与勾选与迁移。

<Demo name="transfer-web-filter" description="filterable 搜索 + 面板标题与占位文案定制 + 选项级 disabled。" />

### 自定义行渲染

`render-source-label` / `render-target-label` 接收 `{ option }` 并返回节点，用于在行内叠加图标、分组标签等富内容；两侧可分别渲染不同形态。

<Demo name="transfer-web-render" description="renderSourceLabel / renderTargetLabel 双面板自定义行内容。" />

### 禁用态

对照两种禁用粒度：选项级 `disabled` 只锁定单条目，其余条目照常迁移；组件级 `disabled` 让勾选、移动按钮与搜索全部失效，整体呈只读态。

<Demo name="transfer-web-disabled" description="选项级 disabled 与组件级 disabled 对照。" />

## API

### Props

| 名称                      | 类型                                                                    | 默认值      | 说明                                                                          |
| ------------------------- | ----------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------- |
| options                   | `Array<{ label: string; value: string \| number; disabled?: boolean }>` | `[]`        | 可迁移条目；`label` 同时用于默认行文案与搜索匹配。                            |
| value                     | `Array<string \| number> \| undefined`                                  | `undefined` | 已选值（右面板数据源）。`undefined` 为不受控模式，由 `default-value` 初始化。 |
| default-value             | `Array<string \| number>`                                               | `[]`        | 不受控模式的初始已选值。                                                      |
| filterable                | `boolean`                                                               | `false`     | 显示两侧搜索框，按 `label` 做包含匹配。                                       |
| source-filter-placeholder | `string \| undefined`                                                   | `undefined` | 源面板搜索占位，未提供时回退为「请搜索」。                                    |
| target-filter-placeholder | `string \| undefined`                                                   | `undefined` | 目标面板搜索占位，未提供时回退为「请搜索」。                                  |
| size                      | `'small' \| 'medium' \| 'large'`                                        | `'medium'`  | 行高与控件尺寸档位。                                                          |
| disabled                  | `boolean`                                                               | `false`     | 禁用全部控件（勾选 / 移动按钮 / 搜索）。                                      |
| source-title              | `string \| undefined`                                                   | `undefined` | 源面板标题，未提供时回退为「源」。                                            |
| target-title              | `string \| undefined`                                                   | `undefined` | 目标面板标题，未提供时回退为「目标」。                                        |
| render-source-label       | `(data: { option }) => VNodeChild`                                      | `undefined` | 源面板行内容渲染函数，未提供时渲染 `option.label`。                           |
| render-target-label       | `(data: { option }) => VNodeChild`                                      | `undefined` | 目标面板行内容渲染函数，未提供时渲染 `option.label`。                         |

### Events

| 名称         | 参数                               | 说明                                           |
| ------------ | ---------------------------------- | ---------------------------------------------- |
| update:value | `(value: Array<string \| number>)` | 移动操作提交的已选值数组，顺序为目标面板顺序。 |

### Slots

无。行内容自定义走 `render-source-label` / `render-target-label` 渲染函数。

### Methods

无。组件未通过 `defineExpose` 暴露实例方法。

行为说明：

- 目标面板顺序跟随 `value` 数组顺序，`options` 中不存在的值会被跳过。
- 移动按钮自上而下：右移选中项、全部右移、左移选中项、全部左移。
- 行内勾选状态为组件内部状态，不通过事件对外暴露。
- 面板高度可用 `--sn-transfer-list-height` 覆盖（默认 200px）。

## Tokens

| Token        | CSS 变量                            | 用途                       |
| ------------ | ----------------------------------- | -------------------------- |
| 默认边框色   | `--sn-web-color-border-default`     | 面板外框                   |
| 细分隔线色   | `--sn-web-color-border-subtle`      | 表头分隔线                 |
| 背景表面色   | `--sn-web-color-background-surface` | 列表面板底色               |
| 背景弱底色   | `--sn-web-color-background-subtle`  | 表头底色与行悬停           |
| 主文本色     | `--sn-web-color-text-primary`       | 面板标题与行文字           |
| 三级文字色   | `--sn-web-color-text-tertiary`      | 已选计数                   |
| 禁用文字色   | `--sn-web-color-text-disabled`      | 禁用项行文字               |
| 输入圆角     | `--sn-web-input-radius`             | 面板圆角（回退 3px）       |
| 小号按钮高度 | `--sn-web-button-height-small`      | `size="small"` 行高        |
| 中号按钮高度 | `--sn-web-button-height-medium`     | `size="medium"` 行高       |
| 大号按钮高度 | `--sn-web-button-height-large`      | `size="large"` 行高        |
| 列表高度     | `--sn-transfer-list-height`         | 面板列表高度（默认 200px） |

## 无障碍

- 两个列表面板带 `role="listbox"` 与 `aria-multiselectable="true"`，可访问名取自面板标题。
- 每行带 `role="option"`、`aria-selected` 与 `aria-disabled`，随勾选与禁用状态动态更新。
- 表头勾选框带「全选 <面板标题>」标签，可迁移项为空时自动禁用；半选时呈现 mixed 状态。
- 四个移动按钮带「右移选中项」/「全部右移」/「左移选中项」/「全部左移」标签，不可用时置灰。
- 行内使用原生 `checkbox`，点击行即可切换，Tab 聚焦 + 空格键可达；搜索框带「过滤源列表」/「过滤目标列表」标签。

## AI Patch Boundary

| 可安全由 AI 生成                                   | 需要人工确认                                    |
| -------------------------------------------------- | ----------------------------------------------- |
| `options` 数据与 `value` 的静态组合                | `update:value` 监听回调内的提交 / 回滚逻辑      |
| `source-title` / `target-title` / 两侧搜索占位文案 | 受控 `v-model:value` 与表单校验、提交时机的联动 |
| `filterable` / `size` / `disabled` 展示开关        | 自定义行渲染函数内的交互控件与异步数据          |
| 文档、demo 中的静态组合用法                        | 条目迁移触发的权限变更、批量接口调用            |

- AI 生成的 JSON Patch 只允许修改以上 Props 数据面，不得修改行勾选内部状态、注入事件处理器或插槽。
- `value` 必须是 `options` 中存在值的子集；Patch 新增 `options` 时须同步维护 `value`。
- `disabled: true` 的选项不可被 Patch 移入 `value`。

完整契约见组件 `ai-description.md`。
