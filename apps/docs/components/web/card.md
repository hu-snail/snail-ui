# Card · Web

`<section role="region">` 容器，支持 title / description 头部、token 驱动的阴影与边框、可选 body 与 footer 插槽。

<script setup>
import ComponentPreview from '../../.vitepress/components/ComponentPreview.vue';
</script>

## Live render · 真实框架挂载

### Default（默认 variant + bordered）

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

### Order summary（组合 Form + Input + Button）

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

```ts
// Card 容器 + 嵌套 FormItem + Input + Button 的一次完整组合
import { createVueRenderer, createComponentRegistry, Card, Form, FormItem, Input, Button } from '@snui/vue-web';

const registry = createComponentRegistry();
registry.register('card', Card);
registry.register('form', Form);
registry.register('form-item', FormItem);
registry.register('input', Input);
registry.register('button', Button);

createVueRenderer({ registry }).mount({
  version: '1.0.0',
  root: {
    id: 'order',
    type: 'card',
    props: { title: 'Order #1024', description: 'Pending payment' },
    children: [
      { id: 'f', type: 'form', props: { formId: 'voucher' }, children: [
        { id: 'fi', type: 'form-item', props: { prop: 'voucher', label: 'Voucher' }, children: [
          { id: 'i', type: 'input', props: { name: 'voucher', placeholder: 'V-AUI-1024' } }
        ]},
        { id: 's', type: 'button', props: { variant: 'primary', text: 'Apply', type: 'submit' } }
      ]}
    ],
  },
}, document.getElementById('app')!);
```

## Props

<table class="props">
  <thead>
    <tr><th>Prop</th><th>Type</th><th>Default</th><th>Required</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>No</td><td>头部标题文本。</td></tr>
    <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>No</td><td>头部副标题。</td></tr>
    <tr><td><code>variant</code></td><td><code>'default' | 'outlined' | 'elevated'</code></td><td><code>'default'</code></td><td>No</td><td>视觉风格变体。</td></tr>
    <tr><td><code>padding</code></td><td><code>'none' | 'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>No</td><td>内部 padding 子轴。</td></tr>
    <tr><td><code>bordered</code></td><td><code>boolean</code></td><td><code>true</code></td><td>No</td><td>显示边框。</td></tr>
    <tr><td><code>shadow</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td><td>显示阴影。</td></tr>
  </tbody>
</table>

## Tokens

| Logical slot | CSS variable |
| --- | --- |
| `background` | `var(--aui-color-surface)` |
| `borderColor` | `var(--aui-color-border-default)` |
| `titleColor` | `var(--aui-color-text-primary)` |
| `descriptionColor` | `var(--aui-color-text-secondary)` |
| `footerBorderColor` | `var(--aui-color-border-soft)` |
| `shadow` | `var(--aui-shadow-md)` |
| `radius` | `var(--aui-radius-card)` |
| `padding.none` | `0` |
| `padding.sm` | `var(--aui-spacing-sm)` |
| `padding.md` | `var(--aui-spacing-md)` |
| `padding.lg` | `var(--aui-spacing-lg)` |

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `region` |
| `aria-labelledby` | 指向 `<h3>` 标题元素 id（当 `title` 存在时） |
| `aria-describedby` | 指向 description 元素 id（当 `description` 存在时） |

## AI Patch Boundary

| Status | Field |
| --- | --- |
| `ai.patchable` | `title`, `description`, `variant`, `padding`, `bordered`, `shadow` |
| `ai.readonly` | `role` |

## Source

`packages/protocol/src/card-contract.ts` (Contract source) · `packages/vue-web/src/card.ts` (Vue renderer)

## 嵌套与子节点

Card 通过 UINode children 接收任意子树（包括按钮、输入、其他 Card）。当 `title` / `description` 都为空时 header 自动省略；当 `footer` slot 为空时 footer 自动省略。