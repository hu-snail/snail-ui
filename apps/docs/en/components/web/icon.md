# Icon (Web)

Wrapper component for [lucide-vue-next](https://lucide.dev/guide/packages/lucide-vue-next). **Tree-shakeable by design**: named imports of individual icons let the bundler drop unused ones, so the production bundle contains only the icons you actually reference.

## Two ways to load icons

### 1. Direct icon component (most explicit, fully tree-shakeable)

```vue
<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { SnIcon } from '@snui/vue-web'
</script>

<template>
  <SnIcon :icon="ChevronRight" :size="20" />
</template>
```

Bundle result: only `ChevronRight`'s SVG path. The other 1500+ lucide icons are tree-shaken.

### 2. String name + registry (data-driven menus / routes)

Useful when the server returns icon names as strings (permission / nav).

```vue
<script setup lang="ts">
import { ChevronRight, Settings, Search } from 'lucide-vue-next'
import { registerSnIcons } from '@snui/vue-web'

registerSnIcons({ ChevronRight, Settings, Search })
</script>

<template>
  <SnIcon name="ChevronRight" />
</template>
```

The registry is a plain object literal, so the static `import { A, B, C }` line is still tree-shakable. **Avoid** `import * as Icons from 'lucide-vue-next'` — that bundles the entire library.

## Basic usage

<Demo name="icon-web-basic" description="Direct icon-component usage; 4 icons, 4 named imports, 4 paths in the bundle." />

## Sizes & stroke

<Demo name="icon-web-size" description="Five sizes (14 / 18 / 24 / 32 / 48) + three stroke widths (1 / 2 / 3) + absolute stroke (no scale with size)." />

## Registry pattern

<Demo name="icon-web-registry" description="registerSnIcons({ ... }) once, then look up icons by string `name` anywhere in the app." />

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| icon | `Component` | — | Pass the icon component directly (recommended) |
| name | `string` | — | Look up an icon previously registered via `registerSnIcons()` |
| size | `number \| string` | `16` | Icon size in px or any CSS length |
| color | `string` | `'currentColor'` | Stroke color (inherits parent `color`) |
| strokeWidth | `number \| string` | `2` | Stroke width in design units |
| strokeWidthAbsolute | `boolean` | `false` | If true, stroke width is interpreted in absolute pixels rather than scaling with `size` |
| defaultClass | `string` | — | Class forwarded to the inner SVG |

When both `icon` and `name` are passed, `icon` wins. When neither resolves, a placeholder is rendered (development hint: "icon not registered").

### Registry API

```ts
import { registerSnIcons, clearSnIcons } from '@snui/vue-web'

registerSnIcons({ ChevronRight, Settings, Search })
clearSnIcons()  // clear (tests)
```

## Accessibility

- Default `aria-hidden="true"` — icons are decorative by default
- For semantic icons, set `aria-label` on the wrapping button / link / label, not on the icon
- Example: `<button aria-label="Close"><SnIcon :icon="X" /></button>`

## Integration with SnButton

```vue
<SnButton type="primary">
  <template #icon>
    <SnIcon :icon="ChevronRight" :size="16" />
  </template>
  Next
</SnButton>
```

## Related

- uni: [sn-icon](/en/components/uni/icon)
- [lucide-vue-next docs](https://lucide.dev/guide/packages/lucide-vue-next)