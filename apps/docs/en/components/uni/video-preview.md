# VideoPreview · uni-app

`sn-video-preview` is the full-screen video layer of `@snui/uni` (mobile / miniprogram / H5): a scrim, a native `<video>` stage, a title bar and a close button. Auto-registered through easycom (`components/sn-video-preview/sn-video-preview.vue` → `<sn-video-preview>`); geometry uses `rpx`.

It is composed from `sn-popup` (scrim / stacking / scroll lock / animation) wrapping the platform's own `<video>` element, so playback and the player controls come from the vendor runtime.

## Basic usage

wd-video-preview exposes `open` / `close` methods and declares `on-open` / `on-close` as **props** (callbacks) rather than events. This port supports both:

```ts
const video = ref();
video.value.open({ src, poster, title });
video.value.close();
```

```vue
<sn-video-preview :on-open="handler" :on-close="handler" />
```

`open()` also emits `open`, so a `@open` listener works too. The extra event is additive and does not change the reference API. Note that Vue maps an `onOpen` prop onto the `open` event, which is why the component emits once and does not also call the prop — otherwise the host callback would fire twice.

<Demo name="video-preview-mp-basic" description="A button opens the video layer; open / close events are reported." />

## Full screen and close position

`full-screen` fills the viewport with the video (the default is a centred 16:9 stage). `close-position` takes `left-top` / `right-top`.

<Demo name="video-preview-mp-fullscreen" description="Full-screen mode, close button on the right, autoplay, and an on-open call counter." />

## Stacking, style and callbacks

`z-index` is forwarded to the inner `sn-popup`; `customStyle` is appended to the layer root's inline style and `customClass` appends a class; `selector` renders as `data-selector` and identifies the instance. `on-open` / `on-close` are prop-style callbacks the component calls exactly once, so they never double-fire with the same-named events.

<Demo name="video-preview-mp-config" description="A custom z-index and customStyle, the selector instance marker, and on-open / on-close counters." />

## Props

| Prop            | Type                        | Default      | Description                                               |
| --------------- | --------------------------- | ------------ | --------------------------------------------------------- |
| `selector`      | `string`                    | `''`         | Instance identifier (parity; rendered as `data-selector`) |
| `zIndex`        | `number`                    | `1000`       | Stacking level                                            |
| `fullScreen`    | `boolean`                   | `false`      | Fill the viewport instead of the centred stage            |
| `closePosition` | `'left-top' \| 'right-top'` | `'left-top'` | Close-button anchor                                       |
| `onOpen`        | `() => void`                | `undefined`  | Called after the layer opened (reference callback prop)   |
| `onClose`       | `() => void`                | `undefined`  | Called after the layer closed (reference callback prop)   |
| `customClass`   | `string`                    | `''`         | Custom class for the layer root                           |
| `customStyle`   | `string`                    | `''`         | Custom inline style for the layer root                    |

## Methods

| Method  | Parameters                            | Description                          |
| ------- | ------------------------------------- | ------------------------------------ |
| `open`  | `{ src, poster?, title?, autoplay? }` | Load the video and show the layer    |
| `close` | —                                     | Hide the layer and unload the source |

## Events

| Event   | Description                                         | Payload |
| ------- | --------------------------------------------------- | ------- |
| `open`  | The layer opened (equivalent to the `onOpen` prop)  | —       |
| `close` | The layer closed (equivalent to the `onClose` prop) | —       |

## Slots

None.

## Theme variables

| Variable                                                         | Purpose                                      |
| ---------------------------------------------------------------- | -------------------------------------------- |
| `--sn-mp-color-background-overlay`                               | Layer scrim / title bar / close-button plate |
| `--sn-mp-color-text-on-primary`                                  | Title and close-glyph color                  |
| `--sn-mp-font-size-md`                                           | Title text size                              |
| `--sn-mp-font-weight-medium`                                     | Title weight                                 |
| `--sn-mp-font-line-height-normal`                                | Title line height                            |
| `--sn-mp-radius-full`                                            | Close-button corners                         |
| `--sn-mp-spacing-3` / `--sn-mp-spacing-4` / `--sn-mp-spacing-12` | Bar padding / close inset                    |

## Accessibility

- The layer root carries `role="dialog"`, `aria-modal="true"` and `aria-label="video preview"`
- The close button is `role="button"` with `aria-label="close"`
- Playback controls are the platform's own, so keyboard / screen-reader support is whatever the host runtime provides

## Dark mode

The scrim, title bar and close button all use `--sn-mp-color-*` semantic tokens, all overridden in the dark block of `@snui/tokens-mp/styles`, so they adapt automatically. The video picture itself is unaffected by the theme. Verify with sn-config-provider's theme set to dark:

## Related

- Image preview: [`sn-image-preview`](/en/components/uni/image-preview)
- Popup layer: [`sn-popup`](/en/components/uni/popup)
