# Captcha (uni-end / mobile)

`sn-captcha` is the `@snui/uni` jigsaw slider captcha: drag the puzzle piece onto the gap; releasing inside `tolerance` emits `success`, otherwise `fail` shakes the piece back. It appears as a popup by default (full-screen scrim + centred panel, with built-in refresh and close buttons); `inline` renders it directly in the page flow for in-place form verification. Auto-registered via easycom (`components/sn-captcha/sn-captcha.vue` → `<sn-captcha>`); geometry uses `rpx` and every colour resolves through `--sn-mp-*` tokens.

## When to use

- You need an interactive "prove you are human" check: drag the piece onto the gap.
- In-place form verification: use `inline` to embed the block in a form without interrupting the user.
- Risk tiering: run the cheap slider (`sn-slide-verify`) first and escalate to the puzzle only when needed.

Not for: behavioural sliders (use `sn-slide-verify`), SMS / image code entry (host business), or server-side ticket validation (the host must do it).

## Demos

### Basic usage

`v-model` controls visibility; `src` is the background; `success` / `fail` report the verdict, and the popup closes itself after a pass.

<Demo name="captcha-mp-basic" description="Jigsaw captcha: open with v-model, drag the piece onto the gap, success / fail callbacks." />

### Inline display

`inline` renders the block in the page flow: no scrim, no close button, and no auto close — it stays on the passed state and the host decides what happens next. `v-model` does not drive visibility in this mode.

<Demo name="captcha-mp-verify" description="Inline mode: the puzzle sits in the page and reports success when solved." />

### Tap to open

The default shape: a trigger opens the scrim popup; `closeOnClickModal` controls scrim-close and `refreshable` controls the refresh button:

<Demo name="captcha-mp-popup" description="Popup form; the two behaviours of close-on-click-modal and refreshable." />

### Two-stage verification (slider chain)

A cheap slider first, escalating to the puzzle once it passes — the common risk-tiering path. The chain passes only when both stages pass:

<Demo name="captcha-mp-interaction" description="Combined with sn-slide-verify: the slider unlocks the puzzle; both passing clears the chain." />

### Custom copy / size / tolerance

Override the hint and success copy; resize the stage; widen the tolerance; lock the scrim.

<Demo name="captcha-mp-custom" description="Custom tips / size / tolerance / locked scrim." />

## Implementation notes

- **No canvas**: the gap is a translucent socket and the piece shows the *source slice* at the target position (CSS translate clipping) — seamless when aligned, identical on H5 and miniprogram.
- The refresh button is built into the panel's top-right corner.
- Only geometric alignment is verified; real bot protection still needs a server-side check.
- Desktop H5 also supports mouse dragging through the same offset math as touch.

## Dragging and measurement

- The piece only travels horizontally; the offset and the gap position are in **design px** (`1 design px = 2rpx`). Pointer deltas are converted with the host rpx basis (effective viewport capped at 960px, 375px base), so the piece tracks the finger / cursor 1:1 on any viewport.
- The stage width comes from the DOM box first, from `uni.createSelectorQuery()` on hosts without a DOM (miniprogram / App), and from the `width` prop as the last resort — the piece never ends up frozen at x = 0.
- Desktop browsers get a second input channel: a mouse drag that defers to a live touch gesture so the two never double-drive.

## Props

| Prop                          | Type      | Default | Description                                                     |
| ----------------------------- | --------- | ------- | --------------------------------------------------------------- |
| `v-model`                     | `boolean` | `false` | Popup visibility (ignored when `inline`)                        |
| `src`                         | `string`  | `''`    | Background image (network / package path, no base64)            |
| `width`                       | `number`  | `300`   | Max stage width (design px); also the travel base when unmeasurable |
| `height`                      | `number`  | `200`   | Stage height (design px)                                        |
| `tips`                        | `string`  | `''`    | Hint text (empty = built-in)                                    |
| `successText`                 | `string`  | `''`    | Success text (empty = built-in)                                 |
| `tolerance`                   | `number`  | `10`    | Snap tolerance (design px)                                      |
| `zIndex`                      | `number`  | `100`   | Popup stacking level (no effect when `inline`)                  |
| `closeOnClickModal`           | `boolean` | `true`  | Close on scrim tap                                              |
| `refreshable`                 | `boolean` | `true`  | Show the refresh button                                         |
| `inline`                      | `boolean` | `false` | Render in the page flow: no scrim, no close, no auto close      |
| `customClass` / `customStyle` | `string`  | `''`    | Root class / inline style                                       |

## Events

| Event     | Description                             | Payload |
| --------- | --------------------------------------- | ------- |
| `success` | Released within `tolerance` of target X | —       |
| `fail`    | Released off target (shake + snap back) | —       |
| `refresh` | Refresh button tapped (gap re-rolled)   | —       |
| `close`   | Popup closed (manual or after success)  | —       |

## Exposed API

| Member                        | Signature    | Description                      |
| ----------------------------- | ------------ | -------------------------------- |
| `init`                        | `() => void` | Re-measure the stage width       |
| `refresh`                     | `() => void` | Re-roll the hole, reset piece    |
| `reset`                       | `() => void` | Reset the piece and the verdict  |
| `target` / `offset` / `state` | `Ref`        | Position & state (debug / tests) |

## Slots

This component provides no slots.

## Theme variables

| Variable                                              | Purpose                                    |
| ----------------------------------------------------- | ------------------------------------------ |
| `--sn-mp-color-background-overlay`                     | Popup scrim                                |
| `--sn-mp-color-background-elevated`                    | Panel surface                              |
| `--sn-mp-color-background-surface`                     | Inline-mode surface                        |
| `--sn-mp-color-background-soft`                        | Stage backdrop before the image loads      |
| `--sn-mp-color-feedback-success`                       | Passed-state border and copy               |
| `--sn-mp-color-text-primary`                           | Doodle-skin outline                        |
| `--sn-mp-radius-lg` / `-md` / `-sm` / `-full`          | Panel / stage / piece / round buttons      |
| `--sn-mp-shadow-lg` / `--sn-mp-shadow-md`              | Panel and piece elevation                  |

## AI Patch Boundary

- AI may patch display configs such as `src` / `tips` / `successText` / `width` / `height` / `tolerance` / `inline` / `closeOnClickModal` / `refreshable`.
- `success` / `fail` / `refresh` / `close` are runtime verification results; patches must not fake a pass or skip the check.
- `zIndex` is a host-level decision; patches must not raise global stacking casually.

## Accessibility

Root `role="dialog"` + `aria-modal` (`inline` switches to `role="group"` without `aria-modal`), `aria-label` follows the hint text; the piece / refresh / close controls all carry `role="button"` and `aria-label`, and the gap is decorative (`aria-hidden`).

## Dark mode

Panel, borders and the success colour all come from `--sn-mp-color-*` with no light `var()` fallback, so it adapts under `.sn-theme-dark`. Verify by wrapping in `sn-config-provider` with `theme="dark"`.
