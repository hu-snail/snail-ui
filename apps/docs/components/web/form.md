# Form · Web

原生 `<form>` 容器 + FormItem 子组件，支持 FormData 自动收集、字段级错误回显、disabled / loading 状态级联。

<script setup>
import ComponentPreview from '../../.vitepress/components/ComponentPreview.vue';
</script>

## Live render · 真实框架挂载

### Login form（最简场景）

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

### Error wiring（FormItem 错误回显）

<ComponentPreview name="form" :raw-props="{ formId: 'errors' }" :children='JSON.stringify([
  { id: "email", type: "form-item", props: { prop: "email", label: "Email", error: "Invalid email format" }, children: [
    { id: "email-input", type: "input", props: { value: "broken", type: "email", name: "email" } }
  ]},
  { id: "submit", type: "button", props: { variant: "danger", text: "Try again", type: "submit" } }
])' />

### 完整登录流程（含 ActionRegistry）

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

```ts
import { createRuntime, createActionRegistry } from '@snui/runtime';
import { createVueRenderer, createComponentRegistry, Form, FormItem, Input, Button } from '@snui/vue-web';
import { LIGHT_THEME, MODERN_STYLE, COMFORTABLE_DENSITY } from '@snui/tokens';

const actions = createActionRegistry();
actions.register('sign-in', async (ctx, params) => {
  console.log('submit values:', params);
  // 真实场景：await fetch('/api/login', { method: 'POST', body: JSON.stringify(params) });
});

const registry = createComponentRegistry();
registry.register('button', Button);
registry.register('input', Input);
registry.register('form', Form);
registry.register('form-item', FormItem);

const runtime = createRuntime({
  schema: { version: '1.0.0', root: { id: 'root', type: 'form', props: { formId: 'login' } } },
  registry: {
    resolve: (type) => registry.has(type) ? { name: type, version: '0.1.0' } : undefined,
    has: (type) => registry.has(type),
    list: () => registry.list(),
  },
  actionRegistry: {
    resolve: (id) => actions.resolve(id),
    has: (id) => actions.has(id),
  },
  tokens: { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMFORTABLE_DENSITY },
  platform: { id: 'web', capabilities: { supports: { dom: true } } },
});

createVueRenderer({ registry }).mount(runtime.schema, document.getElementById('app')!);
runtime.mount(document.getElementById('app')!);
```

## Form props

<table class="props">
  <thead>
    <tr><th>Prop</th><th>Type</th><th>Default</th><th>Required</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>layout</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'vertical'</code></td><td>No</td><td>布局方向。</td></tr>
    <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td><td>禁用整个表单（cascading via FormContext）。</td></tr>
    <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td><td>表单加载中（应用 <code>aria-busy</code>）。</td></tr>
    <tr><td><code>initialValues</code></td><td><code>Record&lt;string, unknown&gt;</code></td><td><code>{}</code></td><td>No</td><td>初始值（HTML FormData 仍由原生 input 自动收集）。</td></tr>
    <tr><td><code>fields</code></td><td><code>FormField[]</code></td><td>—</td><td>No</td><td>字段描述数组，可选；内嵌 children 树是更常用的方式。</td></tr>
    <tr><td><code>formId</code></td><td><code>string</code></td><td>—</td><td>No</td><td>原生 <code>&lt;form&gt;</code> 元素 id。</td></tr>
  </tbody>
</table>

## FormItem props

<table class="props">
  <thead>
    <tr><th>Prop</th><th>Type</th><th>Default</th><th>Required</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>prop</code></td><td><code>string</code></td><td>—</td><td>**Yes**</td><td>字段路径，用于值查找与错误回显。</td></tr>
    <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>No</td><td>字段标签。</td></tr>
    <tr><td><code>required</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td><td>必填，附加 <code>*</code> 标记 + <code>aria-required</code>。</td></tr>
    <tr><td><code>error</code></td><td><code>string</code></td><td>—</td><td>No</td><td>字段级错误信息（来自父级 validate）。</td></tr>
  </tbody>
</table>

## Validation rules（`fields[].rules`）

Phase 2 最小规则集：

| Rule | 行为 |
| --- | --- |
| `required` | 值非空字符串 |
| `minLength` | 字符串长度下限 |
| `maxLength` | 字符串长度上限 |
| `pattern` | RegExp 源码（运行时编译） |
| `message` | 自定义错误文本 |

## Events

<table class="props">
  <thead>
    <tr><th>Event id</th><th>DOM event</th><th>Payload</th></tr>
  </thead>
  <tbody>
    <tr><td><code>submit</code></td><td><code>submit</code></td><td><code>Record&lt;string, string&gt;</code>（已清理的 values）</td></tr>
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
| `role` | `form`（Form） · `group`（FormItem） |
| `keyboard` | `Enter`, `Tab`（Form） · 平台原生（FormItem） |
| `aria-busy` | 绑定到 `Form.props.loading` |
| `aria-disabled` | 绑定到 `Form.props.disabled` |
| `aria-required` | 绑定到 `FormItem.props.required` |
| `aria-invalid` | 绑定到 <code>has-error(error)</code>（有错误信息时） |

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

## 完整流程（Schema → Runtime → Submit → Action）

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