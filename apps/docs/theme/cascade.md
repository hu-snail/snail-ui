# Token cascade

The full cascade from primitive to component, with example bindings.

## Primitive

Raw design values. No semantic meaning. Theme owns this.

```text
color.gray.50    = #fafafa
color.gray.900   = #171717
color.blue.500   = #1677ff
spacing.4        = 12px
radius.md        = 6px
font.size.md     = 14px
shadow.md        = 0 4px 8px rgba(0,0,0,0.08)
motion.duration.base = 200ms
size.control.md  = 32px
```

## Semantic

Semantic aliases reference primitive via `var()`.

```text
color.text.primary     → var(--aui-color-text-primary)
color.action.primary   → var(--aui-color-action-primary)
spacing.inset.md       → var(--aui-spacing-inset-md)
radius.control         → var(--aui-radius-control)
size.control.md        → var(--aui-size-control-md)
```

After resolution (Light theme):

```text
--aui-color-text-primary   → var(--aui-color-gray-900)
--aui-color-gray-900       → #171717
--aui-color-action-primary → var(--aui-color-blue-500)
--aui-color-blue-500       → #1677ff
```

## Component

Component tokens reference semantic.

```text
button.heightMd       → var(--aui-size-control-md)
button.radius         → var(--aui-radius-control)
button.paddingX       → var(--aui-spacing-inset-md)
button.shadow         → var(--aui-shadow-control)
input.height          → var(--aui-size-control-md)
card.padding         → var(--aui-spacing-inset-lg)
card.radius          → var(--aui-radius-card)
```

After resolution:

```text
--aui-button-height-md  → var(--aui-size-control-md)  → var(--aui-size-control-md)  → 32px
--aui-button-radius     → var(--aui-radius-control)   → var(--aui-radius-md)       → 6px
```

## Component CSS uses tokens only

Components never hardcode colors / sizes / spacing:

```css
/* ✅ correct */
.snui-button {
  background: var(--aui-color-action-primary);
  border-radius: var(--aui-button-radius);
  height: var(--aui-button-height-md);
}

/* ❌ forbidden */
.snui-button {
  background: #1677ff;
  border-radius: 6px;
  height: 32px;
}
```

The hardcoded version locks the component to a specific theme / style / density. The token version follows whichever dimensions Axis Swap the host picks.

## Resolver output

```ts
import { resolveEnvironment, renderStyleBlock } from '@snui/tokens';

const env = {
  theme: LIGHT_THEME,
  style: MODERN_STYLE,
  density: COMFORTABLE_DENSITY,
};

const bindings = resolveEnvironment(env);
console.log(bindings.length);     // ~110 entries
console.log(bindings[0]);
// { name: '--aui-color-gray-50', value: '#fafafa' }
console.log(bindings.find(b => b.name === '--aui-color-blue-500'));
// { name: '--aui-color-blue-500', value: '#1677ff' }
console.log(bindings.find(b => b.name === '--aui-button-radius'));
// { name: '--aui-button-radius', value: 'var(--aui-radius-control)' }

renderStyleBlock(bindings);
// → ":root { --aui-color-gray-50: #fafafa; ... }"
```

## Next

- [Theme (Light / Dark)](/theme/theme)
- [Style (Modern / Glass / Minimal)](/theme/style)
- [Density (Compact / Comfortable)](/theme/density)