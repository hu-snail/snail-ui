# sn-slider-bar (uni)

Capsule / bar slider for the uni end. Mirrors the web `SnSliderBar`: a
capsule track with a themed fill, a disc knob the same height as the track
(`knob-shape="circle"` gives a true round one), an optional in-track read-out,
an **aurora** theme (gradient fill + drifting stars), four colour presets
(`ocean` / `sunset` / `grape` / `mono`) and a `column` variant.

## When to use

Volume / brightness bars, playback scrub, price intervals, fan-speed tiers
(`levels`) and vertical dimmers (`variant="column"`). Use `sn-slider` when you
need marks, the wot-ui surface or extreme-value captions.

## Props

| Prop                      | Type                                                                | Default     | Notes                                                     |
| ------------------------- | ------------------------------------------------------------------- | ----------- | --------------------------------------------------------- |
| modelValue                | `number \| number[]`                                                | `0`         | v-model; `[start, end]` in `range` mode.                  |
| min / max                 | `number`                                                            | `0` / `100` | Bounds.                                                   |
| step                      | `number`                                                            | `1`         | Snap granularity.                                         |
| range                     | `boolean`                                                           | `false`     | Two knobs, non-crossing.                                  |
| disabled / readonly       | `boolean`                                                           | `false`     | Disable / read-only.                                      |
| reverse                   | `boolean`                                                           | `false`     | Invert the axis.                                          |
| variant                   | `'bar' \| 'column'`                                                 | `'bar'`     | Horizontal capsule / vertical strip.                      |
| theme                     | `'default' \| 'aurora' \| 'ocean' \| 'sunset' \| 'grape' \| 'mono'` | `'default'` | Aurora = gradient + stars; the rest = colour presets.     |
| showValue                 | `boolean`                                                           | `false`     | Show the read-out (beside / above).                       |
| format                    | `'percent' \| 'value'`                                              | `'percent'` | Read-out source.                                          |
| valueSuffix               | `string`                                                            | `'%'`       | Suffix for the default read-out.                          |
| formatValue               | `(value, percent) => string`                                        | —           | Fully custom read-out.                                    |
| levels                    | `{ value, label, icon? }[]`                                         | —           | Discrete tiers; the read-out shows the label.             |
| showLevels                | `boolean`                                                           | `true`      | Draw a tick per level.                                    |
| size                      | `'small' \| 'medium' \| 'large'`                                    | `'medium'`  | Track thickness 28 / 40 / 56 rpx (≈ 6 % of the length).   |
| barHeight                 | `string \| number`                                                  | —           | Explicit control height (number → rpx).                   |
| thickness                 | `string \| number`                                                  | —           | Track thickness (overrides `size`).                       |
| radius                    | `string`                                                            | —           | Corner radius (CSS length).                               |
| label / suffix            | `string`                                                            | `''`        | Text painted inside the track (head / tail).              |
| fillBackground            | `string`                                                            | `''`        | Custom fill background (ignored by aurora).               |
| barBackground             | `string`                                                            | `''`        | Custom track background (any CSS background).             |
| knobShape                 | `'round' \| 'circle' \| 'square' \| 'pill'`                         | `'round'`   | Knob silhouette (rounded rect / disc / square / capsule). |
| knobSize                  | `string \| number`                                                  | `''`        | Explicit diameter — number = rpx, `"28px"` honoured.      |
| knobColor                 | `string`                                                            | `''`        | Knob fill colour — empty uses the theme thumb (white).    |
| knobBorderColor           | `string`                                                            | `''`        | Knob outline colour — empty uses the theme action colour. |
| knobBorderWidth           | `string`                                                            | `''`        | Knob outline width (CSS length) — empty uses 4rpx.        |
| knobRadius                | `string`                                                            | `''`        | Knob corner radius — empty uses the shape default.        |
| knobIcon                  | `string`                                                            | `''`        | Glyph inside the knob — any `sn-icon` name.               |
| knobIconColor             | `string`                                                            | `''`        | Glyph colour — empty follows the knob ring.               |
| knobIconSize              | `string \| number`                                                  | `''`        | Glyph size (number = rpx) — empty = 56 % of the knob.     |
| gradient                  | `string`                                                            | `''`        | Aurora gradient.                                          |
| sparkles                  | `number`                                                            | `14`        | Aurora star density (0 = off).                            |
| animated                  | `boolean`                                                           | `true`      | Aurora drift / twinkle.                                   |
| innerColor                | `string`                                                            | `''`        | In-track text / glyph colour when filled.                 |
| innerColorEmpty           | `string`                                                            | `''`        | In-track colour at value 0.                               |
| fade                      | `boolean`                                                           | `true`      | Column: fade the empty part.                              |
| tooltipOnly               | `boolean`                                                           | `false`     | Column: read from the caption only.                       |
| ariaLabel                 | `string`                                                            | `''`        | Accessible name.                                          |
| customClass / customStyle | `string`                                                            | `''`        | Root class / inline style.                                |

