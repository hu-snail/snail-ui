# Density · compact / comfortable

The Density axis owns **size density**. Does not affect color or radius.

## Built-in defaults

```ts
import { COMPACT_DENSITY, COMFORTABLE_DENSITY } from '@snui/tokens'
```

| Density | Use |
| --- | --- |
| `COMFORTABLE_DENSITY` | Default — generous spacing, large sizes |
| `COMPACT_DENSITY` | Tighter spacing, smaller control heights, desktop / dense layouts |

## Per-end Density base

Web and uni Density presets map to different px / rpx bases:

- **Web**: Density outputs px values (32px / 36px / 44px ...)
- **uni**: Density via `@snui/tokens-mp` auto-converts to rpx (64rpx / 72rpx / 88rpx ...)

Switching Density preserves Theme and Style.

## Custom Density

```ts
import type { DensityDefinition } from '@snui/tokens'

const dense: DensityDefinition = {
  name: 'dense',
  primitive: {
    spacing: { '3': '4px', '4': '8px', '5': '12px' },
    size: { control: { sm: '20px', md: '28px', lg: '36px' } },
  },
}
```

## Forbidden

| Don't | Why |
| --- | --- |
| Override color Tokens | Belongs to Theme |
| Override radius / shadow | Belongs to Style |
| Couple with specific Theme / Style | Three axes are independent |

## Where to next

- [Token cascade](/en/theme/cascade)
- [Style Packs](/en/style-packs/overview)