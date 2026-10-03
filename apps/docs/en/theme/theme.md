# Theme · light / dark

The Theme axis owns **color**: the Primitive color palette and Semantic color names.

## Built-in defaults

```ts
import { LIGHT_THEME, DARK_THEME } from '@snui/tokens'
```

| Theme | Use |
| --- | --- |
| `LIGHT_THEME` | Light background, dark text (default) |
| `DARK_THEME` | Dark background, light text |

## Switching Theme

```ts
import { snCssVars } from '@snui/tokens'

const el = document.createElement('style')
el.textContent = snCssVars({
  theme: DARK_THEME,    // ← swap Theme
  style: MODERN_STYLE,  // keep Style
  density: COMFORTABLE_DENSITY,  // keep Density
})
document.head.appendChild(el)
```

Per ADR-0002: switching Theme preserves Style and Density — only colors are recomputed.

## Switching via `data-theme`

snail-aui also supports the native CSS attribute-selector approach:

```html
<html data-theme="dark">
```

```css
:root {
  --sn-color-action-primary: #1677ff;
}

[data-theme="dark"] {
  --sn-color-action-primary: #3b82f6;
}
```

This is the easiest way outside MP (Web / H5 only — MP doesn't support attribute selectors).

## Custom Theme

```ts
import type { ThemeDefinition } from '@snui/tokens'

const myBrand: ThemeDefinition = {
  name: 'my-brand',
  semantic: {
    action: {
      primary: '#ff5722',
      primaryHover: '#ff7043',
    },
    background: {
      surface: '#fffaf0',
    },
  },
}
```

Apply it via `snCssVars({ theme: myBrand })` and every `var(--sn-color-action-primary)` reference updates automatically.

## Forbidden

| Don't | Why |
| --- | --- |
| Override radius Tokens | Belongs to Style |
| Override spacing / size primitives | Belongs to Density |
| Couple Theme with a specific Style | Theme and Style are independent |

## Where to next

- [Style · the shape axis](/en/theme/style)
- [Density · compact / comfortable](/en/theme/density)
- [Token cascade](/en/theme/cascade)