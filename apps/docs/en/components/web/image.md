# Image · Web

Image with click-to-preview: a full-screen overlay with zoom, rotation, 1:1
sizing, drag panning, wheel zoom, download, and prev/next navigation inside
a group.

## When to use

- Showing thumbnails that expand into a full-screen preview on click
- Browsing a set of images with a consistent preview experience
- Fallback sources, loading placeholders, or lazy loading are needed

## Examples

### Basic

<Demo name="image-web-basic" description="width / height / object-fit thumbnails." />

### Group

<Demo name="image-web-group" description="Members share one preview with wrap-around prev/next." />

### Fallback

<Demo name="image-web-fallback" description="fallback-src replaces a broken source." />

### Error slot

<Demo name="image-web-error-slot" description="The error slot replaces the failed img." />

### Preview disabled

<Demo name="image-web-preview-disabled" description="preview-disabled turns off click-to-preview." />

### Lazy loading

<Demo name="image-web-lazy" description="Native lazy plus IntersectionObserver mode inside a scroll box." />

### Manual preview

<Demo name="image-web-manual-preview" description="Open the preview via the showPreview() method." />

### Previewed image props

<Demo name="image-web-previewed-img-props" description="previewed-img-props styles the enlarged image." />

### Toolbar hints

<Demo name="image-web-toolbar-tooltip" description="show-toolbar-tooltip adds title hints to toolbar buttons." />

### Custom toolbar

<Demo name="image-web-custom-toolbar" description="render-toolbar keeps prev/next and injects custom actions." />

## API

### SnImage Props

| Prop                          | Type                                                       | Default     | Notes                                                                                                                                            |
| ----------------------------- | ---------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| src                           | `string`                                                   | `undefined` | Image source                                                                                                                                     |
| alt                           | `string`                                                   | `undefined` | Description used as alt + aria-label                                                                                                             |
| width                         | `string \| number`                                         | `undefined` | Thumbnail width (number → px)                                                                                                                    |
| height                        | `string \| number`                                         | `undefined` | Thumbnail height (number → px)                                                                                                                   |
| object-fit                    | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'fill'`    | Thumbnail fit mode                                                                                                                               |
| fallback-src                  | `string`                                                   | `undefined` | Shown when the source fails                                                                                                                      |
| preview-src                   | `string`                                                   | `undefined` | Dedicated preview url, falls back to `src`                                                                                                       |
| img-props                     | `ImgHTMLAttributes`                                        | `undefined` | Extra attrs forwarded to the inner img                                                                                                           |
| previewed-img-props           | `ImgHTMLAttributes`                                        | `undefined` | Attrs/style for the previewed img                                                                                                                |
| lazy                          | `boolean`                                                  | `false`     | Load on viewport entry (native lazy by default)                                                                                                  |
| intersection-observer-options | `{ root?, rootMargin?, threshold? }`                       | `undefined` | Switches lazy to IntersectionObserver mode                                                                                                       |
| preview-disabled              | `boolean`                                                  | `false`     | Disable click-to-preview                                                                                                                         |
| show-toolbar                  | `boolean`                                                  | `true`      | Show the preview toolbar                                                                                                                         |
| show-toolbar-tooltip          | `boolean`                                                  | `false`     | Native title hints on toolbar buttons                                                                                                            |
| keep-drag-offset              | `boolean`                                                  | `false`     | Keep the drag offset after release (default springs back)                                                                                        |
| render-toolbar                | `(props: { nodes }) => VNodeChild`                         | `undefined` | Custom toolbar renderer with prev / next / rotateCounterclockwise / rotateClockwise / resizeToOriginalSize / zoomOut / zoomIn / download / close |

### SnImage Events

| Name  | Parameters       | Notes                                         |
| ----- | ---------------- | --------------------------------------------- |
| load  | `(event: Event)` | Thumbnail loaded                              |
| error | `(event: Event)` | Thumbnail failed (after the fallback attempt) |

### SnImage Slots

| Name        | Parameters | Notes                                |
| ----------- | ---------- | ------------------------------------ |
| error       | `()`       | Replaces the img in the error state  |
| placeholder | `()`       | Shown while the image has not loaded |

### SnImage Methods

| Name        | Type         | Notes                    |
| ----------- | ------------ | ------------------------ |
| showPreview | `() => void` | Open the preview overlay |
| click       | `() => void` | Alias of showPreview     |

### SnImageGroup Props

| Prop                 | Type                               | Default     | Notes                                             |
| -------------------- | ---------------------------------- | ----------- | ------------------------------------------------- |
| src-list             | `string[]`                         | `undefined` | Standalone url list browsed by the shared preview |
| current              | `number`                           | `undefined` | Current index (v-model:current)                   |
| default-current      | `number`                           | `0`         | Uncontrolled initial index                        |
| show                 | `boolean`                          | `undefined` | Preview visibility (v-model:show)                 |
| default-show         | `boolean`                          | `false`     | Uncontrolled initial visibility                   |
| show-toolbar         | `boolean`                          | `true`      | Show the preview toolbar                          |
| show-toolbar-tooltip | `boolean`                          | `false`     | Native title hints                                |
| keep-drag-offset     | `boolean`                          | `false`     | Keep the drag offset after release                |
| render-toolbar       | `(props: { nodes }) => VNodeChild` | `undefined` | Custom toolbar renderer                           |

### SnImageGroup Events

| Name           | Parameters         | Notes                            |
| -------------- | ------------------ | -------------------------------- |
| update:current | `(value: number)`  | Index change (v-model:current)   |
| update:show    | `(value: boolean)` | Visibility change (v-model:show) |
| preview-next   | `()`               | Next clicked                     |
| preview-prev   | `()`               | Previous clicked                 |

### SnImageGroup Slots

| Name    | Parameters | Notes         |
| ------- | ---------- | ------------- |
| default | `()`       | Member images |

### Keyboard & interaction

- `Esc` closes; `←` / `→` switch (group); `↑` / `↓` zoom; Space is blocked
- The previewed image supports drag panning, double-click 1:1 toggle, wheel zoom
- Page scroll is locked while the overlay is open
