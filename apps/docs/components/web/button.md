# Button · Web

The first official AUI component. Used by `apps/docs` itself in every preview. Maps to a real `<button>` DOM element via `@snui/vue-web`.

<script setup>
import ComponentPreview from '../../.vitepress/components/ComponentPreview.vue';
</script>

## Live render · real framework mount

The 12 buttons below are mounted via `createVueRenderer().mount()` from `@snui/vue-web`. Refresh the page to re-mount.

### Variants

<ComponentPreview name="button" variant="primary" text="Primary" />

<ComponentPreview name="button" variant="secondary" text="Secondary" />

<ComponentPreview name="button" variant="danger" text="Danger" />

<ComponentPreview name="button" variant="ghost" text="Ghost" />

### Sizes

<ComponentPreview name="button" variant="primary" size="small" text="Small" />

<ComponentPreview name="button" variant="primary" size="medium" text="Medium" />

<ComponentPreview name="button" variant="primary" size="large" text="Large" />

### States

<ComponentPreview name="button" variant="primary" :disabled="true" text="Disabled" />

<ComponentPreview name="button" variant="primary" :loading="true" text="Loading" />

### On dark surface

<ComponentPreview name="button" variant="primary" text="On dark" :dark="true" />

<ComponentPreview name="button" variant="ghost" text="Ghost dark" :dark="true" />

## Props

<table class="props">
  <thead>
    <tr><th>Prop</th><th>Type</th><th>Default</th><th>Required</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>variant</code></td><td><code>'primary' | 'secondary' | 'danger' | 'ghost'</code></td><td><code>'primary'</code></td><td>No</td><td>Visual style. Maps to <code>--aui-color-action-*</code>.</td></tr>
    <tr><td><code>size</code></td><td><code>'small' | 'medium' | 'large'</code></td><td><code>'medium'</code></td><td>No</td><td>Height + padding + font-size (sub-axis per §36).</td></tr>
    <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td><td>Suppresses click + applies <code>aria-disabled</code>.</td></tr>
    <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td><td>Shows spinner + applies <code>aria-busy</code>; suppresses click.</td></tr>
    <tr><td><code>icon</code></td><td><code>string</code></td><td>—</td><td>No</td><td>Icon name (registered via <code>AppIcon</code>; see project README).</td></tr>
    <tr><td><code>text</code></td><td><code>string</code></td><td>—</td><td>No</td><td>Visible label. Min length 1.</td></tr>
    <tr><td><code>type</code></td><td><code>'button' | 'submit' | 'reset'</code></td><td><code>'button'</code></td><td>No</td><td>Native button type.</td></tr>
  </tbody>
</table>

## Events

<table class="props">
  <thead>
    <tr><th>Event id</th><th>DOM event</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td><code>click</code></td><td><code>click</code></td><td>Suppressed while <code>disabled</code> or <code>loading</code>.</td></tr>
  </tbody>
</table>

## Tokens

| Logical slot | CSS variable |
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

| Attribute | Value |
| --- | --- |
| `role` | `button` |
| `keyboard` | `Enter`, `Space` |
| `aria-disabled` | bound to `props.disabled` |
| `aria-busy` | bound to `props.loading` |

## AI Patch Boundary

| Status | Field |
| --- | --- |
| `ai.patchable` | `variant`, `size`, `disabled`, `loading`, `icon`, `text`, `type` |
| `ai.readonly` | `role`, `keyboard`, `click` |

## Source

`packages/protocol/src/button-contract.ts` (Contract source) · `packages/vue-web/src/button.ts` (Vue renderer)

## Uni-app equivalent

The same Button contract ships for uni-app with the same props, different event catalog. See [Button · uni-app](/components/uni/button).