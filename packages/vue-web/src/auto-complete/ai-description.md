# SnAutoComplete

Web 端自动完成输入组件，对标 naive-ui `n-auto-complete` 1:1。位于 `packages/vue-web/src/auto-complete/`。

## 概述

`SnAutoComplete` 是带下拉候选面板的受控文本输入框。视觉 token 与尺寸类名结构对齐 `SnInput`（`--sn-web-input-*` / `sn-auto-complete--{size}`），但为独立实现，不依赖 SnInput 内部代码（与 SnInputNumber 同款策略）。下拉面板绝对定位于字段下方（预留 `--flip` 翻转类），候选面板 token 走 `--sn-web-auto-complete-*`。

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | 绑定值（`v-model`） |
| `options` | `(string \| { label?, value?, disabled? })[]` | `[]` | 静态候选列表；label 支持 string 或嵌套 string[]（按段渲染 + 命中段高亮） |
| `getShow` | `(value: string) => options[]` | — | 根据当前输入动态计算候选（naive `get-show`）；提供时覆盖 `options` |
| `placeholder` | `string` | `''` | 占位文案 |
| `clearable` | `boolean` | `false` | 有值时显示清空按钮 |
| `disabled` | `boolean` | `false` | 禁用（输入、选择、清空全部失效） |
| `readonly` | `boolean` | `false` | 只读（不弹下拉） |
| `size` | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸 |
| `status` | `'default' \| 'error' \| 'warning'` | `'default'` | 视觉状态（边框色 + `aria-invalid`） |
| `blurAfterSelect` | `boolean` | `false` | 选中候选后立即 blur（naive `blur-after-select`） |
| `ariaLabel` | `string` | `''` | 无障碍标签 |

## Events

| 事件 | Payload | 触发时机 |
| --- | --- | --- |
| `update:modelValue` | `string` | 每次键入 / 选中 / 清空 |
| `update:value` | `string` | 同上（naive `on-update:value` 别名） |
| `change` | `string` | 选中候选或清空时提交 |
| `select` | `string` | 从下拉选中候选（点击或 Enter），payload 为选项 value |
| `search` | `string` | 每次键入（naive `on-input` 语义） |
| `focus` / `blur` | `FocusEvent` | 原生焦点事件 |

## Slots

| Slot | 说明 |
| --- | --- |
| `empty` | 无候选时的下拉内容（默认 "No data"） |

## 交互语义

- **候选来源**：`getShow` 存在时忽略 `options`（naive 语义）。对象选项提交 `value`（缺省为 label 拼接文本），`disabled` 选项渲染但不可选。
- **嵌套 label 高亮**：label 为 string[] 时按段渲染（空格连接），每段对当前输入值做包含匹配，命中子串以 `--sn-web-auto-complete-highlight-*` 高亮（naive highlight 语义的简化实现）。
- **键盘**：ArrowDown/ArrowUp 移动高亮（跳过 disabled 项，两端 wrap；无高亮时 ArrowUp 落在最后一项）、Enter 选中、Esc 关闭。
- **面板开关**：focus / 键入时打开；blur、Esc、点击组件外部（document pointerdown 监听）关闭。document 监听在 `onBeforeUnmount` 移除。
- **a11y**：input `role="combobox"` + `aria-expanded` + `aria-autocomplete="list"` + `aria-activedescendant`，面板 `role="listbox"`，选项 `role="option"` + `aria-selected`。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import SnAutoComplete from '@/auto-complete/SnAutoComplete.vue'

const value = ref('')
const options = ['Install', 'Interpret', 'Interrogate', 'Intersect']
</script>

<template>
  <SnAutoComplete v-model="value" :options="options" clearable placeholder="Type..." />
</template>
```

## 动态候选（getShow）

```vue
<SnAutoComplete
  v-model="value"
  :get-show="(v) => ['gmail.com', 'outlook.com'].map((d) => v.split('@')[0] + '@' + d)"
/>
```

## Tokens

| Token | 默认值 | 用途 |
| --- | --- | --- |
| `--sn-web-auto-complete-padding-x` | `--sn-web-input-padding-x` | 字段水平内边距 |
| `--sn-web-auto-complete-border-color` / `-focus` | `--sn-web-input-*` | 边框色 |
| `--sn-web-auto-complete-radius` | `--sn-web-input-radius` | 圆角 |
| `--sn-web-auto-complete-bg` / `-text-color` / `-placeholder-color` | `--sn-web-input-*` | 字段底色/文字/占位 |
| `--sn-web-auto-complete-clear-color` / `-hover` | text-tertiary / text-primary | 清空按钮 |
| `--sn-web-auto-complete-menu-gap` | `4px` | 面板与字段间距 |
| `--sn-web-auto-complete-menu-max-height` | `240px` | 面板最大高度 |
| `--sn-web-auto-complete-menu-bg` | `--sn-web-color-background-elevated` | 面板底色 |
| `--sn-web-auto-complete-menu-border-color` | `--sn-web-color-border-subtle` | 面板边框 |
| `--sn-web-auto-complete-menu-radius` | `6px` | 面板圆角 |
| `--sn-web-auto-complete-menu-shadow` | overlay 阴影 | 面板阴影 |
| `--sn-web-auto-complete-option-bg-active` | `--sn-web-color-background-soft` | 选项高亮底色 |
| `--sn-web-auto-complete-option-text-color-active` | `--sn-web-color-action-primary` | 选项高亮文字 |
| `--sn-web-auto-complete-highlight-color` / `-weight` | action-primary / 600 | 命中段高亮 |

## Accessibility

- `role="combobox"` + `aria-expanded` / `aria-controls` / `aria-activedescendant`（指向 listbox 中的 option id）。
- 面板 `role="listbox"`，选项 `role="option"` + `aria-selected`，disabled 选项 `aria-disabled`。
- `aria-invalid` 随 `status="error"` 置位。
