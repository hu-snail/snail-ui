# SnCarousel / SnCarouselItem — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end carousel pair.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Carousel / slider. `SnCarousel` renders a viewport with a track of
`SnCarouselItem` slides and switches between them with slide, fade, card
or custom (user-driven `<Transition>`) effects. Used for hero banners,
galleries, onboarding screens, multi-card scrollers.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-carousel` + `n-carousel-item`
(https://www.naiveui.com/zh-CN/light/components/carousel).
Source of truth: naive-ui `src/carousel/src/` (Carousel.tsx,
CarouselItem.tsx, CarouselDots.tsx, CarouselArrow.tsx, CarouselContext.ts,
interface.ts, utils/, styles/index.cssr.ts, styles/light.ts).

## Import

```ts
import { SnCarousel, SnCarouselItem } from '@snui/vue-web'
```

## Mechanics (mirrors naive Carousel.tsx)

- **Loop** (`loop` + `effect='slide'` + `slides-per-view=1`, i.e.
  `duplicatedable`): the first and last slide vnodes are cloned to the
  opposite ends. Display index ⇄ real (clone-inclusive) index mapping,
  clone count, snap targets, per-view sizing and flick thresholds are pure
  functions in `carousel-utils.ts` (unit-tested without a DOM). After a
  clone-landing transition, `transitionend` snaps the track onto the real
  slide at 0ms so the loop is seamless.
- **slide**: flex track translated with `translateX/Y` (px) +
  `transition-style` (default duration 300ms).
- **fade**: slides stack absolutely; opacity swap via `--current`.
- **card**: 3D stage (`perspective: 1000px`); prev/next/current offsets
  are exact naive cssr values; `prev-slide-style` / `next-slide-style`
  apply (naive 2.27.0+ behaviour).
- **custom**: each slide is wrapped in `<Transition v-bind="transition-props">`
  and toggled with `v-show` by display index.
- **Drag**: `draggable` (pointer) / `touchable` (touch). Follows the
  pointer, clamps to one viewport; on release it snaps by nearest track
  position (can cross multiple pages) or by flick (> 50% viewport or
  0.4 px/ms — naive thresholds). Transition is disabled while dragging;
  a drag beats a pending autoplay tick; only one carousel may drag at a
  time (module-level flag, naive parity).
- **Autoplay**: `interval` (default 5000ms) timer; pauses while the
  pointer is over the carousel (`mouseenter` stops, `mouseleave`
  restarts), and restarts after index changes and resizes.
- **Keyboard**: when `keyboard` is on and a dot is focused,
  ArrowRight/PageUp = next and ArrowLeft/PageDown = prev (horizontal);
  ArrowUp/PageUp = next and ArrowDown/PageDown = prev (vertical).
  Enter/Space activates the focused dot regardless of `keyboard`.
- **Mousewheel**: a wheel delta ≥ 10px in the carousel's axis (shift maps
  vertical deltas onto horizontal carousels) switches slides; ignored
  mid-transition (naive has no accumulation — the in-transition guard is
  the throttle).
- **Dots**: `dot` / `line` shapes, `top/bottom/left/right` placement,
  `click`/`hover` trigger. Shown only when the display total > 1.

## SnCarousel Props

| Name | Type | Default | Description |
|---|---|---|---|
| `autoplay` | `boolean` | `false` | Auto-advance; pauses on hover. |
| `centeredSlides` | `boolean` | `false` | Centre the active slide (per-view/auto layouts). |
| `currentIndex` | `number \| undefined` | `undefined` | Controlled current display index (`v-model:current-index`). `undefined` = uncontrolled. |
| `defaultIndex` | `number` | `0` | Initial display index (uncontrolled). |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Scroll axis. |
| `dotPlacement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Indicator dots position. |
| `dotType` | `'dot' \| 'line'` | `'dot'` | Indicator dots shape. |
| `draggable` | `boolean` | `false` | Mouse drag switches slides. |
| `effect` | `'slide' \| 'fade' \| 'card' \| 'custom'` | `'slide'` | Transition effect. |
| `interval` | `number` | `5000` | Autoplay interval (ms). |
| `loop` | `boolean` | `true` | Wrap around at both ends. |
| `mousewheel` | `boolean` | `false` | Wheel switches slides. |
| `nextSlideStyle` | `CSSProperties \| string` | `undefined` | Inline style for the next slide (card mode). |
| `prevSlideStyle` | `CSSProperties \| string` | `undefined` | Inline style for the previous slide (card mode). |
| `slidesPerView` | `number \| 'auto'` | `1` | Slides per view; `'auto'` measures slide widths from the DOM (ResizeObserver with feature detection, SSR-safe). |
| `spaceBetween` | `number` | `0` | Gap (px) between slides. |
| `showArrow` | `boolean` | `false` | Built-in prev/next arrows (inline SVG chevrons, zero deps). |
| `showDots` | `boolean` | `true` | Indicator dots. |
| `touchable` | `boolean` | `true` | Touch drag switches slides. |
| `transitionStyle` | `{ transitionDuration?: string; transitionTimingFunction?: string }` | `{ transitionDuration: '300ms' }` | Slide/fade/card transition timing. |
| `transitionProps` | `TransitionProps` | `undefined` | Vue `<Transition>` props for `effect='custom'`. |
| `trigger` | `'click' \| 'hover'` | `'click'` | How dots activate. |
| `keyboard` | `boolean` | `false` | Arrow keys switch while a dot is focused. |
| `onUpdateCurrentIndex` | `(currentIndex: number, lastIndex: number) => void` | `undefined` | Secondary callback channel (naive parity; the event below is the primary one). |

