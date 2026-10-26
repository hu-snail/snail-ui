# SnVideoPlayer — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end full video player.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A full-featured video player for the web end, benchmarked against mainstream
video players (B 站 / 西瓜播放器): danmaku (canvas engine), picture-in-picture,
a draggable mini floating window (manual + auto-dock on scroll-out), quality
switching, download, playback-rate / loop settings, live mode (LIVE badge, no
progress bar), keyboard shortcuts, and a fully token-driven custom control bar
with seek / volume / fullscreen.

Streaming formats (HLS / DASH / FLV) are **not** bundled: the `sourceBridge`
prop is the plugin boundary — the host installs `hls.js` (or similar) itself
and hands the player a loader function. The bridge reports qualities /
liveness / errors back through its context and owns `destroy()`.

## Reference Library

**NONE** — naive-ui ships no video player (verified against
naive-ui `src/components.ts`). Per AGENTS.md §112 this is a registered
AUI-additive capability (§112.3a): the feature set follows mainstream player
conventions, the API follows this repo's own conventions (controlled /
uncontrolled pair, `update:*` events, `--sn-web-*` tokens).

## Import

```ts
import { SnVideoPlayer } from '@snui/vue-web';
// or directly:
import SnVideoPlayer from '@snui/vue-web/src/video-player/SnVideoPlayer.vue';
```

Internal modules (`use-danmaku.ts`, `use-mini-window.ts`, `video-shortcuts.ts`,
`video-player-types.ts`) are exported through the package root for typing, not
as components.

## Props

| Name             | Type                                       | Default      | Required | Description                                                                                      |
| ---------------- | ------------------------------------------ | ------------ | -------- | ------------------------------------------------------------------------------------------------ |
| `src`            | `string`                                   | `undefined`  | no       | Media URL (plain mode). Ignored while a bridge owns loading.                                     |
| `poster`         | `string`                                   | `undefined`  | no       | Poster shown before the first frame.                                                             |
| `title`          | `string`                                   | `undefined`  | no       | Accessible name; also the mini-window header text.                                               |
| `qualities`      | `SnVideoQuality[]`                         | `[]`         | no       | Progressive quality ladder (`{ label, value, src, type? }`).                                     |
| `defaultQuality` | `string \| number`                         | first entry  | no       | Initially selected ladder entry.                                                                 |
| `autoplay`       | `boolean`                                  | `false`      | no       | Autoplay (browsers require `muted`).                                                             |
| `muted`          | `boolean`                                  | `false`      | no       | Start muted.                                                                                     |
| `loop`           | `boolean`                                  | `false`      | no       | Loop playback.                                                                                   |
| `preload`        | `'none' \| 'metadata' \| 'auto'`           | `'metadata'` | no       | Preload strategy.                                                                                |
| `volume`         | `number`                                   | `1`          | no       | Initial volume 0–1.                                                                              |
| `rate`           | `number`                                   | `1`          | no       | Initial playback rate.                                                                           |
| `live`           | `boolean`                                  | auto         | no       | Force live mode; `undefined` sniffs `duration === Infinity` / bridge report.                     |
| `shortcuts`      | `boolean`                                  | `true`       | no       | Keyboard shortcuts (Space/K, ←→, ↑↓, M, F, P, D).                                                |
| `danmus`         | `SnVideoDanmu[]`                           | `[]`         | no       | Danmaku timeline (`{ text, time, color?, type?, self? }`).                                       |
| `danmuVisible`   | `boolean`                                  | `true`       | no       | Show the danmu layer (v-model-less controlled visibility).                                       |
| `danmuSend`      | `boolean`                                  | `true`       | no       | Show the inline danmu input box.                                                                 |
| `danmuOpacity`   | `number`                                   | `1`          | no       | Danmaku layer opacity 0–1.                                                                       |
| `danmuSpeed`     | `number`                                   | `1`          | no       | Danmaku velocity multiplier.                                                                     |
| `danmuFontSize`  | `number`                                   | `16`         | no       | Base font size in px (scales with player width).                                                 |
| `danmuArea`      | `number`                                   | `0.75`       | no       | Fraction of the height usable for danmu lanes.                                                   |
| `mini`           | `boolean`                                  | uncontrolled | no       | Mini floating window (controlled). `update:mini` mirrors it.                                     |
| `miniOnScrollOut`| `boolean`                                  | `false`      | no       | Auto-dock into the mini window when scrolled out of view while playing.                          |
| `miniWidth`      | `number`                                   | `320`        | no       | Docked window width in px.                                                                       |
| `pip`            | `boolean`                                  | `true`       | no       | PiP toggle; button renders only when the platform supports it.                                   |
| `download`       | `boolean`                                  | `true`       | no       | Download button (hidden for live / bridge-owned media unless `onDownload` given).                |
| `settings`       | `boolean`                                  | `true`       | no       | Settings menu (quality / rate / loop).                                                           |
| `sourceBridge`   | `SnVideoSourceBridge`                      | `undefined`  | no       | Third-party streaming bridge (HLS / DASH / FLV) — host-provided, not bundled.                    |
| `width`          | `string \| number`                         | `undefined`  | no       | Player width (number → px).                                                                      |
| `aspectRatio`    | `string`                                   | `'16 / 9'`   | no       | Player aspect ratio.                                                                             |
| `onDownload`     | `(source) => void \| string \| Promise<string>` | `undefined` | no   | Custom download handler; returning a URL opens that instead of the source.                       |

