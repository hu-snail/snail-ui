# Button (Web)

`SnButton` is the most common interactive component in `@snui/vue-web` (PC desktop). All visual properties are driven by the `--sn-web-*` Token alias layer.

> **v3.1 End-Independent**: `SnButton` (`@snui/vue-web`) and `sn-button` (`@snui/uni`) are **two independent components** in two independent packages — fully independent from development to release. Web CSS uses only `var(--sn-web-*)` (px units); uni CSS uses only `var(--sn-mp-*)` (rpx units). **Zero source-code reuse between ends**.

---

## Basic usage

```vue
<script setup lang="ts">
import { SnButton } from '@snui/vue-web'
import '@snui/tokens-web/styles'
</script>

<template>
  <SnButton>Default</SnButton>
  <SnButton type="primary">Primary</SnButton>
  <SnButton type="success">Success</SnButton>
  <SnButton type="warning">Warning</SnButton>
  <SnButton type="danger">Danger</SnButton>
</template>
```

## Sizes

`tiny` / `small` / `medium` / `large` correspond to `--sn-web-button-height-{tiny,small,medium,large}`.

```vue
<SnButton size="tiny">tiny</SnButton>
<SnButton size="small">small</SnButton>
<SnButton size="medium">medium</SnButton>
<SnButton size="large">large</SnButton>
```

## Block & round

```vue
<SnButton block type="primary">Block</SnButton>
<SnButton round type="success">Round</SnButton>
```

## States

```vue
<SnButton disabled>Disabled</SnButton>
<SnButton loading>Loading</SnButton>
```

While `loading`, the button is unclickable and shows a spinner. Override via the `loading` slot.

---

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| type | `'primary' \| 'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | Button type |
| size | `'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| block | `boolean` | `false` | Block (full width) |
| round | `boolean` | `false` | Pill shape |
| disabled | `boolean` | `false` | Disabled |
| loading | `boolean` | `false` | Loading |
| htmlType | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type |
| bordered | `boolean` | `true` | Show border (for `default` type) |
| ariaLabel | `string` | — | A11y label |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| click | `(event: MouseEvent)` | Click; not emitted when `disabled` or `loading` |

### Slots

| Name | Description |
| --- | --- |
| default | Button content |
| icon | Custom icon (replaces spinner) |
| loading | Custom loading icon (replaces spinner) |

### Types

```ts
type ButtonType = 'primary' | 'default' | 'success' | 'warning' | 'danger' | 'info'
type ButtonSize = 'tiny' | 'small' | 'medium' | 'large'
```

---

## Token customization (Web alias layer)

Web component CSS uses only `--sn-web-*`. Override:

```css
:root {
  --sn-web-color-action-primary: #1677ff;       /* primary background */
  --sn-web-color-feedback-danger: #ef4444;      /* danger background */
  --sn-web-button-radius: 8px;                  /* radius */
  --sn-web-button-height-medium: 36px;          /* medium height */
}
```

> **Forbidden**: Web component CSS must not reference `--sn-mp-*` or `--aui-*` directly. SnButton source CSS internally uses `--sn-web-*`. To override: re-declare `--sn-web-*` aliases in `:root` (aliases ultimately reference `--aui-*`).

---

## Accessibility

- Native `<button>`, `role="button"`
- `disabled` → `aria-disabled="true"`
- `loading` → `aria-busy="true"`
- Supports `aria-label` override
- Keyboard Enter / Space trigger click natively

---

## End difference comparison

| Dimension | Web (`SnButton`) | uni (`sn-button`) |
|---|---|---|
| Package | `@snui/vue-web` | `@snui/uni` |
| Component name | `SnButton` (PascalCase import) | `sn-button` (kebab-case easycom) |
| Token alias | `--sn-web-*` (px) | `--sn-mp-*` (rpx) |
| Sizes | tiny / small / medium / large | small / medium / large (no tiny) |
| Event | `click` (MouseEvent) | `click` (tap) |
| End-specific Props | `htmlType` (native button type) | `hairline` / `feedback` (hairline + active feedback) |
| Unit | — | rpx (auto 750 design width) |

Web has unique `htmlType`; uni has unique `hairline` / `feedback`. Full comparison at [uni sn-button](/components/uni/button).

---

## Related

- Source: `packages/vue-web/src/button/SnButton.vue`
- AI description: `packages/vue-web/src/button/ai-description.md` (`end: web`)
- Token alias layer: `packages/tokens-web/` (`--sn-web-*`)
- uni: [`sn-button`](/components/uni/button)