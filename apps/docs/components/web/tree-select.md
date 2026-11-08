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

## 连接线（show-line）

下拉树面板内绘制父子连接线，四个维度与 `SnTree` 完全对齐：`line-mode`（`branch` / `guide`；`guide` 只画竖向缩进引导线、不画横向分叉）、`line-style`（`solid` / `dashed`）、`line-corner`（`square` / `rounded`，仅 `branch` 生效）、`line-color`（任意 CSS 颜色）。圆角是紧凑的四分之一圆弧（横线抬到行中线上方、盒子高度等于半径；非末子节点保留整行竖线所以主干不断，末子节点把竖线截到弧线起点、由弧线收尾），`--sn-web-tree-select-line-radius` 同时控制横纵半径（默认 3px），应明显小于半个行高；`line-color` 注入到 Teleport 后的面板元素上，因此能覆盖 `--sn-web-tree-select-line-color`（默认取边框色）。线的位置跟随面板缩进与箭头尺寸的 token。

<Demo name="tree-select-web-line" description="直角实线 / 直角虚线 / 圆角自定义颜色三种面板对照。" />

<Demo name="tree-select-web-guide" description="line-mode=&quot;guide&quot; 的缩进引导线：只画贯穿子树的竖线、不画横向分叉；实线 / 虚线对照。" />

## 选项图标（icon）

`options` 的每一项可直接带 `icon` 字段，无需渲染属性；下拉面板里节点文案前会渲染该图标。取值与 `SnTree` 一致：已注册的 `SnIcon` 图标名、图标组件、VNode / VNode 数组、零参渲染函数；未注册的字符串按纯文本渲染。颜色跟随 `--sn-web-tree-select-node-icon-color`。

```ts
import { h } from 'vue';
import { Folder, FileCode } from 'lucide-vue-next';

const options = [
  {
    label: 'src',
    value: 'src',
    icon: Folder, // 图标组件
    children: [{ label: 'app.ts', value: 'app.ts', icon: FileCode }],
  },
  { label: 'README.md', value: 'README.md', icon: h('i', { class: 'file-icon' }) }, // VNode
];
```

类型 `SnTreeSelectIcon = VNodeChild | Component | (() => VNodeChild)`，从 `@snui/vue-web` 导出；`icon` 不参与 `labelField / keyField / childrenField` 字段映射。

## API

### SnTreeSelect Props

| Prop                                  | 类型                                       | 默认值                   | 说明                              |
| ------------------------------------- | ------------------------------------------ | ------------------------ | --------------------------------- |
| modelValue                            | `SnTreeSelectValue \| SnTreeSelectValue[]` | —                        | 单值或 multiple 数组              |
| multiple                              | `boolean`                                  | `false`                  | 多选（勾选独立不级联）            |
| options                               | `SnTreeSelectOptionInput[]`                | `[]`                     | 树形选项                          |
| defaultExpandAll                      | `boolean`                                  | `false`                  | 初始全展开                        |
| placeholder                           | `string`                                   | —                        | 占位                              |
| clearable                             | `boolean`                                  | `false`                  | 清空按钮                          |
| filterable                            | `boolean`                                  | `false`                  | label 匹配 + 展开祖先             |
| disabled / readonly                   | `boolean`                                  | `false`                  | 禁用 / 只读                       |
| size / status                         | 同其它表单组件                             | `'medium'` / `'default'` | 尺寸 / 校验状态                   |
| labelField / keyField / childrenField | `string`                                   | —                        | 字段映射（原始 `key` 字段优先）   |
| showLine                              | `boolean`                                  | `false`                  | 面板内显示父子节点连接线          |
| lineMode                              | `'branch' \| 'guide'`                      | `'branch'`               | 连接线形态：L 形分叉 / 缩进引导线 |
| lineStyle                             | `'solid' \| 'dashed'`                      | `'solid'`                | 连接线样式：实线 / 虚线           |
| lineCorner                            | `'square' \| 'rounded'`                    | `'square'`               | 连接线拐角：直角 / 圆角           |
| lineColor                             | `string`                                   | `undefined`              | 连接线颜色，覆盖面板的线色变量    |

选项数据字段：`label` / `key` 或 `value` / `children` / `disabled` / `icon`（`SnTreeSelectIcon`）。图标仅作用于下拉面板中的节点，不影响已选标签回显。

事件：`update:modelValue` / `change` / `clear` / `focus` / `blur`；Slot：`empty`。键盘：ArrowUp/Down 移动、ArrowLeft 收起/跳父、ArrowRight 展开/下钻、Enter 选中、Esc 关闭。aria：tree + treeitem（aria-level/expanded/selected）。

完整契约见组件 `ai-description.md`。
