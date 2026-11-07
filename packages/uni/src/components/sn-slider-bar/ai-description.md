# sn-slider-bar (uni)

Capsule / bar slider for the uni end. Mirrors the web `SnSliderBar`: a
capsule track with a themed fill, a disc knob the same height as the track,
an optional in-track read-out, an **aurora** theme (gradient fill + drifting
stars) and a `column` variant.

## When to use

Volume / brightness bars, playback scrub, price intervals, fan-speed tiers
(`levels`) and vertical dimmers (`variant="column"`). Use `sn-slider` when you
need marks, the wot-ui surface or extreme-value captions.

## Props

| Prop            | Type                                   | Default     | Notes                                          |
| --------------- | -------------------------------------- | ----------- | ---------------------------------------------- |
| modelValue      | `number \| number[]`                   | `0`         | v-model; `[start, end]` in `range` mode.        |
| min / max       | `number`                               | `0` / `100` | Bounds.                                         |
| step            | `number`                               | `1`         | Snap granularity.                               |
| range           | `boolean`                              | `false`     | Two knobs, non-crossing.                        |
| disabled / readonly | `boolean`                          | `false`     | Disable / read-only.                            |
| reverse         | `boolean`                              | `false`     | Invert the axis.                                |
| variant         | `'bar' \| 'column'`                    | `'bar'`     | Horizontal capsule / vertical strip.            |
| theme           | `'default' \| 'aurora'`                | `'default'` | Aurora = gradient + stars + glow.               |
| showValue       | `boolean`                              | `false`     | Show the read-out (beside / above).             |
| format          | `'percent' \| 'value'`                 | `'percent'` | Read-out source.                                |
| valueSuffix     | `string`                               | `'%'`       | Suffix for the default read-out.                |
| formatValue     | `(value, percent) => string`           | —           | Fully custom read-out.                          |
| levels          | `{ value, label, icon? }[]`            | —           | Discrete tiers; the read-out shows the label.   |
| showLevels      | `boolean`                              | `true`      | Draw a tick per level.                          |
| size            | `'small' \| 'medium' \| 'large'`       | `'medium'`  | Track thickness 56 / 80 / 104 rpx.              |
| barHeight       | `string \| number`                     | —           | Explicit control height (number → rpx).         |
| thickness       | `string \| number`                     | —           | Track thickness (overrides `size`).             |
| radius          | `string`                               | —           | Corner radius (CSS length).                     |
| label / suffix  | `string`                               | `''`        | Text painted inside the track (head / tail).    |
| fillBackground  | `string`                               | `''`        | Custom fill background (ignored by aurora).     |
| gradient        | `string`                               | `''`        | Aurora gradient.                                |
| sparkles        | `number`                               | `14`        | Aurora star density (0 = off).                  |
| animated        | `boolean`                              | `true`      | Aurora drift / twinkle.                         |
| innerColor      | `string`                               | `''`        | In-track text / glyph colour when filled.       |
| innerColorEmpty | `string`                               | `''`        | In-track colour at value 0.                     |
| fade            | `boolean`                              | `true`      | Column: fade the empty part.                    |
| tooltipOnly     | `boolean`                              | `false`     | Column: read from the caption only.             |
| ariaLabel       | `string`                               | `''`        | Accessible name.                                |
| customClass / customStyle | `string`                     | `''`        | Root class / inline style.                      |

## Slots

| Slot  | Notes                                  |
| ----- | -------------------------------------- |
| start | Head glyph before the track.           |
| end   | Tail glyph after the track.            |
| icon  | Glyph painted inside the track.        |
| value | Read-out content (`value` / `percent` / `level`). |

## Two colour states

In-track text / glyph colour follows the value: filled → `innerColor`
(default white on the aurora gradient), empty (value 0) → `innerColorEmpty`
(the muted hint). The swap is a CSS colour transition.

## uni notes

- No DOM: the track is measured once with `uni.createSelectorQuery` and re-measured
  on a `variant` change. Geometry is percentage-based, so rpx scaling is free.
- Animations are CSS keyframes (drift / twinkle) — no JS timers, so H5 and
  mini-program both run them on the render layer.
- `barHeight` (not `height`) carries the explicit height: `height` collides
  with the `view` attribute.

## Out of scope

Marks / extreme-value captions (use `sn-slider`) and the web-end contract.
