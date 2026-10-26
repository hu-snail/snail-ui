# iOS Pack

The iOS Pack is one of snail-aui's out-of-the-box packs. It is implemented entirely in the **Token layer** (no skin CSS required). Designed in reference to Apple Human Interface Guidelines.

> **v3.1 End-Independent**: The `ios` Pack has `end: 'both'` and is available on both Web and uni. On Web, applying it produces `--sn-web-button-radius: 12px` (px); on uni, it produces `--sn-mp-button-radius: 24rpx` (rpx conversion).

---

## Visual signature

| Dimension | default | iOS |
|---|---|---|
| Radius (control) | 6px | 12px |
| Radius (card) | 8px | 16px |
| Shadow | subtle | none |
| Border | 1px line | 0.5px line |
| Primary | `#1677ff` (blue) | `#007AFF` (Apple blue) |
| Button hover | `#4096ff` | `#3395FF` |

---

## Web usage (`@snui/vue-web`)

Direct `snCssVars()` call:

```ts
// @snui/vue-web project
import { snCssVars } from '@snui/tokens'
import '@snui/tokens-web/styles'
import { iosPack } from '@snui/style-packs/ios'

const el = document.createElement('style')
el.textContent = snCssVars({
  end: 'web',
  theme: iosPack.theme,
  style: iosPack.style,
  density: iosPack.density,
})
document.head.appendChild(el)
```

Or via ConfigProvider:

```vue
<SnConfigProvider skin="ios">
  <SnButton type="primary">Button</SnButton>
</SnConfigProvider>
```

ConfigProvider internally adds `skin="ios"` to `document.body.classList`, instantly activating skin CSS.

---

## uni usage (`@snui/uni`)

```vue
<!-- @snui/uni project, tokens-mp auto-converts px to rpx -->
<sn-config-provider skin="ios">
  <sn-button type="primary">Button</sn-button>
</sn-config-provider>
```

iOS Pack on mobile: large radii, no shadow, translucent backgrounds — a typical iOS App look.

---

## Live preview

Select iOS in the docs site's top-right StyleSwitcher to see the change across every component page instantly. Each component page's StylePackPreview also shows iOS side-by-side.

> End switching: iOS Pack is visible on both `/guide/web/` and `/guide/uni/` component pages. On the uni side, button radii are converted to rpx (e.g. Web 12px → uni 24rpx).

---

## Why no skin CSS

iOS Pack's "visual personality" is fully expressible via Token layer:

- 12px radii → `primitive.radius.md`
- No shadow → `style.component.card.shadow: none`
- Apple blue → `theme.semantic.action.primary`

No pseudo-elements, fonts, or hand-drawn borders required. iOS Pack declares only Token fields, no `skinCss`.

---

## Next

- [Style Packs overview](/style-packs/overview)
- [Custom Pack](/style-packs/custom)
- [Token three-tier cascade](/theme/cascade)