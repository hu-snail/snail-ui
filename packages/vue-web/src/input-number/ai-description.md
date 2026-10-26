# SnInputNumber

Web 端数字输入组件，对标 naive-ui `n-input-number` 1:1。位于 `packages/vue-web/src/input-number/`。

## 概述

`SnInputNumber` 是带步进按钮的受控数字输入框。视觉 token 与尺寸类名结构对齐 `SnInput`（`--sn-web-input-*` / `sn-input-number--{size}`），但为独立实现，不依赖 SnInput 内部代码。

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number \| null` | `null` | 绑定值；`null` 表示空字段 |
| `min` | `number` | — | 下界，越界提交会 clamp |
| `max` | `number` | — | 上界，越界提交会 clamp |
| `step` | `number` | `1` | 步长（按钮 / 方向键 / PageUp·Down） |
| `precision` | `number` | — | 提交值小数位（四舍五入） |
| `size` | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸 |
| `disabled` | `boolean` | `false` | 禁用（输入、按钮、清空全部失效） |
| `readonly` | `boolean` | `false` | 只读 |
| `placeholder` | `string` | `''` | 占位文案 |
| `stepStrictly` | `boolean` | `false` | 提交值必须是 `step` 的整数倍（以 `min`，缺省 0 为基准 snap） |
| `showButton` | `boolean` | `true` | 是否渲染 +/− 步进按钮 |
| `buttonPlacement` | `'both' \| 'right'` | `'right'` | 按钮位置：`right` 尾部横排（− +）/ `both` 分置左右两端 |
| `clearable` | `boolean` | `false` | 有值时显示清空按钮，点击提交 `null` |
| `format` | `(value: number) => string \| number` | — | 展示格式化（如百分比） |
| `parse` | `(input: string) => number \| null` | — | `format` 的反函数，解析用户输入 |
| `validator` | `(value: number) => boolean` | — | 返回 `false` 拒绝提交（保留旧值） |
| `border` | `'all' \| 'bottom' \| 'none'` | `'all'` | 边框形态 |
| `bordered` | `boolean`（deprecated） | `true` | `false` → `border:'none'` 的别名 |
| `ariaLabel` | `string` | — | 无障碍标签 |

## Events

| 事件 | Payload | 触发时机 |
| --- | --- | --- |
| `update:modelValue` | `number \| null` | 提交新值（步进 / change / blur / Enter / 清空） |
| `change` | `number \| null` | 值实际变化时随 `update:modelValue` 一起发出 |
| `input` | `number \| null` | 每次键入；payload 是 parse 后的结果（非法/空为 `null`） |
| `focus` / `blur` | `FocusEvent` | 原生焦点事件 |

## 交互语义

- **提交管线**：parse → validator → clamp(min/max) → stepStrictly snap → precision 四舍五入。validator 拒绝时保留旧 modelValue，不提交。
- **步进**：以 `min`（缺省 0）为基准对齐 step 网格，空值时从 `min` 起步。到达边界后按钮置 `disabled` 且不再发出事件。
- **长按连发**：步进按钮 `mousedown` 立即步进一次，400ms 后进入 100ms 间隔连发；`mouseup` / `mouseleave` / 卸载时停止。
- **键盘**：ArrowUp/Down 步进；PageUp/PageDown ×10；Enter 提交在编辑文本。
- **空值**：清空输入在 change/blur 时提交 `null`。
- **a11y**：原生 input `role="spinbutton"` + `aria-valuenow/min/max`，步进按钮带 `Increase` / `Decrease` aria-label。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import SnInputNumber from '@/input-number/SnInputNumber.vue'

const amount = ref<number | null>(null)
</script>

<template>
  <SnInputNumber
    v-model="amount"
    :min="0"
    :max="100"
    :step="5"
    :precision="2"
    step-strictly
    clearable
    placeholder="输入数量"
  />
</template>
```

## format / parse 示例

```ts
// 展示 50% ↔ 值 0.5
:format="(v: number) => `${Math.round(v * 100)}%`"
:parse="(s: string) => (s.trim() === '' ? null : Number(s.replace('%', '')) / 100)"
```

## 约束

- CSS 全部走 `--sn-web-*` token 变量，无硬编码 hex。
- TypeScript strict，无 `any`。
- 未接入 install.ts / index.ts / resolver.ts / config.ts（接线由后续任务处理）。
