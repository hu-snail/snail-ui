# Style · Modern / Glass / Minimal

The Style axis owns the **shape personality**: radius, shadow, and component shape tokens (button radius, card padding, etc.).

A Style does NOT touch colors (those are Theme) or size primitives (those are Density).

## Defaults shipped

```ts
import { MODERN_STYLE } from '@snui/tokens';
```

| Style | Personality |
| --- | --- |
| `MODERN_STYLE` | 6px control radius, subtle shadow, flat surfaces |
| `GLASS_STYLE` | (Phase 2) — 12px radius, elevated shadow, blur |
| `MINIMAL_STYLE` | (Phase 2) — 0 radius, no shadow, hairline borders |

## Behavior on style change

```
Style Change
   ↓
保留 Theme
   ↓
保留 Density
   ↓
重新计算 Component Token
```

Per AUI-PRD-v1.2.md §38: changing the style preserves Theme and Density. Only the component-shape tokens are recomputed.

## Custom style

```ts
import type { StyleDefinition } from '@snui/tokens';

const glass: StyleDefinition = {
  name: 'glass',
  primitive: {
    radius: { md: '12px', lg: '16px' },
    shadow: { md: '0 12px 32px rgba(0,0,0,0.12)' },
  },
  component: {
    button: { radius: 'var(--aui-radius-lg)' },
    card: { radius: 'var(--aui-radius-lg)' },
  },
};
```

When `glass` is applied, the Button's `--aui-button-radius` flips from `6px` to `16px` and shadow depth increases. Color and spacing stay identical.

## What a Style MUST NOT do

| Forbidden | Reason |
| --- | --- |
| Override color tokens | Belongs to Theme |
| Override spacing / size primitives | Belongs to Density |
| Tight-couple to a specific theme | Themes and Styles are independent axes |

## Live comparison

<script setup>
import ComponentPreview from '../../../.vitepress/components/ComponentPreview.vue';
</script>

<ComponentPreview name="button" variant="primary" text="Modern" />

<ComponentPreview name="button" variant="primary" text="Modern · large" size="large" />

> Glass / Minimal previews land when those styles are implemented. The contract surface is the same; only the `component.*` overrides change.

## Next

- [Density (Compact / Comfortable)](/en/theme/density)
- [Token cascade](/en/theme/cascade)
- [Theme (Light / Dark)](/en/theme/theme)