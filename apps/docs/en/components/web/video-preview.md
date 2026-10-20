# VideoPreview · Web

A video thumbnail: poster plus a centered play button that starts inline
playback, and a top-right expand button that opens a full-screen preview
overlay (close with Esc or a mask click).

> naive-ui has no video component (it is absent from `src/components.ts`), so
> this component **does not follow the §112 1:1 rule**. Its API is aligned with
> this repo's `SnImage` preview model instead: thumbnail + click-to-open
> overlay, with `preview-disabled` / `show-toolbar` / `showPreview()` named and
> behaving like SnImage's. The overlay is a separate internal component
> (`SnVideoPreviewOverlay.vue`), mirroring the SnImage / SnImagePreview split.

## When to use

- Showing a video thumbnail inside lists, cards or rich content
- Playing video in place while still offering a full-screen preview
- Custom posters, play glyphs, or a custom expand affordance

## Examples

### Basic

<Demo name="video-preview-web-basic" description="width / height / aspect-ratio size the media box; object-fit controls the fill." />

### Full-screen preview

<Demo name="video-preview-web-overlay" description="The top-right expand button opens the overlay; Esc or a mask click closes it. preview-disabled turns the affordance off." />

### Custom poster and slots

<Demo name="video-preview-web-custom-poster" description="placeholder replaces the poster area, play-icon the glyph, toolbar the expand affordance." />

## API

### SnVideoPreview Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| src | `string` | — | Video source (required) |
| poster | `string` | `undefined` | Poster shown before playback starts |
| preview-src | `string` | `undefined` | Larger url used by the overlay; falls back to `src` |
| width | `string \| number` | `320` | Media box width (number → px) |
| height | `string \| number` | `undefined` | Media box height (number → px) |
| aspect-ratio | `string` | `undefined` | Media box ratio, e.g. `'16 / 9'`; applied only without an explicit height |
| object-fit | `'contain' \| 'cover' \| 'fill'` | `'cover'` | How the video fits its box |
| controls | `boolean` | `true` | Native control bar (usable once inline playback started) |
| autoplay | `boolean` | `false` | Start inline playback on mount |
| loop | `boolean` | `false` | Loop inline playback |
| muted | `boolean` | `false` | Mute inline playback |
| preload | `'none' \| 'metadata' \| 'auto'` | `'metadata'` | Preload strategy |
| preview-disabled | `boolean` | `false` | Disable the overlay: no affordance, `showPreview()` becomes a no-op |
| show-toolbar | `boolean` | `true` | Render the top-right expand affordance (revealed on hover / focus) |
| close-on-mask-click | `boolean` | `true` | Close the overlay on mask click |
| title | `string` | `undefined` | Overlay header text, and accessible-name fallback |
| alt | `string` | `undefined` | Accessible description of the video; wins over `title` |

### SnVideoPreview Events

| Name | Parameters | Notes |
| --- | --- | --- |
| play | `()` | Inline playback started |
| pause | `()` | Inline playback paused |
| ended | `()` | Inline playback reached the end |
| error | `(event: Event)` | The video failed to load or decode |
| preview | `()` | Overlay opened |
| close | `()` | Overlay closed (Esc / mask / close button / closePreview()) |

### SnVideoPreview Slots

| Name | Parameters | Notes |
| --- | --- | --- |
| placeholder | `()` | Replaces the poster area while there is no poster and/or playback has not started |
| play-icon | `()` | Replaces the centered play glyph (default: SnIcon + lucide Play) |
| toolbar | `{ showPreview: () => void }` | Replaces the expand affordance; call `showPreview` to open the overlay |

### SnVideoPreview Methods

| Name | Type | Notes |
| --- | --- | --- |
| play | `() => void` | Start inline playback |
| pause | `() => void` | Pause inline playback |
| showPreview | `() => void` | Open the full-screen overlay (no-op while `preview-disabled`) |
| closePreview | `() => void` | Close the full-screen overlay |

### Keyboard & interaction

- Before playback a scrim with a centered play button covers the poster; the
  click calls `video.play()`
- With `controls` the native control bar drives playback; without it, clicking
  the video toggles play/pause
- Any pause / end returns the box to the poster state, as does a rejected
  `play()` (autoplay policy)
- The overlay closes on Esc or mask click, returns focus to the expand button
  and locks page scroll while open
- The scrim does not intercept pointer events, so the native control bar stays
  clickable; only the play and expand buttons are hit targets