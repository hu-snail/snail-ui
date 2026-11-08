# VideoPlayer · Web

A full video player: danmaku, picture-in-picture, a mini floating window,
quality switching, download, playback-rate / loop settings and live mode —
all built in and themed through `--sn-web-*` tokens. Streaming formats
(HLS / DASH / FLV) plug in through the `sourceBridge` boundary with a
third-party library such as hls.js — **the component library itself ships no
streaming code**.

> This component is an AUI-additive capability: neither naive-ui nor other
> mainstream web UI libraries ship a video player (verified against
> naive-ui `src/components.ts`), so the §112 1:1 rule does not apply. The
> feature set follows mainstream player conventions (Bilibili / Xigua), and
> the API follows this repo's conventions (controlled/uncontrolled pairs,
> `update:*` events, `--sn-web-*` tokens). For the thumbnail + lightbox
> scenario use [VideoPreview](/en/components/web/video-preview).

## When to use

- Full playback pages: courses, trailers, live sports, community video feeds
- Danmaku interaction (display + send)
- Keep a video playing in a corner mini window after the page scrolls
- Multiple qualities of the same content (progressive MP4/WebM ladder or
  multi-bitrate streams)
- HLS / DASH / FLV playback — install the streaming library in your app and
  inject it via `sourceBridge`

## Examples

### Basic

<Demo name="video-player-web-basic" description="src + poster: centered play button, full control bar, hover time preview, volume slider and keyboard shortcuts (Space play/pause, ←→ ±5s, ↑↓ volume, M mute, F fullscreen)." />

### Danmaku

<Demo name="video-player-web-danmaku" description="Pass a timeline via danmus and send live bullets from the inline box (self danmus are highlighted and not replayed after a seek back). Visibility, opacity, speed, font size and lane area are props; one canvas engine drives it all." />

### Quality ladder (progressive)

<Demo name="video-player-web-quality" description="qualities takes a 1080P / 720P / 360P ladder; switching from the settings menu preserves the playback position." />

### Picture-in-picture

<Demo name="video-player-web-pip" description="Browser-native PiP: the button renders only when document.pictureInPictureEnabled is available; shortcut P does the same." />

### Mini window (auto-dock on scroll)

<Demo name="video-player-web-mini" description="With mini-on-scroll-out, scrolling the player out of the viewport docks it into a draggable bottom-right mini window (closable), and scrolling back restores it; manual control via the toolbar button or v-model:mini." />

### Download

<Demo name="video-player-web-download" description="The download button uses <a download> by default (direct download same-origin, new tab cross-origin); pass on-download to take over with authenticated or blob flows." />

### Live + HLS bridge (hls.js, public live stream)

<Demo name="video-player-web-hls-live" description="sourceBridge wires hls.js to a public HLS live test stream (Akamai moctobpltc): automatic LIVE badge, no progress bar, danmaku keeps working. The demo loads hls.js on demand from a CDN — the library source stays dependency-free; install hls.js in your own app." />

### Multi-bitrate VOD (qualities from the stream)

<Demo name="video-player-web-hls-vod" description="hls.js parses the public Mux multi-bitrate test stream and reports levels via setQualities; the settings menu switches levels directly — same quality menu as the progressive ladder." />

## Installing a third-party streaming library (guide)

The library **contains no streaming implementation**. Install hls.js in your
application:

```bash
npm install hls.js
```

Then wire it in through `sourceBridge` (full notes in the component header):

```ts
import Hls from 'hls.js';
import type { SnVideoSourceBridge } from '@snui/vue-web';

export const hlsBridge: SnVideoSourceBridge = (ctx) => {
  // Native HLS (Safari): decline and let the player use its native path.
  if (ctx.video.canPlayType('application/vnd.apple.mpegurl')) return;
  if (!Hls.isSupported()) return;
  const hls = new Hls();
  hls.loadSource(ctx.source.src);
  hls.attachMedia(ctx.video);
  hls.on(Hls.Events.MANIFEST_PARSED, (_e, data) => {
    ctx.setQualities(data.levels.map((level, id) => ({ id, label: `${level.height}P` })));
  });
  return {
    destroy: () => hls.destroy(),
    selectQuality: (id) => {
      hls.currentLevel = id as number;
    },
  };
};
```

