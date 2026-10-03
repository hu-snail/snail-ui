# Divider (Web)

`SnDivider` is the visual separator component in `@snui/vue-web` (PC desktop). All visual properties are driven by the `--sn-web-*` Token alias layer.

> **v3.1 End-Independent**: `SnDivider` (`@snui/vue-web`) and `sn-divider` (`@snui/uni`) are **two independent components**. Web CSS uses only `var(--sn-web-*)` (px); uni CSS uses only `var(--sn-mp-*)` (rpx). **Zero source-code reuse between ends**.

---

## Live preview

<Demo name="divider-web" />

---

## Basic usage

```vue
<script setup lang="ts">
import { SnDivider } from '@snui/vue-web'
import '@snui/tokens-web/styles'
</script>

<template>
  <p>Above</p>
  <SnDivider />
  <p>Below (horizontal default)</p>
</template>
```

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Axis of the line |
| `dashed` | `boolean` | `false` | Dashed border |
| `color` | `string` | — | Custom color (any CSS color value) |
| `marginSize` | `'small' \| 'medium' \| 'large'` | `'medium'` | Vertical margin (only for horizontal) |

### Slots

| Name | Description |
| --- | --- |
| `default` | Text on the line (only horizontal) |

---

## Tokens (Web alias layer)

| Logical slot | CSS variable |
| --- | --- |
| `line` | `var(--sn-web-color-border-default)` |
| `slot text` | `var(--sn-web-color-text-secondary)` |
| `slot background` | `var(--sn-web-color-background-surface)` |

> SnDivider source CSS internally uses `--sn-web-*` aliases (**not** `--aui-*`).

---

## Accessibility

- `role="separator"`
- `aria-orientation` follows `direction` prop
- Pure decoration: no keyboard interaction

---

## End difference

| Dimension | Web (`SnDivider`) | uni (`sn-divider`) |
|---|---|---|
| Package | `@snui/vue-web` | `@snui/uni` |
| Component name | `SnDivider` (PascalCase import) | `sn-divider` (kebab-case easycom) |
| Token alias | `--sn-web-*` (px) | `--sn-mp-*` (rpx) |
| End-specific Props | — | `hairline: boolean` (default true, 1rpx) |
| Container | `<div>` + `<span>` | `<view>` + `<text>` |
| Default margin | 8 / 16 / 24 px | 16 / 32 / 48 rpx |

---

## Related

- Source: `packages/vue-web/src/divider/SnDivider.vue`
- AI description: `packages/vue-web/src/divider/ai-description.md` (`end: web`)
- Token alias layer: `packages/tokens-web/`
- uni: [`sn-divider`](/en/components/uni/divider)