# Density · compact / comfortable

The Density axis owns **size density**: spacing, sizes, font sizes. Three axes are independent — Density does not affect color or radius.

## Built-in defaults

```ts
import { COMPACT_DENSITY, COMFORTABLE_DENSITY } from '@snui/tokens'
```

| Density | Use |
| --- | --- |
| `COMFORTABLE_DENSITY` | Default — generous spacing, large sizes, mobile-first |
| `COMPACT_DENSITY` | Tighter spacing, smaller control heights, desktop / dense layouts |

## Switching Density behavior

```text
Density swap
   ↓
preserve Theme
   ↓
preserve Style
   ↓
recompute Primitive size / spacing / fontSize
```

Per ADR-0002: switching Density only recomputes size-related primitives.

## Custom Density

```ts
import type { DensityDefinition } from '@snui/tokens'

const dense: DensityDefinition = {
  name: 'dense',
  primitive: {
    spacing: {
      '3': '4px',     // was 8px
      '4': '8px',     // was 12px
      '5': '12px',    // was 16px
    },
    size: {
      control: {
        sm: '20px',
        md: '28px',
        lg: '36px',
      },
    },
    font: {
      size: {
        body: '13px',     // was 14px
      },
    },
  },
}
```

Apply `dense` and button height switches from `36px` to `28px`, body text from `14px` to `13px`. Color and radius stay unchanged.

## Forbidden

| Don't | Why |
| --- | --- |
| Override color Tokens | Belongs to Theme |
| Override radius / shadow | Belongs to Style |
| Couple Density with specific Theme / Style | Three axes are independent |

## Where to next

- [Token cascade](/en/theme/cascade)
- [Style Packs](/en/style-packs/overview)