## Events

| Name               | Payload                              | Description                                  |
| ------------------ | ------------------------------------ | -------------------------------------------- |
| `play` / `pause`   | —                                    | Media state changes.                         |
| `ended`            | —                                    | Playback finished.                           |
| `timeupdate`       | `currentTime: number`                | Media clock tick.                            |
| `seeked`           | `currentTime: number`                | Seek finished (danmu pointer re-anchored).   |
| `waiting` / `canplay` | —                                 | Buffering state.                             |
| `error`            | `unknown`                            | Media or bridge failure (error panel shows). |
| `ready`            | —                                    | Metadata loaded.                             |
| `rate-change`      | `rate: number`                       | Playback rate changed.                       |
| `volume-change`    | `{ volume, muted }`                  | Volume / mute changed.                       |
| `fullscreen-change`| `active: boolean`                    | Element fullscreen toggled.                  |
| `pip-change`       | `active: boolean`                    | Picture-in-picture toggled.                  |
| `update:mini` / `mini-change` | `active: boolean`         | Mini window toggled (v-model:mini pattern).  |
| `quality-change`   | `{ id, label? }`                     | Quality switched (ladder or bridge level).   |
| `danmu-send`       | `SnVideoDanmu`                       | A danmu was sent from the input box.         |
| `download`         | `SnBridgeSource`                     | Download initiated.                          |

## Slots

| Name    | Description                          |
| ------- | ------------------------------------ |
| `error` | Replaces the built-in error panel.   |

## Methods (defineExpose)

`play` `pause` `toggle` `seek(t)` `setVolume(v)` `setMuted(b)` `toggleMute`
`setRate(r)` `toggleFullscreen` `toggleWebFullscreen` `togglePip` `toggleMini`
`toggleDanmu` `sendDanmu(text, opts?)` `retry` `videoEl` `rootEl`.

## Tokens

Component-scoped `--sn-web-video-player-*` custom properties with generic
`--sn-web-*` fallbacks (radius / spacing / color / shadow / focus-ring).
Overridable at any ancestor: `--sn-web-video-player-bg`, `-controls-bg`,
`-scrim`, `-color`, `-button-hover`, `-track`, `-buffered`, `-thumb-size`,
`-big-play-size`, `-mini-width`, `-mini-z`, `-radius`, etc.

## Accessibility

- All control buttons are real `<button>`s with localized `aria-label`
  (`VideoPlayer` locale namespace) and pressed-state `aria-pressed` /
  `aria-checked` where applicable.
- The progress bar is `role="slider"` with `aria-valuemin/max/now/text`,
  focusable, ArrowLeft/Right seek ±5s.
- The settings panel uses `role="menu"` + `role="menuitemradio"` +
  `aria-checked`; the loop row is `role="switch"`.
- The video element carries `aria-label` from `title`; `playsinline` is
  always rendered so iOS never hijacks the screen.
- Keyboard shortcuts: Space/K toggle, ←/→ seek ±5s, ↑/↓ volume, M mute,
  F fullscreen, P PiP (when supported), D danmaku — suppressed while typing
  in the danmu input, and Space/arrows are `preventDefault`-ed so the page
  never scrolls.

## AI Patch Boundary

| Field               | Patchable | Notes                                             |
| ------------------- | --------- | ------------------------------------------------- |
| `src` / `qualities` | yes       | Source swaps preserve playback position.          |
| `danmus`            | yes       | Whole-timeline replacement; engine re-anchors.    |
| `danmu*` tuning     | yes       | opacity / speed / fontSize / area are live props. |
| `mini`              | yes       | Controlled via `v-model:mini`.                    |
| `sourceBridge`      | no        | Function prop — patching it re-creates the stream.|
| internal engine state | no      | Danmaku actives / lane bookkeeping are internal.  |

## Compatibility Notes

- Autoplay requires `muted` in every modern browser; a rejected `play()`
  surfaces the error panel instead of throwing.
- PiP / fullscreen buttons are feature-detected and absent when unsupported.
- Live detection uses the spec signal `duration === Infinity`; `NaN`
  (metadata not yet loaded) never reads as live. The bridge can override via
  `setIsLive(true)`.
- The download button uses an anchor with the `download` attribute: same-origin
  files download directly; cross-origin URLs open in a new tab (browser
  policy). Provide `onDownload` for authenticated / blob flows.
