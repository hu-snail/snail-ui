# Theme / Style / Density

AUI splits tokens into three independent dimensions. Each axis can be changed at runtime without touching the others.

| Axis | Owns | Example switches |
| --- | --- | --- |
| **Theme** | Color (text / background / border / action / feedback) | Light, Dark |
| **Style** | Radius, Shadow, Component shape | Modern, Glass, Minimal |
| **Density** | Size, Spacing, Font size | Compact, Comfortable |

The three dimensions **never** implicitly affect each other (AUI-PRD-v1.2.md §36: "三个维度不得隐式修改其他维度"). Changing the theme never alters spacing; changing density never alters color.

## The cascade

```
Default values
   ↓
Theme override     → primitive.color + semantic.color
   ↓
Style override     → primitive.radius/shadow + component tokens
   ↓
Density override   → primitive.spacing/size/font.size
   ↓
Variant            → component tokens (per-instance preset)
   ↓
Instance override  → flat Record<string, string> (top-most)
```

## Tokens are CSS variables

The resolver outputs a flat `TokenBinding[]`:

```ts
{ name: '--aui-color-blue-500', value: '#1677ff' }
{ name: '--aui-color-text-primary', value: 'var(--aui-color-blue-500)' }
{ name: '--aui-button-radius', value: 'var(--aui-radius-control)' }
```

Components consume via `var(--aui-color-action-primary)` — they never see the raw primitive. This means a theme switch only changes the binding table, not the components.

## Pages in this section

- [Theme (Light / Dark)](/theme/theme)
- [Style (Modern / Glass / Minimal)](/theme/style)
- [Density (Compact / Comfortable)](/theme/density)
- [Token cascade](/theme/cascade)

## Programmatic API

```ts
import { resolveEnvironment, renderStyleBlock } from '@snui/tokens';

const env = {
  theme: LIGHT_THEME,
  style: MODERN_STYLE,
  density: COMFORTABLE_DENSITY,
  // Optional instance overrides
  instanceOverrides: {
    '--aui-color-action-primary': '#ff5500',
  },
};

const bindings = resolveEnvironment(env);

// Inject as a CSS string:
const css = renderStyleBlock(bindings);
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);

// Or attach to a host element directly:
for (const { name, value } of bindings) {
  document.documentElement.style.setProperty(name, value);
}
```

See the [`@snui/tokens` source](https://github.com/hu-snail/snail-ui) for the full default scale.