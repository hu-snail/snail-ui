# Button · Web

首个 AUI 官方组件。`apps/docs` 的每个 preview 都用到它。通过 `@snui/vue-web` 映射到真实的 `<button>` DOM 元素。

<script setup>
import ComponentPreview from '../../.vitepress/components/ComponentPreview.vue';
</script>

## Live render · 真实框架挂载

下面 12 个 button 通过 `createVueRenderer().mount()` 从 `@snui/vue-web` 挂载，刷新页面即可重新挂载。

### 变体（Variants）

<ComponentPreview name="button" variant="primary" text="Primary" />

<ComponentPreview name="button" variant="secondary" text="Secondary" />

<ComponentPreview name="button" variant="danger" text="Danger" />

<ComponentPreview name="button" variant="ghost" text="Ghost" />

### 尺寸（Sizes）

<ComponentPreview name="button" variant="primary" size="small" text="Small" />

<ComponentPreview name="button" variant="primary" size="medium" text="Medium" />

<ComponentPreview name="button" variant="primary" size="large" text="Large" />

### 状态（States）

<ComponentPreview name="button" variant="primary" :disabled="true" text="Disabled" />

<ComponentPreview name="button" variant="primary" :loading="true" text="Loading" />

### 暗色表面

<ComponentPreview name="button" variant="primary" text="On dark" :dark="true" />

<ComponentPreview name="button" variant="ghost" text="Ghost dark" :dark="true" />

## Props

<table class="props">
  <thead>
    <tr><th>Prop</th><th>类型</th><th>默认值</th><th>必填</th><th>说明</th></tr>
  </thead>
  <tbody>
    <tr><td><code>variant</code></td><td><code>'primary' | 'secondary' | 'danger' | 'ghost'</code></td><td><code>'primary'</code></td><td>No</td><td>视觉风格。映射到 <code>--aui-color-action-*</code>。</td></tr>
    <tr><td><code>size</code></td><td><code>'small' | 'medium' | 'large'</code></td><td><code>'medium'</code></td><td>No</td><td>高度 / 内边距 / 字号子轴（§36）。</td></tr>
    <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td><td>禁用并应用 <code>aria-disabled</code>。</td></tr>
    <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td><td>显示 spinner 并应用 <code>aria-busy</code>；禁用 click。</td></tr>
    <tr><td><code>icon</code></td><td><code>string</code></td><td>—</td><td>No</td><td>图标名（通过 <code>AppIcon</code> 注册）。</td></tr>
    <tr><td><code>text</code></td><td><code>string</code></td><td>—</td><td>No</td><td>可见标签。最小长度 1。</td></tr>
    <tr><td><code>type</code></td><td><code>'button' | 'submit' | 'reset'</code></td><td><code>'button'</code></td><td>No</td><td>原生 button type。</td></tr>
  </tbody>
</table>

## Events

<table class="props">
  <thead>
    <tr><th>Event id</th><th>DOM event</th><th>说明</th></tr>
  </thead>
  <tbody>
    <tr><td><code>click</code></td><td><code>click</code></td><td>当 <code>disabled</code> 或 <code>loading</code> 时被抑制。</td></tr>
  </tbody>
</table>

## Tokens

| 逻辑槽位 | CSS 变量 |
| --- | --- |
| `primary.background` | `var(--aui-color-action-primary)` |
| `primary.color` | `var(--aui-color-text-on-action)` |
| `danger.background` | `var(--aui-color-action-danger)` |
| `ghost.color` | `var(--aui-color-action-primary)` |
| `ghost.borderColor` | `var(--aui-color-action-primary)` |
| `size.small.height` | `var(--aui-control-height-sm)` |
| `size.medium.height` | `var(--aui-control-height-md)` |
| `size.large.height` | `var(--aui-control-height-lg)` |

## Accessibility

| 属性 | 值 |
| --- | --- |
| `role` | `button` |
| `keyboard` | `Enter`, `Space` |
| `aria-disabled` | 绑定到 `props.disabled` |
| `aria-busy` | 绑定到 `props.loading` |

## AI Patch Boundary

| 状态 | 字段 |
| --- | --- |
| `ai.patchable` | `variant`, `size`, `disabled`, `loading`, `icon`, `text`, `type` |
| `ai.readonly` | `role`, `keyboard`, `click` |

## Source

`packages/protocol/src/button-contract.ts` (Contract source) · `packages/vue-web/src/button.ts` (Vue renderer)

## Uni-app equivalent

Button 契约同样适用于 uni-app，props 相同，事件名略有差异。详见 [Button · uni-app](/components/uni/button)。