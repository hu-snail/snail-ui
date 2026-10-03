# Theme · Light / Dark

The Theme axis owns the **color** system: text, background, border, action, and feedback colors.

A theme overrides primitive color + semantic color. It does NOT touch radius, shadow, spacing, or font sizes (those are Style + Density).

## Defaults shipped

```ts
import { LIGHT_THEME, DARK_THEME } from '@snui/tokens';
```

| Theme | Source of truth |
| --- | --- |
| `LIGHT_THEME` | default — semantic.text.primary → `var(--aui-color-gray-900)` |
| `DARK_THEME` | semantic.text.primary → `var(--aui-color-gray-100)` |

## Behavior on theme change

```
Theme Change
   ↓
保留 Style
   ↓
保留 Density
   ↓
重新解析 Token
```

Per AUI-PRD-v1.2.md §38: changing the theme preserves the Style and Density axes. Only the color layer is recomputed.

## Custom theme

```ts
import type { ThemeDefinition } from '@snui/tokens';

const brand: ThemeDefinition = {
  name: 'brand',
  primitive: {
    blue: {
      500: '#5b21b6', // brand purple
    },
  },
  semantic: {
    text: {
      primary: 'var(--aui-color-blue-500)',
    },
  },
};
```

When the user picks `brand`, every component using `--aui-color-action-primary` re-renders against the new primitive color (the primitive binding at `--aui-color-blue-500` swaps), without any code change.

## What a theme MUST NOT do

| Forbidden | Reason |
| --- | --- |
| Override radius / shadow / spacing | Belongs to Style / Density |
| Reference `window` / `document` / global state | Tokens are pure data |
| Reference the Style or Density axes | The three axes are independent |

If you find yourself reaching for any of the above, you're designing a Style or Density instead — split it.

## Live comparison

The two previews below mount the same Button under LIGHT_THEME and DARK_THEME. The schema is identical; only the binding table differs.

<script setup>
import ComponentPreview from '../../../.vitepress/components/ComponentPreview.vue';
</script>

<ComponentPreview name="button" variant="primary" text="Light theme" />

> Dark theme preview lands once the docs site picks up the night-mode toggle. The contract is identical; only the resolver output differs.

## Next

- [Style (Modern / Glass / Minimal)](/en/theme/style)
- [Density (Compact / Comfortable)](/en/theme/density)
- [Token cascade](/en/theme/cascade)