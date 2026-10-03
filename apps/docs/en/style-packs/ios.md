# iOS Style

The iOS style is one of the default Style Packs shipped with snail-aui. It lives entirely in the Token layer (no skin CSS needed). Based on Apple's Human Interface Guidelines.

## Visual differences

| Dimension | Default | iOS |
|---|---|---|
| Radius (control) | 6px | 12px |
| Radius (card) | 8px | 16px |
| Shadow | subtle | none |
| Border | 1px hairline | 0.5px hairline |
| Primary | `#1677ff` (blue) | `#007AFF` (Apple blue) |
| Button hover | `#4096ff` | `#3395FF` |

## Usage

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

Or with ConfigProvider:

```vue
<SnConfigProvider skin="ios">
  <SnButton type="primary">Button</SnButton>
</SnConfigProvider>
```

## Live preview

Click iOS in the docs site StyleSwitcher (top-right) to see the change across all component pages instantly. Each component page also shows iOS in its StylePackPreview row.

## Where to next

- [Style Pack Overview](/en/style-packs/overview)
- [Custom Style Pack](/en/style-packs/custom)