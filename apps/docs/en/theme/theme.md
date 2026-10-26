# Theme · light / dark

The Theme axis owns **color**. Theme emits the base `--aui-color-*` raw variables; per-end alias packages map them to `--sn-{end}-color-*`.

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

// Web
snCssVars({
  end: 'web',
  theme: DARK_THEME,
  style: MODERN_STYLE,
  density: COMFORTABLE_DENSITY,
})

// uni
snCssVars({
  end: 'mp',
  theme: DARK_THEME,
  style: MODERN_STYLE,
  density: COMFORTABLE_DENSITY,
})
```

Switching Theme preserves Style and Density.

## Switching via data-theme

```html
<html data-theme="dark">
```

```css
:root { --aui-color-action-primary: #1677ff; }
[data-theme="dark"] { --aui-color-action-primary: #3b82f6; }
```

## Custom Theme

```ts
import type { ThemeDefinition } from '@snui/tokens'

const myBrand: ThemeDefinition = {
  name: 'my-brand',
  semantic: { action: { primary: '#ff5722', primaryHover: '#ff7043' } },
}
```

## Forbidden

| Don't | Why |
| --- | --- |
| Override radius Tokens | Belongs to Style |
| Override spacing / size | Belongs to Density |
| Couple with a specific Style | Theme and Style are independent |

## Where to next

- [Style · the shape axis](/en/theme/style)
- [Density · compact / comfortable](/en/theme/density)
- [Token cascade](/en/theme/cascade)