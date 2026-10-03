# Form · Web

Native `<form>` container with FormItem sub-component. Supports FormData collection, per-field error display, and cascading disabled / loading via `FormContext`.

<script setup>
import ComponentPreview from '../../../.vitepress/components/ComponentPreview.vue';
</script>

## Live render · real framework mount

### Login form

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

### Error wiring

<ComponentPreview name="form" :raw-props="{ formId: 'errors' }" :children='JSON.stringify([
  { id: "email", type: "form-item", props: { prop: "email", label: "Email", error: "Invalid email format" }, children: [
    { id: "email-input", type: "input", props: { value: "broken", type: "email", name: "email" } }
  ]},
  { id: "submit", type: "button", props: { variant: "danger", text: "Try again", type: "submit" } }
])' />

## Form props

<table class="props">
  <thead>
    <tr><th>Prop</th><th>Type</th><th>Default</th><th>Required</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>layout</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'vertical'</code></td><td>No</td><td>Layout direction.</td></tr>
    <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td><td>Disable the whole form (cascading via FormContext).</td></tr>
    <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td><td>Form is loading (applies <code>aria-busy</code>).</td></tr>
    <tr><td><code>initialValues</code></td><td><code>Record&lt;string, unknown&gt;</code></td><td><code>{}</code></td><td>No</td><td>Initial values (HTML FormData is still auto-collected by native inputs).</td></tr>
    <tr><td><code>fields</code></td><td><code>FormField[]</code></td><td>—</td><td>No</td><td>Optional field descriptors; nested children is the common path.</td></tr>
    <tr><td><code>formId</code></td><td><code>string</code></td><td>—</td><td>No</td><td>Native <code>&lt;form&gt;</code> element id.</td></tr>
  </tbody>
</table>

## FormItem props

<table class="props">
  <thead>
    <tr><th>Prop</th><th>Type</th><th>Default</th><th>Required</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>prop</code></td><td><code>string</code></td><td>—</td><td>**Yes**</td><td>Field path used for value / error lookup.</td></tr>
    <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>No</td><td>Field label.</td></tr>
    <tr><td><code>required</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td><td>Required field; renders <code>*</code> + <code>aria-required</code>.</td></tr>
    <tr><td><code>error</code></td><td><code>string</code></td><td>—</td><td>No</td><td>Field-level error message (from parent validate).</td></tr>
  </tbody>
</table>

## Validation rules (`fields[].rules`)

Phase 2 minimum rule set:

| Rule | Behaviour |
| --- | --- |
| `required` | value must be a non-empty string |
| `minLength` | minimum string length |
| `maxLength` | maximum string length |
| `pattern` | RegExp source string (compiled at runtime) |
| `message` | custom error text |

## Events

<table class="props">
  <thead>
    <tr><th>Event id</th><th>DOM event</th><th>Payload</th></tr>
  </thead>
  <tbody>
    <tr><td><code>submit</code></td><td><code>submit</code></td><td><code>Record&lt;string, string&gt;</code> (cleaned values)</td></tr>
    <tr><td><code>validate</code></td><td>—</td><td><code>{ valid: boolean; errors: Record&lt;string, string&gt; }</code></td></tr>
  </tbody>
</table>

## Tokens

| Logical slot | CSS variable |
| --- | --- |
| `background` | `var(--aui-color-surface)` |
| `itemGap` | `var(--aui-spacing-md)` |
| `labelColor` | `var(--aui-color-text-primary)` |
| `errorColor` | `var(--aui-color-text-danger)` |
| `requiredColor` | `var(--aui-color-text-danger)` |
| `borderColor` | `var(--aui-color-border-default)` |

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `form` (Form) · `group` (FormItem) |
| `keyboard` | `Enter`, `Tab` (Form) · platform-native (FormItem) |
| `aria-busy` | bound to `Form.props.loading` |
| `aria-disabled` | bound to `Form.props.disabled` |
| `aria-required` | bound to `FormItem.props.required` |
| `aria-invalid` | bound to <code>has-error(error)</code> (when error present) |

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

## Source

`packages/protocol/src/form-contract.ts` (Contract source) · `packages/vue-web/src/form.ts` (Vue renderer)

## Full pipeline (Schema → Runtime → Submit → Action)

```text
User types
   ↓
Input emits 'input' / 'change'
   ↓
Form's <form> dispatchEvent('submit')
   ↓
Form collects FormData → emit 'submit' (values)
   ↓
Runtime ActionRegistry dispatches registered handler
   ↓
Handler mutates state (or returns validation)
   ↓
Reactive re-render via @vue/reactivity
```