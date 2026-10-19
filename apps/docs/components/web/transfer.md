# Transfer · Web（PC 端）

穿梭框：左面板为未选（源），右面板为已选（目标），配合全选表头、四个移动按钮与面板内搜索，完成批量勾选迁移。

## 何时使用

- 从候选集合中批量挑选若干项（权限分配、部门选择、字段筛选）。
- 需要一次性全部迁移（单箭头移动勾选项，双箭头移动全部可移动项）。
- 候选数量较多，需要按标题搜索过滤（filterable）。
- 部分条目只读不可迁移（option 级 disabled）。

## 代码演示

### 基础用法

`v-model:value` 绑定已选值数组；面板头勾选框支持全选与半选态；单箭头迁移勾选项，双箭头迁移全部。

<Demo name="transfer-web-basic" description="v-model:value 双面板穿梭 + 已选回显。" />

### 搜索过滤 / 禁用项 / 自定义行渲染

`filterable` 打开两侧搜索框（placeholder 可分别配置）；`disabled` 选项不可勾选不可迁移；`renderSourceLabel` / `renderTargetLabel` 自定义行内容。

<Demo name="transfer-web-filter" description="filterable 搜索 + sourceTitle / targetTitle + disabled 选项 + renderSourceLabel。" />

## API

### SnTransfer Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| options | `Array<{ label: string; value: string \| number; disabled?: boolean }>` | `[]` | 可迁移条目 |
| value | `Array<string \| number> \| undefined` | `undefined` | 已选值（受控）；不传时组件内部维护 |
| default-value | `Array<string \| number>` | `[]` | 非受控模式的初始已选值 |
| filterable | `boolean` | `false` | 显示两侧搜索框 |
| source-filter-placeholder | `string \| undefined` | `undefined` | 源面板搜索占位（回退「请搜索」） |
| target-filter-placeholder | `string \| undefined` | `undefined` | 目标面板搜索占位（回退「请搜索」） |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 行高 / 按钮尺寸档位 |
| disabled | `boolean` | `false` | 禁用全部控件 |
| source-title | `string \| undefined` | `undefined` | 源面板标题（回退「源」） |
| target-title | `string \| undefined` | `undefined` | 目标面板标题（回退「目标」） |
| render-source-label | `({ option }) => VNodeChild \| undefined` | `undefined` | 源面板行渲染函数 |
| render-target-label | `({ option }) => VNodeChild \| undefined` | `undefined` | 目标面板行渲染函数 |

### SnTransfer Events

| Event | 参数 | 说明 |
| --- | --- | --- |
| update:value | `(value: Array<string \| number>)` | 移动操作提交的已选值数组 |

### SnTransfer Slots

无插槽。行内容自定义走 `renderSourceLabel` / `renderTargetLabel` 渲染函数。

行为说明：

- 目标面板顺序跟随 `value` 数组顺序。
- 移动按钮自上而下：右移选中项、全部右移、左移选中项、全部左移。
- 行内勾选状态为组件内部状态，不通过事件对外暴露。
- 面板高度可通过 `--sn-transfer-list-height` 覆盖（默认 200px）。

## Tokens

| Token | 用途 |
| --- | --- |
| `--sn-web-color-border-default` / `-subtle` | 面板边框 / 表头分隔线 |
| `--sn-web-color-background-surface` / `-subtle` | 面板底色 / 表头与行悬停底色 |
| `--sn-web-color-text-primary` / `-tertiary` / `-disabled` | 行文字 / 计数 / 禁用项文字 |
| `--sn-web-input-radius` | 面板圆角 |
| `--sn-web-button-height-small` / `-medium` / `-large` | 三档行高 |
| `--sn-transfer-list-height` | 列表高度（可覆盖，默认 200px） |

## A11y

| 属性 | 说明 |
| --- | --- |
| `role="listbox"` + `aria-multiselectable="true"` | 两个列表容器 |
| `role="option"` + `aria-selected` / `aria-disabled` | 行语义，随勾选动态更新 |
| 全选勾选框 | 半选时呈现 mixed 状态；空列表自动禁用 |
| 移动按钮 `aria-label` | 右移选中项 / 全部右移 / 左移选中项 / 全部左移，不可用时置灰 |
| 原生 checkbox | 行点击切换，Tab + Space 键盘可达 |

## AI Patch Boundary

- AI 生成的 JSON Patch 只允许修改以上 Props 数据面（如 `value`、`options`、`sourceTitle`）。
- 不允许通过 Patch 修改行勾选内部状态、注入事件处理器或插槽。
- `value` 必须是 `options` 中存在的值集合的子集；Patch 新增 `options` 时须同步维护 `value`。
- `disabled: true` 的选项不可被 Patch 移入 `value`。

完整契约见组件 `ai-description.md`。
