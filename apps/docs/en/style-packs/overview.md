# Style Packs Overview

Style Packs are snail-aui's **first-class styling abstraction**. They combine Token overrides, skin CSS, and resources so users can swap iOS / doodle / sticky-note / Douyin / Taobao identities in one click.

## Why three layers

Just changing Token variables (color / radius / spacing) can't deliver visual personalities like doodle, sticky-note, or Douyin — hand-drawn borders, handwritten fonts, and neon glow effects need CSS. So a Style Pack is three layers:

| Layer | Content | Required |
|---|---|---|
| **Token** | Color / radius / spacing overrides (`snCssVars()`) | ✅ every Pack |
| **Skin CSS** | `.snui-skin-{name}` scoped CSS (font / decoration / effects) | Only Packs needing visual personality (doodle / Douyin) |
| **Resources** | Fonts / textures / SVG | A few Packs (Douyin / Taobao) |

**Hard constraint**: skin CSS only modifies visual layers (color, shadow, font, animation, pseudo-elements) — never component DOM / Props / behavior.

## Official Pack roadmap

| Pack | Visual | Layers | Ship |
|---|---|---|---|
| `default` | 6px radius, subtle shadow, blue | Token | M2 ✅ |
| `dark` | Low-saturation dark | Token | M2 ✅ |
| `ios` | Big radius, no shadow, Apple blue | Token | M2 ✅ |
| `doodle` | Hand-drawn borders, handwritten font, B&W | Token + skin CSS | M3 |
| `sticky-note` | Warm yellow bg, tilted shadow | Token + skin CSS | M3 |
| `taobao` | Orange-red, rounded | Token + skin CSS | M4 |
| `douyin` | Dark bg, red + cyan, neon glow | Token + skin CSS + resources | M4 |

## Usage

### Web: call `snCssVars()` directly

```ts
import { snCssVars } from '@snui/tokens'
import { iosPack } from '@snui/style-packs/ios'

const el = document.createElement('style')
el.textContent = snCssVars({
  theme: iosPack.theme,
  style: iosPack.style,
  density: iosPack.density,
})
document.head.appendChild(el)
```

### Web: with ConfigProvider

```vue
<SnConfigProvider skin="ios">
  <SnButton type="primary">Button</SnButton>
</SnConfigProvider>
```

ConfigProvider internally writes `skin="ios"` to `document.body.classList` so skin CSS takes effect immediately.

### uni: via ConfigProvider prop

```vue
<sn-config-provider skin="doodle">
  <sn-button type="primary">Button</sn-button>
</sn-config-provider>
```

MP does not support `:root` or attribute selectors — ConfigProvider sets `.snui-skin-doodle` on its root element, and skin CSS overrides apply through component scoped selectors.

## Docs site interactions

**StyleSwitcher** (top-right): lists every official Pack. Click to instantly swap Tokens on the current page.

**StylePackPreview** (per component page): horizontal row of every Pack applied to the current component.

**ThemeCopier** (per page, after the API section): shows the ready-to-paste `snCssVars(...)` snippet for the active Pack. One-click copy.

## Custom Packs

Publish your own Pack:

```ts
import type { StylePackDefinition } from '@snui/style-packs'

const myPack: StylePackDefinition = {
  name: 'my-brand',
  label: 'My Brand',
  description: 'Custom brand skin.',
  style: {
    name: 'modern',
    primitive: { radius: { md: '8px' } },
    component: { button: { radius: '8px' } },
  },
  skinCss: '/packs/my-brand.skin.css',  // optional
}
```

Validate it:

```bash
pnpm snui pack validate
```

## Where to next

- [iOS Style](/en/style-packs/ios)
- [Custom Style Pack](/en/style-packs/custom)