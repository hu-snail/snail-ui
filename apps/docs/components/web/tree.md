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

### 复选框 + 拖拽

复选框与原生 HTML5 拖拽可同时使用：拖到行上 / 下缘调整同级顺序，拖到非叶节点中部移入该节点。默认不级联勾选（勾选子节点不会改变父节点），需要联动时加 `cascade`。

<Demo name="tree-web-checkable-drag" description="checkable + draggable + line-mode=&quot;guide&quot;；拖拽调整顺序或移入文件夹。" />

### 禁用与状态

禁用节点不可选中、不可勾选、不可展开；checkboxDisabled 仅禁用勾选。

<Demo name="tree-web-disabled" description="disabled / checkboxDisabled 节点。" />

### 前缀与后缀

节点级 prefix / suffix 字段，或树级 render-prefix / render-suffix 渲染函数。

<Demo name="tree-web-prefix-suffix" description="option 字段与渲染函数两种来源。" />

### 节点图标（icon）

无需渲染函数，直接在节点数据上写 `icon` 字段即可。支持：已通过 `registerSnIcons` 注册的图标名（走 `SnIcon`，14px）、图标组件、VNode、VNode 数组、零参渲染函数；未注册的普通字符串按纯文本渲染，不会让整行空白。连接线 demo 中的文件/文件夹图标即由该字段提供。

```ts
import { h } from 'vue';
import { Folder, FileCode } from 'lucide-vue-next';
import type { SnTreeOption } from '@snui/vue-web';

const data: SnTreeOption[] = [
  {
    key: 'src',
    label: 'src',
    icon: Folder, // 图标组件
    children: [{ key: 'app', label: 'app.ts', icon: FileCode }],
  },
  { key: 'readme', label: 'README.md', icon: h('i', { class: 'file-icon' }) }, // VNode
];
```

类型 `SnTreeIcon = VNodeChild | Component | (() => VNodeChild)`，从 `@snui/vue-web` 导出。

拖拽相关类型 `SnTreeDropPosition` / `SnTreeAllowDropInfo` / `SnTreeAllowDrop` / `SnTreeDragInfo` / `SnTreeDropInfo` 同样从 `@snui/vue-web` 导出。

### 整行选中（block-line）

悬停与选中背景铺满整行，而不是只铺节点文本。

<Demo name="tree-web-block-line" description="block-line 整行高亮。" />

### 连接线（show-line）

在父子节点间绘制连接线。默认的 `branch` 模式为 L 形：分支未结束的行保留竖向贯穿线，最后一个子节点的线止于行中线；`guide` 模式只画竖向缩进引导线。四个独立维度可组合：

- `line-mode`：`branch`（默认，L 形分叉线）/ `guide`（缩进引导线：每个层级只画一条贯穿整棵子树的竖线，不画横向分叉；`line-corner` 仅在 `branch` 下生效）。
- `line-style`：实线 `solid`（默认）/ 虚线 `dashed`。
- `line-corner`：直角 `square`（默认）/ 圆角 `rounded`。圆角是一个紧凑的四分之一圆弧：横线元素向上抬到行中线之上、盒子高度等于半径，由 `border-left` 弯入 `border-bottom`。非末子节点保留整行竖引导线，弧线从主干上顺切分出，所以主干不断、分支自然分叉；末子节点把竖线截到弧线起点，由弧线自己收尾。`--sn-web-tree-line-radius`（默认 3px）同时控制**横向与纵向半径**；半径应明显小于半个行高，否则弧线会退化成大弯。
- `line-color`：任意 CSS 颜色或 token 字符串，注入为组件内的 `--sn-web-tree-line-color`；不传时走 token 链并回退到边框色。

线宽随 `indent` 变化；`showLine` 为 false 时四个配置都不生效、DOM 零变化。

<Demo name="tree-web-line" description="直角实线 / 直角虚线 / 圆角自定义颜色三种连接线布局对照。" />

<Demo name="tree-web-guide" description="line-mode=&quot;guide&quot; 的缩进引导线：只画贯穿子树的竖线、不画横向分叉；实线 / 虚线对照。" />

### 空状态

data 为空时的占位渲染，可用 empty 插槽自定义。

<Demo name="tree-web-empty" description="默认空文案 + empty 插槽。" />

## API

### SnTree Props

