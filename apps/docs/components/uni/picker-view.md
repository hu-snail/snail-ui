# PickerView 选择器视图（uni 端 / 移动端）

`sn-picker-view` 是 `@snui/uni` 的滚轮本体（`sn-picker` 的内核）：多列滚轮、键名解析与级联推导。easycom 自动注册（`components/sn-picker-view/sn-picker-view.vue` → `<sn-picker-view>`），几何值使用 `rpx`。因为 CONTRIBUTING §2.3 的跨端元素白名单里没有原生 `picker-view`，滚轮由 `<view>` + `transform: translateY()` + touch 事件实现。触摸状态是普通组件状态，`touchend` / `touchcancel` 复位，组件销毁即消失——没有全局监听、没有定时器。

## 基础用法

sn-picker-view 单列滚轮：columns 传字符串数组，tap 某一行即可选中。

<Demo name="picker-view-mp-basic" description="sn-picker-view 单列滚轮：columns 传字符串数组，tap 某一行即可选中。" />

## 级联与禁用（`cascade` / `disabled` / `valueKey`）

cascade 模式下 columns 传树形结构，组件按已选路径推导后续列；disabled 整列不可交互。

<Demo name="picker-view-mp-cascade" description="cascade 模式下 columns 传树形结构，组件按已选路径推导后续列；disabled 整列不可交互。" />

## 几何与自定义字段名（`itemHeight` / `visibleItemCount` / `valueKey` / `labelKey` / `childrenKey`）

`item-height` 是每行高度（px 设计值 → rpx）、`visible-item-count` 决定可见行数；`value-key` / `label-key` / `children-key` 让组件读取业务字段，不必把数据改成 `value` / `label` / `children`。

<Demo name="picker-view-mp-keys-geometry" description="itemHeight / visibleItemCount 调行高与可见行数；valueKey / labelKey / childrenKey 读取自定义字段名。" />

## 拖动即时回写与根节点样式（`immediateChange` / `customClass` / `customStyle`）

`immediate-change` 让拖动过程中持续 commit（不等松手）；`custom-class` / `custom-style` 落在根节点上改滚轮外框。

<Demo name="picker-view-mp-immediate-custom" description="immediateChange 拖动中持续触发 change；customClass / customStyle 改根节点外框与底色。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `Array<string \| number>` | `[]` | 各列选中值 |
| `columns` | `Array<Array<string \| number \| object>>` | `[]` | 列数据；`cascade` 时传选项树 |
| `itemHeight` | `number` | `44` | 单项高度（px 设计值） |
| `visibleItemCount` | `number` | `6` | 可见项数量 |
| `valueKey` / `labelKey` / `childrenKey` | `string` | `'value'` / `'label'` / `'children'` | 选项字段名 |
| `immediateChange` | `boolean` | `false` | 拖动过程中立即触发 change |
| `cascade` | `boolean` | `false` | 把 columns 当树处理 |
| `disabled` | `boolean` | `false` | 禁用滚轮 |
| `customClass` / `customStyle` | `string` | `''` | 根节点自定义类名 / 样式 |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 选中值变化时 | `(value: Array)` |
| `change` | 选中值确定（或 immediateChange 时每次移动） | `PickerViewChangePayload` |
| `pickstart` / `pickend` | 触摸拖动开始 / 结束 | — |

## Exposed API

| 成员 | 签名 | 说明 |
| --- | --- | --- |
| `getSelectedValues` | `() => Array` | 当前各列值 |
| `getSelectedOptions` | `() => Array` | 当前各列原始选项 |
| `getSelectedLabels` | `() => string[]` | 当前各列文案 |
| `getSelectedIndex` / `getColumnIndex` | `() => number[]` | 当前各列行号 |
| `getColumnsData` / `getColumnData` | `(index?) => Array` | 归一化后的列数据 |
| `resetColumns` | `() => void` | 各列复位到第一个可选行 |

## Slots

本组件不提供插槽。

## 主题变量

| 变量 | 用途 |
| --- | --- |
| ``--sn-mp-color-background-elevated`` | 滚轮底色 |
| ``--sn-mp-color-text-primary` / `-secondary` / `-disabled`` | 选中 / 普通 / 禁用行文字 |
| ``--sn-mp-color-border-subtle`` | 选中指示线 |
| ``--sn-mp-font-size-md`` | 行文字字号 |
| ``--sn-mp-font-weight-semibold`` | 选中行字重 |
| ``--sn-mp-spacing-2` / `-3`` | 指示线内缩 / 行内边距 |

## 无障碍

- 根节点 `role="group"` + `aria-disabled`。
- 每行为 `role="button"`，带 `aria-selected` / `aria-disabled`。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` / `page.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：

