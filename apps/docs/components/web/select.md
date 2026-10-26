# Select · Web（PC 端）

选择器。Teleport 下拉 + 视口翻转定位，单选 / 多选 / 过滤 / 分组 / 远程搜索。

## 基础用法

<Demo name="select-web-basic" description="options + v-model 单选。" />

## 多选（multiple）

<Demo name="select-web-multiple" description="数组 v-model + tag 删除 + maxTagCount。" />

## 可过滤（filterable）

<Demo name="select-web-filterable" description="输入过滤候选，支持自定义 filter。" />

## 分组（children）

<Demo name="select-web-group" description="options 带 children 渲染分组标题。" />

## 自定义字段（labelField / valueField）

<Demo name="select-web-fields" description="非 label/value 字段名映射。" />

## 可清空 / 禁用 / 加载

<Demo name="select-web-states" description="clearable、disabled、loading。" />

## API

### SnSelect Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue | `SnSelectValue \| SnSelectValue[] \| null` | `null` | v-model（multiple 为数组） |
| multiple | `boolean` | `false` | 多选 |
| options | `Array<SnSelectOptionInput>` | `[]` | 选项（裸值或对象，children 分组） |
| labelField / valueField | `string` | `'label'` / `'value'` | 字段映射 |
| placeholder | `string` | — | 占位文案 |
| clearable | `boolean` | `false` | 清空按钮 |
| filterable | `boolean` | `false` | 输入过滤 |
| filter | `(pattern, option) => boolean` | 内置包含匹配 | 自定义过滤 |
| disabled / readonly | `boolean` | `false` | 禁用 / 只读 |
| size | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'` | 尺寸 |
| status | `'default'\|'error'\|'warning'` | `'default'` | 校验状态 |
| maxTagCount | `number` | — | 多选 tag 上限 |
| tag | `boolean` | `false` | 多选 tag 胶囊形态 |
| loading | `boolean` | `false` | 下拉加载态 |
| remote | `boolean` | `false` | 远程搜索（配合 loading + search 事件） |

事件：`update:modelValue` / `change` / `search` / `clear` / `focus` / `blur`；Slots：`action` / `empty` / `header`。键盘：Enter / Space / ArrowUp / ArrowDown / Esc / Backspace（多选删尾）。aria：listbox + aria-expanded + aria-activedescendant。

完整契约见组件 `ai-description.md`。
