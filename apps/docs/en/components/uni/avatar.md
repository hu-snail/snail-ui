# Avatar · uni-app (Mobile)

`sn-avatar` is the identity thumbnail of `@snui/uni` (mobile / miniprogram / H5). It renders an image, initials or an icon, and ships a documented fallback chain so a broken image URL never leaves a hole in the layout. Auto-registered via easycom; geometry uses `rpx`.

## Basic usage

Three content layers plus a custom background:

<Demo name="avatar-mp-basic" description="Text initials, icon, custom background colours and an image avatar." />

## Size and shape

Four size presets (`small` 48rpx / `normal` 72rpx / `medium` 96rpx / `large` 112rpx), or a custom length:

<Demo name="avatar-mp-size" description="Presets small / normal / medium / large; round and square shapes; custom numeric and percentage sizes." />

A number is read as px; a string is forwarded verbatim, so `:size="56"`, `size="20%"` and `size="64rpx"` all work.

## Load-failure fallback

A failed image degrades automatically and emits `error`:

<Demo name="avatar-mp-fallback" description="Image fails → alt text → text → icon, with an error event." />

Fallback chain:

```text
src (image) → alt (on failure) → text → icon (SVG) → iconfont (cssIcon) → default slot
```

The failure state is bound to `src`: assigning a new `src` resets it, so a recycled avatar instance is never pinned to the placeholder layer.

## Font icons and mode

The second-to-last layer of the fallback chain is a font icon: with `cssIcon` true the class is built as `iconPrefix-icon`, and a string `cssIcon` is used as the prefix itself. `mode` is forwarded to the inner `<image>` (aspectFill crops / aspectFit letterboxes) and `customClass` / `customStyle` apply to the root node.

<Demo name="avatar-mp-icon-font" description="cssIcon + iconPrefix font icons, a string cssIcon prefix, mode cropping and customClass / customStyle." />

## Auto registration (easycom)

```vue
<sn-avatar text="AU" size="large" />
```

For an explicit import:

```ts
import { SnAvatar } from '@snui/uni/components/sn-avatar/sn-avatar.vue'
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | `''` | Image URL; failure falls back to `alt` → text → icon |
| `text` | `string` | `''` | Initials / short label |
| `icon` | `string` | `''` | Icon name (registered via `registerSnIcons()`) |
| `iconPrefix` | `string` | `''` | Iconfont class prefix, used when `cssIcon` is on |
| `cssIcon` | `boolean \| string` | `false` | Render a font icon; a string value is the class prefix |
| `size` | `string \| number` | `'normal'` | Preset or custom length; a number is px |
| `shape` | `'round' \| 'square'` | `'round'` | Avatar outline |
| `bgColor` | `string` | `''` | Inline background override |
| `color` | `string` | `''` | Inline text / icon colour override |
| `alt` | `string` | `''` | Placeholder label used when the image fails |
| `mode` | `string` | `'aspectFill'` | uni-app `<image>` fill mode |
| `customClass` | `string` | `''` | Extra class on the root node |
| `customStyle` | `string` | `''` | Inline style on the root node |

## Events

| Event | Description | Payload |
| --- | --- | --- |
| `click` | Tapped anywhere on the avatar | `(event: Event)` |
| `error` | Image failed to load (the fallback layer is already rendering) | `(event: Event)` |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Fully custom content; overrides every built-in layer |

## Theme variables

| Variable | Purpose |
| --- | --- |
| `--sn-mp-color-background-subtle` | Default placeholder fill |
| `--sn-mp-color-text-secondary` | Default initials colour |
| `--sn-mp-color-text-primary` | Doodle skin outline |
| `--sn-mp-font-size-{xs,md,lg,xl}` | Initials size, scaled by preset |
| `--sn-mp-font-weight-{semibold,bold}` | Initials weight |
| `--sn-mp-radius-{md,full}` | `square` vs `round` shape |

## Accessibility

- Root carries `role="img"` with `aria-label` set to the visible label, so a text avatar announces "image: AU" instead of reading as body copy.
- `@tap` is the only interaction; miniprogram has no keyboard focus.

## Dark mode

Both the background and the text colour come from `--sn-mp-color-*` with no light fallback:

- The default placeholder fill uses `--sn-mp-color-background-subtle`, which flips to a dark gray so the initials stay readable.
- The image content itself does not participate in theming (it is whatever the asset is); the component only owns the container fill and label colour.
- `bgColor` / `color` overrides apply verbatim; use `var(--sn-mp-*)` for them so they track dark mode.

Verify with sn-config-provider 的 theme 设为 dark:


## Related

- Web end: [`SnAvatar`](/en/components/web/avatar)
- Avatar stack: `sn-avatar-group` (upcoming)
- Count marker: [`sn-badge`](/en/components/uni/badge)
