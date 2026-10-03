# Custom Style Pack

Publish your own Pack and treat team brand / customer customization as reusable assets.

> **v3.1 End-Independent**: Custom Packs default to `end: 'both'` (cross-end). If a Pack is mobile-only (e.g. relies on rpx units for dense layouts), explicitly declare `end: 'mp'`. CLI `pack validate` checks `end` validity.

---

## Definition

```ts
// my-brand/styles/skin.ts
import type { StylePackDefinition } from '@snui/style-packs'

export const myBrandPack: StylePackDefinition = {
  name: 'my-brand',
  label: 'My Brand',
  description: 'Official brand skin — orange-red accent, 8px radius, subtle shadow.',

  // Cross-end — default 'both', may be omitted
  // end: 'mp'  // ← mobile only

  // Token layer — brand accent overrides
  theme: {
    name: 'my-brand-light',
    semantic: {
      action: {
        primary: '#ff5722',
        primaryHover: '#ff7043',
      },
    },
  },

  // Style axis — radius + shadow
  style: {
    name: 'my-brand',
    primitive: {
      radius: { sm: '6px', md: '8px', lg: '12px', xl: '16px' },
      shadow: {
        sm: '0 1px 3px rgba(0,0,0,0.10)',
        md: '0 4px 12px rgba(0,0,0,0.12)',
      },
    },
    component: {
      button: { radius: '8px' },
      card: { radius: '12px', shadow: '0 4px 12px rgba(0,0,0,0.12)' },
    },
  },

  // Skin CSS layer — optional, overrides component visual personality
  skinCss: '/packs/my-brand.skin.css',
}
```

Skin CSS example:

```css
/* my-brand/public/packs/my-brand.skin.css */
.snui-skin-my-brand [data-snui-component="button"] {
  font-weight: 600;
  letter-spacing: 0.02em;
}

.snui-skin-my-brand [data-snui-component="card"] {
  border-top: 3px solid #ff5722;
}
```

> Color literals are allowed in skin CSS (skin CSS is end-independent visual-personality override, not Token-driven). If you want Token-driven skin, use the base `--aui-*` variables (note: **do not** use `--sn-web-*` or `--sn-mp-*` aliases in skin CSS — skin is shared across ends).

---

## Validate

```bash
pnpm snui pack validate
```

Checks:

- `name` (kebab-case), `label`, `description` all exist
- `end` field (`'web' | 'mp' | 'both'`, default `'both'`) is valid
- `style.component` keys exist on `@snui/tokens` ComponentTokens type
- `theme` contains no non-color fields
- Skin CSS file exists (when `skinCss` is declared)

---

## Apply

### Web side

```ts
import { snCssVars } from '@snui/tokens'
import '@snui/tokens-web/styles'
import { myBrandPack } from './styles/my-brand'

const el = document.createElement('style')
el.textContent = snCssVars({
  end: 'web',
  theme: myBrandPack.theme,
  style: myBrandPack.style,
  density: myBrandPack.density,
})
document.head.appendChild(el)

// Also load skin CSS
if (myBrandPack.skinCss) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = myBrandPack.skinCss
  document.head.appendChild(link)
}
```

Or via ConfigProvider:

```vue
<SnConfigProvider skin="my-brand">
  <App />
</SnConfigProvider>
```

### uni side

```vue
<!-- @snui/uni, end: 'mp' auto-converts px to rpx -->
<sn-config-provider skin="my-brand">
  <app />
</sn-config-provider>
```

> **End constraint**: If your custom Pack is mobile-only (e.g. uses `@media (max-width: 480px)`), declare `end: 'mp'`. The docs site StyleSwitcher and MCP `get_style_pack` automatically filter by `end` to prevent misuse on the Web side.

---

## Boundary constraints

**Forbidden**:

- Modifying component `.vue` files
- Overriding reference layers via component props (e.g. `background: #fff`)
- Using `!important` in skin CSS
- Deep DOM selectors in skin CSS (depends on `data-snui-component` hook)
- Putting non-color tokens in the `theme` field
- Putting color tokens in the `style` field
- **Using `--sn-web-*` or `--sn-mp-*` aliases in Token / skin CSS** (Skin is shared across ends)

**Allowed**:

- Overriding colors, radii, shadows, spacing, and ComponentToken fields
- Pseudo-elements, animations, and fonts in skin CSS
- Selecting via `data-snui-component` hook in skin CSS
- Color literals in skin CSS (visual-personality override, not Token-driven)

---

## Next

- [Token cascade](/theme/cascade)
- [AI ecosystem](/ai/overview)