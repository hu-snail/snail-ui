# sn-icon (uni / Mobile)

Cross-end icon component for `@snui/uni`. Four rendering paths share one `size` / `color` / stroke contract: **iconfont glyphs** (`name` + `classPrefix`), the **built-in icon catalog** (string `icon`), **third-party icon sources on demand** (Iconify / custom providers), and **inline SVG data** (`IconData` objects).

## Usage

### 1. String icon — built-in catalog (recommended)

```vue
<script setup lang="ts">
import { SnIcon } from '@snui/uni';
</script>

<template>
  <SnIcon icon="arrow-down" />
  <SnIcon icon="search" :size="20" />
  <SnIcon icon="circle-check" color="#34d399" />
</template>
```

A string `icon` resolves in order: the `registerSnIcons()` registry → the built-in catalog. The catalog ships **111 common icons × 7 categories** (direction / operation / alert / edit / general / file / chart); the data comes from lucide (ISC license) and renders with lucide's stroke style.

Registering the same name overrides the catalog entry (brand customization without touching the component):

```ts
import { registerSnIcons, type IconData } from '@snui/uni';

const BrandStar: IconData = { paths: ['M12 2l2.94 5.95 ...'] };
registerSnIcons({ star: BrandStar }); // <SnIcon icon="star" /> now renders BrandStar
```

<Demo name="icon-mp-string" description="String icon API: catalog names render directly; a registry entry of the same name overrides; integrated with SnButton's #icon slot." />

### Built-in catalog gallery (search + categories)

The showcase page browses the whole catalog: a search box (matches English names / Chinese labels / keywords), category chips and a grid of cards — tapping a card copies its name.

<Demo name="icon-mp-gallery" description="All 111 built-in icons × 7 categories: search (English/Chinese/keywords), category chips, grid cards (tap to copy the name)." />

Catalog API (custom panels reuse the same source):

```ts
import {
  SN_ICON_CATALOG,          // every entry { name, category, zh, keywords, data }
  SN_ICON_CATEGORY_LABELS,  // category metadata (key → { zh, en })
  searchSnIconCatalog,      // (query, category?) => SnIconCatalogEntry[]
} from '@snui/uni';
```

### 2. Iconify on demand (third-party icon libraries)

