# sn-icon (uni / Mobile)

Cross-end icon component for `@snui/uni`. Consumes plain SVG path data (an `IconData` object) and renders inline SVG. **Tree-shakeable**: each icon is an independent ESM data module — the bundler drops everything you didn't named-import.

## Why not lucide-vue-next

`lucide-vue-next` is a Vue 3 web wrapper — see [official docs](https://lucide.dev/guide/packages/lucide-vue-next) — and cannot be used directly by uni-app. uni-app's traditional options (iconfont, SVG sprite) have known bundle-bloat / dynamic-resolution issues.

`sn-icon` follows "one icon = one data module": lucide's `<path d="...">` strings are extracted into named `IconData` exports. Consumers named-import only the icons they need; Rollup / esbuild statically analyze the import statements and tree-shake the rest.

## Usage

### 1. Built-in shortcut icon set

```vue
<script setup lang="ts">
import { SnIcon, type IconData } from '@snui/uni'
import { ChevronRight, Search, Settings } from '@snui/uni'
</script>

<template>
  <SnIcon :icon="ChevronRight" :size="32" />
  <SnIcon :icon="Search" />
  <SnIcon :icon="Settings" />
</template>
```

Bundle result: only the three SVG path strings. The other ~19 built-in icons are tree-shaken.

> The shortcut icon data is re-exported from `@snui/uni` as named exports — each icon is its own ESM module, so `import { A, B, C }` 只把这三个 path 打包。The `SnIcon` component and the icon data are independent ESM modules; demos can import them from the same package or split paths for clarity:
>
> ```ts
> import SnIcon from '@snui/uni'              // component
> import { ChevronRight } from '@snui/uni'    // icon data
> ```

### 2. Custom IconData (copy from any lucide SVG)

```vue
<script setup lang="ts">
import { SnIcon, type IconData } from '@snui/uni'

const MyFlag: IconData = {
  viewBox: '0 0 24 24',
  paths: ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z', 'M4 22V15'],
}
</script>

<template>
  <SnIcon :icon="MyFlag" :size="32" />
</template>
```

Copy SVG paths from https://lucide.dev/icons (ISC-licensed, commercial-use OK).

## Basic usage

<Demo name="icon-mp-basic" description="5 shortcut icons (ChevronRight / Search / Settings / Heart / Trash). Each named import is an independent ESM module." />

## Sizes & stroke

<Demo name="icon-mp-size" description="Five sizes (14 / 18 / 24 / 32 / 48) + three stroke widths (1 / 2 / 3). Mobile default: 32rpx." />

## Custom + button integration

<Demo name="icon-mp-registry" description="Custom IconData + SnButton's #icon slot (Plus / custom / X)." />

## Iconfont glyphs (name / classPrefix)

`name` uses wot-ui's native glyph path: the component renders `<view class="{classPrefix}-{name}">` and the glyph comes from the iconfont stylesheet the host loads. `class-prefix` defaults to `sn-icon`; change the prefix to work with a font that uses `wd-icon-*` naming.

<Demo name="icon-mp-name" description="The iconfont class name produced by name + class-prefix: sn-icon-home by default, wd-icon-home once class-prefix is wd-icon." />

## CSS icons (cssIcon)

When `css-icon` receives a string, that class goes on the glyph node verbatim (no prefix added) — the fit for an icon subset, background image or pseudo-element that already carries its own naming. With the boolean form plus `name`, both class names are applied.

<Demo name="icon-mp-css" description="css-icon with a string class renders verbatim; the boolean form with name applies both class names." />

## Root class and inline style (`customClass` / `customStyle`)

`customClass` appends to the sn-icon root class, and `customStyle` merges into the sizing box — a string is written as the root style wholesale (replacing the default `width` / `height`), an object merges with the size. Reach for them when the icon needs a border, padding or a fill; to change only the colour prefer `color`.

<Demo name="icon-mp-custom" description="customClass adds a dashed frame; a string customStyle sets colour / padding / fill; both together; the color prop as a control." />

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| icon | `IconData` | — | SVG path data object (alternative to `name`) |
| size | `number \| string` | `32` | Icon size (rpx recommended) |
| color | `string` | `'currentColor'` | Stroke color (inherits parent `color`) |
| strokeWidth | `number \| string` | `2` | Stroke width in design units |
| strokeWidthAbsolute | `boolean` | `false` | If true, stroke width is interpreted in absolute pixels rather than scaling with `size` |
| name | `string` | `''` | Iconfont glyph name; renders `{classPrefix}-{name}` |
| classPrefix | `string` | `'sn-icon'` | Iconfont class-name prefix |
| cssIcon | `boolean \| string` | `false` | A string renders that class verbatim (no prefix); with the boolean form plus `name`, both class names are applied |
| customClass | `string` | `''` | Extra class on the root node |
| customStyle | `string \| Record<string,string>` | `''` | Inline style on the root node |

`IconData` interface:

```ts
interface IconData {
  viewBox?: string      // default '0 0 24 24'
  paths: string[]       // one or more SVG <path d="...">
}
```

### Built-in icons

`@snui/uni` main entry exposes ~22 common icons as named exports: `ChevronRight`, `ChevronLeft`, `ChevronDown`, `ChevronUp`, `ArrowRight`, `ArrowLeft`, `Check`, `X`, `Plus`, `Minus`, `Search`, `Settings`, `User`, `Bell`, `Home`, `Heart`, `Star`, `Trash`, `Edit`, `Download`, `Upload`, `Menu`, `MoreHorizontal`.

To add more icons, create one file per icon under `components/sn-icon/icons/` (e.g. `chevron-right.ts`) and export a frozen `IconData` object.

## Cross-platform rendering

| Platform | Behavior |
| --- | --- |
| H5 | Inline SVG, browser-native rendering |
| WeChat miniprogram | SVG compiles to an `image` tag (not pixel-perfect on every platform) |
| App (uni-app x) | Native SVG via Webview layer |
| Douyin / Alipay | SVG support varies by platform; usually renders |

## Accessibility

- Default `aria-hidden="true"` — decorative by default
- For semantic icons, set `aria-label` on the wrapping button / link / label

## Related

- Web: [SnIcon](/en/components/web/icon)
- [lucide icon library](https://lucide.dev/icons)