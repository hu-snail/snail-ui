# Empty · uni-app

`sn-empty` is the empty-state placeholder of `@snui/uni` (mobile / miniprogram / H5): a glyph (built-in inline SVG / registry icon / iconfont class / image URL), an optional tip line and an optional bottom action area. Auto-registered through easycom (`components/sn-empty/sn-empty.vue` → `<sn-empty>`); geometry uses `rpx`.

## Basic usage

Without `icon` the component renders its built-in inline SVG glyph (no emoji, no external image — AGENTS.md §113).

<Demo name="empty-mp-basic" description="Default glyph, a tip line, and a longer wrapping tip." />

## Glyph sources

`icon` resolves in this order:

1. Looks like an image source (`http…` / `//…` / `/…` / `data:` / `./…`) → `<image mode="aspectFit">`
2. `cssIcon` is truthy (`true` or a non-empty class string) → `iconPrefix` + `icon` applied as classes on a `<text>` glyph (iconfont path)
3. `icon` resolves through the sn-icon registry → inline SVG via `<sn-icon>`
4. Nothing resolves → the built-in SVG glyph

`iconSize` treats a number as `rpx`; a string passes through.

<Demo name="empty-mp-icon" description="Registry icon / custom iconSize / CSS icon class / data-URI image — four sources." />

## Slots

- `image`: replaces the whole glyph area
- `bottom`: action area below the tip (e.g. a retry button)

<Demo name="empty-mp-slots" description="A retry button in the bottom slot; a fully custom glyph in the image slot." />

## Custom class and style

`customClass` appends a root class and `customStyle` writes a root inline style; the two can be combined.

<Demo name="empty-mp-custom" description="custom-class dashed outline / custom-style padding / both together." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `string` | `'empty'` | Icon name / registry key / image URL / CSS class |
| `iconPrefix` | `string` | `''` | Icon class prefix (applied with `icon`) |
| `cssIcon` | `boolean \| string` | `false` | CSS-icon mode: treat `icon` / `iconPrefix` as class names |
| `iconSize` | `number \| string` | `''` | Glyph / image size; a number is rpx, a string passes through |
| `tip` | `string` | `''` | Tip text |
| `customClass` | `string` | `''` | Custom class for the root node |
| `customStyle` | `string` | `''` | Custom inline style for the root node |

## Events

None — `sn-empty` is purely presentational.

## Slots

| Slot | Description |
| --- | --- |
| `image` | Custom image area content |
| `bottom` | Custom bottom content |

## Tokens

| Variable | Purpose |
| --- | --- |
| `--sn-mp-color-text-disabled` | Glyph color |
| `--sn-mp-color-text-secondary` | Tip color |
| `--sn-mp-font-size-md` | Tip size |
| `--sn-mp-font-line-height-normal` | Tip line height |
| `--sn-mp-spacing-5` | Glyph ↔ tip / bottom gap |
| `--sn-mp-spacing-12` | Component bottom padding |
| `--sn-mp-color-border-default` | Doodle-skin outline |
| `--sn-mp-radius-xl` | Doodle-skin corners |

## Accessibility

- Root carries `role="status"`; `aria-label` is the `tip` text (or `"empty"` when absent)
- The glyph box is `aria-hidden="true"`; the tip carries the meaning
- No keyboard interaction; put interactive elements in the `bottom` slot

## Dark mode

The glyph and tip use `--sn-mp-color-text-disabled` / `--sn-mp-color-text-secondary`, both overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:


## Related

- Loading placeholder: [`sn-loading`](/en/components/uni/loading)
- Progress: [`sn-progress`](/en/components/uni/progress)
