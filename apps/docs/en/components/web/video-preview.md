# VideoPreview · Web

A video media box: poster plus a centered play button that starts inline playback,
and a top-right expand button that opens a full-screen preview overlay (close with
Esc or a mask click).

The player UI is **always our own bar** (`SnVideoControls`); the browser's native
controls are **never rendered by default**. Native `<video controls>` chrome is
drawn by the UA, cannot be styled with CSS and looks different on every browser /
OS. `native-controls` is the explicit escape hatch, and `background` downgrades the
video to a purely decorative banner / section background.

> naive-ui has no video component (it is absent from `src/components.ts`), so
> this component **does not follow the §112 1:1 rule**. Its API is aligned with
> this repo's `SnImage` preview model instead: thumbnail + click-to-open
> overlay, with `preview-disabled` / `show-toolbar` / `showPreview()` named and
> behaving like SnImage's. The overlay (`SnVideoPreviewOverlay.vue`) and the
> control bar (`SnVideoControls.vue`) are internal components — neither is
> exported from the package barrel — mirroring the SnImage / SnImagePreview
> split.

## When to use

- Showing a video thumbnail inside lists, cards or rich content
- Playing video in place while still offering a full-screen preview
- Custom posters, play glyphs, or a custom expand affordance
- Hero banners and section backgrounds where a video must appear **with no player
  UI at all** (`background`)

## Examples

### Basic

<Demo name="video-preview-web-basic" description="The custom control bar is the default; width / height / aspect-ratio size the media box and object-fit controls the fill." />

### Custom bar vs native controls

<Demo name="video-preview-web-controls" description="Left: the default custom bar (play/pause, mute, timeline, time, fullscreen). Right: native-controls falls back to the browser bar — visibly unstylable and inconsistent." />

### Background / banner video

<Demo name="video-preview-web-background" description="background turns the video into a decoration: no controls, no play button, no hover toolbar, forced muted + autoplay + loop, filling a position: relative parent." />

### Full-screen preview

<Demo name="video-preview-web-overlay" description="The top-right expand button opens the overlay; Esc or a mask click closes it. The overlay reuses the very same control bar; preview-disabled turns the affordance off." />

### Custom poster and slots

<Demo name="video-preview-web-custom-poster" description="placeholder replaces the poster area, play-icon the glyph, toolbar the expand affordance." />

## API

### SnVideoPreview Props

| Prop                | Type                             | Default      | Notes                                                                                                                                                                                                                      |
| ------------------- | -------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| src                 | `string`                         | —            | Video source (required)                                                                                                                                                                                                    |
| poster              | `string`                         | `undefined`  | Poster shown before playback starts (ignored while `background`)                                                                                                                                                           |
| preview-src         | `string`                         | `undefined`  | Larger url used by the overlay; falls back to `src`                                                                                                                                                                        |
| width               | `string \| number`               | `320`        | Media box width (number → px); ignored while `background`                                                                                                                                                                  |
| height              | `string \| number`               | `undefined`  | Media box height (number → px)                                                                                                                                                                                             |
| aspect-ratio        | `string`                         | `undefined`  | Media box ratio, e.g. `'16 / 9'`; applied only without an explicit height                                                                                                                                                  |
| object-fit          | `'contain' \| 'cover' \| 'fill'` | `'cover'`    | How the video fits its box; forced to `'cover'` while `background`                                                                                                                                                         |
| controls            | `boolean`                        | `true`       | **Renders OUR beautified bar** (play/pause, mute, timeline, time, fullscreen). It no longer means the browser's own `controls` attribute                                                                                   |
| native-controls     | `boolean`                        | `false`      | Renders the browser's own `controls` attribute. Native chrome is **unstylable** and inconsistent across browsers / OSes; escape hatch only. May be combined with `controls`                                                |
| background          | `boolean`                        | `false`      | Decorative banner / background mode: forces `controls` and `native-controls` off, forces `muted` + `autoplay` + `loop` + `object-fit: cover`, absolutely fills the parent, hides the video from AT and from pointer events |
| autoplay            | `boolean`                        | `false`      | Start playback on mount (browser policy requires muted — see Compatibility)                                                                                                                                                |
| loop                | `boolean`                        | `false`      | Loop inline playback                                                                                                                                                                                                       |
| muted               | `boolean`                        | `false`      | Mute inline playback                                                                                                                                                                                                       |
| preload             | `'none' \| 'metadata' \| 'auto'` | `'metadata'` | Preload strategy                                                                                                                                                                                                           |
| preview-disabled    | `boolean`                        | `false`      | Disable the overlay: no affordance, `showPreview()` becomes a no-op (also implied by `background`)                                                                                                                         |
| show-toolbar        | `boolean`                        | `true`       | Render the top-right expand affordance (revealed on hover / focus; hidden while `background`)                                                                                                                              |
| close-on-mask-click | `boolean`                        | `true`       | Close the overlay on mask click                                                                                                                                                                                            |
| title               | `string`                         | `undefined`  | Overlay header text, and accessible-name fallback                                                                                                                                                                          |
| alt                 | `string`                         | `undefined`  | Accessible description of the video; wins over `title`                                                                                                                                                                     |

### SnVideoPreview Events

| Name    | Parameters       | Notes                                                       |
| ------- | ---------------- | ----------------------------------------------------------- |
| play    | `()`             | Inline playback started                                     |
| pause   | `()`             | Inline playback paused                                      |
| ended   | `()`             | Inline playback reached the end                             |
| error   | `(event: Event)` | The video failed to load or decode                          |
| preview | `()`             | Overlay opened                                              |
| close   | `()`             | Overlay closed (Esc / mask / close button / closePreview()) |

### SnVideoPreview Slots

