# SnVideoPreview — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end video preview
> component. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A video thumbnail that plays inline on click and can be expanded into a
full-screen preview overlay: a media box with a poster, a centered play
button, an optional top-right "expand" affordance, and — in the overlay — a
header title, a close button, ESC-to-close and click-mask-to-close.

## Reference Library

**Explicit divergence from the naive-ui 1:1 rule**: naive-ui has NO video
component (verified against naive-ui `src/components.ts`). Per AGENTS.md §112
this is a deliberate, documented divergence rather than a missing parity
target: the API is aligned with this repo's own `SnImage` preview model —
thumbnail + click-to-open overlay, `previewDisabled` / `showToolbar` /
`showPreview()` — with the overlay as a separate internal component
(`SnVideoPreviewOverlay.vue`), mirroring the SnImage / SnImagePreview split.

## Import

```ts
import { SnVideoPreview } from '@snui/vue-web'
// or directly:
import SnVideoPreview from '@snui/vue-web/src/video-preview/SnVideoPreview.vue'
```

`SnVideoPreviewOverlay.vue` is internal (mounted by `SnVideoPreview`), not a
public component — same contract as `SnImagePreview.vue`.

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `src` | `string` | — | **yes** | Video source. |
| `poster` | `string` | `undefined` | no | Poster shown before playback starts. |
| `previewSrc` | `string` | `undefined` | no | Dedicated (larger) overlay url; falls back to `src`. |
| `width` | `string \| number` | `320` | no | Box width (number → px). |
| `height` | `string \| number` | `undefined` | no | Box height (number → px). |
| `aspectRatio` | `string` | `undefined` | no | Box aspect ratio, e.g. `'16 / 9'`; applied only when no explicit `height`. |
| `objectFit` | `'contain' \| 'cover' \| 'fill'` | `'cover'` | no | How the video fits its box. |
| `controls` | `boolean` | `true` | no | Native control bar (available once inline playback started). |
| `autoplay` | `boolean` | `false` | no | Start inline playback on mount. |
| `loop` | `boolean` | `false` | no | Loop inline playback. |
| `muted` | `boolean` | `false` | no | Mute inline playback. |
| `preload` | `'none' \| 'metadata' \| 'auto'` | `'metadata'` | no | Preload strategy. |
| `previewDisabled` | `boolean` | `false` | no | Disable the overlay: no affordance, `showPreview()` is a no-op. |
| `showToolbar` | `boolean` | `true` | no | Render the top-right overlay affordance (revealed on hover / focus). |
| `closeOnMaskClick` | `boolean` | `true` | no | Close the overlay when its mask is clicked. |
| `title` | `string` | `undefined` | no | Overlay header text, and accessible-name fallback. |
| `alt` | `string` | `undefined` | no | Accessible description of the video; wins over `title`. |

## Events

| Name | Parameters | Description |
|---|---|---|
| `play` | `()` | Inline playback started (native `play` event). |
| `pause` | `()` | Inline playback paused. |
| `ended` | `()` | Inline playback reached the end. |
| `error` | `(event: Event)` | The video element failed to load or decode. |
| `preview` | `()` | The overlay was opened. |
| `close` | `()` | The overlay was closed (ESC / mask / close button / `closePreview()`). |

The overlay's own video does not re-emit `play` / `pause` / `ended` / `error`;
those belong to the inline box (documented behaviour, not an oversight).

## Slots

| Name | Params | Description |
|---|---|---|
| `placeholder` | `()` | Replaces the poster area while there is no poster and/or the video has not started playing. |
| `play-icon` | `()` | Replaces the centered play glyph (default: `SnIcon` + lucide `Play`). |
| `toolbar` | `{ showPreview: () => void }` | Replaces the top-right overlay affordance; call `showPreview` to open the overlay. |

## Methods

| Name | Type | Description |
|---|---|---|
| `play` | `() => void` | Start inline playback. |
| `pause` | `() => void` | Pause inline playback. |
| `showPreview` | `() => void` | Open the full-screen preview overlay (no-op while `previewDisabled`). |
| `closePreview` | `() => void` | Close the full-screen preview overlay. |

## Interaction contract

- Not playing → a scrim plus a centered play button sits over the poster.
  Clicking it calls `video.play()`; with `controls` the native control bar then
  takes over, otherwise clicking the video toggles play/pause.
- Any native `pause` / `ended` returns the box to the poster state; `play()`
  rejecting (autoplay policy) also falls back to the poster state.
- The scrim is decorative (`pointer-events: none`) so the native control bar
  stays reachable underneath it; only the play button and the toolbar button
  are hit targets.
- The overlay opens from the toolbar affordance or `showPreview()`; closing via
  ESC / mask / close button emits `close` and returns focus to the toolbar
  affordance. Page scroll is locked while the overlay is shown.

## Accessibility

- The box contains a real `<button>` for play (`aria-label="播放视频"`) and one
  for the overlay affordance (`aria-label="放大预览"`), both with real
  `SnIcon` glyphs.
- The overlay is `role="dialog"` + `aria-modal="true"` + `aria-label` from
  `title` (fallback `视频预览`); focus moves into it on open (the close button,
  `aria-label="关闭"`) and back to the trigger on close.
- The overlay video and the inline video both carry `aria-label` derived from
  `alt` (preferred) or `title`.
- `:focus-visible` outlines use `--sn-web-focus-ring`.

## Dispose (§41)

On unmount the inline video is paused and its `src` removed; the overlay pauses
its video, drops its `src`, removes its `document` `keydown` listener and
restores the page scroll lock. Every media call is guarded
(`typeof el.play === 'function'`) because `HTMLMediaElement` methods are absent
in some environments (happy-dom) and `play()` may reject on autoplay policy.

## Tokens Consumed (end: web)

| Token | Purpose |
|---|---|
| `--sn-web-color-background-surface` | Box background behind the video |
| `--sn-web-color-background-subtle` | Placeholder slot surface |
| `--sn-web-color-background-overlay` | Overlay mask |
| `--sn-web-color-background-elevated` | Overlay close-button hover |
| `--sn-web-color-text-on-primary` | Play / toolbar glyph color |
| `--sn-web-color-text-tertiary` | Placeholder slot text |
| `--sn-web-radius-md`, `--sn-web-radius-full` | Box + round buttons |
| `--sn-web-spacing-4`, `--sn-web-spacing-8` | Toolbar offset / gaps |
| `--sn-web-font-size-sm`, `--sn-web-font-line-height-normal` | Placeholder text |
| `--sn-web-focus-ring` | `:focus-visible` outlines |

Component-scoped `--sn-web-video-preview-*` variables (play size, toolbar
button size, mask/placeholder surfaces, overlay z-index/gutter) each carry a
literal fallback and can be overridden per instance.

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-011.