# Tokens Overview

The heart of snail-aui's styling system is Tokens (design variables). Components never hardcode colors, spacing, or radii — every visual property references a Token.

## Three-layer cascade

```text
Primitive   →  Semantic   →  Component   →  --sn-* alias
raw values      semantics       component-level   brand consumption entry
```

The single rule: **components consume only `var(--sn-*)`**.

## Three independent axes

The Token system has three independent dimensions that don't cross:

| Axis | What it changes | Forbidden |
|---|---|---|
| **Theme** | Color (Primitive + Semantic) | Radius, spacing, size |
| **Style** | Radius + shadow + Component Token | Color, spacing, font size |
| **Density** | Spacing + size + font size | Color, radius |

Switching Theme does not affect component shape; switching Style does not affect color; switching Density does not affect color or radius.

## Default values

| Token | Default |
|---|---|
| `--sn-color-action-primary` | `#1677ff` (blue) |
| `--sn-color-text-primary` | `#18181b` (near-black) |
| `--sn-color-background-surface` | `#ffffff` (white) |
| `--sn-button-radius` | `6px` |
| `--sn-button-height-medium` | `36px` |
| `--sn-card-shadow` | `0 1px 3px rgba(0,0,0,0.08)` |

Switching the dark theme:

- `--sn-color-action-primary` becomes `#3b82f6`
- `--sn-color-background-surface` becomes `#18181b`
- Radius and spacing are unchanged

Switching the iOS Style Pack:

- `--sn-button-radius` becomes `12px`
- `--sn-button-shadow` becomes `none`
- Color is unchanged

## Full Token namespace

### Color (Semantic)

```css
--sn-color-text-{primary, secondary, disabled, inverse, on-accent}
--sn-color-background-{surface, elevated, sunken, overlay, accent, subtle}
--sn-color-border-{subtle, default, strong, accent, focus}
--sn-color-action-{primary, primary-hover, primary-active, secondary, secondary-hover}
--sn-color-feedback-{success, warning, danger, info}
```

### Component

```css
/* Button */
--sn-button-height-{tiny, small, medium, large}
--sn-button-padding-x
--sn-button-radius
--sn-button-font-size
--sn-button-shadow

/* Input */
--sn-input-height-{small, medium, large}
--sn-input-padding-x
--sn-input-radius

/* Card */
--sn-card-padding
--sn-card-radius
--sn-card-shadow

/* Focus ring */
--sn-focus-ring
```

## Where to next

- [Theme · light / dark](/en/theme/theme)
- [Style · the shape axis](/en/theme/style)
- [Density · compact / comfortable](/en/theme/density)
- [Token cascade](/en/theme/cascade)
- [Style Packs](/en/style-packs/overview)