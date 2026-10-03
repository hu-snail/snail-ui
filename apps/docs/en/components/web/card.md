# Card · Web (PC)

`<section role="region">` container with `title` / `description` header, Token alias-driven shadow & border, optional body & footer slots.

> **v3.1 End-Independent**: `SnCard` (`@snui/vue-web`) and `sn-card` (`@snui/uni`) are **two independent components**. Web CSS uses only `var(--sn-web-*)`. Component Contract is shared across ends (`packages/protocol/src/card-contract.ts`), but Vue renderers are per-end.

---

## Live render · real framework mount

### Default (default variant + bordered)

<ComponentPreview name="card" :raw-props="{ title: 'Order #1024', description: 'Placed today · shipping in 2 days' }" :children='JSON.stringify([
  { id: "amount", type: "card", props: { title: "Amount", bordered: false, padding: "sm" } }
])' />

### Outlined

<ComponentPreview name="card" :raw-props="{ variant: 'outlined', title: 'Outlined card', description: 'Stronger border, no shadow' }" />

### Elevated

<ComponentPreview name="card" :raw-props="{ variant: 'elevated', title: 'Elevated card', description: 'Borderless + drop shadow' }" />

### Padding variants

<ComponentPreview name="card" :raw-props="{ title: 'No padding', padding: 'none', bordered: true }" :children='JSON.stringify([
  { id: "i", type: "input", props: { value: "tight content", type: "text" } }
])' />

<ComponentPreview name="card" :raw-props="{ title: 'Large padding', padding: 'lg', bordered: true, shadow: true }" :children='JSON.stringify([
  { id: "b", type: "button", props: { variant: "primary", text: "Click me" } }
])' />

### No header / No border

<ComponentPreview name="card" :raw-props="{ bordered: false }" :children='JSON.stringify([
  { id: "t", type: "button", props: { variant: "ghost", text: "Action" } }
])' />

### On dark surface

<ComponentPreview name="card" dark :raw-props="{ title: 'On dark', description: 'High-contrast card', bordered: true, shadow: true }" :children='JSON.stringify([
  { id: "b", type: "button", props: { variant: "primary", text: "Confirm" } }
])' />

### Order summary (Form + Input + Button composition)

<ComponentPreview
  name="card"
  :raw-props="{ title: 'Order #1024', description: 'Pending payment', bordered: true, shadow: true }"
  :children='JSON.stringify([
    { id: "f", type: "form-item", props: { prop: "voucher", label: "Voucher" }, children: [
      { id: "i", type: "input", props: { value: "", placeholder: "V-AUI-1024", name: "voucher" } }
    ]},
    { id: "b", type: "button", props: { variant: "primary", text: "Apply", type: "submit" } }
  ])'
/>

---

## Basic usage

```vue
<script setup lang="ts">
import { SnCard, SnForm, SnFormItem, SnInput, SnButton } from '@snui/vue-web'
import '@snui/tokens-web/styles'
</script>

<template>
  <SnCard title="Order #1024" description="Pending payment" bordered shadow>
    <SnForm>
      <SnFormItem label="Voucher">
        <SnInput placeholder="V-AUI-1024" />
      </SnFormItem>
      <SnButton type="primary">Apply</SnButton>
    </SnForm>
  </SnCard>
</template>
```

---

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Header title |
| `description` | `string` | — | Header subtitle |
| `variant` | `'default' \| 'outlined' \| 'elevated'` | `'default'` | Visual variant |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Inner padding axis |
| `bordered` | `boolean` | `true` | Show border |
| `shadow` | `boolean` | `false` | Show shadow |

---

## Tokens (Web alias layer)

| Logical slot | CSS variable |
| --- | --- |
| `background` | `var(--sn-web-color-surface)` |
| `borderColor` | `var(--sn-web-color-border-default)` |
| `titleColor` | `var(--sn-web-color-text-primary)` |
| `descriptionColor` | `var(--sn-web-color-text-secondary)` |
| `footerBorderColor` | `var(--sn-web-color-border-soft)` |
| `shadow` | `var(--sn-web-shadow-md)` |
| `radius` | `var(--sn-web-radius-card)` |
| `padding.none` | `0` |
| `padding.sm` | `var(--sn-web-spacing-sm)` |
| `padding.md` | `var(--sn-web-spacing-md)` |
| `padding.lg` | `var(--sn-web-spacing-lg)` |

> v3.1 end-independent: SnCard source uses `--sn-web-*` aliases (**not** `--aui-*` base). `tokens-web` package internally maps `--sn-web-*` → `--aui-*`.

---

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `region` |
| `aria-labelledby` | points to `<h3>` title id (when `title` exists) |
| `aria-describedby` | points to description id (when `description` exists) |

---

## AI Patch Boundary

| Status | Field |
| --- | --- |
| `ai.patchable` | `title`, `description`, `variant`, `padding`, `bordered`, `shadow` |
| `ai.readonly` | `role` |

---

## End difference

| Dimension | Web (`SnCard`) | uni (`sn-card`) |
|---|---|---|
| Package | `@snui/vue-web` | `@snui/uni` |
| Component name | `SnCard` (PascalCase import) | `sn-card` (kebab-case easycom) |
| Token alias | `--sn-web-*` (px) | `--sn-mp-*` (rpx) |
| variant | `default` / `outlined` / `elevated` | same (visual diff emerges naturally from rpx) |
| Default padding | `dense` | `medium` |

---

## Source

`packages/protocol/src/card-contract.ts` (Contract shared across ends) · `packages/vue-web/src/card/SnCard.vue` (Web renderer) · `packages/tokens-web/` (alias layer)

---

## Nesting & children

Card accepts arbitrary subtrees via UINode children (buttons, inputs, other Cards). When both `title` and `description` are empty, header is auto-omitted; when `footer` slot is empty, footer is auto-omitted.