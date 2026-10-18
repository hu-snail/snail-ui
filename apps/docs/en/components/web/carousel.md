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

### Multiple slides per view

`slides-per-view` + `space-between`.

<Demo name="carousel-web-slides-per-view" description="slides-per-view=3 + space-between" />

### Custom arrows and dots

The `arrow` / `dots` scoped slots fully replace the built-ins
({ total, currentIndex, to, prev, next, isPrevDisabled, isNextDisabled }).

<Demo name="carousel-web-custom-arrow-and-dots" description="Scoped-slot arrows and numbered dots" />

## API

### SnCarousel Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| autoplay | `boolean` | `false` | Auto-advance; pauses on hover. |
| centered-slides | `boolean` | `false` | Centre the active slide. |
| current-index | `number \| undefined` | `undefined` | Controlled index (`v-model:current-index`); `undefined` = uncontrolled. |
| default-index | `number` | `0` | Initial index (uncontrolled). |
| direction | `'horizontal' \| 'vertical'` | `'horizontal'` | Scroll axis. |
| dot-placement | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Dots position. |
| dot-type | `'dot' \| 'line'` | `'dot'` | Dots shape. |
| draggable | `boolean` | `false` | Mouse drag switches slides. |
| effect | `'slide' \| 'fade' \| 'card' \| 'custom'` | `'slide'` | Transition effect. |
| interval | `number` | `5000` | Autoplay interval (ms). |
| loop | `boolean` | `true` | Wrap at both ends (edge clones in slide + single-view mode). |
| mousewheel | `boolean` | `false` | Wheel switches slides. |
| next-slide-style | `CSSProperties \| string` | `undefined` | Next-slide style override (card mode). |
| prev-slide-style | `CSSProperties \| string` | `undefined` | Prev-slide style override (card mode). |
| slides-per-view | `number \| 'auto'` | `1` | Slides per view; `'auto'` measures the DOM. |
| space-between | `number` | `0` | Gap (px) between slides. |
| show-arrow | `boolean` | `false` | Built-in arrows (inline SVG, zero deps). |
| show-dots | `boolean` | `true` | Indicator dots. |
| touchable | `boolean` | `true` | Touch drag switches slides. |
| transition-style | `{ transitionDuration?, transitionTimingFunction? }` | `{ transitionDuration: '300ms' }` | Slide/fade/card transition timing. |
| transition-props | `TransitionProps` | `undefined` | Passed to `<Transition>` for `effect="custom"`. |
| trigger | `'click' \| 'hover'` | `'click'` | How dots activate. |
| keyboard | `boolean` | `false` | Arrow keys switch while a dot is focused. |

Event: `update:current-index (currentIndex: number, lastIndex: number)`.

### SnCarouselItem Props

None; content goes into the default slot, state (current / prev / next)
is derived from the parent.

### Slots

| Component | Slot | Scope | Description |
| --- | --- | --- | --- |
| SnCarousel | `default` | — | `<SnCarouselItem>` sequence (bare children are auto-wrapped). |
| SnCarousel | `arrow` | `{ total, currentIndex, to, prev, next, isPrevDisabled, isNextDisabled }` | Custom arrows. |
| SnCarousel | `dots` | `{ total, currentIndex, to }` | Custom dots. |
| SnCarouselItem | `default` | `{ isPrev, isNext, isActive, index }` | Slide content. |

### Inst Methods

| Method | Signature | Description |
| --- | --- | --- |
| to | `(index: number) => void` | Jump to a display index. |
| prev | `() => void` | Previous slide. |
| next | `() => void` | Next slide. |
| getCurrentIndex | `() => number` | Current display index. |

## Divergence / future

- Intentional divergence from naive: `default-index` is broken in
  naive-ui 2.43.1 (initializes against an empty slide list, always
  collapsing to 0); SnCarousel honours it.
- Implemented but without a dedicated demo: standalone `space-between`
  scenario, `centered-slides`, `effect="custom"` (`transition-props`),
  `hover` / `keyboard` / `mousewheel` / `simulate-drag` scenarios,
  `slides-per-view="auto"`, `dot-placement="top"` / `"right"`, controlled
  `current-index` wiring.
- Drag geometry (multi-page snapping, flick thresholds) is tested at the
  pure-function layer in `carousel-utils.ts`; happy-dom performs no
  DOM-level drag assertions.

See the component's `ai-description.md` for the full contract.
