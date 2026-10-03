# Input · Web（PC 端）

受控输入控件，Token 别名层驱动的样式方案与一组跨浏览器原生 input 事件。映射到真实的 `<input>` DOM 元素，由 `@snui/vue-web` 渲染。

---

## 基本用法

<Demo name="input-web" />

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SnInput } from '@snui/vue-web'
import '@snui/tokens-web/styles'

const email = ref('')
</script>

<template>
  <SnInput v-model="email" type="email" placeholder="you@aui.dev" clearable />
</template>
```

---

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` | 受控值。父组件在收到 `input` 后应使用新值重新渲染 |
| `placeholder` | `string` | — | 空值占位符 |
| `type` | `'text' \| 'password' \| 'email' \| 'number' \| 'tel' \| 'url' \| 'search'` | `'text'` | 原生 input type |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 高度 / 内边距 / 字号子轴 |
| `disabled` | `boolean` | `false` | 禁用并应用 `aria-disabled` |
| `readonly` | `boolean` | `false` | 只读并应用 `aria-readonly` |
| `clearable` | `boolean` | `false` | 值为非空时显示 × 清除按钮 |
| `maxlength` | `number` | — | 最大字符数 |
| `minlength` | `number` | — | 最小字符数 |
| `name` | `string` | — | 原生 name（FormData 收集时使用） |

## Events

| Event id | DOM event | Payload | Notes |
| --- | --- | --- | --- |
| `input` | `input` | `string` | 每次按键触发 |
| `change` | `change` | `string` | 提交时触发（input + blur / Enter） |
| `focus` | `focus` | `FocusEvent` | 获得焦点 |
| `blur` | `blur` | `FocusEvent` | 失去焦点 |
| `clear` | `click`（清除按钮） | — | 用户点击清除按钮（`clearable=true`）；同时 emit 一对 `input`/`change`，值为 `''` |

---

---

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `textbox` |
| `keyboard` | `Tab`, `ArrowLeft`, `ArrowRight`, `Backspace`, `Delete` |
| `aria-disabled` | 绑定到 `props.disabled` |
| `aria-readonly` | 绑定到 `props.readonly` |
| `aria-placeholder` | 绑定到 `props.placeholder` |

---

---

---

## 与 Form 联动

通常 Input 嵌入 `SnForm` / `SnFormItem` 容器，FormData 在原生 `<form>` submit 时自动收集带 `name` 的输入：

```vue
<SnForm @submit="onSubmit">
  <SnFormItem label="Email" required>
    <SnInput v-model="email" name="email" type="email" />
  </SnFormItem>
  <SnButton type="primary" html-type="submit">登录</SnButton>
</SnForm>
```

---

## Source

Contract 跨端共享，Web 渲染器在 `@snui/vue-web`。