## SnCarouselItem Props

None. Content is the default slot; per-slide behaviour (current/prev/next
state, sizing, margins, card transforms) is derived from the parent
through provide/inject (mirrors naive CarouselContext).

## Events

| Event | Payload | When |
|---|---|---|
| `update:current-index` | `(currentIndex: number, lastIndex: number)` | Display index changed (`v-model:current-index`). |

## Slots

| Component | Slot | Scope | Description |
|---|---|---|---|
| `SnCarousel` | `default` | — | Sequence of `<SnCarouselItem>` children (bare children are auto-wrapped). |
| `SnCarousel` | `arrow` | `{ total, currentIndex, to, prev, next, isPrevDisabled, isNextDisabled }` | Replaces the built-in arrow pair. `prev`/`next` are the transition-guarded variants. |
| `SnCarousel` | `dots` | `{ total, currentIndex, to }` | Replaces the built-in dots. |
| `SnCarouselItem` | `default` | `{ isPrev, isNext, isActive, index }` | Slide content. |

## Inst Methods (defineExpose)

| Method | Signature | Description |
|---|---|---|
| `to` | `(index: number) => void` | Jump to a display index. |
| `prev` | `() => void` | Previous slide. |
| `next` | `() => void` | Next slide. |
| `getCurrentIndex` | `() => number` | Current display index. |

## §112 Divergences (documented, intentional)

- **`default-index` actually works.** naive-ui 2.43.1 initializes its
  uncontrolled display index against an empty slide list (total view = 1),
  which collapses `default-index` to 0 — verified against naive-ui 2.43.1
  under happy-dom (the current slide stays at real index 1 / dot 0).
  naive ships no default-index demo. SnCarousel initializes the display
  index in display space directly, so `default-index` is honoured.
- **Wheel accumulation**: none — identical to naive (single-event 10px
  threshold; `inTransition` acts as the throttle). Registered because the
  naive source is often misread as accumulating deltas.

## §112 future markers (declared parity, deferred)

- `slides-per-view='auto'` visual behaviour requires a live layout:
  measurement plumbing is implemented (ResizeObserver + per-slide size
  capture), but a browser-only visual check is still pending.
- `caroulseExposedMethod`-style `onUpdateCurrentIndex` alias already
  shipped; no further inst methods planned (`syncBarPosition` etc. do not
  exist on n-carousel).

## Tokens Consumed (end: web)

| Token / colour | Value | Purpose |
|---|---|---|
| `--sn-web-bezier-ease` | token | All transitions' easing |
| Dot colours | `rgba(255,255,255,.3 / .5 / 1)` | Inactive / focused / active dots |
| Arrow background | `rgba(255,255,255,.2)`, hover `.3` | Arrow buttons |
| Arrow icon colour | `color-mix(in srgb, rgba(255,255,255,1) 93%, transparent)` | ≈ naive `#eee` (see note) |

Token note: dots and arrows render on top of arbitrary slide imagery, so
they use the white-overlay rgba() values that naive's own carousel theme
(`styles/light.ts`) uses — `dotColor rgba(255,255,255,.3)`, active `1`,
focus `.5`, arrow background `rgba(255,255,255,.2/.3)` straight from
naive's cssr. The only literal naive uses is `arrowColor: '#eee'`; the
repo token discipline forbids literal hex, so it is expressed as an
equivalent white color-mix (93% ≈ #eee) and flagged here.

## Accessibility

- Slides container `role="listbox"`; each slide `role="option"`,
  `tabindex="-1"`, `data-index`, `aria-hidden` reflecting active state.
- Dots container `role="tablist"`; each dot `role="button"`,
  `tabindex="0"`, `aria-selected`.
- Arrows `role="button"`; `--disabled` state at boundaries when
  `loop=false`.
- Keyboard: dots are tabbable; Enter/Space activates; arrow keys switch
  with `keyboard`.

## Versioning

`@snui/vue-web` — initial release. Style-packs foundations batch
(feature/v3-foundations-and-style-packs).
