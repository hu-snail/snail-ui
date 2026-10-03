# Form · Web (PC)

Native `<form>` container + FormItem sub-components, with FormData auto-collection, field-level error echoing, and disabled / loading state cascading.

> **v3.1 End-Independent**: `SnForm` / `SnFormItem` (`@snui/vue-web`) and `sn-form` / `sn-form-item` (`@snui/uni`) are **two independent components**. Web CSS uses only `var(--sn-web-*)`. Component Contract is shared across ends, but Vue renderers are per-end.

---

## Live render · real framework mount

### Login form (minimal)

<ComponentPreview name="form" :raw-props="{ formId: 'login', layout: 'vertical' }" :children='JSON.stringify([
  { id: "email-item", type: "form-item", props: { prop: "email", label: "Email", required: true }, children: [
    { id: "email", type: "input", props: { value: "", type: "email", name: "email", placeholder: "you@aui.dev" } }
  ]},
  { id: "password-item", type: "form-item", props: { prop: "password", label: "Password", required: true }, children: [
    { id: "password", type: "input", props: { value: "", type: "password", name: "password", placeholder: "••••••" } }
  ]},
  { id: "submit", type: "button", props: { variant: "primary", text: "Sign in", type: "submit" } }
])' />

### Disabled form

<ComponentPreview name="form" :raw-props="{ formId: 'signup', disabled: true, layout: 'vertical' }" :children='JSON.stringify([
  { id: "n", type: "form-item", props: { prop: "name", label: "Name" }, children: [
    { id: "ni", type: "input", props: { value: "Ada Lovelace", name: "name", type: "text" } }
  ]},
  { id: "s", type: "button", props: { variant: "primary", text: "Submit", type: "submit" } }
])' />

### Loading form

<ComponentPreview name="form" :raw-props='{ formId: "loading-demo", loading: true, layout: "vertical" }' :children='JSON.stringify([
  { id: "e", type: "form-item", props: { prop: "email", label: "Email" }, children: [
    { id: "ei", type: "input", props: { value: "loading@aui.dev", type: "email", name: "email" } }
  ]},
  { id: "s", type: "button", props: { variant: "primary", text: "Submit", type: "submit", loading: true } }
])' />

### Error wiring (FormItem error echo)

<ComponentPreview name="form" :raw-props="{ formId: 'errors' }" :children='JSON.stringify([
  { id: "email", type: "form-item", props: { prop: "email", label: "Email", error: "Invalid email format" }, children: [
    { id: "email-input", type: "input", props: { value: "broken", type: "email", name: "email" } }
  ]},
  { id: "submit", type: "button", props: { variant: "danger", text: "Try again", type: "submit" } }
])' />

### Full login flow

<ComponentPreview
  name="form"
  :raw-props="{ formId: 'full', layout: 'vertical' }"
  :children='JSON.stringify([
    { id: "f-name", type: "form-item", props: { prop: "name", label: "Name", required: true }, children: [
      { id: "i-name", type: "input", props: { value: "Ada", type: "text", name: "name" } }
    ]},
    { id: "f-email", type: "form-item", props: { prop: "email", label: "Email", required: true }, children: [
      { id: "i-email", type: "input", props: { value: "ada@aui.dev", type: "email", name: "email" } }
    ]},
    { id: "f-submit", type: "button", props: { variant: "primary", text: "Sign in", type: "submit" } }
  ])'
/>

---

## Basic usage

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { SnForm, SnFormItem, SnInput, SnButton } from '@snui/vue-web'
import '@snui/tokens-web/styles'

const form = reactive({ email: '', password: '' })
const loading = ref(false)

async function submit() {
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  loading.value = false
}
</script>

<template>
  <SnForm :model="form" layout="vertical" @submit="submit">
    <SnFormItem label="Email" required>
      <SnInput v-model="form.email" type="email" placeholder="you@aui.dev" />
    </SnFormItem>
    <SnFormItem label="Password" required>
      <SnInput v-model="form.password" type="password" placeholder="••••••" />
    </SnFormItem>
    <SnButton type="primary" :loading="loading" html-type="submit">Sign in</SnButton>
  </SnForm>
</template>
```

---

## Form props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction |
| `disabled` | `boolean` | `false` | Disable entire form (cascading) |
| `loading` | `boolean` | `false` | Form loading (applies `aria-busy`) |
| `initialValues` | `Record<string, unknown>` | `{}` | Initial values (FormData still auto-collected) |
| `fields` | `FormField[]` | — | Field descriptor array; children tree is more common |
| `formId` | `string` | — | Native `<form>` id |

## FormItem props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `prop` | `string` | — | **Required**. Field path for value lookup & error echo |
| `label` | `string` | — | Field label |
| `required` | `boolean` | `false` | Required, adds `*` + `aria-required` |
| `error` | `string` | — | Field error (from parent validate) |

## Validation rules (`fields[].rules`)

| Rule | Behavior |
| --- | --- |
| `required` | Value is non-empty string |
| `minLength` | Min string length |
| `maxLength` | Max string length |
| `pattern` | RegExp source (runtime compiled) |
| `message` | Custom error text |

## Events

| Event id | DOM event | Payload |
| --- | --- | --- |
| `submit` | `submit` | `Record<string, string>` (sanitized values) |
| `validate` | — | `{ valid: boolean; errors: Record<string, string> }` |

---

## Tokens (Web alias layer)

| Logical slot | CSS variable |
| --- | --- |
| `background` | `var(--sn-web-color-surface)` |
| `itemGap` | `var(--sn-web-spacing-md)` |
| `labelColor` | `var(--sn-web-color-text-primary)` |
| `errorColor` | `var(--sn-web-color-text-danger)` |
| `requiredColor` | `var(--sn-web-color-text-danger)` |
| `borderColor` | `var(--sn-web-color-border-default)` |

> v3.1 end-independent: SnForm source uses `--sn-web-*` aliases (**not** `--aui-*`).

---

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `form` (Form) · `group` (FormItem) |
| `keyboard` | `Enter`, `Tab` (Form) · platform-native (FormItem) |
| `aria-busy` | bound to `Form.props.loading` |
| `aria-disabled` | bound to `Form.props.disabled` |
| `aria-required` | bound to `FormItem.props.required` |
| `aria-invalid` | bound to `has-error(error)` |

---

## End difference

| Dimension | Web (`SnForm`) | uni (`sn-form`) |
|---|---|---|
| Package | `@snui/vue-web` | `@snui/uni` |
| Container | `<form>` | `<form>` (compiled by miniprogram) |
| Token alias | `--sn-web-*` | `--sn-mp-*` |
| Submit callback | `@submit` (Vue emit) | `@submit` + `uni-forms` library |
| Validation | SnForm built-in (Phase 2 minimal) | uni-forms / async-validator |

---

## AI Patch Boundary

**Form**

| Status | Field |
| --- | --- |
| `ai.patchable` | `layout`, `disabled`, `loading`, `initialValues`, `fields`, `formId` |
| `ai.readonly` | `role`, `submit`, `reset` |

**FormItem**

| Status | Field |
| --- | --- |
| `ai.patchable` | `prop`, `label`, `required`, `error` |
| `ai.readonly` | `role` |

---

## Source

`packages/protocol/src/form-contract.ts` (Contract shared) · `packages/vue-web/src/form/SnForm.vue` (Web renderer) · `packages/tokens-web/` (alias layer)