## Slots

| Slot  | Notes                                             |
| ----- | ------------------------------------------------- |
| start | Head glyph before the track.                      |
| end   | Tail glyph after the track.                       |
| icon  | Glyph painted inside the track.                   |
| knob  | Custom knob content (`index` / `value`).          |
| value | Read-out content (`value` / `percent` / `level`). |

## Knob look (reference)

The default knob is a white chip ringed in the theme action colour
(`--sn-mp-color-action-primary`) — the modern capsule-slider look with a
`Volume 48` read-out, a `range` pair, and a vertical `column` trio.

Geometry is derived from the track thickness `t` (all rpx, so it scales):

| Shape             | Along the travel axis | Across it | Radius  |
| ----------------- | --------------------- | --------- | ------- |
| `round` (default) | 1.30 t                | 1.00 t    | 32 %    |
| `circle`          | 1.00 t                | 1.00 t    | 50 %    |
| `square`          | 1.00 t                | 1.00 t    | 26 %    |
| `pill`            | 0.82 t                | 0.55 t    | capsule |

`knob-size` overrides the table entirely (one explicit square diameter, the
shape only decides the radius); `circle` is a square with a 50 % radius, so
`knob-shape="circle" :knob-size="56"` is a 56 rpx disc.

To change the silhouette or colour, use the additive shape props:

- `knob-shape="circle"` — a true disc (equal width and height, full round).
- `knob-shape="square"` — enclosed square chip (the orange "Volume 40"
  reference); add `knob-radius="50%"` for the dark disc of the "Battery 65"
  reference.
- `knob-shape="pill"` — narrow capsule inside the track ("Mood 70").
- `knob-size` — one explicit diameter for all shapes (number → rpx,
  `"28px"` / `"1.75rem"` also accepted).
- `knob-color` / `knob-border-color` / `knob-border-width` / `knob-radius` —
  recolor and reshape the knob (e.g. a dark knob with a green ring over a
  rainbow fill).
- `bar-background` — paint the track (e.g. a rainbow gradient), while
  `fill-background` / `theme="aurora"` paint the filled portion.

All six props are plain CSS values injected as vars (`--sn-bar-knob-*`); the
knob travel / range / column geometry is unchanged, so existing usages keep
working and every new look is a pure style override.

## Knob glyph

`knob-icon` paints an `sn-icon` inside the thumb — any registry name, the
111-name built-in catalogue (`star`, `heart`, `minus`, `plus`, `check`,
`trending-up`, …) or a `prefix:rest` provider id:

```html
<SnSliderBar v-model="volume" knob-shape="circle" knob-icon="star" />
<SnSliderBar v-model="mood" knob-shape="circle" knob-icon="heart" knob-icon-color="#f43f5e" />
<SnSliderBar v-model="zoom" knob-icon="plus" knob-icon-size="12px" />
```

- **Colour** — `knob-icon-color` wins; empty falls back to the theme ring
  (`--sn-bar-knob-border-color`), so a themed bar gets a themed glyph for free.
- **Size** — `knob-icon-size` (number = rpx, `"12px"` honoured); empty is 56 %
  of the knob's short side, which keeps the glyph clear of the 4rpx ring and
  scales with `size` / `knob-size`.
- **Slot** — `#knob` overrides the glyph (`v-slot:knob="{ index, value }"`) for
  a fully custom thumb.
- The glyph is decoration: `pointer-events: none` so a press always reaches the
  thumb, and the slider role / aria values stay on the thumb itself. Without
  `knob-icon` no node is emitted at all (the chip stays plain).

## Travel band (the knob never leaves the track)

The knob centre travels along the track **inset by half a knob at both ends**,
so value 0 puts the knob's outer edge exactly on the left cap of the capsule and
`max` on the right cap — no value can push the thumb past the track or the card.

The inset is folded into a per-value **margin**, never into a container:
`left: p%` puts the centre on the raw track, `margin-left: half·(1 − 2p)` pulls
it back in. The knob box therefore always stays inside its layer.

> Do **not** go back to an inset wrapper around the thumbs. uni-app x computes
> `overflow: hidden` on every `view` by default, so an inset layer clips exactly
> the half-knob it exists to protect — the thumb renders as a half-disc "C" with
> a flat cut edge and a grey sliver of track outside it (H5 of uni-app x and
> App both did this). Same reason the values ride a `--sn-bar-knob-shift` var
> instead of a literal `margin-left: 26rpx`: `rpx` is not a browser unit, and
> any host that parses the style string first drops the declaration.

