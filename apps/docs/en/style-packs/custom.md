# Custom Style Pack

Publish your own Style Pack to make team brand / client customization a reusable asset.

## Definition

```ts
// my-brand/styles/skin.ts
import type { StylePackDefinition } from '@snui/style-packs'

export const myBrandPack: StylePackDefinition = {
  name: 'my-brand',
  label: 'My Brand',
  description: 'Official brand skin — orange-red primary, 8px radius, subtle shadow.',

  // Token layer — brand color overrides
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
      button: { radius: 'var(--aui-radius-md)' },
      card: { radius: 'var(--aui-radius-lg)', shadow: 'var(--aui-shadow-md)' },
    },
  },

  // Skin CSS layer — optional, overrides visual personality
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
  border-top: 3px solid var(--sn-color-action-primary);
}
```

## Validate

```bash
pnpm snui pack validate
```

Checks:
- `name` (kebab-case), `label`, `description` all present
- `style.component` keys exist in `@snui/tokens` ComponentTokens
- `theme` has no non-color fields
- skin CSS file exists (if `skinCss` declared)

## Apply

```ts
import { snCssVars } from '@snui/tokens'
import { myBrandPack } from './styles/my-brand'

const el = document.createElement('style')
el.textContent = snCssVars({
  theme: myBrandPack.theme,
  style: myBrandPack.style,
  density: myBrandPack.density,
})
document.head.appendChild(el)

// And load skin CSS
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

## Hard constraints

**Forbidden**:

- Modify component .vue files
- Override references via component props (`background: #fff`)
- Use `!important` in skin CSS
- Use deep DOM selectors in skin CSS (rely on the `data-snui-component` hook)
- Put non-color Tokens in the `theme` field
- Put color Tokens in the `style` field

**Allowed**:

- Override color / radius / shadow / spacing / declared Component Token fields
- Add pseudo-elements, animations, fonts in skin CSS
- Select components via `data-snui-component` hook

## Where to next

- [Token cascade](/en/theme/cascade)
- [AI Ecosystem](/en/ai/overview)