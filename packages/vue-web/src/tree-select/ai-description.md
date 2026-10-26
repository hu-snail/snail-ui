# SnTreeSelect

Web 端树形选择组件，对标 naive-ui `n-tree-select` 1:1。位于 `packages/vue-web/src/tree-select/`。

## 概述

`SnTreeSelect` 是带树形下拉面板的选择器：触发器展示选中值（单选显示 label，多选显示 tag 列表），点击展开 Teleport 到 body 的树面板。叶节点与父节点均可选——选中父节点只提交父节点自身的值，不做级联勾选。面板定位为 SnSelect 同款简化 popper（fixed 坐标 + 下方优先 + 视口不足翻转到上方）。

## 简化说明（对齐任务边界）

- `checkable` 与 `multiple` 合一：`checkable` 是 `multiple` 的别名，多选勾选互相独立，不级联（对齐 naive 默认 `checkStrategy` 的简化处理）。
- `expandedKeys` 受控展开简化为**非受控展开**：组件内部维护展开状态，不暴露受控 API。
- 展开状态在 `defaultExpandAll` 下于首次渲染播种；用户手动切换任意节点后不再重新播种。

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null \| Array<string \| number>` | `null` | 绑定值（`v-model`）；多选模式为数组 |
| `multiple` | `boolean` | `false` | 多选模式（tag 回显、菜单不关、勾选独立） |
| `checkable` | `boolean` | `false` | `multiple` 的别名（多选复选模式合一） |
| `options` | `{ label, key \| value, disabled?, children? }[]` | `[]` | 树形选项；`key` 缺省读 `value` 字段，仍缺省用下标 |
| `defaultExpandAll` | `boolean` | `false` | 首次渲染展开全部父节点 |
| `placeholder` | `string` | `'Please select'` | 空值占位文案 |
| `clearable` | `boolean` | `false` | 有值时显示清空按钮 |
| `filterable` | `boolean` | `false` | 启用内置过滤输入（按 label 匹配，命中自动展开祖先） |
| `disabled` | `boolean` | `false` | 禁用（不弹面板、不可清空） |
| `readonly` | `boolean` | `false` | 只读（不弹面板） |
| `size` | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸 |
| `status` | `'default' \| 'error' \| 'warning'` | `'default'` | 视觉状态（边框色 + `aria-invalid`） |
| `labelField` | `string` | `'label'` | label 字段名 |
| `keyField` | `string` | `'key'` | key 字段名（缺省回退 `value` 字段） |
| `childrenField` | `string` | `'children'` | 子节点字段名 |
| `ariaLabel` | `string` | `''` | 无障碍标签 |
| `emptyText` | `string` | `'No data'` | 空状态文案（`empty` slot 优先） |
| `customClass` / `customStyle` | `string` / `string \| object` | `''` | 根节点透传 |

## Events

| 事件 | Payload | 触发时机 |
| --- | --- | --- |
| `update:modelValue` | `value \| value[] \| null` | 选中 / 取消选中 / 删 tag / 清空 |
| `change` | 同上 | 同上 |
| `clear` | — | 清空按钮激活 |
| `focus` / `blur` | `FocusEvent` | 触发器焦点变化 |

## Slots

| Slot | 说明 |
| --- | --- |
| `empty` | 无选项 / 过滤无命中时的面板内容 |

## 交互语义

- **选择**：点击节点行提交该节点值。单选后关闭面板并回焦触发器；多选切换成员且保持面板打开。父节点可选中且只提交自身值；disabled 节点不可选中（其子节点仍可选，展开开关不受 disabled 影响）。
- **展开/收起**：点击父节点行的 switcher 箭头切换（inline SVG，展开时旋转 90°）；缩进按深度计算（`--sn-web-tree-select-node-indent` × depth）。
- **过滤**：query 对 label 做大小写不敏感包含匹配；节点自身命中或后代命中则保留，命中节点的祖先自动展开显示；query 清空后恢复用户手动展开状态。
- **键盘**：`Enter` 开面板 / 选中高亮节点；`ArrowUp`/`ArrowDown` 在可见节点间移动高亮（wrap，可落在 disabled 节点上但 Enter 不提交）；`ArrowRight` 展开折叠的父节点、已展开则落到第一个子节点；`ArrowLeft` 收起已展开的父节点、叶子/已收起则跳到父节点行；`Escape` 关闭；`Backspace`（多选 + 空 query）删除最后一个 tag；`Space` 开面板（过滤输入聚焦时不吞空格）。
- **面板开关**：触发器点击切换；点击组件外部（document mousedown 监听）关闭；监听在 `onBeforeUnmount` 移除。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import SnTreeSelect from '@/tree-select/SnTreeSelect.vue'

const value = ref(null)
const options = [
  {
    label: 'Fruits',
    key: 'fruits',
    children: [
      { label: 'Apple', key: 'apple' },
      { label: 'Banana', key: 'banana' },
    ],
  },
  { label: 'Milk', key: 'milk' },
]
</script>

<template>
  <SnTreeSelect v-model="value" :options="options" default-expand-all clearable />
</template>
```