| 名称                | 类型                                                  | 默认值       | 说明                                                                 |
| ------------------- | ----------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| data                | `SnTreeOption[]`                                      | `[]`         | 树节点数据                                                           |
| keyField            | `string`                                              | `'key'`      | 节点 key 的字段名                                                    |
| labelField          | `string`                                              | `'label'`    | 节点文案的字段名                                                     |
| childrenField       | `string`                                              | `'children'` | 子节点列表的字段名                                                   |
| defaultExpandedKeys | `SnTreeKey[]`                                         | `[]`         | 初始展开的节点（非受控）                                             |
| expandedKeys        | `SnTreeKey[] \| undefined`                            | `undefined`  | 受控展开节点；`undefined` 时为非受控，支持 `v-model:expanded-keys`   |
| defaultExpandAll    | `boolean`                                             | `false`      | 初始展开全部非叶节点                                                 |
| selectable          | `boolean`                                             | `true`       | 点击节点是否可选中                                                   |
| selectedKeys        | `SnTreeKey[] \| undefined`                            | `undefined`  | 受控选中节点；支持 `v-model:selected-keys`                           |
| defaultSelectedKeys | `SnTreeKey[]`                                         | `[]`         | 初始选中节点（非受控）                                               |
| multiple            | `boolean`                                             | `false`      | 允许多选节点                                                         |
| cancelable          | `boolean`                                             | `true`       | 再次点击已选中节点是否取消选中                                       |
| checkable           | `boolean`                                             | `false`      | 显示节点复选框                                                       |
| checkedKeys         | `SnTreeKey[] \| undefined`                            | `undefined`  | 受控勾选节点；支持 `v-model:checked-keys`                            |
| defaultCheckedKeys  | `SnTreeKey[]`                                         | `[]`         | 初始勾选节点（非受控）                                               |
| cascade             | `boolean`                                             | `false`      | 勾选向下级联；父级按子级勾选状态呈现全选/半选                        |
| blockLine           | `boolean`                                             | `false`      | 悬停/选中背景铺满整行                                                |
| indent              | `number`                                              | `24`         | 每一级缩进宽度（px）                                                 |
| showLine            | `boolean`                                             | `false`      | 显示父子节点连接线（L 形引导线）                                     |
| lineMode            | `'branch' \| 'guide'`                                 | `'branch'`   | 连接线形态：L 形分叉 / 缩进引导线；仅 `showLine` 开启时生效          |
| lineStyle           | `'solid' \| 'dashed'`                                 | `'solid'`    | 连接线样式：实线 / 虚线；仅 `showLine` 开启时生效                    |
| lineCorner          | `'square' \| 'rounded'`                               | `'square'`   | 连接线拐角：直角 / 圆角；仅 `showLine` 开启时生效                    |
| lineColor           | `string`                                              | `undefined`  | 连接线颜色（任意 CSS 色值或 token）；覆盖 `--sn-web-tree-line-color` |
| draggable           | `boolean`                                             | `false`      | 开启行的 HTML5 拖拽                                                  |
| allowDrop           | `(info: { node, dropPosition, phase }) => boolean`    | `undefined`  | 拖拽 / 放置闸门；默认禁止拖入叶节点                                  |
| renderPrefix        | `(info: { option, checked, selected }) => VNodeChild` | `undefined`  | 节点前缀渲染函数                                                     |
| renderSuffix        | `(info: { option, checked, selected }) => VNodeChild` | `undefined`  | 节点后缀渲染函数                                                     |

### SnTree Events

| 名称                | 参数                                                                       | 说明                                     |
| ------------------- | -------------------------------------------------------------------------- | ---------------------------------------- |
| update:expandedKeys | `(keys, options, meta: { node, action: 'expand' \| 'collapse' })`          | 展开状态变化                             |
| update:selectedKeys | `(keys, options, meta: { node, action: 'select' \| 'unselect' })`          | 选中变化                                 |
| update:checkedKeys  | `(keys, options, meta: { node, action: 'check' \| 'uncheck' })`            | 勾选变化（级联模式下仅含完全勾选的节点） |
| dragStart           | `{ node, event }`                                                          | 开始拖拽                                 |
| dragEnter           | `{ node, event }`                                                          | 拖拽进入某行                             |
| dragLeave           | `{ node, event }`                                                          | 拖拽离开某行                             |
| dragEnd             | `{ node, event }`                                                          | 拖拽结束（放置或取消）                   |
| drop                | `{ node, dragNode, dropPosition: 'before' \| 'inside' \| 'after', event }` | 放置在目标行；由宿主更新数据             |

### SnTree Slots

| 名称  | 参数 | 说明             |
| ----- | ---- | ---------------- |
| empty | —    | 无数据时的空状态 |

### SnTreeOption 字段

| 字段             | 类型                           | 说明                                              |
| ---------------- | ------------------------------ | ------------------------------------------------- |
| key              | `string \| number`             | 节点唯一标识（缺省时自动生成）                    |
| label            | `string`                       | 节点文案                                          |
| children         | `SnTreeOption[]`               | 子节点                                            |
| disabled         | `boolean`                      | 禁用节点（不可选、不可勾、不可展开）              |
| isLeaf           | `boolean`                      | 强制按叶节点渲染（不显示展开箭头）                |
| icon             | `SnTreeIcon`                   | 节点级前置图标：图标名/组件/VNode/渲染函数/纯文本 |
| prefix / suffix  | `string \| (() => VNodeChild)` | 节点级前缀/后缀                                   |
| checkboxDisabled | `boolean`                      | 仅禁用该节点的复选框                              |

无障碍：根节点 `role="tree"`，行 `role="treeitem"`（`aria-expanded` / `aria-selected`），复选框 `role="checkbox"`（`aria-checked` 三态）；连接线为纯装饰（`aria-hidden`，不拦截点击）。拖拽基于 HTML5 drag & drop（鼠标 / 触控板），键盘重排、虚拟滚动、键盘导航、异步加载子节点、勾选策略枚举为后续迭代项，暂未实现。

完整契约见组件 `ai-description.md`。
