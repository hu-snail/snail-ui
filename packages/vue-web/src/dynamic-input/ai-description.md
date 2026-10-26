# SnDynamicInput

Web 端动态输入组件，对标 naive-ui `n-dynamic-input` 1:1。位于 `packages/vue-web/src/dynamic-input/`。

## 概述

`SnDynamicInput` 按 `modelValue` 数组渲染一行一值的可编辑行。原始值行（string / number）用内置 token 化输入框编辑；对象值行走 scoped default slot（slot 存在时优先于内置输入）。每行右侧带 − / + 按钮做行删除 / 行后插入，项数到 `min` / `max` 边界时对应按钮隐藏。

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `Array<string \| number \| Record<string, unknown> \| null>` | `[]` | 绑定数组；每项一个独立值 |
| `preset` | `() => DynamicInputValue` | `() => null` | 新行创建工厂（naive 默认 `null`；文本行传 `() => ''`） |
| `min` | `number` | `0` | 行数下界；到界 − 按钮隐藏 |
| `max` | `number` | — | 行数上界；到界 + 按钮隐藏 |
| `disabled` | `boolean` | `false` | 禁用所有行输入与操作按钮 |
| `readonly` | `boolean` | `false` | 行只读且不渲染 − / + 结构按钮 |
| `size` | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸（内置输入框高度/字号） |
| `status` | `'default' \| 'error' \| 'warning'` | `'default'` | 视觉状态，级联到每行内置输入框边框 |
| `onCreate` | `(value: DynamicInputValue, index: number) => DynamicInputValue` | — | 新值后处理：在 `preset` 产出草稿后加工（对标 naive `on-create`） |

## Events

| 事件 | Payload | 触发时机 |
| --- | --- | --- |
| `update:modelValue` | `DynamicInputValue[]` | 任何变化——行编辑 / 删除 / 插入 / 空态创建；总是整个新数组 |

## Slots

| Slot | Scope | 说明 |
| --- | --- | --- |
| `default` | `{ value, index }` | 自定义行渲染。提供后优先于内置输入框；对象值行必须用它渲染，编辑通过 `update:modelValue` 回写 |

## 交互语义

- **行编辑**：内置输入框每键入即 emit 整个新数组。number 行保持数字类型（可解析时）；清空 / 不可解析提交原始字符串（对齐 naive input preset）。
- **插入**：`+` 在该行后插入 `preset()`（再经 `onCreate` 加工）的新行；空数组时渲染整宽虚线 "Add" 按钮替代行列表。
- **删除**：`−` 删该行；行数 ≤ `min` 时按钮隐藏且点击不生效。
- **边界**：`max` 到界隐藏所有 + 按钮；`min` 到界隐藏所有 − 按钮。
- **readonly**：输入框带原生 `readonly`，− / + 不渲染（行结构冻结）；`onRowInput` 内部二次防御，程序化 setValue 也不提交。
- **a11y**：行按钮带 `Remove row N` / `Add row after N` aria-label；行输入带 `Row N` label 与 `aria-invalid` / `aria-disabled`。
- **图标**：− / + 均为内联 SVG（stroke 线条风，与 SnInputNumber 步进图标同源风格），禁 emoji（AGENTS.md §113）。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import SnDynamicInput from '@/dynamic-input/SnDynamicInput.vue'

const tags = ref<string[]>(['vue', 'vite'])
</script>

<template>
  <SnDynamicInput v-model="tags" :min="1" :max="5" :preset="() => ''" />
</template>
```

## 对象行 + slot

```vue
<SnDynamicInput v-model="pairs" :on-create="(v, i) => ({ key: `k${i}`, value: '' })">
  <template #default="{ value, index }">
    <SnInput v-model="value.key" />
  </template>
</SnDynamicInput>
```

## Token（`--sn-web-dynamic-input-*`）

| Token | 用途 | 回退 |
| --- | --- | --- |
| `--sn-web-dynamic-input-row-gap` | 行间距 | `8px` |
| `--sn-web-dynamic-input-action-gap` | 输入框与按钮组间距 | `6px` |
| `--sn-web-dynamic-input-btn-size` | 行按钮尺寸 | `26px` |
| `--sn-web-dynamic-input-border-color` | 行边框 / 按钮边框 | `--sn-web-color-border-default` |
| `--sn-web-dynamic-input-bg` | 行输入背景 | `--sn-web-color-background-surface` |
| `--sn-web-dynamic-input-text-color` | 行文本 | `--sn-web-color-text-primary` / `text-secondary` |

高度 / 圆角 / 内边距复用 `--sn-web-input-*`（`--sn-web-input-radius` / `--sn-web-input-padding-x`）；焦点环复用 `--sn-web-focus-ring`。颜色全部 token 化，无硬编码 hex。

## 约束

- TypeScript strict + `exactOptionalPropertyTypes`，无 `any`；可选 prop 不设 `: undefined` 默认值。
- 行 key 用 index（值可为原始量 / null，无稳定业务 key；naive-ui 用内部 WeakMap 生成 key，此处省略——行数场景下重排仅发生在插入/删除时，index key 足够且避免引入 seemly 依赖）。
- 未接入 install.ts / index.ts / resolver.ts / config.ts（接线由后续任务处理）。
