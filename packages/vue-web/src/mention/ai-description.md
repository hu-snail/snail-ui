# SnMention

Web 端 @提及输入组件，对标 naive-ui `n-mention` 1:1。位于 `packages/vue-web/src/mention/`。

## 概述

`SnMention` 是带候选面板的提及触发输入框：输入 delimiter（默认 `@`）后弹出候选，后续输入实时过滤，选中后把触发词（delimiter + 已输入 query）替换为 `delimiter + value`。视觉 token 对齐 SnInput（`--sn-web-input-*` fallback），面板 token 走 `--sn-web-mention-*`，候选面板 Teleport 到 body + fixed 定位 + 视口翻转（与 SnSelect 同款简化 popper 策略，无完整 popper）。

## Props

| Prop          | 类型                                                 | 默认值      | 说明                                                 |
| ------------- | ---------------------------------------------------- | ----------- | ---------------------------------------------------- |
| `modelValue`  | `string`                                             | `''`        | 绑定值（`v-model`）                                  |
| `options`     | `(string \| { label, value?, disabled? })[]`         | `[]`        | 候选列表；对象选项提交 `value`（缺省为 label）       |
| `delimiter`   | `string \| string[]`                                 | `'@'`       | 触发符；多字符取末字符（naive 语义），数组则任一触发 |
| `placeholder` | `string`                                             | `''`        | 占位文案                                             |
| `disabled`    | `boolean`                                            | `false`     | 禁用（输入、选择全部失效）                           |
| `readonly`    | `boolean`                                            | `false`     | 只读（不弹面板）                                     |
| `size`        | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'`  | 尺寸                                                 |
| `status`      | `'default' \| 'error' \| 'warning'`                  | `'default'` | 视觉状态（边框色 + `aria-invalid`）                  |
| `type`        | `'text' \| 'textarea'`                               | `'text'`    | 单行输入或多行文本域                                 |
| `rows`        | `number`                                             | `3`         | `type="textarea"` 时的行数                           |
| `ariaLabel`   | `string`                                             | `''`        | 无障碍标签                                           |

## Events

| 事件                | Payload            | 触发时机                             |
| ------------------- | ------------------ | ------------------------------------ |
| `update:modelValue` | `string`           | 每次键入 / 选中                      |
| `change`            | `string`           | 选中候选后提交的完整文本             |
| `select`            | `{ label, value }` | 从面板选中候选（点击 / Enter / Tab） |
| `focus` / `blur`    | `FocusEvent`       | 原生焦点事件                         |

## Slots

| Slot    | 说明                                     |
| ------- | ---------------------------------------- |
| `empty` | 无匹配候选时的面板内容（默认 "No data"） |

## 交互语义

- **触发**：从 caret 位置向前扫描（遇空白停止），找到 delimiter 字符即激活面板；query 为 delimiter 到 caret 之间的文本。文本中间的提及（caret 未落在触发词内）不激活。
- **过滤**：query 对 label 做大小写不敏感的包含匹配；query 为空显示全部。
- **替换**：选中后从 delimiter 起点到 caret 的文本替换为 `delimiter + value`，caret 后的文本保留；替换后 caret 移到插入文本末尾并保持焦点（可连续 @ 多人）。
- **键盘**：ArrowDown/ArrowUp 移动高亮（跳过 disabled 项，两端 wrap；无高亮时 ArrowUp 落在最后一项）、Enter/Tab 选中、Esc 关闭。
- **面板开关**：输入触发词时打开；query 被空白截断、Esc、blur、点击组件外部（document pointerdown 监听）关闭。document 监听在 `onBeforeUnmount` 移除。
- **定位**：Teleport 到 body + `position: fixed`，宽至少为字段宽度，下方优先、下方空间不足且上方更宽裕时翻转到上方（SnSelect 同款策略）。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import SnMention from '@/mention/SnMention.vue';

const value = ref('');
const options = ['alice', 'bob', 'carol'];
</script>

<template>
  <SnMention v-model="value" :options="options" placeholder="Type @ to mention..." />
</template>
```

## 对象选项 + 多 delimiter

```vue
<SnMention
  v-model="value"
  :options="[
    { label: 'Alice Lee', value: 'alice' },
    { label: 'Bob', value: 'bob', disabled: true },
  ]"
  :delimiter="['@', '#']"
  @select="(o) => console.log('picked', o.value)"
/>
```

## Tokens

| Token                                                                | 默认值                                 | 用途                |
| -------------------------------------------------------------------- | -------------------------------------- | ------------------- |
| `--sn-web-mention-padding-x`                                         | `--sn-web-input-padding-x`             | 字段水平内边距      |
| `--sn-web-mention-border-color` / `-focus`                           | border-default / action-primary        | 边框色              |
| `--sn-web-mention-radius`                                            | `--sn-web-input-radius`                | 圆角                |
| `--sn-web-mention-bg` / `-text-color` / `-placeholder-color`         | surface / text-primary / text-tertiary | 字段底色/文字/占位  |
| `--sn-web-mention-focus-ring`                                        | `--sn-web-focus-ring`                  | 焦点环              |
| `--sn-web-mention-focus-ring-error` / `-warning`                     | danger/warning soft                    | 状态焦点环          |
| `--sn-web-mention-textarea-padding-y`                                | `6px`                                  | textarea 上下内边距 |
| `--sn-web-mention-menu-max-height`                                   | `240px`                                | 面板最大高度        |
| `--sn-web-mention-menu-bg`                                           | `--sn-web-color-background-elevated`   | 面板底色            |
| `--sn-web-mention-menu-border-color`                                 | `--sn-web-color-border-subtle`         | 面板边框            |
| `--sn-web-mention-menu-radius` / `-padding` / `-shadow` / `-z-index` | `6px` / `4px` / overlay 阴影 / `100`   | 面板外观            |
| `--sn-web-mention-option-padding-y` / `-x`                           | `6px` / `10px`                         | 选项内边距          |
| `--sn-web-mention-option-bg-active`                                  | `rgba(0,0,0,0.04)`                     | 选项高亮底色        |
| `--sn-web-mention-option-text-color-active`                          | `--sn-web-color-action-primary`        | 选项高亮文字        |
| `--sn-web-mention-option-text-color-disabled`                        | `--sn-web-color-text-disabled`         | 禁用选项文字        |
| `--sn-web-mention-empty-padding` / `-color`                          | `12px` / text-tertiary                 | 空状态              |

## Accessibility

- input/textarea `role="combobox"` + `aria-expanded` / `aria-controls` / `aria-autocomplete="list"` / `aria-activedescendant`（指向 listbox 中的 option id）。
- 面板 `role="listbox"`，选项 `role="option"` + `aria-selected`，disabled 选项 `aria-disabled`。
- `aria-invalid` 随 `status="error"` 置位。
