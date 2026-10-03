# Style · the shape axis (Modern / Glass / Minimal)

The Style axis owns **shape personality**: radii, shadows, component tokens (button radius, card padding). Style never touches color (that's Theme) or size primitives (that's Density).

## Built-in defaults

```ts
import { MODERN_STYLE } from '@snui/tokens'
```

| Style | Personality |
| --- | --- |
| `MODERN_STYLE` | 6px control radius, subtle shadows, flat surfaces |
| `GLASS_STYLE` | (Phase 2) — 12px radius, floating shadows, glassmorphic |
| `MINIMAL_STYLE` | (Phase 2) — 0 radius, no shadow, hairline border |

## Style Pack vs Style axis

The Style axis is the standard definition of the Style field (radius + shadow + Component Token). A **Style Pack** is a higher-level wrapper: Token + skin CSS + resources layered to fully change the visual personality (doodle / sticky-note / Douyin). See [Style Packs](/en/style-packs/overview).

## Switching Style behavior

```text
Style swap
   ↓
preserve Theme
   ↓
preserve Density
   ↓
recompute Component Token
```

Per ADR-0002: switching Style preserves Theme and Density. Only component-shape Tokens are recomputed.

## Custom Style

```ts
import type { StyleDefinition } from '@snui/tokens'

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
}
```

Apply `glass` and Button's `--sn-button-radius` switches from `6px` to `16px` while color and spacing stay.

## Forbidden

| Don't | Why |
| --- | --- |
| Override color Tokens | Belongs to Theme |
| Override spacing / size primitives | Belongs to Density |
| Couple Style with a specific Theme | Theme and Style are independent |

## Where to next

- [Density · compact / comfortable](/en/theme/density)
- [Token cascade](/en/theme/cascade)
- [Style Packs](/en/style-packs/overview)