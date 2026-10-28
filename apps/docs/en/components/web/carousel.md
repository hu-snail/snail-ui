# Carousel · Web

`SnCarousel` + `SnCarouselItem` rotate content in a limited viewport with
slide / fade / card / custom effects, seamless looping (edge clones),
autoplay, drag, wheel and keyboard switching (n-carousel aligned).

## When to Use

- Banners, featured content and image galleries.
- Showing several homogeneous cards per screen (`slides-per-view`) and
  paging through them.
- Auto-playing, wrapping carousels (first/last clones make the loop
  seamless).

Not for: long scrollable lists — use a scroll container or
`SnInfiniteScroll`.

## Examples

### Basic

Defaults to `effect="slide"` with `loop` (edge clones make it seamless).

<Demo name="carousel-web-basic" description="Basic looping carousel" />

### Autoplay

`autoplay` + `interval`; hovering pauses, leaving resumes.

<Demo name="carousel-web-autoplay" description="autoplay with hover pause" />

### Arrows

`show-arrow` renders built-in prev/next arrows (disabled at the boundary
when `loop=false`).

<Demo name="carousel-web-arrow" description="Built-in arrows with show-arrow" />

### Dots

`dot-type` (dot / line) and `dot-placement` (top / bottom / left / right).

<Demo name="carousel-web-dots" description="Line dots and left placement" />

### Vertical

`direction="vertical"`.

<Demo name="carousel-web-vertical" description="Vertical carousel with right dots" />

### Effects

`effect`: slide / fade / card.

<Demo name="carousel-web-effect" description="slide vs fade vs card" />

### Custom transition

`effect="custom"` hands transition control to the business: slides toggle
through `v-show` inside a `<Transition>`; pass any Vue `<Transition>`
props via `transition-props` and define the enter/leave classes yourself.

<Demo name="carousel-web-effect-custom" description="effect=custom + transition-props zoom-fade" />

### 3D card effect

`effect="card"` ships a built-in 3D card stack: the current card sits
centred, side cards recede, and clicking a side card navigates to it.

<Demo name="carousel-web-card-3d" description="effect=card 3D card stack" />

### Multiple slides per view

`slides-per-view` + `space-between`.

<Demo name="carousel-web-slides-per-view" description="slides-per-view=3 + space-between" />

### Mouse wheel

`mousewheel`: scrolling the wheel over the carousel switches slides.

<Demo name="carousel-web-mousewheel" description="mousewheel wheel switching" />

### Custom arrows and dots

The `arrow` / `dots` scoped slots fully replace the built-ins
({ total, currentIndex, to, prev, next, isPrevDisabled, isNextDisabled }).

<Demo name="carousel-web-custom-arrow-and-dots" description="Scoped-slot arrows and numbered dots" />

### Video

Drive the slides with the `options` list — the media markup lives inside
the component. `type: 'video'` marks a video entry (no hand-written
`<video>` / `<img>` tags): videos render `muted` + `loop` +
`playsinline`, click toggles playback, and leaving the current slide
pauses them; images get `draggable=false` so the native drag never
fights the carousel. Item shape `SnCarouselMediaItem`: `type`
(`'image'` default / `'video'`), `src`, `alt`, `poster`,
`title` / `description` (caption), `fit` (object-fit, default
`cover`), `key`.

<Demo name="carousel-web-video" description="options-driven image/video slides + item slot customization" />

While `options` is set the default slot is ignored; the `item` scoped
slot can take over each slide (receives `item` / `index` /
`isActive` …) — the second carousel in the demo is a slot override.
Hand-written `SnCarouselItem` usage is unchanged.

### Real-world scenarios

Marketing banner (`title` / `description` caption overlay):

<Demo name="carousel-web-banner" description="Marketing banner with captions and line dots" />

E-commerce product cards (`slides-per-view=3` + `space-between=16` + `loop`):

<Demo name="carousel-web-product-cards" description="Three product cards per view, mouse drag" />

News / announcements (`direction="vertical"` + `autoplay`):

<Demo name="carousel-web-news" description="Vertical news ticker, hover pause, draggable" />

## API

### SnCarousel Props

