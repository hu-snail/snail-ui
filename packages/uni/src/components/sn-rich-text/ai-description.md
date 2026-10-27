# sn-rich-text — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-rich-text component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Render an HTML string as readable content: headings, paragraphs, emphasis,
quotes, code, lists, images (with loading/error placeholders and native
preview), links, tables (colspan/rowspan) and inline video/audio — plus a
heading outline and page scrolling for anchor navigation.

## Reference Library

Per AGENTS.md §112.4a, this component's API surface mirrors wot-ui
`wd-rich-text` (<https://wot-ui.cn/component/rich-text.html>), the reference
library Human-designated for the uni end. The machine-readable spec
(`.ai/reference/wot-ui-api-spec.json`, wot-ui v2.3.2) predates the component,
so the parity list lives in the rule table instead. New props added here MUST
also be added to that rule.

## Content support and boundaries

- Supported: headings, paragraphs, emphasis, quote, code, ordered/unordered
  (nested) lists, images, links, tables, video/audio, common named entities
  and numeric entities.
- Sanitized away: `script`, `style`, `iframe`, `svg`, `object`, `embed`,
  form controls, event-handler attributes, and any inline style outside the
  typography/box allowlist (`position`, `url()`, `expression()` are dropped).
- Resource addresses accept HTTP(S), protocol-relative and relative paths;
  links additionally accept `#anchor`, `mailto:` and `tel:`.
- Hard limits: 200000 UTF-16 code units, 10000 parse nodes, 128 nesting
  levels. Exceeding a limit emits `error` (`source: 'parse'`) and shows the
  default slot — split very long articles instead of raising the limits.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-rich-text :content="article" selectable @link-click="onLink" />
```

```ts
import { SnRichText } from '@snui/uni';
```

## Props

| Name             | Type                     | Default | Required | Description                                                              |
| ---------------- | ------------------------ | ------- | -------- | ------------------------------------------------------------------------ |
| `content`        | `string`                 | `''`    | no       | HTML string to render.                                                   |
| `loadingImage`   | `string`                 | `''`    | no       | Placeholder image while a content image loads (falls back to text).      |
| `errorImage`     | `string`                 | `''`    | no       | Placeholder image after a content image fails (falls back to `alt`).     |
| `enableAnchor`   | `boolean`                | `false` | no       | Build the heading outline and make anchor targets addressable.           |
| `selectable`     | `boolean`                | `false` | no       | Allow text selection where the platform supports it.                     |
| `previewImage`   | `boolean`                | `true`  | no       | Preview a standalone image on tap via `uni.previewImage`.                |
| `lazyLoad`       | `boolean`                | `false` | no       | Let the platform lazy-load content images.                               |
| `baseUrl`        | `string`                 | `''`    | no       | Absolute HTTP(S) base for relative resource addresses (links untouched). |
| `allowDataImage` | `boolean`                | `false` | no       | Accept ≤64KiB PNG/JPEG/GIF/WebP base64 images (never auto-previewed).    |
| `tagStyle`       | `Record<string, string>` | `{}`    | no       | Per-tag default style overrides, e.g. `{ p: 'text-align:center' }`.      |
| `classStyles`    | `Record<string, string>` | `{}`    | no       | Class-name → inline-style map for classes used inside the content.       |
| `customClass`    | `string`                 | `''`    | no       | Root custom class.                                                       |
| `customStyle`    | `string`                 | `''`    | no       | Root custom inline style.                                                |

Style priority: tag defaults → `tagStyle` → `classStyles` → HTML inline style.

## Events

| Name               | Payload                                                   | Description                                            |
| ------------------ | --------------------------------------------------------- | ------------------------------------------------------ |
| `load`             | `{ imageCount }`                                          | Parsing + node update done (media not awaited).        |
| `error`            | `{ source: 'parse' \| 'image' \| 'video' \| 'audio', … }` | Parse limit, image failure or media resource failure.  |
| `image-load`       | `{ src, index, width, height }`                           | A content image loaded (once per image node).          |
| `image-click`      | `{ src, index }`                                          | A standalone image was tapped.                         |
| `link-click`       | `{ href }`                                                | A link (or linked image) with a valid href was tapped. |
| `media-play`       | `{ id, type, src }`                                       | Media started playing.                                 |
| `media-pause`      | `{ id, type, src }`                                       | Media paused.                                          |
| `media-ended`      | `{ id, type, src }`                                       | Media reached the end.                                 |
| `media-timeupdate` | `{ id, type, src, currentTime, duration }`                | Progress in seconds.                                   |

## Methods (template ref)

| Name             | Signature                                       | Description                                       |
| ---------------- | ----------------------------------------------- | ------------------------------------------------- |
| `getText`        | `() => string`                                  | Filtered plain text (paragraphs / alt text kept). |
| `getHeadings`    | `() => RichTextHeading[]`                       | Outline copy; empty when `enableAnchor` is off.   |
| `getAnchorRect`  | `(id) => Promise<{ top, left, width, height }>` | Rejects when unknown, hidden or not rendered.     |
| `scrollToAnchor` | `(id, { offset?, duration? }) => Promise<void>` | Page scroll + one correction pass.                |
| `playMedia`      | `(id) => boolean`                               | `true` = command dispatched.                      |
| `pauseMedia`     | `(id?) => boolean`                              | Omit the id to pause every media in the content.  |
| `seekMedia`      | `(id, seconds) => boolean`                      | Moves without starting playback.                  |

## Slots

| Name      | Description                                                        |
| --------- | ------------------------------------------------------------------ |
| `default` | Shown when the content is empty, filtered out, or failed to parse. |

## CSS Variables

| Name                                       | Description                                  |
| ------------------------------------------ | -------------------------------------------- |
| `--sn-mp-rich-text-color`                  | Body text color.                             |
| `--sn-mp-rich-text-font-size`              | Body font size.                              |
| `--sn-mp-rich-text-line-height`            | Body line height (default `1.7`).            |
| `--sn-mp-rich-text-link-color`             | Link color.                                  |
| `--sn-mp-rich-text-video-height`           | Video height when the content sets none.     |
| `--sn-mp-rich-text-image-state-min-height` | Minimum height of image loading/error state. |
| `--sn-mp-rich-text-image-state-color`      | Image state text color.                      |
| `--sn-mp-rich-text-image-state-bg`         | Image state background color.                |

All eight default to token aliases, so dark mode follows
`page.sn-theme-dark` without extra wiring.

## Platform notes

- Rendering uses real `view` / `text` / `image` / `video` elements instead of
  the platform `rich-text` element: that is what makes image sizes, link taps
  and media control observable.
- Audio playback uses `uni.createInnerAudioContext` lazily and destroys the
  context on unmount; video control uses `uni.createVideoContext`.
- Anchor methods need `uni.createSelectorQuery` / `uni.pageScrollTo`; where the
  platform lacks them the promises reject instead of silently doing nothing.
- `tagStyle` / `classStyles` are plain string-keyed maps: confirm them on
  uni-app x (App) before relying on dynamic key objects there.
