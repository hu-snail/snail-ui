# SnDynamicTags (Web)

Web 端动态标签组件，对标 naive-ui `n-dynamic-tags` 1:1。位于
`packages/vue-web/src/dynamic-tags/`。

## 概述

`SnDynamicTags` 渲染一组可增删的胶囊标签 + 末尾「添加」触发按钮。
点击触发按钮出现内嵌输入框；Enter 提交（trim 后非空才追加，可连续
输入）、Esc 取消、blur 提交（对齐 naive 的 blur-submit 语义）。
`inputProps` 简化为单个 `placeholder` prop；tag 固定为圆角胶囊
（对标 `n-tag` 默认形态）。

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `(string \| number)[]` | `[]` | `v-model`；变更时 emit 完整数组 |
| `closable` | `boolean` | `true` | 每个 tag 是否带 × 删除按钮 |
| `disabled` | `boolean` | `false` | 禁用：无触发按钮、无删除按钮 |
| `readonly` | `boolean` | `false` | 只读：同上，视觉不加 disabled 灰 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸（字号 + 胶囊高度） |
| `max` | `number` | — | 标签上限；到上限隐藏添加按钮、拒绝追加 |
| `trigger` | `'click' \| 'focus'` | `'click'` | `focus` 时点击组件任意处打开输入框 |
| `placeholder` | `string` | `''` | 内嵌输入框占位（简化 `inputProps`） |

## Events

| 事件 | Payload | 触发时机 |
| --- | --- | --- |
| `update:modelValue` | `Array<string \| number>` | 任何增删，完整数组 |
| `change` | `Array<string \| number>` | 同上（naive `on-change`） |
| `add` | `string \| number` | 追加一个 tag |
| `remove` | `string \| number` | 删除一个 tag |
| `click` | `(value, MouseEvent)` | 点击 tag 本体 |

## Slots

| Slot | Scoped | 说明 |
| --- | --- | --- |
| `tag` | `{ label, index }` | 自定义 tag 渲染 |
| `input` | `{ value, placeholder, confirm, cancel, setValue }` | 自定义内嵌输入框 |
| `trigger` | — | 自定义添加触发按钮内容 |
| `empty` | — | 无 tag 时的空态 |

## 交互语义

- **添加**：点触发按钮 → 内嵌 input 出现并自动 focus；Enter 提交后
  input 保持打开可连续输入；到 `max` 后自动关闭。
- **取消**：Esc 丢弃在输文本并关闭。
- **blur**：非空文本提交后关闭；空文本直接关闭（naive 对齐）。
- **删除**：tag 上的 × 按钮 `click.stop`，不触发 tag 的 `click` 事件。
- **trigger='focus'**：根元素 click 打开输入框；tag/× 已 stopPropagation。

## Tokens

全部走 `--sn-web-dynamic-tags-*` 别名，回退 `--sn-web-color-*`：

| Token | 回退 | 用途 |
| --- | --- | --- |
| `--sn-web-dynamic-tags-gap` | `6px` | tag 间距 |
| `--sn-web-dynamic-tags-tag-padding-x` | `8px` | tag 水平内边距 |
| `--sn-web-dynamic-tags-tag-radius` | `999px` | 胶囊圆角 |
| `--sn-web-dynamic-tags-tag-bg` | `background-soft` | tag 背景 |
| `--sn-web-dynamic-tags-tag-bg-hover` | `background-overlay` | tag hover 背景 |
| `--sn-web-dynamic-tags-close-color` / `-hover` | `text-tertiary` / `text-primary` | × 按钮 |
| `--sn-web-dynamic-tags-trigger-border-color` / `-hover` | `border-default` / `action-primary` | 触发按钮边框 |
| `--sn-web-dynamic-tags-trigger-color` / `-hover` | `text-secondary` / `action-primary` | 触发按钮前景 |
| `--sn-web-dynamic-tags-input-border-color` | `action-primary` | 输入框边框 |
| `--sn-web-focus-ring` | — | 触发按钮 focus 光圈 |

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import SnDynamicTags from '@/dynamic-tags/SnDynamicTags.vue'

const tags = ref<Array<string | number>>(['vue', 'naive-ui'])
</script>

<template>
  <SnDynamicTags v-model="tags" :max="5" placeholder="输入后回车" />
</template>
```

## Accessibility

- 添加触发按钮 `aria-label="Add tag"`，× 按钮 `aria-label="Remove {tag}"`。
- 输入框为原生 `<input>`，Enter/Esc/blur 全键盘可达。
- disabled 状态加 `aria-disabled` 语义由视觉 + 按钮 unmount 表达。
