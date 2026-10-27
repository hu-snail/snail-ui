# RichText · uni-app (Mobile)

`sn-rich-text` renders an HTML string as readable content: headings, paragraphs, emphasis, quotes, code, lists, images (with loading / error placeholders and native preview), links, tables (merged cells) and inline video / audio — plus a heading outline and page scrolling for anchor navigation. Auto-registered via easycom.

## When to use

- Articles, announcements and event pages built from HTML content
- Tapping an image should preview; tapping a link should be handled by the host
- Long articles need a heading outline with chapter jumping
- Embedded video / audio needs programmatic playback control

## Demos

### Basic article

Hand the HTML to `content`; `selectable` makes the text selectable where the platform allows.

<Demo name="rich-text-mp-basic" description="Headings, paragraphs, emphasis, quote and ordered / unordered lists composing a full article." />

### Images and preview

Standalone images report `image-click` and open the built-in WeChat-style viewer by default (pinch zoom, double-tap, drag-down dismiss — see `sn-image-preview`); `original-src` shows a thumbnail but previews the full image; `data-preview="false"` removes one image from the preview list; a filtered address falls back to the `alt` text.

<Demo name="rich-text-mp-images" description="Built-in WeChat-style preview, original-src HD preview, data-preview opt-out, failure falling back to alt." />

### Links and linked images

Tapping a valid link only reports `link-click` — navigation is the host's call; images wrapped by a valid link report `link-click` too; filtered addresses render as plain images / text.

<Demo name="rich-text-mp-links" description="link-click events, linked images, filtered addresses." />

### Tables

`colspan` / `rowspan` merges and `colgroup` column widths are supported; wide tables scroll horizontally inside the component instead of stretching the page.

<Demo name="rich-text-mp-table" description="Merged cells, colgroup widths, horizontal scrolling." />

### Media and playback control

Media never autoplays; video ships native controls and audio renders a play / pause button. Give media a unique `id` and drive it with `playMedia` / `pauseMedia` / `seekMedia` — `true` means the command was dispatched.

<Demo name="rich-text-mp-media" description="Video and audio, media-timeupdate progress, component-method playback control." />

### Style maps, outline and empty state

`tag-style` sets per-tag defaults, `class-styles` maps class names used inside the content (editor `ql-*` classes are built in); `enable-anchor` turns on the outline and `scrollToAnchor`; an empty, filtered-empty or failed content shows the default slot.

<Demo name="rich-text-mp-styles" description="tag-style / class-styles priority, outline jumping, empty-state slot." />

## Content boundaries

- Supported: headings, paragraphs, emphasis, quote, code, ordered / unordered (nested) lists, images, links, tables, video / audio, common named entities and numeric entities.
- Filtered away: `script`, `style`, `iframe`, `svg`, `object`, `embed`, form controls and event-handler attributes; inline styles keep typography / box-model properties only — `position`, `url()` and `expression()` are always dropped.
- Resource addresses accept HTTP(S), protocol-relative and relative paths; links additionally accept `#anchor`, `mailto:` and `tel:`.
- Per-parse limits: 200000 UTF-16 code units, 10000 nodes, 128 nesting levels. Exceeding one emits `error` and shows the default slot — split very long articles instead.

## easycom

```vue
<sn-rich-text :content="article" selectable @link-click="onLink" />
```

Explicit import works too:

```ts
import { SnRichText } from '@snui/uni';
```

## Props

| Name             | Type                     | Default | Description                                                          |
| ---------------- | ------------------------ | ------- | -------------------------------------------------------------------- |
| `content`        | `string`                 | `''`    | HTML string to render.                                               |
| `loadingImage`   | `string`                 | `''`    | Placeholder image while loading; falls back to text.                 |
| `errorImage`     | `string`                 | `''`    | Placeholder image on failure; falls back to `alt`.                   |
| `enableAnchor`   | `boolean`                | `false` | Build the heading outline and enable anchor targeting.               |
| `selectable`     | `boolean`                | `false` | Allow text selection where the platform supports it.                 |
| `previewImage`   | `boolean`                | `true`  | Preview a standalone image on tap via the native API.                |
| `lazyLoad`       | `boolean`                | `false` | Let the platform lazy-load content images.                           |
| `baseUrl`        | `string`                 | `''`    | Absolute base for relative resource addresses; links stay untouched. |
| `allowDataImage` | `boolean`                | `false` | Accept ≤64KiB PNG/JPEG/GIF/WebP base64 images; never auto-previewed. |
| `tagStyle`       | `Record<string, string>` | `{}`    | Per-tag default style overrides.                                     |
| `classStyles`    | `Record<string, string>` | `{}`    | Class-name → inline-style map for content classes.                   |
| `customClass`    | `string`                 | `''`    | Root custom class.                                                   |
| `customStyle`    | `string`                 | `''`    | Root custom inline style.                                            |

