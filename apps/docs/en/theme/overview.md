# Tokens Overview

The core of snail-aui's styling system is Tokens (design variables). Components never hardcode colors, spacing, or radii — every visual property references a Token.

## End-aware Token architecture (v3.1)

Each end consumes its own Token alias:

```text
Unified base: @snui/tokens
   ↓  --aui-* CSS variables (end-agnostic raw layer)
   ├──→  @snui/tokens-web    --sn-web-*    →  consumed by @snui/vue-web
   └──→  @snui/tokens-mp     --sn-mp-*     →  consumed by @snui/uni
```

- Web components only use `var(--sn-web-*)`
- uni components only use `var(--sn-mp-*)`
- Zero source code reuse
- The base `--aui-*` layer is end-agnostic

## Three-layer cascade

```text
Primitive   →  Semantic   →  Component   →  --aui-* raw (end-agnostic)
raw values      semantics       component-level
   ↓
   @snui/tokens-web emits --sn-web-* aliases  →  Web consumption
   @snui/tokens-mp  emits --sn-mp-* aliases   →  uni consumption (with rpx)
```

## Three independent axes

| Axis | What | Forbidden |
|---|---|---|
| **Theme** | Color | Radius, spacing, size |
| **Style** | Radius + shadow + Component Token | Color, spacing, font size |
| **Density** | Spacing + size + font size | Color, radius |

## Default values

| Token | Default |
|---|---|
| `--aui-color-action-primary` | `#1677ff` |
| `--aui-color-text-primary` | `#18181b` |
| `--aui-color-background-surface` | `#ffffff` |
| `--aui-button-radius` | `6px` → Web `--sn-web-button-radius: 6px` / uni `--sn-mp-button-radius: 24rpx` |
| `--aui-button-height-medium` | `36px` → Web `36px` / uni `72rpx` |
| `--aui-card-shadow` | `0 1px 3px rgba(0,0,0,0.08)` |

## Per-end tokens

Different ends have different Component Token fields:

| Field | Web (`--sn-web-*`) | uni (`--sn-mp-*`) |
|---|---|---|
| `button-radius` | ✅ 6px | ✅ 24rpx |
| `table-row-height` | ✅ 32px | ❌ |
| `list-item-height` | ❌ | ✅ 88rpx |
| `dropdown-item-padding` | ✅ 8px 16px | ❌ |
| `sidebar-item-height` | ❌ | ✅ 100rpx |

## Where to next

- [Theme · light / dark](/en/theme/theme)
- [Style · the shape axis](/en/theme/style)
- [Density · compact / comfortable](/en/theme/density)
- [Token cascade](/en/theme/cascade)
- [Style Packs (cross-end)](/en/style-packs/overview)