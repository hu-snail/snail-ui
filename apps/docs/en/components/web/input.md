# Input · Web (PC)

Controlled input control with Token alias-driven styles and a set of cross-browser native input events. Maps to a real `<input>` DOM element, rendered by `@snui/vue-web`.

---

## Basic usage

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
| `value` | `string` | `''` | Controlled value |
| `placeholder` | `string` | — | Empty placeholder |
| `type` | `'text' \| 'password' \| 'email' \| 'number' \| 'tel' \| 'url' \| 'search'` | `'text'` | Native input type |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Height / padding / font size axis |
| `disabled` | `boolean` | `false` | Disabled, applies `aria-disabled` |
| `readonly` | `boolean` | `false` | Read-only, applies `aria-readonly` |
| `clearable` | `boolean` | `false` | Show × clear button when value non-empty |
| `maxlength` | `number` | — | Max characters |
| `minlength` | `number` | — | Min characters |
| `name` | `string` | — | Native name (for FormData collection) |

## Events

| Event id | DOM event | Payload | Notes |
| --- | --- | --- | --- |
| `input` | `input` | `string` | Every keystroke |
| `change` | `change` | `string` | On commit (input + blur / Enter) |
| `focus` | `focus` | `FocusEvent` | Focused |
| `blur` | `blur` | `FocusEvent` | Blurred |
| `clear` | `click` (clear button) | — | User clicked × (when `clearable=true`); also emits `input`/`change` with `''` |

---

---

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `textbox` |
| `keyboard` | `Tab`, `ArrowLeft`, `ArrowRight`, `Backspace`, `Delete` |
| `aria-disabled` | bound to `props.disabled` |
| `aria-readonly` | bound to `props.readonly` |
| `aria-placeholder` | bound to `props.placeholder` |

---

---

---

## Form integration

Input typically nests inside `SnForm` / `SnFormItem`. FormData auto-collects named inputs on native `<form>` submit:

```vue
<SnForm @submit="onSubmit">
  <SnFormItem label="Email" required>
    <SnInput v-model="email" name="email" type="email" />
  </SnFormItem>
  <SnButton type="primary" html-type="submit">Sign in</SnButton>
</SnForm>
```

---

## Source

Contract shared across ends, Web renderer in `@snui/vue-web`.