Style priority: tag defaults → `tagStyle` → `classStyles` → HTML inline style.

## Events

| Name               | Payload                                                   | Description                                            |
| ------------------ | --------------------------------------------------------- | ------------------------------------------------------ |
| `load`             | `{ imageCount }`                                          | Parsing + node update done; media not awaited.         |
| `error`            | `{ source: 'parse' \| 'image' \| 'video' \| 'audio', … }` | Limit, image failure or media resource failure.        |
| `image-load`       | `{ src, index, width, height }`                           | A content image loaded; once per image node.           |
| `image-click`      | `{ src, index }`                                          | A standalone image was tapped.                         |
| `link-click`       | `{ href }`                                                | A link (or linked image) with a valid href was tapped. |
| `media-play`       | `{ id, type, src }`                                       | Media started playing.                                 |
| `media-pause`      | `{ id, type, src }`                                       | Media paused.                                          |
| `media-ended`      | `{ id, type, src }`                                       | Media reached the end.                                 |
| `media-timeupdate` | `{ id, type, src, currentTime, duration }`                | Progress in seconds.                                   |

## Methods

| Name             | Signature                     | Return                                  | Description                                        |
| ---------------- | ----------------------------- | --------------------------------------- | -------------------------------------------------- |
| `getText`        | -                             | `string`                                | Filtered plain text; paragraphs and alt text kept. |
| `getHeadings`    | -                             | `{ id, level, text }[]`                 | Outline copy; empty when `enableAnchor` is off.    |
| `getAnchorRect`  | `id: string`                  | `Promise<{ top, left, width, height }>` | Rejects when unknown, hidden or not rendered.      |
| `scrollToAnchor` | `id, { offset?, duration? }`  | `Promise<void>`                         | Page scroll with one post-animation correction.    |
| `playMedia`      | `id: string`                  | `boolean`                               | `true` means the command was dispatched.           |
| `pauseMedia`     | `id?: string`                 | `boolean`                               | Omit the id to pause every media in the content.   |
| `seekMedia`      | `id: string, seconds: number` | `boolean`                               | Moves without starting playback.                   |

## Slots

| Name      | Description                                                        |
| --------- | ------------------------------------------------------------------ |
| `default` | Shown when the content is empty, filtered out, or failed to parse. |

## CSS variables

| Name                                       | Description                                |
| ------------------------------------------ | ------------------------------------------ |
| `--sn-mp-rich-text-color`                  | Body text colour.                          |
| `--sn-mp-rich-text-font-size`              | Body font size.                            |
| `--sn-mp-rich-text-line-height`            | Body line height (default `1.7`).          |
| `--sn-mp-rich-text-link-color`             | Link colour.                               |
| `--sn-mp-rich-text-video-height`           | Video height when the content sets none.   |
| `--sn-mp-rich-text-image-state-min-height` | Minimum height of the image loading state. |
| `--sn-mp-rich-text-image-state-color`      | Image state text colour.                   |
| `--sn-mp-rich-text-image-state-bg`         | Image state background colour.             |

All eight default to theme aliases, so dark mode needs no extra wiring.

## Dark mode

Every colour resolves from a `--sn-mp-color-*` semantic variable; wrap with `<sn-config-provider theme="dark">` to verify:

```vue
<sn-config-provider theme="dark">
  <sn-rich-text :content="article" />
</sn-config-provider>
```

## Platform notes

- Content renders with real `view` / `text` / `image` / `video` elements instead of the platform `rich-text` element — that is what makes image sizes, link taps and media control observable.
- Audio playback creates an inner audio context lazily and destroys it on unmount; video control dispatches through a video context.
- Anchor methods rely on the platform selector query and page scroll APIs; where they are missing the promises reject instead of failing silently.
- `tagStyle` / `classStyles` are plain string-keyed maps; confirm dynamic key objects on uni-app x (App) before relying on them there.
