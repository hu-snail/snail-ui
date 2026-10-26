# Img · uni-app

`sn-img` is the image component of `@snui/uni` (mobile / miniprogram / H5): built-in loading and error states, crop modes, circular / rounded shapes, lazy loading and tap-to-preview. Auto-registered through easycom (`components/sn-img/sn-img.vue` → `<sn-img>`); geometry uses `rpx`.

## Basic usage

`mode` uses uni `<image>` crop modes; numeric `width` / `height` / `radius` are treated as rpx while strings pass through; `round` renders a circle.

<Demo name="img-mp-basic" description="Three crop modes, plus circular / rounded / full-width." />

## Loading and error states

`showLoading` / `showError` toggle the built-in states; the `loading` / `error` slots fully replace them; changing `src` resets to the loading state.

<Demo name="img-mp-state" description="Switch between a valid and a broken URL, a custom error slot, built-in states disabled." />

## Tap-to-preview and lazy loading

`enablePreview` calls `uni.previewImage` on tap, and `previewSrc` names the large image actually opened (it defaults to `src`). Where the host lacks that capability (docs preview / unit tests / SSR) a tap only emits `click`. `lazyLoad` is handed to the native `<image lazy-load>`; `showMenuByLongpress` opens the miniprogram QR menu on long press (WeChat only).

<Demo name="img-mp-preview" description="Thumbnail opens the large image, preview-src overrides, lazy loading and the long-press menu." />

## Custom classes and styles

`customClass` / `customStyle` apply to the root node (frame, shadow) and `customImage` applies to the inner `<image>` (filters, zoom).

<Demo name="img-mp-custom" description="Root class / inline style and the inner image class each take effect." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| src | string | '' | Image source |
| previewSrc | string | '' | Image opened by preview (defaults to `src`) |
| width | string \| number | '' | Width (bare number = rpx) |
| height | string \| number | '' | Height (bare number = rpx) |
| mode | ImageMode | 'scaleToFill' | Crop mode (uni `<image mode>` set) |
| round | boolean | false | Render as a circle |
| radius | string \| number | '' | Corner radius (bare number = rpx) |
| lazyLoad | boolean | false | Lazy-load the image |
| enablePreview | boolean | false | Tap opens `uni.previewImage` |
| showMenuByLongpress | boolean | false | Long-press QR menu (WeChat only) |
| showLoading | boolean | true | Show the loading overlay |
| showError | boolean | true | Show the error overlay |
| customClass | string | '' | Custom class for the root node |
| customStyle | string | '' | Custom inline style for the root node |
| customImage | string | '' | Custom class for the inner `<image>` |

## Events

| Event | Description | Payload |
| --- | --- | --- |
| click | Image tapped | Event |
| load | Image loaded | Event |
| error | Image failed to load | Event |

## Slots

| Slot | Description |
| --- | --- |
| loading | Custom loading state |
| error | Custom error state |

## Theme variables

| Variable | Purpose |
| --- | --- |
| --sn-mp-color-background-subtle | Placeholder plate while loading |
| --sn-mp-color-border-default | Spinner track |
| --sn-mp-color-action-primary | Spinner head |
| --sn-mp-color-text-tertiary | Error text |
| --sn-mp-font-size-sm | Error text size |
| --sn-mp-font-line-height-normal | Error text line height |
| --sn-mp-radius-full | `round` shape |

## Accessibility

- The tap target is the root `<view>`; put the accessible name on the surrounding link / button
- The loading spinner is `aria-hidden="true"`

## Dark mode

The placeholder plate, spinner and error text all come from semantic tokens (`--sn-mp-color-background-subtle` / `--sn-mp-color-border-default` / `--sn-mp-color-action-primary` / `--sn-mp-color-text-tertiary`), all overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:


## Related

- Carousel: [`sn-swiper`](/en/components/uni/swiper)
- Avatar: [`sn-avatar`](/en/components/uni/avatar)
