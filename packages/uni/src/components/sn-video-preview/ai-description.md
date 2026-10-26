# sn-video-preview — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-video-preview component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Full-screen video layer: a scrim with a native `<video>` stage, a title bar and
a close button. Composed from `sn-popup` (scrim / stacking / scroll lock /
animation) wrapping the platform's own `<video>` element, so playback and the
player controls come from the vendor runtime.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui
`wd-video-preview` (https://wot-ui.cn/component/video-preview.html). New props
added here MUST also be added to the wd-video-preview parity list.

## Imperative surface

The reference exposes `open` / `close` as methods and `on-open` / `on-close` as
**props** (callbacks) rather than events. Both are supported:

```ts
const video = ref();
video.value.open({ src, poster, title });
video.value.close();
```

```vue
<sn-video-preview :on-open="handler" :on-close="handler" />
```

`open()` also emits `open`, so a `@open` listener works too. The extra event is
additive; the reference surface is unchanged. Note that Vue maps an `onOpen`
prop onto the `open` event, which is why the component emits once instead of
calling the prop separately.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-video-preview ref="video" full-screen />
```

```ts
import { SnVideoPreview } from '@snui/uni';
```

## Props

| Name            | Type                        | Default      | Required | Description                                               |
| --------------- | --------------------------- | ------------ | -------- | --------------------------------------------------------- |
| `selector`      | `string`                    | `''`         | no       | Instance identifier (parity; exposed as `data-selector`). |
| `zIndex`        | `number`                    | `1000`       | no       | Stacking level.                                           |
| `fullScreen`    | `boolean`                   | `false`      | no       | Fill the viewport instead of the centred stage.           |
| `closePosition` | `'left-top' \| 'right-top'` | `'left-top'` | no       | Close-button anchor.                                      |
| `onOpen`        | `() => void`                | `undefined`  | no       | Called after the layer opened (reference callback prop).  |
| `onClose`       | `() => void`                | `undefined`  | no       | Called after the layer closed (reference callback prop).  |
| `customClass`   | `string`                    | `''`         | no       | Custom class for the layer root.                          |
| `customStyle`   | `string`                    | `''`         | no       | Custom inline style for the layer root.                   |

## Methods

| Name    | Parameters                                     | Description                           |
| ------- | ---------------------------------------------- | ------------------------------------- |
| `open`  | `options: { src, poster?, title?, autoplay? }` | Load the video and show the layer.    |
| `close` | —                                              | Hide the layer and unload the source. |

## Events

| Name    | Payload | Description                                              |
| ------- | ------- | -------------------------------------------------------- |
| `open`  | —       | The layer opened (also reachable as the `onOpen` prop).  |
| `close` | —       | The layer closed (also reachable as the `onClose` prop). |

## Slots

None.

## Tokens Consumed (end: mp)

| Token              | CSS Variable                       | Purpose                               |
| ------------------ | ---------------------------------- | ------------------------------------- |
| Background overlay | `--sn-mp-color-background-overlay` | Layer scrim / title bar / close plate |
| Text on primary    | `--sn-mp-color-text-on-primary`    | Title + close glyph                   |
| Font size MD       | `--sn-mp-font-size-md`             | Title text                            |
| Font weight medium | `--sn-mp-font-weight-medium`       | Title text                            |
| Line height normal | `--sn-mp-font-line-height-normal`  | Title line height                     |
| Radius full        | `--sn-mp-radius-full`              | Close button                          |
| Spacing 3 / 4 / 12 | `--sn-mp-spacing-*`                | Bar padding, close inset              |

## Accessibility

- The layer root carries `role="dialog"`, `aria-modal="true"` and
  `aria-label="video preview"`
- The close button is `role="button"` with `aria-label="close"`
- Playback controls are the platform's own, so keyboard / screen-reader support
  is whatever the host runtime provides

## Dispose

No timer, no listener: `sn-popup` owns its animation timer and the native
`<video>` owns playback. `close()` clears the source so the platform stops
decoding instead of continuing in the background (AGENTS.md §41).

## Versioning

`@snui/uni@0.4.0` — initial release. Part of the M2 display-category uni
components (qr-code / table / image-preview / video-preview / img-cropper).
