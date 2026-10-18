# Tree 树形控件 · Web（PC 端）

以缩进层级展示树形数据，支持节点展开/收起、单选/多选、以及带级联与半选态的复选勾选。

## 何时使用

- 文件目录、组织架构、地区划分等具有明确父子层级的数据展示与导航。
- 需要按层级逐级浏览并在节点间做单选或多选。
- 需要以复选框批量圈选节点，且勾选需要向子级联动（父级半选提示）。

## 代码演示

### 基础用法

数据 + 默认展开 + 受控选中。

<Demo name="tree-web-basic" description="defaultExpandedKeys 展开父级，v-model:selected-keys 单选。" />

### 自定义字段名

数据结构字段与默认约定不一致时重映射。

<Demo name="tree-web-fields" description="keyField / labelField / childrenField。" />

### 多选

multiple 模式下点击切换选中。

<Demo name="tree-web-multiple" description="v-model:selected-keys 为数组，点击切换。" />

### 级联勾选

勾选联动子级，父级根据子级状态呈现全选/半选。

<Demo name="tree-web-cascade" description="checkable + cascade，v-model:checked-keys。" />

### 禁用与状态

禁用节点不可选中、不可勾选、不可展开；checkboxDisabled 仅禁用勾选。

<Demo name="tree-web-disabled" description="disabled / checkboxDisabled 节点。" />

### 前缀与后缀

节点级 prefix / suffix 字段，或树级 render-prefix / render-suffix 渲染函数。

<Demo name="tree-web-prefix-suffix" description="option 字段与渲染函数两种来源。" />

### 整行选中（block-line）

悬停与选中背景铺满整行，而不是只铺节点文本。

<Demo name="tree-web-block-line" description="block-line 整行高亮。" />

### 空状态

data 为空时的占位渲染，可用 empty 插槽自定义。

<Demo name="tree-web-empty" description="默认空文案 + empty 插槽。" />

## API

### SnTree Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| data | `SnTreeOption[]` | `[]` | 树节点数据 |
| keyField | `string` | `'key'` | 节点 key 的字段名 |
| labelField | `string` | `'label'` | 节点文案的字段名 |
| childrenField | `string` | `'children'` | 子节点列表的字段名 |
| defaultExpandedKeys | `SnTreeKey[]` | `[]` | 初始展开的节点（非受控） |
| expandedKeys | `SnTreeKey[] \| undefined` | `undefined` | 受控展开节点；`undefined` 时为非受控，支持 `v-model:expanded-keys` |
| defaultExpandAll | `boolean` | `false` | 初始展开全部非叶节点 |
| selectable | `boolean` | `true` | 点击节点是否可选中 |
| selectedKeys | `SnTreeKey[] \| undefined` | `undefined` | 受控选中节点；支持 `v-model:selected-keys` |
| defaultSelectedKeys | `SnTreeKey[]` | `[]` | 初始选中节点（非受控） |
| multiple | `boolean` | `false` | 允许多选节点 |
| cancelable | `boolean` | `true` | 再次点击已选中节点是否取消选中 |
| checkable | `boolean` | `false` | 显示节点复选框 |
| checkedKeys | `SnTreeKey[] \| undefined` | `undefined` | 受控勾选节点；支持 `v-model:checked-keys` |
| defaultCheckedKeys | `SnTreeKey[]` | `[]` | 初始勾选节点（非受控） |
| cascade | `boolean` | `false` | 勾选向下级联；父级按子级勾选状态呈现全选/半选 |
| blockLine | `boolean` | `false` | 悬停/选中背景铺满整行 |
| indent | `number` | `24` | 每一级缩进宽度（px） |
| renderPrefix | `(info: { option, checked, selected }) => VNodeChild` | `undefined` | 节点前缀渲染函数 |
| renderSuffix | `(info: { option, checked, selected }) => VNodeChild` | `undefined` | 节点后缀渲染函数 |

### SnTree Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| update:expandedKeys | `(keys, options, meta: { node, action: 'expand' \| 'collapse' })` | 展开状态变化 |
| update:selectedKeys | `(keys, options, meta: { node, action: 'select' \| 'unselect' })` | 选中变化 |
| update:checkedKeys | `(keys, options, meta: { node, action: 'check' \| 'uncheck' })` | 勾选变化（级联模式下仅含完全勾选的节点） |

### SnTree Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| empty | — | 无数据时的空状态 |

### SnTreeOption 字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| key | `string \| number` | 节点唯一标识（缺省时自动生成） |
| label | `string` | 节点文案 |
| children | `SnTreeOption[]` | 子节点 |
| disabled | `boolean` | 禁用节点（不可选、不可勾、不可展开） |
| isLeaf | `boolean` | 强制按叶节点渲染（不显示展开箭头） |
| prefix / suffix | `string \| (() => VNodeChild)` | 节点级前缀/后缀 |
| checkboxDisabled | `boolean` | 仅禁用该节点的复选框 |

无障碍：根节点 `role="tree"`，行 `role="treeitem"`（`aria-expanded` / `aria-selected`），复选框 `role="checkbox"`（`aria-checked` 三态）。拖拽、虚拟滚动、键盘导航、异步加载子节点、勾选策略枚举为后续迭代项，暂未实现。

完整契约见组件 `ai-description.md`。