Write `icon` as `collection:name` (or explicitly `iconify:collection:name`) to use [Iconify](https://iconify.design)'s 200k+ icons (mdi / tabler / ph / logos…). The component fetches the SVG document on demand and renders it, with a **module-level cache** (one request per URL), a **15s timeout**, **abort on unmount** (AbortSignal) and failure degradation (structured warning + empty render — the page never breaks).

```vue
<template>
  <SnIcon icon="mdi:home" :size="28" color="#0052d9" />
  <SnIcon icon="logos:vue" :size="28" />
</template>
```

- An explicit `color` is baked into the request through Iconify's `color` parameter; `currentColor` (the default) cannot cascade into a remote SVG document and renders black — pass an explicit color when you need theme colors.
- Offline / intranet apps can disable the network fallback: `configSnIcons({ iconify: false })`; or point at your own proxy with `configSnIconify({ apiBase, timeout, request })`.

<Demo name="icon-mp-iconify" description="Iconify on demand: four third-party icons (mdi/tabler/logos/ph), explicit color baking, and a reload button that exercises the cache." />

### 3. Custom icon source providers

Any `prefix:rest` routes to a registered provider, which may return `IconData` (inline-SVG rendering) or an image URL string (background-image / `<image>` rendering):

```ts
import { registerSnIconProvider } from '@snui/uni';

registerSnIconProvider('app', {
  resolve: (name, ctx) => fetchMyIcon(name, ctx), // IconData | string | Promise<...>
});
```

```vue
<SnIcon icon="app:logo" />
```

### 4. Alibaba iconfont (font glyphs)

`name` uses the wot-ui-compatible glyph path: the component renders `<view class="{classPrefix}-{name}">`, and the font + stylesheet come from the host app. [iconfont.cn](https://www.iconfont.cn) projects emit class names matching `{prefix}-{name}` (default prefix `sn-icon`) — add the `@font-face` + class styles globally and it works; use `class-prefix="wd-icon"` to adopt a `wd-icon-*` font. Color inherits through CSS `color`, the most consistent behavior across platforms.

<Demo name="icon-mp-name" description="The iconfont class name produced by name + class-prefix: sn-icon-home by default, wd-icon-home once class-prefix is wd-icon." />

`css-icon` with a string puts that class on the glyph node verbatim (no prefix) — the fit for custom-named subsets / background-image schemes.

<Demo name="icon-mp-css" description="css-icon with a string class renders verbatim; the boolean form with name applies both class names." />

### 5. IconData objects (tree-shakeable)

```vue
<script setup lang="ts">
import { SnIcon, ChevronRight, type IconData } from '@snui/uni';

const MyFlag: IconData = {
  viewBox: '0 0 24 24',
  paths: ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z', 'M4 22V15'],
};
</script>

<template>
  <SnIcon :icon="ChevronRight" :size="32" />
  <SnIcon :icon="MyFlag" />
</template>
```

The `@snui/uni` shortcut set (`ChevronRight`, `Search`, `Settings`, ~22 icons) stays tree-shakeable: named imports bundle only the referenced icons.

`IconData` accepts an optional `render: 'stroke' | 'fill'` field (default `'stroke'`). Lucide-style paths are outlines drawn with `stroke`; Material Symbols / Material Icons paths are solid glyph faces and must declare `render: 'fill'` to render filled (`strokeWidth` is ignored in that mode).

## Basic usage

<Demo name="icon-mp-basic" description="5 shortcut icons (ChevronRight / Search / Settings / Heart / Trash). Each named import is an independent ESM module." />

## Sizes & stroke

<Demo name="icon-mp-size" description="Five sizes (14 / 18 / 24 / 32 / 48) + three stroke widths (1 / 2 / 3). Mobile default: 32rpx." />

## Custom + button integration

<Demo name="icon-mp-registry" description="Custom IconData + SnButton's #icon slot (Plus / custom / X)." />

## Root class and inline style (`customClass` / `customStyle`)

`customClass` appends to the sn-icon root class, and `customStyle` merges into the sizing box — a string is written as the root style wholesale (replacing the default `width` / `height`), an object merges with the size. Reach for them when the icon needs a border, padding or a fill; to change only the colour prefer `color`.

<Demo name="icon-mp-custom" description="customClass adds a dashed frame; a string customStyle sets colour / padding / fill; both together; the color prop as a control." />

## API

### Props

| Name                | Type                              | Default          | Description                                                                                              |
| ------------------- | --------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------- |
| icon                | `IconData \| string`              | —                | SVG data object; or a string resolved as registry → built-in catalog → provider (`prefix:rest`)          |
| size                | `number \| string`                | `32`             | Icon size (rpx recommended)                                                                              |
| color               | `string`                          | `'currentColor'` | Stroke color (inherits parent `color`; baked into Iconify requests)                                      |
| strokeWidth         | `number \| string`                | `2`              | Stroke width in design units                                                                             |
| strokeWidthAbsolute | `boolean`                         | `false`          | If true, stroke width is interpreted in absolute pixels rather than scaling with `size`                  |
| name                | `string`                          | `''`             | Iconfont glyph name; renders `{classPrefix}-{name}` (wins over `icon` when both are given)               |
| classPrefix         | `string`                          | `'sn-icon'`      | Iconfont class-name prefix                                                                               |
| cssIcon             | `boolean \| string`               | `false`          | A string renders that class verbatim (no prefix); with the boolean form plus `name`, both are applied    |
| customClass         | `string`                          | `''`             | Extra class on the root node                                                                             |
| customStyle         | `string \| Record<string,string>` | `''`             | Inline style on the root node                                                                            |

`IconData` interface:

```ts
interface IconData {
  viewBox?: string; // default '0 0 24 24'
  paths: string[]; // one or more SVG <path d="...">
}
```

### Module-level API

| Function / constant                                                   | Description                                                                      |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `SN_ICON_CATALOG`                                                     | Every built-in catalog entry (name / category / zh / keywords / data)            |
| `SN_ICON_CATEGORY_LABELS`                                             | Category metadata (key → `{ zh, en }`)                                           |
| `searchSnIconCatalog(query, category?)`                               | Catalog search (English name / Chinese / keywords, case-insensitive substring)   |
| `registerSnIcons(map)` / `clearSnIcons()` / `resolveIconByName(name)` | IconData registry (overrides the catalog on name clashes)                        |
| `registerSnIconProvider(prefix, provider)`                            | Register a `prefix:rest` icon source                                             |
| `configSnIcons({ iconify })`                                          | `false` disables the Iconify fallback; an object passes Iconify options through  |
| `configSnIconify({ apiBase, timeout, request })`                      | Iconify service config (official API / 15s / fetch→uni.request by default)       |

## Cross-platform rendering

| Platform           | Behavior                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| H5                 | Inline SVG, browser-native rendering, `currentColor` works                                      |
| WeChat miniprogram | SVG data renders through the image semantics; Iconify / remote paths use background-image data URLs |
| App (uni-app x)    | The transform pipeline rewrites both SVG paths to `<image>` + SVG data URL (patched in uni-x)   |

## Accessibility

- Default `aria-hidden="true"` — decorative by default
- For semantic icons, set `aria-label` on the wrapping button / link / label

## Related

- Web: [SnIcon](/en/components/web/icon)
- [lucide icon library](https://lucide.dev/icons)
- [Iconify](https://iconify.design) / [iconfont.cn](https://www.iconfont.cn)
