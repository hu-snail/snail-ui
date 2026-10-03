# Input · Web (PC)

Controlled input control with Token alias-driven styles and a set of cross-browser native input events. Maps to a real `<input>` DOM element, rendered by `@snui/vue-web`.

> **v3.1 End-Independent**: `SnInput` (`@snui/vue-web`) and `sn-input` (`@snui/uni`) are **two independent components**. Web CSS uses only `var(--sn-web-*)`. Component Contract is shared across ends, but Vue renderers are per-end.

---

## Live render · real framework mount

The following inputs are mounted via `createVueRenderer().mount()`; refresh to remount.

### Types

<ComponentPreview name="input" :raw-props="{ value: 'text input', type: 'text', placeholder: 'Text' }" />
<ComponentPreview name="input" :raw-props="{ value: 'a@b.dev', type: 'email', placeholder: 'Email' }" />
<ComponentPreview name="input" :raw-props="{ value: '', type: 'password', placeholder: 'Password' }" />
<ComponentPreview name="input" :raw-props="{ value: '13900000000', type: 'tel', placeholder: 'Phone' }" />

### Sizes

<ComponentPreview name="input" :raw-props="{ value: 'Small', size: 'small', placeholder: 'Small' }" />
<ComponentPreview name="input" :raw-props="{ value: 'Medium', size: 'medium', placeholder: 'Medium' }" />
<ComponentPreview name="input" :raw-props="{ value: 'Large', size: 'large', placeholder: 'Large' }" />

### States

<ComponentPreview name="input" :raw-props="{ value: 'Disabled', disabled: true }" />
<ComponentPreview name="input" :raw-props="{ value: 'Readonly', readonly: true }" />

### Clearable

<ComponentPreview name="input" :raw-props="{ value: 'Click × to clear', clearable: true }" />

### Length constraints

<ComponentPreview name="input" :raw-props="{ value: '', placeholder: 'Max 8 chars', maxlength: 8, name: 'username' }" />

### Controlled

<ComponentPreview
  name="input"
  :raw-props="{ value: 'controlled', name: 'email', type: 'email', placeholder: 'you@aui.dev' }"
/>

---

## Basic usage

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

## Tokens (Web alias layer)

| Logical slot | CSS variable |
| --- | --- |
| `background` | `var(--sn-web-color-input-bg)` |
| `color` | `var(--sn-web-color-input-text)` |
| `borderColor` | `var(--sn-web-color-input-border)` |
| `placeholderColor` | `var(--sn-web-color-input-placeholder)` |
| `disabledBackground` | `var(--sn-web-color-input-bg-disabled)` |
| `disabledColor` | `var(--sn-web-color-input-text-disabled)` |
| `focusRing` | `var(--sn-web-color-focus-ring)` |
| `size.small.height` | `var(--sn-web-control-height-sm)` |
| `size.medium.height` | `var(--sn-web-control-height-md)` |
| `size.large.height` | `var(--sn-web-control-height-lg)` |

> v3.1 end-independent: SnInput source CSS internally uses `--sn-web-*` aliases (**not** `--aui-*`).

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

## End difference

| Dimension | Web (`SnInput`) | uni (`sn-input`) |
|---|---|---|
| Package | `@snui/vue-web` | `@snui/uni` |
| Container | `<input type="...">` | `<input>` (compiled by miniprogram) |
| Token alias | `--sn-web-*` (px) | `--sn-mp-*` (rpx) |
| clearable | ✓ | ✓ |
| maxlength / minlength | ✓ | ✓ (miniprogram native) |
| Default keyboard | platform-native | platform-native; mobile triggers soft keyboard |
| End-specific Props | — | `confirmType` (done / send / search, etc.) |

---

## AI Patch Boundary

| Status | Field |
| --- | --- |
| `ai.patchable` | `value`, `placeholder`, `disabled`, `readonly`, `type`, `size`, `clearable`, `maxlength`, `minlength`, `name` |
| `ai.readonly` | `role`, `keyboard`, `focus`, `blur` |

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

`packages/protocol/src/input-contract.ts` (Contract shared) · `packages/vue-web/src/input/SnInput.vue` (Web renderer) · `packages/tokens-web/` (alias layer)