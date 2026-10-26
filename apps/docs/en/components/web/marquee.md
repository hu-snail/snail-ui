# Marquee · Web

`SnMarquee` scrolls **one** copy of its slot content across a clipped box in a
continuous, seamless loop. Typical use: notice bars, promo strips, rolling
announcements.

## When to use

- Site notices, campaign copy, live activity feeds — text that is one line too
  long to fit
- A one-line-per-item vertical announcement board
- Space-constrained headers where wrapping would break the layout

Not a fit: content that already fits on one screen needs no ticker, and
important text the user has to read carefully should be static.

## Examples

### Basic

Scrolls left by default; hovering pauses it.

<Demo name="marquee-web-basic" description="Basic horizontal ticker: 12s per pass, 24px gap, pauses on hover." />

### Directions

`direction` picks the travel direction; a vertical ticker needs a fixed
`height` to clip against.

<Demo name="marquee-web-direction" description="left / right / up / down, with height set for the vertical ones." />

### Notice bar

`playing` controls pause / resume, `pause-on-hover` controls the hover pause.

<Demo name="marquee-web-notice" description="Tag + ticker + play/pause button, i.e. a site-wide notice bar." />

## API

### SnMarquee Props

| Name         | Type                                  | Default     | Notes                                                                                              |
| ------------ | ------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------- |
| direction    | `'left' \| 'right' \| 'up' \| 'down'` | `'left'`    | Direction the content travels                                                                      |
| duration     | `number`                              | `12`        | Seconds for one full pass; non-finite / non-positive values fall back to `12`                      |
| repeat       | `number`                              | `2`         | How many copies are rendered; coerced to an integer ≥ 2 (`Math.max(2, Math.floor(...))`)           |
| gap          | `number \| string`                    | `24`        | Distance between two copies (number → px), applied as trailing padding on every copy               |
| pauseOnHover | `boolean`                             | `true`      | Pause while the pointer hovers the marquee                                                         |
| playing      | `boolean`                             | `true`      | Whether the ticker runs; `false` freezes it in place                                               |
| vertical     | `boolean`                             | `false`     | Shorthand for a vertical ticker: `direction="up"` unless `direction` already is `'up'` / `'down'`  |
| height       | `number \| string`                    | `undefined` | Box height (number → px); recommended for a vertical ticker so there is a viewport to clip against |

### SnMarquee Slots

| Name    | Params | Notes                                                                                            |
| ------- | ------ | ------------------------------------------------------------------------------------------------ |
| default | `()`   | **ONE** copy of the content — the component duplicates it, so do not repeat the content yourself |

### SnMarquee Events

None. The ticker is driven entirely by CSS and never emits.

## How the seamless loop works

- The root clips (`overflow: hidden`); the animated node is the inner
  `.sn-marquee__track`, a single-row (or single-column) flex track holding
  `repeat` identical copies.
- `gap` is applied as **trailing** padding on each copy (`padding-right`
  horizontally, `padding-bottom` vertically). It is deliberately not a flex
  `gap` on the track: a flex gap applies `repeat - 1` times and excludes the
  wrap-around point, so the loop would collapse to a single gap and expose the
  seam.
- One pass moves the track by exactly one copy box (content + its trailing
  gap) = `100% / repeat` of the track, published as `--sn-marquee-shift`
  (`-50%` for the default `repeat: 2`), so copy 2 lands exactly where copy 1
  started.
- `direction="right"` / `"down"` reuse the same keyframes with
  `animation-direction: reverse`, which keeps the loop seamless without a
  second set of keyframes.
- Copies are `flex: 0 0 auto`, so none can shrink out of sync with the others.

## Accessibility

- Only the first copy is exposed to assistive technology; every extra copy
  carries `aria-hidden="true"`, so a screen reader reads the text once instead
  of N times.
- The root is `role="marquee"` + `aria-live="off"`, so the moving text is not
  announced mid-animation.
- `prefers-reduced-motion: reduce` stops the animation outright
  (`animation: none`); the content stays readable in place.

## Theming

The component consumes `--sn-web-*` aliases (text colour, background, font
size, line height), each declaration carrying a literal fallback.
`--sn-marquee-duration` / `--sn-marquee-shift` are internal animation inputs set
inline, not design tokens.

## Known Divergences / Deferred

- No counterpart in naive-ui (verified against its `src/components.ts`
  component list), so per §112 this is an **explicit divergence**: the prop
  surface follows the de-facto `react-fast-marquee` / `vue3-marquee` naming
  (`direction` / `duration` / `gap` / `pauseOnHover` / `playing`). The
  deprecated HTML `<marquee>` element is deliberately not used.
- `duration` in seconds per pass instead of `speed` in px/s: a duration keeps
  the loop time independent of the content width, so one configuration works
  for both a short notice and a wide card strip.
- No JS ticker / `requestAnimationFrame` / timer — one CSS keyframe only, so
  there is no resource to dispose.
- No `autoFill` (measuring the container and repeating until it is filled)
  would force a synchronous reflow on mount; raise `repeat` instead.
- No `gradient` / edge-fade props: a fade needs hard-coded colours, and this
  library keeps colours in tokens rather than props.

See the component `ai-description.md` for the full contract.
