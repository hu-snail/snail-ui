# Cascader · Web（PC 端）

级联选择器。Teleport 多级列面板，路径 v-model，支持过滤与 hover 展开。列宽固定（不随内容自适应），超长文本省略。

## 基础用法

<Demo name="cascader-web-basic" description="多级列逐级选择，路径 v-model。" />

## 多选模式（multiple）

通过设置 `multiple` 开启树选择多选模式。每一行渲染勾选框，勾选父节点会级联勾选其全部可选后代叶子（v-model 提交每条叶子的完整路径）；触发器按路径渲染可删除的 tag，`maxTagCount` 折叠为 `+N`，勾选过程中菜单保持展开。

<Demo name="cascader-web-multiple" description="multiple 多选：父级级联勾选、tag 回显与单独删除。" />

## 严格选择模式（check-strictly）

设置 `check-strictly` 开启严格选择模式，点击任何节点都可以选择。单选时点击父级会提交其自身完整路径并同时展开下级，便于继续下钻；多选时解除父子节点的关联 —— 每个勾选框只代表自身，勾选父级不再级联后代，也没有半选状态。过滤命中同样包含父级节点。

<Demo name="cascader-web-strictly" description="check-strictly：单选点击父级即选中并展开；多选勾选互不关联。" />

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

| Prop                                    | 类型                                         | 默认值      | 说明                                                  |
| --------------------------------------- | -------------------------------------------- | ----------- | ----------------------------------------------------- |
| modelValue                              | `SnCascaderValue[]` \| `SnCascaderValue[][]` | `[]`        | 单选：叶节点完整路径；多选：路径数组（清空提交 `[]`） |
| options                                 | `SnCascaderOptionInput[]`                    | `[]`        | 树形选项（children 分级）                             |
| placeholder                             | `string`                                     | —           | 占位                                                  |
| clearable                               | `boolean`                                    | `false`     | 清空按钮                                              |
| filterable                              | `boolean`                                    | `false`     | 按路径文本匹配                                        |
| multiple                                | `boolean`                                    | `false`     | 多选（树选择）：勾选父级级联全部可选后代叶子          |
| maxTagCount                             | `number`                                     | —           | 多选时最多展示的 tag 数，其余折叠为 `+N`              |
| checkStrictly                           | `boolean`                                    | `false`     | 严格选择：任意节点（含父级）可提交；多选解除父子关联  |
| disabled / readonly                     | `boolean`                                    | `false`     | 禁用 / 只读                                           |
| size                                    | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'`  | 尺寸                                                  |
| status                                  | `'default'\|'error'\|'warning'`              | `'default'` | 校验状态                                              |
| labelField / valueField / childrenField | `string`                                     | —           | 字段映射                                              |
| expandTrigger                           | `'click'\|'hover'`                           | `'click'`   | 下级展开触发                                          |

事件：`update:modelValue` / `change` / `clear` / `focus` / `blur`；Slot：`empty`。键盘：ArrowLeft/Right 切列、ArrowUp/Down 移动、Enter 选中叶（多选时切换勾选且不关闭；`check-strictly` 单选时高亮父级同样提交）、Esc 关闭。回显：路径 label 以 " / " 连接；多选时每条路径一个 tag。菜单列宽固定为 `--sn-web-cascader-column-width`（默认 160px），不随内容自适应；面板宽度由已展开的列决定（初始一列，每展开一级加宽一列），不与触发器同宽。

完整契约见组件 `ai-description.md`。
