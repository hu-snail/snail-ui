# sn-image-preview — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-image-preview component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

WeChat-grade full-screen image viewer: an opaque black curtain, a paged
image track, an `n / total` counter, a thin close cross and tap-to-close —
plus a full gesture layer: drag-to-page with rubber banding, pinch zoom
(1–4×, anchored at the finger midpoint), double-tap zoom (2.5×, anchored at
the tap point), zoomed panning inside bounds, and drag-down dismiss with a
curtain fade. Composed from `sn-popup` (scrim / stacking / scroll lock /
animation); the track and gestures are hand-rolled (see
`sn-image-preview-gestures.ts`).

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui
`wd-image-preview` (https://wot-ui.cn/component/image-preview.html). The
gesture layer is AUI-additive and registered in AGENTS.md §112.3a. New props
added here MUST also be added to the wd-image-preview parity list.

## Imperative surface (not `v-model`)

The reference exposes `open` / `close` / `setActive` methods and has no
`modelValue` prop, so this port keeps exactly that shape:

```ts
const preview = ref()
preview.value.open({ images: [...], startPosition: 0 })
preview.value.setActive(2)
preview.value.close()
```

## `selector` mode

`open()` resolves `uni.createSelectorQuery` against `selector` and lays
transparent tap zones over the matched elements, so tapping a thumbnail opens
the viewer at that index. The query is guarded: on hosts without it (unit tests,
SSR) no zone is created and `open()` still works.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-image-preview ref="preview" :images="list" show-index />
```

```ts
import { SnImagePreview } from '@snui/uni';
```

## Props

| Name                  | Type                        | Default       | Required | Description                                                             |
| --------------------- | --------------------------- | ------------- | -------- | ----------------------------------------------------------------------- |
| `selector`            | `string`                    | `''`          | no       | CSS selector whose matched elements open the viewer.                    |
| `images`              | `string[]`                  | `[]`          | no       | Image URLs.                                                             |
| `startPosition`       | `number`                    | `0`           | no       | Index shown when opened.                                                |
| `showIndex`           | `boolean`                   | `true`        | no       | Show the `n / total` counter.                                           |
| `loop`                | `boolean`                   | `true`        | no       | Loop from the last image to the first.                                  |
| `closeable`           | `boolean`                   | `true`        | no       | Render the close button.                                                |
| `closeIcon`           | `string`                    | `'close'`     | no       | sn-icon registry name; unknown names fall back to the built-in X glyph. |
| `closeIconPosition`   | `'top-left' \| 'top-right'` | `'top-right'` | no       | Close-button anchor.                                                    |
| `closeOnClick`        | `boolean`                   | `true`        | no       | Tapping the image or the scrim closes the viewer.                       |
| `showMenuByLongpress` | `boolean`                   | `true`        | no       | Long-press shows the miniprogram QR menu on the image.                  |
| `zIndex`              | `number`                    | `1000`        | no       | Stacking level.                                                         |
| `customClass`         | `string`                    | `''`          | no       | Custom class for the viewer root.                                       |
| `customStyle`         | `string`                    | `''`          | no       | Custom inline style for the viewer root.                                |

## Methods

| Name        | Parameters                              | Description                                                       |
| ----------- | --------------------------------------- | ----------------------------------------------------------------- |
| `open`      | `options?: { images?, startPosition? }` | Show the viewer; the options override the props for this session. |
| `close`     | —                                       | Hide the viewer.                                                  |
| `setActive` | `index: number`                         | Jump to an index (clamped to the list).                           |

## Events

| Name         | Payload     | Description                                      |
| ------------ | ----------- | ------------------------------------------------ |
| `open`       | —           | The viewer opened.                               |
| `close`      | —           | The viewer closed.                               |
| `change`     | `{ index }` | The active image changed (swipe or `setActive`). |
| `long-press` | `{ image }` | The current image was long-pressed.              |

## Slots

| Name        | Description                                                         |
| ----------- | ------------------------------------------------------------------- |
| `default`   | Bottom content, receives `{ current }`. Rendered under the counter. |
| `indicator` | Replaces the built-in counter, receives `{ current, total }`.       |

The `default` slot also stands in for the whole stage when `images` is empty.

## Tokens Consumed (end: mp)

| Token                 | CSS Variable                       | Purpose                                                      |
| --------------------- | ---------------------------------- | ------------------------------------------------------------ |
| Background overlay    | `--sn-mp-color-background-overlay` | Counter pill / close button plate                            |
| Text on primary       | `--sn-mp-color-text-on-primary`    | Counter + close glyph                                        |
| Font size MD          | `--sn-mp-font-size-md`             | Counter text                                                 |
| Font weight medium    | `--sn-mp-font-weight-medium`       | Counter text                                                 |
| Line height normal    | `--sn-mp-font-line-height-normal`  | Counter text                                                 |
| Radius full           | `--sn-mp-radius-full`              | Counter pill / close button                                  |
| Spacing 1 / 4 / 5 / 8 | `--sn-mp-spacing-*`                | Counter padding, close inset, footer padding, counter offset |

## Accessibility

- The viewer root carries `role="dialog"`, `aria-modal="true"` and
  `aria-label="image preview"`
- The counter is an `aria-live="polite"` region so a swipe announces the new
  position
- The close button is `role="button"` with `aria-label="close"`
- `sn-popup` handles the scrim tap; there is no keyboard paging — the native
  `<swiper>` owns the gesture

## Dispose

No timer, no listener: `sn-popup` owns its animation timer and `sn-swiper`
owns the platform's autoplay. `onBeforeUnmount` drops the cached hit zones and
the session image list (AGENTS.md §41).

## Versioning

`@snui/uni@0.4.0` — initial release. Part of the M2 display-category uni
components (qr-code / table / image-preview / video-preview / img-cropper).
