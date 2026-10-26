# SnMarquee — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end marquee component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A seamless scrolling ticker (跑马灯): the slot content travels across a clipped
box in a continuous loop with no visible restart. Typical use: site-wide
notice bars, promo strips, live activity feeds, vertical announcement boards.

## Reference Library

**Explicit divergence from the naive-ui 1:1 rule**: naive-ui has NO marquee
component (verified against naive-ui `src/components.ts` — it is not in the
component list). Per AGENTS.md §112 the divergence is documented here: the
prop surface follows the near-universal marquee convention established by
`react-fast-marquee` (https://github.com/justin-chu/react-fast-marquee) and
`vue3-marquee` (https://github.com/volkanakkus/vue3-marquee):
`direction` / `duration` / `gap` / `pauseOnHover` / `playing` /
`autoFill`-style copy duplication. The deprecated HTML `<marquee>` element is
deliberately NOT used.

## Import

```ts
import { SnMarquee } from '@snui/vue-web';
```

## Props

| Name           | Type                                  | Default     | Description                                                                                                     |
| -------------- | ------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| `direction`    | `'left' \| 'right' \| 'up' \| 'down'` | `'left'`    | Direction the content travels.                                                                                  |
| `duration`     | `number`                              | `12`        | Seconds for one full pass of the track. Non-finite / non-positive values fall back to `12`.                     |
| `repeat`       | `number`                              | `2`         | How many copies of the slot content are rendered. Coerced to an integer ≥ 2 (`Math.max(2, Math.floor(...))`).   |
| `gap`          | `number \| string`                    | `24`        | Distance kept between two copies (number → px). Applied as trailing padding on every copy.                      |
| `pauseOnHover` | `boolean`                             | `true`      | Pause the animation while the pointer hovers the marquee.                                                       |
| `playing`      | `boolean`                             | `true`      | Whether the ticker runs. `false` freezes it in place.                                                           |
| `vertical`     | `boolean`                             | `false`     | Shorthand for a vertical ticker: behaves as `direction="up"` unless `direction` already is `'up'` / `'down'`.   |
| `height`       | `number \| string`                    | `undefined` | Box height (number → px). Recommended for a vertical ticker so the viewport has a fixed height to clip against. |

## Slots

| Name      | Params | Description                                                                                          |
| --------- | ------ | ---------------------------------------------------------------------------------------------------- |
| `default` | `()`   | ONE copy of the ticker content. The component duplicates it; the caller must not repeat the content. |

## Events

None — the ticker is pure CSS and never emits.

## Divergences

- **No naive-ui counterpart** (see Reference Library): the only explicit
  divergence mechanism used in this library, registered exactly like
  `SnComment` / `SnThing` are.
- `duration` in **seconds per pass** instead of `react-fast-marquee`'s `speed`
  (px/s) / `vue3-marquee`'s `speed`: a duration keeps the loop time
  independent of the content width, so one prop works for both a short notice
  and a wide card strip.
- **No JS ticker**: a single linear, infinite CSS keyframe moves the track.
  There is no `requestAnimationFrame`, timer or scroll listener, so the
  component holds no resource that needs a `dispose` (AGENTS.md §41 / §82) and
  costs nothing while idle.
- `vertical` is a convenience alias; every behaviour (keyframes, axis, shift)
  is still derived from `direction` alone.
- No `autoFill`: `react-fast-marquee` measures the container and repeats the
  content until it fills the viewport. This component renders a fixed
  `repeat` count instead, because a measurement pass would force a synchronous
  reflow on mount (`ResizeObserver` re-entry) for a purely decorative effect.
  Callers with very wide viewports can raise `repeat`.
- No `gradient` / `gradientColor` / `gradientWidth` (edge fade) props: the
  fade would need a hard-coded colour pair, and this library keeps colours in
  tokens rather than props.
- **Accessibility.** Only the first copy is exposed to assistive technology —
  every additional copy (`repeat - 1` of them) carries `aria-hidden="true"`, so
  a screen reader reads the announcement once instead of N times. The root
  carries `role="marquee"` (a live-region role) with `aria-live="off"`, so the
  moving text is never announced mid-animation.
- `@media (prefers-reduced-motion: reduce)` stops the animation outright
  (`animation: none`) instead of slowing it down; the content stays readable in
  place.

## Seamless-loop contract

- The root clips (`overflow: hidden`); the animated child is
  `.sn-marquee__track`, a single-row (or single-column) flex track of `repeat`
  identical `.sn-marquee__copy` boxes.
- Each copy carries the whole `gap` as **trailing** padding (`padding-right`
  horizontally, `padding-bottom` vertically). The gap is deliberately NOT a
  flex `gap` on the track: a flex gap applies `repeat - 1` times plus the
  container edge, so it collapses to a single gap at the wrap-around point and
  the seam becomes visible.
- One pass translates the track by exactly one copy box =
  `100% / repeat` of the track, published as `--sn-marquee-shift`
  (e.g. `-50%` for the default `repeat: 2`). Copy 2 therefore lands exactly
  where copy 1 started.
- `direction="right"` / `"down"` reuse the same keyframes with
  `animation-direction: reverse`, which keeps the loop seam-free without a
  second set of keyframes.
- Copies are `flex: 0 0 auto` so no copy can shrink out of sync with the
  others.

## Tokens Consumed (end: web)

| Token                               | Use                 |
| ----------------------------------- | ------------------- |
| `--sn-web-color-background-surface` | Box background.     |
| `--sn-web-color-text-primary`       | Ticker text colour. |
| `--sn-web-font-size-md`             | Base font size.     |
| `--sn-web-font-line-height-normal`  | Base line height.   |

Every declaration ships a literal fallback (`var(--sn-web-…, <literal>)`) so the
component renders standalone; the animation inputs
`--sn-marquee-duration` / `--sn-marquee-shift` are component-local properties
set inline, not design tokens.

## Versioning

`@snui/vue-web@0.1.0` — initial release. Web-end data-display / navigation
batch (Marquee).
