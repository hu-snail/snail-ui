# Input · Web

Controlled input with token-driven styling and a complete set of native input events. Maps to a real `<input>` DOM element via `@snui/vue-web`.

<script setup>
import ComponentPreview from '../../../.vitepress/components/ComponentPreview.vue';
</script>

## Live render · real framework mount

All inputs below are mounted via `createVueRenderer().mount()`. Refresh the page to re-mount.

### Types

<ComponentPreview name="input" :raw-props="{ value: 'text input', type: 'text', placeholder: 'Text input' }" />
<ComponentPreview name="input" :raw-props="{ value: 'a@b.dev', type: 'email', placeholder: 'Email' }" />
<ComponentPreview name="input" :raw-props="{ value: '', type: 'password', placeholder: 'Password' }" />
<ComponentPreview name="input" :raw-props="{ value: '13900000000', type: 'tel', placeholder: 'Phone' }" />

### Sizes

<ComponentPreview name="input" :raw-props="{ value: 'Small', size: 'small', placeholder: 'Small' }" />
<ComponentPreview name="input" :raw-props="{ value: 'Medium', size: 'medium', placeholder: 'Medium' }" />
<ComponentPreview name="input" :raw-props="{ value: 'Large', size: 'large', placeholder: 'Large' }" />

### States

<ComponentPreview name="input" :raw-props="{ value: 'Disabled', disabled: true }" />
<ComponentPreview name="input" :raw-props="{ value: 'Read-only', readonly: true }" />

### Clearable

<ComponentPreview name="input" :raw-props="{ value: 'Click × to clear', clearable: true }" />

### Length constraints

<ComponentPreview name="input" :raw-props="{ value: '', placeholder: 'Max 8 chars', maxlength: 8, name: 'username' }" />

## Props

<table class="props">
  <thead>
    <tr><th>Prop</th><th>Type</th><th>Default</th><th>Required</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>value</code></td><td><code>string</code></td><td><code>''</code></td><td>No</td><td>Controlled value. Parent re-renders with new value after <code>input</code>.</td></tr>
    <tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>No</td><td>Empty-state placeholder.</td></tr>
    <tr><td><code>type</code></td><td><code>'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'</code></td><td><code>'text'</code></td><td>No</td><td>Native input type.</td></tr>
    <tr><td><code>size</code></td><td><code>'small' | 'medium' | 'large'</code></td><td><code>'medium'</code></td><td>No</td><td>Height + padding + font-size sub-axis (§36).</td></tr>
    <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td><td>Disable and apply <code>aria-disabled</code>.</td></tr>
    <tr><td><code>readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td><td>Read-only and apply <code>aria-readonly</code>.</td></tr>
    <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td><td>Show <code>×</code> clear button when value is non-empty.</td></tr>
    <tr><td><code>maxlength</code></td><td><code>number</code></td><td>—</td><td>No</td><td>Maximum character count.</td></tr>
    <tr><td><code>minlength</code></td><td><code>number</code></td><td>—</td><td>No</td><td>Minimum character count.</td></tr>
    <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>No</td><td>Native name (used by FormData collection).</td></tr>
  </tbody>
</table>

## Events

<table class="props">
  <thead>
    <tr><th>Event id</th><th>DOM event</th><th>Payload</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td><code>input</code></td><td><code>input</code></td><td><code>string</code></td><td>Emitted on every keystroke.</td></tr>
    <tr><td><code>change</code></td><td><code>change</code></td><td><code>string</code></td><td>Emitted on commit (input + blur / Enter).</td></tr>
    <tr><td><code>focus</code></td><td><code>focus</code></td><td><code>FocusEvent</code></td><td>Element receives focus.</td></tr>
    <tr><td><code>blur</code></td><td><code>blur</code></td><td><code>FocusEvent</code></td><td>Element loses focus.</td></tr>
    <tr><td><code>clear</code></td><td><code>click</code> (clear button)</td><td>—</td><td>Emitted when user clicks the clear button (<code>clearable=true</code>). Also emits <code>input</code>/<code>change</code> with empty string.</td></tr>
  </tbody>
</table>

## Tokens

| Logical slot | CSS variable |
| --- | --- |
| `background` | `var(--aui-color-input-bg)` |
| `color` | `var(--aui-color-input-text)` |
| `borderColor` | `var(--aui-color-input-border)` |
| `placeholderColor` | `var(--aui-color-input-placeholder)` |
| `disabledBackground` | `var(--aui-color-input-bg-disabled)` |
| `disabledColor` | `var(--aui-color-input-text-disabled)` |
| `focusRing` | `var(--aui-color-focus-ring)` |
| `size.small.height` | `var(--aui-control-height-sm)` |
| `size.medium.height` | `var(--aui-control-height-md)` |
| `size.large.height` | `var(--aui-control-height-lg)` |

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `textbox` |
| `keyboard` | `Tab`, `ArrowLeft`, `ArrowRight`, `Backspace`, `Delete` |
| `aria-disabled` | bound to `props.disabled` |
| `aria-readonly` | bound to `props.readonly` |
| `aria-placeholder` | bound to `props.placeholder` |

## AI Patch Boundary

| Status | Field |
| --- | --- |
| `ai.patchable` | `value`, `placeholder`, `disabled`, `readonly`, `type`, `size`, `clearable`, `maxlength`, `minlength`, `name` |
| `ai.readonly` | `role`, `keyboard`, `focus`, `blur` |

## Source

`packages/protocol/src/input-contract.ts` (Contract source) · `packages/vue-web/src/input.ts` (Vue renderer)

## With Form

Inputs typically nest inside `Form` / `FormItem`. FormData is collected automatically by the native `<form>` element on submit.

```html
<form>
  <div class="form-item">
    <label>Email</label>
    <input name="email" type="email" />
  </div>
</form>
```