Only the fill keeps an inset layer (`.sn-slider-bar__travel--fill`): there,
0 %…100 % already means "knob centre", so the fill always stops under the thumb.
The fill's single-value variant bleeds back over the left inset
(`left: var(--sn-bar-knob-hw-neg)`) so its round end tucks under the cap — the
one place that still needs `overflow: visible`. Range fills are painted strictly
`start → end` inside the band. Level ticks use the same shift, so a dot at 0 or
100 % sits under the thumb instead of on the capsule's edge. Drag math uses the
same inset rect (`valueRect`), so the finger and the rendered thumb agree at
both extremes.

### uni-app x flattener contract (why the base rule repeats `left: 0`)

The `.uvue` pipeline has no descendant selectors: `.a .b { … }` is flattened
into `--snx-a-b-prop` on the container plus `prop: var(--snx-…-prop, <base>)`.
The fallback is copied from the **base rule** — so every property a variant
branch overrides (`left` / `right` / `top` / `bottom` / `margin-bottom` …) must
also be declared in the base rule, even when the value is 0.

Miss it once and the emitted declaration is a fallback-less
`left: var(--snx-…)`, which is invalid at computed-value time → `left: auto` →
the layer collapses to zero width → every `left: p%` inside resolves to 0 and
the bar cannot be dragged at all (the thumb visibly parks on the left edge).
`.sn-slider-bar__travel--knobs`, `--fill` and `.sn-slider-bar__knob` therefore
declare both axes explicitly; `dist/components/sn-slider-bar/sn-slider-bar.uvue`
should always show `left: var(--snx-…-travel--knobs-left, 0)` with the `0`.

## Themes

`theme` repaints three vars — `--sn-bar-track` / `--sn-bar-fill` /
`--sn-bar-knob-border-color` — and therefore never touches geometry:

| Theme     | Track             | Fill                        | Ring      |
| --------- | ----------------- | --------------------------- | --------- |
| `default` | `trackBackground` | `fillBackground` / action   | action    |
| `aurora`  | `trackBackground` | `gradient` + drifting stars | action    |
| `ocean`   | cyan 16 %         | `#06b6d4 → #2563eb`         | `#0ea5e9` |
| `sunset`  | orange 18 %       | `#fb923c → #f43f5e`         | `#fb7185` |
| `grape`   | violet 18 %       | `#8b5cf6 → #d946ef`         | `#8b5cf6` |
| `mono`    | slate 22 %        | `#64748b`                   | `#64748b` |

Explicit props win: `bar-background` / `fill-background` /
`knob-border-color` always override what the preset would paint.

## Two colour states

In-track text / glyph colour follows the value: filled → `innerColor`
(default white on the aurora gradient), empty (value 0) → `innerColorEmpty`
(the muted hint). The swap is a CSS colour transition.

## Dragging

The gesture lives in `sn-slider-bar-drag.ts` and behaves the same on every
target:

- **Grab the knob, keep the offset.** The thumb keeps its position under the
  finger instead of snapping to it, so the first move never jumps.
- **Press the track to jump.** The nearest knob jumps to the press point (the
  closer of the two in `range` mode) and keeps following from there.
- **1 commit per frame.** Moves are coalesced and skipped when the snapped
  value did not change, and the geometry renders from a local drag value, so a
  controlled `v-model` parent cannot make the thumb lag behind the finger.
- **One box measurement per gesture.** The track rect is read once (mount, size
  / `variant` / `range` change, press) — never per move.
- **A press that lands before the box is known still starts the drag.** Hosts
  without synchronous element geometry (mini-programs, App) answer the
  measurement asynchronously; the gesture waits for it instead of being dropped,
  and the move that arrived meanwhile is applied once it resolves.
- **The gesture owns the touch.** `touchmove` is bound with `stop` + `prevent`
  (`catchtouchmove` in mini-programs): without it the page scrolls, the host
  cancels the touch, and the thumb stops dead half-way ("拉不动").
- **Desktop H5 drags with the mouse.** `mousedown` is taken on `document` and
  the press is claimed by hit-testing the track box, not by an element ref —
  refs resolve to a component instance on uni H5 and to a `UniElement` on
  uni-app x H5, so an `instanceof HTMLElement` bind silently disabled desktop
  dragging. Touch and mouse share one engine.

## uni notes

- The track box is resolved in this order: `document.getElementById` on the
  per-instance track id (works on uni H5 _and_ uni-app x H5), then the template
  ref, then `uni.createSelectorQuery('#id')` on mini-programs / App. Geometry is
  percentage-based, so rpx scaling is free.
- Animations are CSS keyframes (drift / twinkle) — no JS timers, so H5 and
  mini-program both run them on the render layer. They pause while a drag owns
  the bar so the two never compete for the main thread.
- `barHeight` (not `height`) carries the explicit height: `height` collides
  with the `view` attribute.

## Out of scope

Marks / extreme-value captions (use `sn-slider`) and the web-end contract.
