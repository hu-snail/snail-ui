# Divider (Web)

`SnDivider` is the visual separator component in `@snui/vue-web` (PC desktop). All visual properties are driven by the `--sn-web-*` Token alias layer.

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

---

## Accessibility

- `role="separator"`
- `aria-orientation` follows `direction` prop
- Pure decoration: no keyboard interaction

---

---

## Related

- uni: [`sn-divider`](/en/components/uni/divider)