## Tokens

| Token | 默认值 | 用途 |
| --- | --- | --- |
| `--sn-web-tree-select-height` | `22–40px`（按 size） | 触发器高度 |
| `--sn-web-tree-select-radius` | `6px` | 圆角 |
| `--sn-web-tree-select-border-color` / `-focus` | border-default / action-primary | 边框色 |
| `--sn-web-tree-select-bg` / `-text-color` / `-placeholder-color` | surface / text-primary / text-tertiary | 触发器底色/文字/占位 |
| `--sn-web-tree-select-focus-ring` | `--sn-web-focus-ring` | 焦点环 |
| `--sn-web-tree-select-tag-bg` / `-text-color` | background-subtle / text-primary | tag 胶囊 |
| `--sn-web-tree-select-tag-close-color` / `-hover` / `-bg-hover` | text-tertiary / text-primary / rgba | tag 删除按钮 |
| `--sn-web-tree-select-clear-color` / `-hover` / `-bg-hover` | 同上 | 清空按钮 |
| `--sn-web-tree-select-arrow-color` | text-tertiary | 下拉箭头 |
| `--sn-web-tree-select-bg-disabled` / `-text-color-disabled` / `-border-color-disabled` | subtle / text-disabled / border-subtle | 禁用态 |
| `--sn-web-tree-select-menu-bg` / `-border-color` / `-radius` / `-z-index` | elevated / border-default / 6px / `1000` | 面板外观 |
| `--sn-web-tree-select-menu-max-height` | `260px` | 面板最大高度（内部滚动） |
| `--sn-web-tree-select-menu-shadow` | 双层 rgba 阴影 | 面板阴影 |
| `--sn-web-tree-select-node-min-height` / `-font-size` / `-text-color` | `30px` / `14px` / text-primary | 节点行 |
| `--sn-web-tree-select-node-padding-x` / `-indent` | `10px` / `16px` | 节点水平内边距 / 每级缩进 |
| `--sn-web-tree-select-node-bg-hover` | `rgba(0,0,0,0.045)` | 高亮行底色 |
| `--sn-web-tree-select-node-bg-selected` / `-text-color-selected` / `-selected-bar-color` | rgba / action-primary / action-primary | 选中行 |
| `--sn-web-tree-select-node-text-color-disabled` | text-disabled | 禁用节点文字 |
| `--sn-web-tree-select-switcher-color` / `-hover` / `-radius` | text-tertiary / text-primary / `4px` | 展开箭头 |
| `--sn-web-tree-select-empty-color` / `-padding-y` | text-tertiary / `12px` | 空状态 |

## Accessibility

- 触发器：`role="combobox"` + `aria-haspopup="tree"` + `aria-expanded` + `aria-controls` + `aria-activedescendant`。
- 面板：`role="tree"`（多选时 `aria-multiselectable`）。
- 节点行：`role="treeitem"` + `aria-selected` + `aria-disabled` + `aria-level`（深度+1）+ 父节点 `aria-expanded`。
- 键盘高亮通过 `aria-activedescendant` 暴露；`aria-invalid` 随 `status="error"` 置位。