| Name        | Parameters                    | Notes                                                                                                               |
| ----------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| placeholder | `()`                          | Replaces the poster area while there is no poster and/or playback has not started (not rendered while `background`) |
| play-icon   | `()`                          | Replaces the centered play glyph (default: SnIcon + lucide Play)                                                    |
| toolbar     | `{ showPreview: () => void }` | Replaces the expand affordance; call `showPreview` to open the overlay                                              |

### SnVideoPreview Methods

| Name         | Type         | Notes                                                                         |
| ------------ | ------------ | ----------------------------------------------------------------------------- |
| play         | `() => void` | Start inline playback                                                         |
| pause        | `() => void` | Pause inline playback                                                         |
| showPreview  | `() => void` | Open the full-screen overlay (no-op while `preview-disabled` or `background`) |
| closePreview | `() => void` | Close the full-screen overlay                                                 |

### The custom control bar

Left to right: **play / pause**, **mute / unmute**, **current time**, **draggable
timeline**, **total time**, **fullscreen / exit fullscreen**.

- The timeline is a real `<input type="range">`: keyboard accessible (arrows /
  Home / End) and announced through `aria-valuetext` as `current / total`
- The bar holds no playback state of its own: it forwards intents to the media
  element and is fed back by the element's events (`play` / `pause` /
  `timeupdate` / `volumechange` / `fullscreenchange`), which is why the overlay
  reuses the exact same component and there is only one bar stylesheet
- The fullscreen button is **capability-gated**: without the Fullscreen API
  (some embedded WebViews) the button is not rendered at all instead of being dead
- Toggling mute only touches `video.muted` and the glyph — it never emits
  `play` / `pause`

### Keyboard & interaction

- Before playback a scrim with a centered play button covers the poster; the
  click calls `video.play()`
- With `controls` the custom bar drives playback and clicking the video body does
  **not** toggle it (no double handling); with both `controls` and
  `native-controls` off, clicking the video toggles play/pause
- Any pause / end returns the box to the poster state, as does a rejected
  `play()` (autoplay policy)
- The overlay closes on Esc or mask click, returns focus to the expand button
  and locks page scroll while open
- The scrim does not intercept pointer events, so the control bar stays
  clickable; only the play and expand buttons are hit targets

## Compatibility

These are browser facts, not component bugs:

- **Autoplay requires muted media.** The autoplay policies of Chrome / Safari /
  Firefox only allow _muted_ media to start on its own (Safari additionally
  consults the user's per-site preference). `autoplay` therefore forces
  `muted` — both the `muted` attribute and the `video.muted` property, because
  engines check different ones — and `background` forces `muted` + `autoplay` +
  `loop` outright. With sound left enabled the video likely stays on its first
  frame; that is the policy blocking playback, not a broken player.
- **iOS needs `playsinline`.** Without it, iOS Safari takes over the whole
  screen with the native fullscreen player and wrecks the page layout. The
  component **always** renders both `playsinline` and the legacy
  `webkit-playsinline`; there is no prop to turn them off — it is a fix, not a
  setting.
- **Native controls are unstylable and inconsistent.** With `native-controls`
  the browser draws the chrome: button count, order, colors, corner radii and
  the volume / captions / picture-in-picture entries differ between Chrome,
  Safari, Firefox, iOS and Android, ignore every `--sn-web-*` token and cannot
  be overridden with CSS. That is exactly why the default is our own bar.
- **Background / banner video must have no controls.** A decorative video with
  any player chrome — native or custom — stops being a background. `background`
  forces both kinds off, drops the poster scrim and centered play button, drops
  the hover toolbar and the overlay, marks the video decorative (`aria-hidden`,
  `pointer-events: none`) and stretches it with `object-fit: cover`. The parent
  only needs `position: relative`.
- **The Fullscreen API may be missing.** Some embedded WebViews, un-permitted
  iframes (`allowfullscreen`) and older browsers have no Fullscreen API; the
  component probes `requestFullscreen` / `exitFullscreen` / `fullscreenElement`
  on mount and **does not render** the button when it is unavailable.

## Accessibility

- The play button (`aria-label="播放视频"`), expand button
  (`aria-label="放大预览"`) and every bar button render real `SnIcon` glyphs with
  a readable name; bar labels describe the **action** that will happen (`播放` /
  `暂停`, `静音` / `取消静音`, `全屏` / `退出全屏`)
- The overlay is `role="dialog"` + `aria-modal="true"`; focus moves to the close
  button on open and returns to the trigger on close
- In `background` mode the video is hidden from assistive technology
  (`aria-hidden`) — decorative content must not be announced
- `:focus-visible` outlines use `--sn-web-focus-ring`

## Theme tokens

Every bar style comes from component-level `--sn-web-video-preview-*` /
`--sn-web-video-controls-*` variables, each with a literal fallback, overridable
per instance:

| Token                                                                      | Purpose                                   |
| -------------------------------------------------------------------------- | ----------------------------------------- |
| `--sn-web-video-preview-radius` / `--sn-web-video-preview-bg`              | Box radius and surface                    |
| `--sn-web-video-preview-mask-bg` / `--sn-web-video-preview-play-*`         | Poster scrim and centered play button     |
| `--sn-web-video-preview-toolbar-*`                                         | Top-right expand affordance               |
| `--sn-web-video-preview-controls-z-index`                                  | Custom bar stacking                       |
| `--sn-web-video-controls-bg` / `--sn-web-video-controls-color`             | Bar surface and text                      |
| `--sn-web-video-controls-timeline-bg` / `--sn-web-video-controls-thumb-bg` | Timeline track and thumb                  |
| `--sn-web-video-preview-overlay-*`                                         | Overlay mask, title, close button, sizing |
