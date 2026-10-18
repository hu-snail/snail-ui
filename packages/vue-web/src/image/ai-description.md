# SnImage — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end image component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Displays an image with click-to-preview: a full-screen overlay with zoom,
rotation, 1:1 sizing, download, drag panning, and (inside a group) prev/next
navigation. Supports fallback sources, lazy loading, and custom error /
placeholder slots.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui `n-image`
/ `n-image-group` (https://www.naiveui.com/zh-CN/light/components/image).
The preview overlay is an internal component (`SnImagePreview.vue`) mounted
by `SnImage` (standalone) or `SnImageGroup` (one shared instance), mirroring
the reference's Image/ImageGroup/ImagePreview split.

## Import

```ts
import SnImage, { SnImageGroup } from '@snui/vue-web'
// or directly:
import SnImage from '@snui/vue-web/src/image/SnImage.vue'
import SnImageGroup from '@snui/vue-web/src/image/SnImageGroup.vue'
```

## SnImage Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `src` | `string` | — | no | Image source. |
| `alt` | `string` | — | no | Image description (alt + aria-label). |
| `width` | `string \| number` | — | no | Thumbnail width (number → px). |
| `height` | `string \| number` | — | no | Thumbnail height (number → px). |
| `objectFit` | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'fill'` | no | Thumbnail fit inside its box. |
| `fallbackSrc` | `string` | — | no | Shown when the thumbnail fails to load. |
| `previewSrc` | `string` | — | no | Dedicated (larger) preview url; falls back to `src`. |
| `imgProps` | `ImgHTMLAttributes` | — | no | Extra attributes forwarded to the inner `<img>`. |
| `previewedImgProps` | `ImgHTMLAttributes` | — | no | Attributes/style for the previewed `<img>`. |
| `lazy` | `boolean` | `false` | no | Load on viewport entry (native `loading="lazy"` by default). |
| `intersectionObserverOptions` | `{ root?, rootMargin?, threshold? }` | — | no | Switches `lazy` to IntersectionObserver mode; `root` accepts an element or a selector string. |
| `previewDisabled` | `boolean` | `false` | no | Disable click-to-preview. |
| `showToolbar` | `boolean` | `true` | no | Toolbar visibility in the preview. |
| `showToolbarTooltip` | `boolean` | `false` | no | Native `title` hints on toolbar buttons. |
| `keepDragOffset` | `boolean` | `false` | no | Keep the dragged offset after mouse release (default springs back). |
| `renderToolbar` | `(props: { nodes }) => VNodeChild` | — | no | Custom preview toolbar renderer; `nodes` carries `prev / next / rotateCounterclockwise / rotateClockwise / resizeToOriginalSize / zoomOut / zoomIn / download / close`. |

## SnImage Events

| Name | Parameters | Description |
|---|---|---|
| `load` | `Event` | Thumbnail loaded. |
| `error` | `Event` | Thumbnail failed (after the fallback attempt). |

## SnImage Slots

| Name | Description |
|---|---|
| `error` | Replaces the `<img>` while it is in the error state. |
| `placeholder` | Rendered while the image has not loaded yet. |

## SnImage Methods

| Name | Type | Description |
|---|---|---|
| `showPreview` | `() => void` | Manually open the preview overlay. |
| `click` | `() => void` | Alias of `showPreview` (reference parity). |

## SnImageGroup Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `srcList` | `string[]` | — | no | Standalone image list; the shared preview browses these urls (member images are ignored). |
| `current` | `number` | — | no | Current previewed index (v-model:current). |
| `defaultCurrent` | `number` | `0` | no | Initial index for uncontrolled usage. |
| `show` | `boolean` | — | no | Controlled preview visibility (v-model:show). |
| `defaultShow` | `boolean` | `false` | no | Initial visibility for uncontrolled usage. |
| `showToolbar` | `boolean` | `true` | no | Toolbar visibility in the shared preview. |
| `showToolbarTooltip` | `boolean` | `false` | no | Native `title` hints on toolbar buttons. |
| `keepDragOffset` | `boolean` | `false` | no | Keep the dragged offset after mouse release. |
| `renderToolbar` | `(props: { nodes }) => VNodeChild` | — | no | Custom preview toolbar renderer. |

## SnImageGroup Events

| Name | Parameters | Description |
|---|---|---|
| `update:current` | `number` | Preview index change (v-model:current). |
| `update:show` | `boolean` | Preview visibility change (v-model:show). |
| `preview-next` | — | Next button clicked. |
| `preview-prev` | — | Previous button clicked. |

## SnImageGroup Slots

| Name | Description |
|---|---|
| `default` | Member `SnImage`s. |

## Divergences from the reference API

- `show-toolbar-tooltip` renders native `title` attributes instead of
  floating tooltips, keeping the overlay free of nested popups.
- Mouse wheel zooms the previewed image (task-mandated addition; the
  reference only blocks the wheel event).
- Body scroll is locked while the preview is open.
- The mask/toolbar use `--sn-web-color-*` tokens (overlay mask + elevated
  toolbar surface) instead of hardcoded rgba literals.
- Setting `srcList` while member images are present ignores the members
  instead of throwing.

## Accessibility

- The thumbnail `alt` doubles as `aria-label`; the wrapper carries
  `role="none"`.
- Preview closes via Escape; arrow keys switch (group) and zoom.
- Every toolbar action is a real `<button>` with a Chinese `aria-label`
  (向左旋转 / 向右旋转 / 原始尺寸 / 缩小 / 放大 / 下载图片 / 关闭 /
  上一张 / 下一张) and an inline SVG glyph.
- The previewed image supports drag-panning with a grab cursor.

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Background overlay | `--sn-web-color-background-overlay` | Preview mask |
| Background elevated | `--sn-web-color-background-elevated` | Toolbar surface |
| Text secondary | `--sn-web-color-text-secondary` | Toolbar icon color |
| Text primary (+ color-mix 12%) | `--sn-web-color-text-primary` | Thumbnail border (mixed with surface) |
| Text primary (+ color-mix 4.7%) | `--sn-web-color-text-primary` | Toolbar button hover (mixed with surface) |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-010.