| Prop             | Type                                                 | Default                           | Description                                                             |
| ---------------- | ---------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------- |
| autoplay         | `boolean`                                            | `false`                           | Auto-advance; pauses on hover.                                          |
| centered-slides  | `boolean`                                            | `false`                           | Centre the active slide.                                                |
| current-index    | `number \| undefined`                                | `undefined`                       | Controlled index (`v-model:current-index`); `undefined` = uncontrolled. |
| default-index    | `number`                                             | `0`                               | Initial index (uncontrolled).                                           |
| direction        | `'horizontal' \| 'vertical'`                         | `'horizontal'`                    | Scroll axis.                                                            |
| dot-placement    | `'top' \| 'bottom' \| 'left' \| 'right'`             | `'bottom'`                        | Dots position.                                                          |
| dot-type         | `'dot' \| 'line'`                                    | `'dot'`                           | Dots shape.                                                             |
| draggable        | `boolean`                                            | `false`                           | Mouse drag switches slides.                                             |
| effect           | `'slide' \| 'fade' \| 'card' \| 'custom'`            | `'slide'`                         | Transition effect.                                                      |
| interval         | `number`                                             | `5000`                            | Autoplay interval (ms).                                                 |
| loop             | `boolean`                                            | `true`                            | Wrap at both ends (edge clones in slide + single-view mode).            |
| mousewheel       | `boolean`                                            | `false`                           | Wheel switches slides.                                                  |
| options          | `SnCarouselMediaItem[]`                              | `undefined`                       | Data-driven slides (media markup built in); the default slot is ignored while set. |
| next-slide-style | `CSSProperties \| string`                            | `undefined`                       | Next-slide style override (card mode).                                  |
| prev-slide-style | `CSSProperties \| string`                            | `undefined`                       | Prev-slide style override (card mode).                                  |
| slides-per-view  | `number \| 'auto'`                                   | `1`                               | Slides per view; `'auto'` measures the DOM.                             |
| space-between    | `number`                                             | `0`                               | Gap (px) between slides.                                                |
| show-arrow       | `boolean`                                            | `false`                           | Built-in arrows (inline SVG, zero deps).                                |
| show-dots        | `boolean`                                            | `true`                            | Indicator dots.                                                         |
| touchable        | `boolean`                                            | `true`                            | Touch drag switches slides.                                             |
| transition-style | `{ transitionDuration?, transitionTimingFunction? }` | `{ transitionDuration: '300ms' }` | Slide/fade/card transition timing.                                      |
| transition-props | `TransitionProps`                                    | `undefined`                       | Passed to `<Transition>` for `effect="custom"`.                         |
| trigger          | `'click' \| 'hover'`                                 | `'click'`                         | How dots activate.                                                      |
| keyboard         | `boolean`                                            | `false`                           | Arrow keys switch while a dot is focused.                               |

Event: `update:current-index (currentIndex: number, lastIndex: number)`.

### SnCarouselItem Props

| Prop        | Type     | Default     | Description                                                    |
| ----------- | -------- | ----------- | -------------------------------------------------------------- |
| title       | `string` | `undefined` | Primary caption in the bottom gradient overlay (beyond naive). |
| description | `string` | `undefined` | Secondary caption line under the title.                        |

When `title`, `description` or the `caption` slot is present, a bottom
overlay renders (gradient background + white text, `pointer-events: none`
so dragging passes through); `caption` slot content replaces the
title/description text.

### Slots

| Component      | Slot      | Scope                                                                     | Description                                                       |
| -------------- | --------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| SnCarousel     | `default` | —                                                                         | `<SnCarouselItem>` sequence (bare children are auto-wrapped).     |
| SnCarousel     | `item`    | `{ item, index, isActive, isPrev, isNext }`                               | Overrides the built-in media renderer in options mode (falls back to built-in). |
| SnCarousel     | `arrow`   | `{ total, currentIndex, to, prev, next, isPrevDisabled, isNextDisabled }` | Custom arrows.                                                    |
| SnCarousel     | `dots`    | `{ total, currentIndex, to }`                                             | Custom dots.                                                      |
| SnCarouselItem | `default` | `{ isPrev, isNext, isActive, index }`                                     | Slide content.                                                    |
| SnCarouselItem | `caption` | —                                                                         | Custom caption overlay content (replaces title/description text). |

### Inst Methods

| Method          | Signature                 | Description              |
| --------------- | ------------------------- | ------------------------ |
| to              | `(index: number) => void` | Jump to a display index. |
| prev            | `() => void`              | Previous slide.          |
| next            | `() => void`              | Next slide.              |
| getCurrentIndex | `() => number`            | Current display index.   |

## Divergence / future

- Intentional divergence: `default-index` was found to be broken in the
  upstream implementation (initializes against an empty slide list,
  always collapsing to 0); SnCarousel honours it.
- Extensions beyond naive (intentional divergences): ① `SnCarouselItem`
  `title` / `description` props + `caption` slot (bottom gradient text
  overlay); ② a slide losing the current state auto-pauses its inner
  `<video>` elements (also cleaned up on unmount); ③ a drag never starts
  when mousedown/touchstart lands inside an interactive element
  (`video / audio / a / button / input / textarea / select /
[contenteditable] / [data-no-drag]`), keeping native controls usable
  (naive preventDefaults every mouse drag start).
- Docs demos all enable `draggable` for easy trying; the component default
  stays naive-aligned at `false`.
- Implemented but without a dedicated demo: standalone `space-between`
  scenario, `centered-slides`, `hover` / `keyboard` / `simulate-drag`
  scenarios, `slides-per-view="auto"`, `dot-placement="top"` / `"right"`,
  controlled `current-index` wiring.
- Drag geometry (multi-page snapping, flick thresholds) is tested at the
  pure-function layer in `carousel-utils.ts`; happy-dom performs no
  DOM-level drag assertions (a 0×0 viewport clamps the drag offset to 0;
  the interactive-element suppression cases stub `offsetWidth` to observe
  the full chain).

See the component's `ai-description.md` for the full contract.
