# Style · the shape axis

Style owns **shape personality**: radius, shadow, Component Token. Style never touches color or size primitives.

## Built-in defaults

```ts
import { MODERN_STYLE } from '@snui/tokens'
```

| Style | Personality |
| --- | --- |
| `MODERN_STYLE` | 6px radius, subtle shadow, flat |
| `GLASS_STYLE` | (Phase 2) — 12px radius, floating shadow, glassmorphic |
| `MINIMAL_STYLE` | (Phase 2) — 0 radius, no shadow, hairline border |

## Per-end Style

Web and uni have independent Style fields (sharing the `--aui-*` base):

- **Web Style**: `--sn-web-button-radius` / `--sn-web-card-shadow`
- **uni Style**: `--sn-mp-button-radius` / `--sn-mp-card-shadow`

Switching Style preserves Theme and Density.

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

## Forbidden

| Don't | Why |
| --- | --- |
| Override color Tokens | Belongs to Theme |
| Override spacing / size | Belongs to Density |
| Couple with a specific Theme | Independent |

## Where to next

- [Density · compact / comfortable](/en/theme/density)
- [Token cascade](/en/theme/cascade)
- [Style Packs](/en/style-packs/overview)