```vue
<SnVideoPlayer :src="liveUrl" :source-bridge="hlsBridge" live />
```

Returning a falsy value declines the source and the player falls back to
native playback (e.g. Safari's built-in HLS). `setQualities` / `setIsLive` /
`reportError` may be called at any time; the player updates the quality
menu, live badge and error panel accordingly.

## API

### Props

| Name               | Type                                            | Default      | Description                                                                  |
| ------------------ | ----------------------------------------------- | ------------ | ---------------------------------------------------------------------------- |
| src                | `string`                                        | `undefined`  | Media URL (plain mode); ignored while a bridge owns loading                  |
| poster             | `string`                                        | `undefined`  | Poster shown before the first frame                                          |
| title              | `string`                                        | `undefined`  | Accessible name; also the mini-window header                                 |
| qualities          | `SnVideoQuality[]`                              | `[]`         | Progressive quality ladder `{ label, value, src, type? }`                    |
| default-quality    | `string \| number`                              | first entry  | Initially selected ladder entry                                              |
| autoplay           | `boolean`                                       | `false`      | Autoplay (browsers require `muted`, see compatibility)                       |
| muted              | `boolean`                                       | `false`      | Start muted                                                                  |
| loop               | `boolean`                                       | `false`      | Loop playback                                                                |
| preload            | `'none' \| 'metadata' \| 'auto'`                | `'metadata'` | Preload strategy                                                             |
| volume             | `number`                                        | `1`          | Initial volume 0–1                                                           |
| rate               | `number`                                        | `1`          | Initial playback rate                                                        |
| live               | `boolean`                                       | auto         | Force live mode; default sniffs `duration === Infinity` / bridge report      |
| shortcuts          | `boolean`                                       | `true`       | Keyboard shortcuts (Space/K, ←→, ↑↓, M, F, P, D)                             |
| danmus             | `SnVideoDanmu[]`                                | `[]`         | Danmaku timeline `{ text, time, color?, type?, self? }`                      |
| danmu-visible      | `boolean`                                       | `true`       | Show the danmu layer                                                         |
| danmu-send         | `boolean`                                       | `true`       | Show the inline danmu input (hidden for live)                                |
| danmu-opacity      | `number`                                        | `1`          | Danmaku layer opacity 0–1                                                    |
| danmu-speed        | `number`                                        | `1`          | Danmaku velocity multiplier                                                  |
| danmu-font-size    | `number`                                        | `16`         | Base font size in px (scales with player width)                              |
| danmu-area         | `number`                                        | `0.75`       | Fraction of height usable for danmu lanes                                    |
| mini               | `boolean`                                       | uncontrolled | Mini floating window (controlled), pair with `@update:mini` / `v-model:mini` |
| mini-on-scroll-out | `boolean`                                       | `false`      | Auto-dock when scrolled out of view while playing                            |
| mini-width         | `number`                                        | `320`        | Docked window width in px                                                    |
| pip                | `boolean`                                       | `true`       | PiP entry (button renders only when supported)                               |
| download           | `boolean`                                       | `true`       | Download button (hidden for live / bridge-owned media without `on-download`) |
| settings           | `boolean`                                       | `true`       | Settings menu (quality / rate / loop)                                        |
| source-bridge      | `SnVideoSourceBridge`                           | `undefined`  | Third-party streaming bridge, see the guide above                            |
| width              | `string \| number`                              | `undefined`  | Player width (number → px)                                                   |
| aspect-ratio       | `string`                                        | `'16 / 9'`   | Aspect ratio                                                                 |
| on-download        | `(source) => void \| string \| Promise<string>` | `undefined`  | Custom download; returning a URL opens that instead                          |

### Events

| Name                      | Payload               | Description                                  |
| ------------------------- | --------------------- | -------------------------------------------- |
| play / pause              | —                     | Media state changes                          |
| ended                     | —                     | Playback finished                            |
| timeupdate                | `currentTime: number` | Media clock tick                             |
| seeked                    | `currentTime: number` | Seek finished (danmu pointer re-anchored)    |
| waiting / canplay         | —                     | Buffering state                              |
| error                     | `unknown`             | Media or bridge failure (error panel shows)  |
| ready                     | —                     | Metadata loaded                              |
| rate-change               | `rate: number`        | Playback rate changed                        |
| volume-change             | `{ volume, muted }`   | Volume / mute changed                        |
| fullscreen-change         | `active: boolean`     | Element fullscreen toggled                   |
| pip-change                | `active: boolean`     | Picture-in-picture toggled                   |
| update:mini / mini-change | `active: boolean`     | Mini window toggled (`v-model:mini` pattern) |
| quality-change            | `{ id, label? }`      | Quality switched (ladder or bridge level)    |
| danmu-send                | `SnVideoDanmu`        | A danmu was sent from the input box          |
| download                  | `SnBridgeSource`      | Download initiated                           |

### Slots

| Name  | Params | Description                       |
| ----- | ------ | --------------------------------- |
| error | —      | Replaces the built-in error panel |

### Methods (via template ref)

| Name                              | Type                                   | Description                      |
| --------------------------------- | -------------------------------------- | -------------------------------- |
| play / pause / toggle             | `() => void \| Promise<void>`          | Transport control                |
| seek                              | `(t: number) => void`                  | Jump (clamped for live)          |
| setVolume / setMuted / toggleMute | `(v) => void`                          | Volume control                   |
| setRate                           | `(r: number) => void`                  | Playback rate                    |
| toggleFullscreen                  | `() => void`                           | Element fullscreen               |
| toggleWebFullscreen               | `() => void`                           | Page fullscreen                  |
| togglePip                         | `() => Promise<void>`                  | Picture-in-picture               |
| toggleMini                        | `() => void`                           | Mini window                      |
| toggleDanmu                       | `() => void`                           | Danmaku visibility               |
| sendDanmu                         | `(text, opts?) => void`                | Send a danmu at the current time |
| retry                             | `() => void`                           | Retry after an error             |
| videoEl / rootEl                  | `Ref<HTMLVideoElement \| HTMLElement>` | Underlying elements (advanced)   |

## Theme tokens

Component-scoped `--sn-web-video-player-*` custom properties, all with
generic `--sn-web-*` fallbacks, overridable at any ancestor:
`--sn-web-video-player-bg`, `-controls-bg`, `-scrim`, `-color`,
`-button-hover`, `-track`, `-buffered`, `-thumb-size`, `-big-play-size`,
`-mini-width`, `-mini-z`, `-radius`, and more.

## Accessibility

- Every control is a real `<button>` with localized `aria-label` (the
  `VideoPlayer` locale namespace); toggles expose `aria-pressed` /
  `aria-checked`.
- The progress bar is `role="slider"` with `aria-valuemin/max/now/text`,
  focusable; ArrowLeft/Right seek ±5s.
- The settings panel uses `role="menu"` + `menuitemradio` + `aria-checked`;
  the loop row is `role="switch"`.
- Shortcuts are suppressed while typing in the danmu input; Space / arrows
  are `preventDefault`-ed so the page never scrolls.
- `playsinline` is always rendered so iOS Safari never hijacks the screen.

## Compatibility notes

- Modern browsers allow autoplay only for muted media; a rejected `play()`
  surfaces the error panel instead of throwing.
- PiP / fullscreen buttons are feature-detected and absent when unsupported.
- Live detection uses the spec signal `duration === Infinity`; `NaN`
  (metadata not yet loaded) never reads as live. Bridges can override with
  `setIsLive(true)`.
- The download button relies on `<a download>`: same-origin files download
  directly, cross-origin URLs open a new tab (browser policy). Provide
  `on-download` for authenticated / blob flows.
- The danmaku canvas degrades to pure scheduling where no 2D context exists
  (tests / non-rendering DOM).
