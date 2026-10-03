# Divider (uni / Mobile)

`sn-divider` is the visual separator component in `@snui/uni` (mobile / miniprogram / H5). easycom auto-register, rpx for cross-device scaling.

> **v3.1 End-Independent**: `sn-divider` (`@snui/uni`) and `SnDivider` (`@snui/vue-web`) are **two independent components**. uni CSS uses only `var(--sn-mp-*)` (rpx). **Zero source-code reuse**.

---

## Live preview

<Demo name="divider-mp" />

---

## Auto-register (easycom)

```vue
<template>
  <p>Above</p>
  <sn-divider />
  <p>Below</p>
</template>
```

Explicit import (when easycom is disabled):

```ts
import { SnDivider } from '@snui/uni'
```

---

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Axis |
| `dashed` | `boolean` | `false` | Dashed border |
| `hairline` | `boolean` | `true` | 1rpx hairline |
| `color` | `string` | — | Custom color |
| `marginSize` | `'small' \| 'medium' \| 'large'` | `'medium'` | Vertical margin (horizontal only) |

### Slots

| Name | Description |
| --- | --- |
| `default` | Text on the line (horizontal only) |

---

## Tokens (uni alias layer + rpx)

| Logical slot | CSS variable |
| --- | --- |
| `line` | `var(--sn-mp-color-border-default)` |
| `slot text` | `var(--sn-mp-color-text-secondary)` |
| `slot background` | `var(--sn-mp-color-background-surface)` |

> sn-divider source CSS internally uses `--sn-mp-*` aliases (**not** `--sn-web-*` / `--aui-*`).

---

## End difference

| Dimension | uni (`sn-divider`) | Web (`SnDivider`) |
|---|---|---|
| Package | `@snui/uni` | `@snui/vue-web` |
| Component name | `sn-divider` (kebab-case easycom) | `SnDivider` (PascalCase import) |
| Token alias | `--sn-mp-*` (rpx) | `--sn-web-*` (px) |
| End-specific Props | `hairline: boolean` (default true) | — |
| Container | `<view>` + `<text>` | `<div>` + `<span>` |
| Default margin | 16 / 32 / 48 rpx | 8 / 16 / 24 px |

---

## Related

- Source: `packages/uni/src/components/sn-divider/sn-divider.vue`
- AI description: `packages/uni/src/components/sn-divider/ai-description.md` (`end: mp`)
- Token alias layer: `packages/tokens-mp/`
- Web: [`SnDivider`](/en/components/web/divider)