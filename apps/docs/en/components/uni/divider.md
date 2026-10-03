# Divider (uni / Mobile)

`sn-divider` is the visual separator component in `@snui/uni` (mobile / miniprogram / H5). easycom auto-register, rpx for cross-device scaling.

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

---

---

## Related

- Web: [`SnDivider`](/en/components/web/divider)