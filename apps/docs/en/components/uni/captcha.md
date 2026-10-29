# Captcha (uni-end / mobile)

`sn-captcha` is the `@snui/uni` jigsaw slider captcha: drag the puzzle piece onto the gap; releasing inside `tolerance` emits `success`, otherwise `fail` shakes the piece back. Popup form (full-screen scrim + centred panel) with a built-in refresh and close button. Auto-registered via easycom (`components/sn-captcha/sn-captcha.vue` → `<sn-captcha>`); geometry uses `rpx`. The stage width is measured once on open / mount (`init()` re-measures).

## Differences from lime-ui `l-captcha`

- **No canvas**: lime slices the hole out of the image with a canvas; miniprogram canvas layering and H5 consistency make that the least portable path. Here the hole is a translucent dashed socket and the piece shows the *source slice* at the target position (CSS translate clipping) — seamless when aligned, identical on H5 and MP.
- `refresh` is a built-in top-right button (lime customises it via a slot).
- Only geometric alignment is verified; bot protection still requires a server-side check (same premise as lime).

## Basic usage

`v-model` controls visibility; `src` is the background; `success` / `fail` drive your business flow.

<Demo name="captcha-mp-basic" description="Jigsaw captcha: open with v-model, drag the piece onto the gap, success / fail callbacks." />

## Customisation (`tips` / `successText` / `width` / `height` / `tolerance` / `closeOnClickModal`)

Override the hint and success copy; resize the stage; widen the tolerance; lock the scrim.

<Demo name="captcha-mp-custom" description="Custom tips / size / tolerance / locked scrim." />

## Props

| Prop                | Type      | Default | Description                                  |
| ------------------- | --------- | ------- | -------------------------------------------- |
| `v-model`           | `boolean` | `false` | Popup visibility                             |
| `src`               | `string`  | `''`    | Background image (network / package path)    |
| `width`             | `number`  | `300`   | Max stage width (design px)                  |
| `height`            | `number`  | `200`   | Stage height (design px)                     |
| `tips`              | `string`  | `''`    | Hint text (empty = built-in)                 |
| `successText`       | `string`  | `''`    | Success text (empty = built-in)              |
| `tolerance`         | `number`  | `10`    | Snap tolerance (px)                          |
| `zIndex`            | `number`  | `100`   | Popup stacking level                         |
| `closeOnClickModal` | `boolean` | `true`  | Close on scrim tap                           |
| `refreshable`       | `boolean` | `true`  | Show the refresh button                      |
| `customClass` / `customStyle` | `string` | `''` | Root class / inline style            |

## Events

| Event     | Description                              | Payload |
| --------- | ---------------------------------------- | ------- |
| `success` | Released within `tolerance` of target X  | —       |
| `fail`    | Released off target (shake + snap back)  | —       |
| `refresh` | Hole position re-rolled                  | —       |
| `close`   | Popup closed (manual or after success)   | —       |

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

## Accessibility

Root `role="dialog"` + `aria-modal`, `aria-label` follows the hint text; the piece / refresh / close controls all carry `role="button"` and `aria-label`.
