# Cascader · Web（PC 端）

级联选择器。Teleport 多级列面板，路径 v-model，支持过滤与 hover 展开。

## 基础用法

<Demo name="cascader-web-basic" description="多级列逐级选择，路径 v-model。" />

## 可过滤（filterable）

<Demo name="cascader-web-filterable" description="按完整路径文本匹配，命中平铺展示。" />

## 自定义字段

<Demo name="cascader-web-fields" description="labelField / valueField / childrenField。" />

## 展开触发（expand-trigger）

<Demo name="cascader-web-trigger" description="click（默认）/ hover 展开下级。" />

## 可清空 / 禁用

<Demo name="cascader-web-states" description="clearable、disabled、disabled 项。" />

## API

### SnCascader Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue | `SnCascaderValue[]` | `[]` | 叶节点完整路径（清空提交 `[]`） |
| options | `SnCascaderOptionInput[]` | `[]` | 树形选项（children 分级） |
| placeholder | `string` | — | 占位 |
| clearable | `boolean` | `false` | 清空按钮 |
| filterable | `boolean` | `false` | 按路径文本匹配 |
| disabled / readonly | `boolean` | `false` | 禁用 / 只读 |
| size | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'` | 尺寸 |
| status | `'default'\|'error'\|'warning'` | `'default'` | 校验状态 |
| labelField / valueField / childrenField | `string` | — | 字段映射 |
| expandTrigger | `'click'\|'hover'` | `'click'` | 下级展开触发 |

事件：`update:modelValue` / `change` / `clear` / `focus` / `blur`；Slot：`empty`。键盘：ArrowLeft/Right 切列、ArrowUp/Down 移动、Enter 选中叶、Esc 关闭。回显：路径 label 以 " / " 连接。

完整契约见组件 `ai-description.md`。
