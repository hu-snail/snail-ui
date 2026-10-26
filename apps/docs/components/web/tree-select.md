# TreeSelect · Web（PC 端）

树形选择器。Teleport 树面板（缩进 + 展开箭头），单选 / 多选 / 过滤。

## 基础用法

<Demo name="tree-select-web-basic" description="树面板单选，父/叶均可选。" />

## 多选（multiple）

<Demo name="tree-select-web-multiple" description="tag 列表回显可删，勾选独立不级联。" />

## 默认全展开 + 过滤

<Demo name="tree-select-web-filter" description="defaultExpandAll；filterable 命中展开祖先。" />

## 自定义字段

<Demo name="tree-select-web-fields" description="labelField / keyField / childrenField。" />

## 可清空 / 禁用

<Demo name="tree-select-web-states" description="clearable、disabled、disabled 项。" />

## API

### SnTreeSelect Props

| Prop                                  | 类型                                       | 默认值                   | 说明                            |
| ------------------------------------- | ------------------------------------------ | ------------------------ | ------------------------------- |
| modelValue                            | `SnTreeSelectValue \| SnTreeSelectValue[]` | —                        | 单值或 multiple 数组            |
| multiple                              | `boolean`                                  | `false`                  | 多选（勾选独立不级联）          |
| options                               | `SnTreeSelectOptionInput[]`                | `[]`                     | 树形选项                        |
| defaultExpandAll                      | `boolean`                                  | `false`                  | 初始全展开                      |
| placeholder                           | `string`                                   | —                        | 占位                            |
| clearable                             | `boolean`                                  | `false`                  | 清空按钮                        |
| filterable                            | `boolean`                                  | `false`                  | label 匹配 + 展开祖先           |
| disabled / readonly                   | `boolean`                                  | `false`                  | 禁用 / 只读                     |
| size / status                         | 同其它表单组件                             | `'medium'` / `'default'` | 尺寸 / 校验状态                 |
| labelField / keyField / childrenField | `string`                                   | —                        | 字段映射（原始 `key` 字段优先） |

事件：`update:modelValue` / `change` / `clear` / `focus` / `blur`；Slot：`empty`。键盘：ArrowUp/Down 移动、ArrowLeft 收起/跳父、ArrowRight 展开/下钻、Enter 选中、Esc 关闭。aria：tree + treeitem（aria-level/expanded/selected）。

完整契约见组件 `ai-description.md`。
