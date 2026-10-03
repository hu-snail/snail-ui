# Style Packs Overview

Style Packs are snail-aui's **first-class style citizens**. They combine **Token overrides + skin CSS + resources** into a single switchable unit, enabling one-click switching between iOS, Doodle, Sticky-Note, Douyin, Taobao, and other visual languages.

> **v3.1 End-Independent Update**: Style Packs themselves are **shared across ends** (`@snui/style-packs`), but the consumption entry is per-end. The Web side applies packs via `--sn-web-*` aliases emitted by `@snui/tokens-web`; the uni side applies them via `--sn-mp-*` aliases emitted by `@snui/tokens-mp`. Every Pack also carries an `end: 'web' | 'mp' | 'both'` field marking its applicable end.

---

## Why three layers

Modifying Token variables (colors, radii, spacing) alone cannot reproduce **visual personalities** like Doodle, Sticky-Note, or Douyin — hand-drawn borders, handwritten fonts, and neon glow require CSS. Style Packs therefore consist of three layers:

| Layer | Contents | Required |
|---|---|---|
| **Token layer** | Color / radius / spacing overrides (`snCssVars({ end })`) | ✅ All Packs |
| **Skin CSS layer** | `.snui-skin-{name}` scoped rules (fonts, effects, decorations) | Packs with visual personality (Doodle, Douyin) |
| **Resource layer** | Fonts / textures / SVGs | A few Packs (Douyin, Taobao) |

**Hard constraint**: Skin CSS may only operate on the visual layer (colors, shadows, fonts, animations, pseudo-elements). It must not modify component DOM, Props, or behavior.

---

## Official Pack roadmap

| Pack | Visual signature | Layers | `end` | Delivery |
|---|---|---|---|---|
| `default` | 6px radii, subtle shadow, blue | Token | `both` | M2 ✅ |
| `dark` | Low-saturation dark | Token | `both` | M2 ✅ |
| `ios` | Large radii, no shadow, Apple blue | Token | `both` | M2 ✅ |
| `doodle` | Hand-drawn borders, handwritten font, B&W | Token + Skin CSS | `both` | M3 |
| `sticky-note` | Warm yellow bg, tilted shadow | Token + Skin CSS | `both` | M3 |
| `mp-taobao` | Orange-red accent, rounded radii | Token + Skin CSS | `mp` | M4 |
| `mp-douyin` | Dark bg, red/cyan accent, neon glow | Token + Skin CSS + Resources | `mp` | M4 |

> **End constraint**: `mp-taobao` and `mp-douyin` are not available on the Web side — they are designed for mobile dense layouts and rpx units. The docs site's StyleSwitcher and MCP `get_style_pack` automatically filter by `end`.

---

## Usage (end-independent)

### Web side (PC desktop)

```ts
// @snui/vue-web project
import { snCssVars } from '@snui/tokens'
import '@snui/tokens-web/styles'  // imports --sn-web-* alias layer
import { iosPack } from '@snui/style-packs/ios'

const el = document.createElement('style')
el.textContent = snCssVars({
  end: 'web',           // ← end identifier; outputs --sn-web-* aliases
  theme: iosPack.theme,
  style: iosPack.style,
  density: iosPack.density,
})
document.head.appendChild(el)
```

Or via ConfigProvider:

```vue
<!-- @snui/vue-web -->
<SnConfigProvider skin="ios">
  <SnButton type="primary">Button</SnButton>
</SnConfigProvider>
```

ConfigProvider internally adds `skin="ios"` to `document.body.classList`, instantly activating skin CSS.

### uni side (mobile / miniprogram / H5)

```ts
// @snui/uni project
import { snCssVars } from '@snui/tokens'
import '@snui/tokens-mp/styles'   // imports --sn-mp-* alias layer (rpx units)
import { doodlePack } from '@snui/style-packs/doodle'

const cssText = snCssVars({
  end: 'mp',            // ← end identifier; outputs --sn-mp-* aliases + rpx conversion
  theme: doodlePack.theme,
  style: doodlePack.style,
  density: doodlePack.density,
})
// uni has no document.head; inject via ConfigProvider
```

```vue
<!-- @snui/uni -->
<sn-config-provider skin="doodle">
  <sn-button type="primary">Button</sn-button>
</sn-config-provider>
```

Miniprograms do not support `:root` or attribute selectors. ConfigProvider writes `.snui-skin-doodle` directly to the root element, and skin CSS uses component scoped.

### Zero source-code reuse across ends

Web component CSS (`@snui/vue-web`) references `var(--sn-web-*)`; uni component CSS (`@snui/uni`) references `var(--sn-mp-*)`. **The two ends' component source code is fully independent**. Style Packs are shared theme resources, but `end` decides applicability.

---

## Docs site interaction

The **StyleSwitcher** in the top-right of the docs site lists all official Packs and instantly switches the Token variables for every component on the page.

| Page | StyleSwitcher lists |
|---|---|
| `/guide/web/{...}` | Packs where `end ∈ {web, both}` (default / dark / ios / doodle / sticky-note) |
| `/guide/uni/{...}` | Packs where `end ∈ {mp, both}` (default / dark / ios / doodle / sticky-note / mp-taobao / mp-douyin) |

Each component page also includes **StylePackPreview** showing that component rendered under different Packs.

**ThemeCopier** at the bottom of each page renders the current Pack's `snCssVars(...)` code snippet for one-click copying.

---

## Custom Packs

Publish your own Pack:

```ts
import type { StylePackDefinition } from '@snui/style-packs'

const myPack: StylePackDefinition = {
  name: 'my-brand',
  label: 'My Brand',
  description: 'Custom brand skin.',

  // Shared across ends — omit `end` for default 'both'
  // end: 'mp'  // ← mobile only

  style: {
    name: 'modern',
    primitive: { radius: { md: '8px' } },
    component: { button: { radius: '8px' } },
  },

  skinCss: '/packs/my-brand.skin.css',  // optional
}
```

Validate:

```bash
pnpm snui pack validate
```

Validation checks:

- `name` (kebab-case), `label`, `description` all exist
- `end` field (`'web' | 'mp' | 'both'`) is valid
- `style.component` keys exist on `@snui/tokens` ComponentTokens type
- `theme` contains no non-color fields
- Skin CSS file exists (when `skinCss` is declared)

---

## Next

- [iOS Pack](/style-packs/ios)
- [Custom Pack](/style-packs/custom)
- [Token three-tier cascade](/theme/cascade)
- [AI ecosystem](/ai/overview)