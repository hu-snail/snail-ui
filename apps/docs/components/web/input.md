# Input · Web

受控输入控件，Token 驱动的样式方案与一组跨浏览器原生 input 事件。映射到真实的 `<input>` DOM 元素，由 `@snui/vue-web` 渲染。

<script setup>
import ComponentPreview from '../../.vitepress/components/ComponentPreview.vue';
</script>

## Live render · 真实框架挂载

下面所有输入框通过 `createVueRenderer().mount()` 挂载，刷新页面即可重新挂载。

### Types（input type）

<ComponentPreview name="input" :raw-props="{ value: 'text input', type: 'text', placeholder: '文本输入' }" />
<ComponentPreview name="input" :raw-props="{ value: 'a@b.dev', type: 'email', placeholder: '邮箱' }" />
<ComponentPreview name="input" :raw-props="{ value: '', type: 'password', placeholder: '密码' }" />
<ComponentPreview name="input" :raw-props="{ value: '13900000000', type: 'tel', placeholder: '手机号' }" />

### Sizes（尺寸）

<ComponentPreview name="input" :raw-props="{ value: 'Small', size: 'small', placeholder: '小号' }" />
<ComponentPreview name="input" :raw-props="{ value: 'Medium', size: 'medium', placeholder: '中号' }" />
<ComponentPreview name="input" :raw-props="{ value: 'Large', size: 'large', placeholder: '大号' }" />

### States（状态）

<ComponentPreview name="input" :raw-props="{ value: '禁用态', disabled: true }" />
<ComponentPreview name="input" :raw-props="{ value: '只读态', readonly: true }" />

### Clearable（可清除）

<ComponentPreview name="input" :raw-props="{ value: '点击右侧 × 清空', clearable: true }" />

### Length constraints（长度约束）

<ComponentPreview name="input" :raw-props="{ value: '', placeholder: '最多 8 字符', maxlength: 8, name: 'username' }" />

### 受控用法示例

<ComponentPreview
  name="input"
  :raw-props="{ value: 'controlled', name: 'email', type: 'email', placeholder: 'you@aui.dev' }"
/>

```ts
import { ref } from 'vue';
import { createVueRenderer, createComponentRegistry, Input } from '@snui/vue-web';

const value = ref('hello@aui.dev');

// 或者直接构造 schema：
const registry = createComponentRegistry();
registry.register('input', Input);
createVueRenderer({ registry }).mount({
  version: '1.0.0',
  root: {
    id: 'email',
    type: 'input',
    props: { value: value.value, name: 'email', type: 'email' },
  },
}, document.getElementById('app')!);
```

## Props

<table class="props">
  <thead>
    <tr><th>Prop</th><th>Type</th><th>Default</th><th>Required</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>value</code></td><td><code>string</code></td><td><code>''</code></td><td>No</td><td>受控值。父组件在收到 <code>input</code> 后应使用新值重新渲染。</td></tr>
    <tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>No</td><td>空值占位符。</td></tr>
    <tr><td><code>type</code></td><td><code>'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'</code></td><td><code>'text'</code></td><td>No</td><td>原生 input type。</td></tr>
    <tr><td><code>size</code></td><td><code>'small' | 'medium' | 'large'</code></td><td><code>'medium'</code></td><td>No</td><td>高度 / 内边距 / 字号子轴（§36）。</td></tr>
    <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td><td>禁用并应用 <code>aria-disabled</code>。</td></tr>
    <tr><td><code>readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td><td>只读并应用 <code>aria-readonly</code>。</td></tr>
    <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td><td>值为非空时显示 <code>×</code> 清除按钮。</td></tr>
    <tr><td><code>maxlength</code></td><td><code>number</code></td><td>—</td><td>No</td><td>最大字符数。</td></tr>
    <tr><td><code>minlength</code></td><td><code>number</code></td><td>—</td><td>No</td><td>最小字符数。</td></tr>
    <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>No</td><td>原生 name（FormData 收集时使用）。</td></tr>
  </tbody>
</table>

## Events

<table class="props">
  <thead>
    <tr><th>Event id</th><th>DOM event</th><th>Payload</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td><code>input</code></td><td><code>input</code></td><td><code>string</code></td><td>每次按键触发。</td></tr>
    <tr><td><code>change</code></td><td><code>change</code></td><td><code>string</code></td><td>提交时触发（input + blur / Enter）。</td></tr>
    <tr><td><code>focus</code></td><td><code>focus</code></td><td><code>FocusEvent</code></td><td>获得焦点。</td></tr>
    <tr><td><code>blur</code></td><td><code>blur</code></td><td><code>FocusEvent</code></td><td>失去焦点。</td></tr>
    <tr><td><code>clear</code></td><td><code>click</code>（清除按钮）</td><td>—</td><td>用户点击清除按钮（<code>clearable=true</code> 时）。同时 emit 一对 <code>input</code>/<code>change</code>，值为 <code>''</code>。</td></tr>
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
| `aria-disabled` | 绑定到 `props.disabled` |
| `aria-readonly` | 绑定到 `props.readonly` |
| `aria-placeholder` | 绑定到 `props.placeholder` |

## AI Patch Boundary

| Status | Field |
| --- | --- |
| `ai.patchable` | `value`, `placeholder`, `disabled`, `readonly`, `type`, `size`, `clearable`, `maxlength`, `minlength`, `name` |
| `ai.readonly` | `role`, `keyboard`, `focus`, `blur` |

## Source

`packages/protocol/src/input-contract.ts` (Contract source) · `packages/vue-web/src/input.ts` (Vue renderer)

## 与 Form 联动

通常 Input 嵌入 `Form` / `FormItem` 容器，FormData 在原生 `<form>` submit 时自动收集带 `name` 的输入。

```html
<form>
  <div class="form-item">
    <label>Email</label>
    <input name="email" type="email" />
  </div>
</form>
```