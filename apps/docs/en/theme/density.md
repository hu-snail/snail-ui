# Density · Compact / Comfortable

The Density axis owns **size**: control heights, padding, font sizes, line-heights.

A Density does NOT touch tokens (those are Style) or changes (those are Theme).

## Defaults shipped

```ts
import { COMPACT_DENSITY, COMFORTABLE_DENSITY } from '@snui/tokens';
```

| Density | Sample deltas |
| --- | --- |
| `COMPACT_DENSITY` | `--aui-spacing-4: 10px` (was 12px), `--aui-size-control-md: 20px` (was 32px) |
| `COMFORTABLE_DENSITY` | default — no overrides |

## Behavior on density change

```
Density Change
   ↓
保留 Theme
   ↓
保留 Style
   ↓
只重新计算尺寸类 Token
```

Per AUI-PRD-v1.2.md §38: changing the density preserves Theme and Style. Only size primitives are recomputed.

## Custom density

```ts
import type { DensityDefinition } from '@snui/tokens';

const cozy: DensityDefinition = {
  name: 'cozy',
  primitive: {
    spacing: {
      '3': '10px',
      '4': '14px',
      '5': '18px',
    },
    size: {
      control: { sm: '28px', md: '36px', lg: '44px' },
    },
    font: {
      size: { md: '15px' },
    },
  },
};
```

`cozy` is between `compact` and `comfortable`. It does not touch any color or radius token.

## What a Density MUST NOT do

| Forbidden | Reason |
| --- | --- |
| Override color tokens | Belongs to Theme |
| Override radius / shadow | Belongs to Style |
| Tight-couple to a specific style | Styles and Densities are independent axes |

## Live comparison

<script setup>
import ComponentPreview from '../../../.vitepress/components/ComponentPreview.vue';
</script>

<ComponentPreview name="button" variant="primary" size="medium" text="Comfortable · medium" />

> Compact density preview lands once the docs site supports a density switcher. The contract surface is the same; only the primitive `spacing` / `size` overrides change.

## Next

- [Token cascade](/en/theme/cascade)
- [Theme (Light / Dark)](/en/theme/theme)
- [Style (Modern / Glass / Minimal)](/en/theme/style)