# ImagePreview · uni-app

`sn-image-preview` is the full-screen image viewer of `@snui/uni` (mobile / miniprogram / H5): a swipeable image stage, an `n / total` counter, a close button and tap-to-close. Auto-registered through easycom (`components/sn-image-preview/sn-image-preview.vue` → `<sn-image-preview>`); geometry uses `rpx`.

It is composed from `sn-popup` (scrim / stacking / scroll lock / animation); the image track and the WeChat-grade gestures (paging / pinch / double-tap / drag-down dismiss) are built in — see the Gestures section below.

## Basic usage

wd-image-preview exposes `open` / `close` / `setActive` methods instead of a `v-model`; this port keeps that imperative interface:

```ts
const preview = ref()
preview.value.open({ images: [...], startPosition: 0 })
preview.value.setActive(2)
preview.value.close()
```

The `images` / `startPosition` passed to `open(options)` override the prop values for that session.

<Demo name="image-preview-mp-basic" description="Tap a thumbnail to open at that index; a button opens from the first image; events are reported." />

## Options

- `close-icon-position` accepts `top-left` / `top-right`
- `show-index=false` hides the built-in counter; the `indicator` slot fully replaces it
- The `default` slot renders footer content and receives `{ current }`
- `close-on-click` controls whether tapping the image / scrim closes the viewer

<Demo name="image-preview-mp-config" description="Top-left close button, counter off, footer slot showing the current position." />

## Gestures (WeChat-grade preview)

The viewer ships the full WeChat gesture layer (AUI-additive on top of the reference spec):

- **Drag to page** — the track follows the finger; release flips past 35% of the width or on a flick; non-loop edges get rubber-band damping
- **Pinch zoom** — two fingers, 1–4×, anchored at the finger midpoint; out-of-range releases snap back
- **Double-tap zoom** — toggles 1× / 2.5× anchored at the tap point
- **Zoomed pan** — one finger pans inside the bounds once zoomed, with rubber banding at the edges
- **Drag-down dismiss** — the image tracks the finger while the black curtain fades out, revealing the page; past 25% of the screen height (or a flick) the viewer closes
- Zoom resets on page change; single-tap close and double-tap zoom are disambiguated by a 300 ms window

<Demo name="image-preview-mp-gestures" description="Pinch to zoom, double-tap, pan when zoomed, drag down to dismiss — WeChat image viewer gestures." />

## `selector` mode

`selector` is resolved on `open()` through `uni.createSelectorQuery`: the boxes of every matched element are laid over with transparent tap zones, so tapping a thumbnail on the page opens the viewer at that index. The query is guarded — on hosts without it (unit tests / SSR) no zone is created and `open()` still works.

<Demo name="image-preview-mp-behavior" description="Selector hit zones, loop off, close button hidden, close-on-click off, a custom z-index and the long-press event." />

## loop / closeable / close-on-click / z-index

- `loop=false` stops paging at the edges with rubber-band damping
- `closeable=false` hides the close button; provide a close entry in the `default` slot or rely on `close-on-click`
- `close-on-click=false` stops taps on the image / scrim from closing, so a stray tap cannot dismiss the viewer
- `z-index` is forwarded to the inner `sn-popup`
- `show-menu-by-longpress` emits `long-press` with `{ image }`

## Props

| Prop                  | Type                        | Default       | Description                                                                    |
| --------------------- | --------------------------- | ------------- | ------------------------------------------------------------------------------ |
| `selector`            | `string`                    | `''`          | Selector whose matched elements open the viewer                                |
| `images`              | `string[]`                  | `[]`          | Image URLs                                                                     |
| `startPosition`       | `number`                    | `0`           | Index shown first                                                              |
| `showIndex`           | `boolean`                   | `true`        | Show the counter                                                               |
| `loop`                | `boolean`                   | `true`        | Loop from the last image to the first                                          |
| `closeable`           | `boolean`                   | `true`        | Render the close button                                                        |
| `closeIcon`           | `string`                    | `'close'`     | Close glyph (sn-icon registry name; unknown names fall back to the built-in X) |
| `closeIconPosition`   | `'top-left' \| 'top-right'` | `'top-right'` | Close-button anchor                                                            |
| `closeOnClick`        | `boolean`                   | `true`        | Tapping the image or scrim closes the viewer                                   |
| `showMenuByLongpress` | `boolean`                   | `true`        | Long-press shows the miniprogram QR menu                                       |
| `zIndex`              | `number`                    | `1000`        | Stacking level                                                                 |
| `customClass`         | `string`                    | `''`          | Custom class for the viewer root                                               |
| `customStyle`         | `string`                    | `''`          | Custom inline style for the viewer root                                        |

## Methods

| Method      | Parameters                              | Description                                                  |
| ----------- | --------------------------------------- | ------------------------------------------------------------ |
| `open`      | `options?: { images?, startPosition? }` | Show the viewer; options override the props for this session |
| `close`     | —                                       | Hide the viewer                                              |
| `setActive` | `index: number`                         | Jump to an index (clamped to the list)                       |

## Events

| Event        | Description                        | Payload     |
| ------------ | ---------------------------------- | ----------- |
| `open`       | The viewer opened                  | —           |
| `close`      | The viewer closed                  | —           |
| `change`     | The active image changed           | `{ index }` |
| `long-press` | The current image was long-pressed | `{ image }` |

## Slots

| Slot        | Description                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------- |
| `default`   | Footer content, receives `{ current }`; also stands in for the whole stage when `images` is empty |
| `indicator` | Replaces the built-in counter, receives `{ current, total }`                                      |

## Theme variables

| Variable                                                                              | Purpose                                                         |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `--sn-mp-color-background-overlay`                                                    | Counter pill / close-button plate                               |
| `--sn-mp-color-text-on-primary`                                                       | Counter and close-glyph color                                   |
| `--sn-mp-font-size-md`                                                                | Counter text size                                               |
| `--sn-mp-font-weight-medium`                                                          | Counter weight                                                  |
| `--sn-mp-font-line-height-normal`                                                     | Counter line height                                             |
| `--sn-mp-radius-full`                                                                 | Counter pill / close-button corners                             |
| `--sn-mp-spacing-1` / `--sn-mp-spacing-4` / `--sn-mp-spacing-5` / `--sn-mp-spacing-8` | Counter padding / close inset / footer padding / counter offset |

## Accessibility

- The viewer root carries `role="dialog"`, `aria-modal="true"` and `aria-label="image preview"`
- The counter is an `aria-live="polite"` region, so a swipe announces the new position
- The close button is `role="button"` with `aria-label="close"`
- The scrim tap is handled by `sn-popup`; paging is the native `<swiper>` gesture, with no keyboard paging

## Dark mode

The counter pill, close button and footer all use `--sn-mp-color-*` semantic tokens, all overridden in the dark block of `@snui/tokens-mp/styles`, so they adapt automatically. The scrim itself is `--sn-mp-color-background-overlay`, which keeps enough contrast in dark mode. Verify with sn-config-provider's theme set to dark:

## Related

- Image display and loading state: [`sn-img`](/en/components/uni/img)
- Video preview: [`sn-video-preview`](/en/components/uni/video-preview)
- Popup layer: [`sn-popup`](/en/components/uni/popup)
