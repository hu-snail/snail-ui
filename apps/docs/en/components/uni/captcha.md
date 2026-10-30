# Captcha (uni-end / mobile)

`sn-captcha` is the `@snui/uni` jigsaw slider captcha: drag the puzzle piece onto the gap; releasing inside `tolerance` emits `success`, otherwise `fail` shakes the piece back. It appears as a popup by default (full-screen scrim + centred panel, with built-in refresh and close buttons), and `inline` renders it directly in the page flow. Auto-registered via easycom (`components/sn-captcha/sn-captcha.vue` → `<sn-captcha>`); geometry uses `rpx`. The stage width is measured once on open / mount (`init()` re-measures).

## Implementation notes

- **No canvas**: the gap is a translucent socket and the piece shows the *source slice* at the target position (CSS translate clipping) — seamless when aligned, identical on H5 and miniprogram.
- The refresh button is built into the panel's top-right corner.
- Only geometric alignment is verified; real bot protection still needs a server-side check.
- Desktop H5 also supports mouse dragging through the same offset math as touch.

## Basic usage

`v-model` controls visibility; `src` is the background; `success` / `fail` drive your business flow.

<Demo name="captcha-mp-basic" description="Jigsaw captcha: open with v-model, drag the piece onto the gap, success / fail callbacks." />

## Inline form

`inline` renders the block in the page flow (no scrim, no focus stealing), which suits in-place form verification:

<Demo name="captcha-mp-verify" description="Inline mode: the puzzle sits in the page and reports success when solved." />

## Tap to open

The default shape: a trigger opens the scrim popup; `closeOnClickModal` controls scrim-close and `refreshable` controls the refresh button:

<Demo name="captcha-mp-popup" description="Popup form; the two behaviours of close-on-click-modal and refreshable." />

## Two-stage verification (slider chain)

A cheap slider first, escalating to the puzzle once it passes — the common risk-tiering path. The chain passes only when both stages pass:

<Demo name="captcha-mp-interaction" description="Combined with sn-slide-verify: the slider unlocks the puzzle; both passing clears the chain." />

## Customisation (`tips` / `successText` / `width` / `height` / `tolerance` / `closeOnClickModal`)

Override the hint and success copy; resize the stage; widen the tolerance; lock the scrim.

<Demo name="captcha-mp-custom" description="Custom tips / size / tolerance / locked scrim." />

## Props

| Prop                          | Type      | Default | Description                                   |
| ----------------------------- | --------- | ------- | --------------------------------------------- |
| `v-model`                     | `boolean` | `false` | Popup visibility (`inline` = solved state)    |
| `src`                         | `string`  | `''`    | Background image (network / package path)     |
| `width`                       | `number`  | `300`   | Max stage width (design px)                   |
| `height`                      | `number`  | `200`   | Stage height (design px)                      |
| `tips`                        | `string`  | `''`    | Hint text (empty = built-in)                  |
| `successText`                 | `string`  | `''`    | Success text (empty = built-in)               |
| `tolerance`                   | `number`  | `10`    | Snap tolerance (px)                           |
| `zIndex`                      | `number`  | `100`   | Popup stacking level                          |
| `closeOnClickModal`           | `boolean` | `true`  | Close on scrim tap                            |
| `refreshable`                 | `boolean` | `true`  | Show the refresh button                       |
| `inline`                      | `boolean` | `false` | Render in the page flow (no scrim, no focus)  |
| `customClass` / `customStyle` | `string`  | `''`    | Root class / inline style                     |

## Events

| Event     | Description                             | Payload |
| --------- | --------------------------------------- | ------- |
| `success` | Released within `tolerance` of target X | —       |
| `fail`    | Released off target (shake + snap back) | —       |
| `refresh` | Hole position re-rolled                 | —       |
| `close`   | Popup closed (manual or after success)  | —       |

## Exposed API

| Member                        | Signature    | Description                      |
| ----------------------------- | ------------ | -------------------------------- |
| `init`                        | `() => void` | Re-measure the stage width       |
| `refresh`                     | `() => void` | Re-roll the hole, reset piece    |
| `reset`                       | `() => void` | Reset the piece and the verdict  |
| `target` / `offset` / `state` | `Ref`        | Position & state (debug / tests) |

## Theme variables

| Variable            | Purpose                                             |
| ------------------- | --------------------------------------------------- |
| `--sn-mp-*` aliases | Panel / radius / shadow / success colour all come from global tokens — no component-private colour variables |

## AI Patch Boundary

- AI may patch display configs such as `src` / `tips` / `successText` / `width` / `height` / `tolerance` / `inline` / `closeOnClickModal` / `refreshable`.
- `success` / `fail` / `refresh` / `close` are runtime verification results; patches must not fake a pass or skip the check.
- `zIndex` is a host-level decision; patches must not raise global stacking casually.

## Accessibility

Root `role="dialog"` + `aria-modal` (`inline` switches to `role="group"` without `aria-modal`), `aria-label` follows the hint text; the piece / refresh / close controls all carry `role="button"` and `aria-label`.

## Dark mode

Panel, borders and the success colour all come from `--sn-mp-color-*` with no light `var()` fallback, so it adapts under `.sn-theme-dark`. Verify by wrapping in `sn-config-provider` with `theme="dark"`.
