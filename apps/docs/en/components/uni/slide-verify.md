# SlideVerify · uni-app

`sn-slide-verify` is the drag-to-confirm slider of `@snui/uni`: the handle must reach the right edge (minus `tolerance`) before `success` fires. easycom auto-registration (`components/sn-slide-verify/sn-slide-verify.vue` → `<sn-slide-verify>`); geometry in `rpx`. The track width is measured once on mount (`onMounted` → one `getBoundingClientRect`); call the exposed `init()` after a layout change. No observer, no timer.

## Basic usage

Drag-to-confirm: reaching the right edge (within `tolerance`) fires `success`; a short drag fires `fail` and snaps back.

<Demo name="slide-verify-mp-basic" description="Drag-to-confirm: reaching the right edge (within `tolerance`) fires `success`; a short drag fires `fail` and snaps back." />

## Copy, colors & disabled (`text` / `successText` / `backgroundColor` / `disabled`)

`text` / `successText` override the built-in copy; `backgroundColor` / `activeBackgroundColor` override the track; `disabled` blocks dragging.

<Demo name="slide-verify-mp-custom" description="`text` / `successText` override the built-in copy; `backgroundColor` / `activeBackgroundColor` override the track; `disabled` blocks dragging." />

## Icon glyphs & root styling (`icon` / `successIcon` / `iconPrefix` / `cssIcon` / `iconSize` / `successIconSize` / `tolerance` / `customClass` / `customStyle`)

Without a name the built-in SVG glyphs render; a name goes through the iconfont convention (`icon-prefix` + `-` + name) and `css-icon` treats the name as a bare class; `icon-size` / `success-icon-size` size the two glyph boxes independently. `tolerance` widens the right-edge slack; `custom-class` / `custom-style` land on the root.

<Demo name="slide-verify-mp-icons" description="`icon` / `successIcon` follow the iconfont convention; `cssIcon` renders as a bare class; `iconSize` / `successIconSize` size the two glyphs independently; `tolerance` widens the slack; `customClass` / `customStyle` land on the root." />

## Props

| Prop                                        | Type      | Default | Description                            |
| ------------------------------------------- | --------- | ------- | -------------------------------------- |
| `tolerance`                                 | `number`  | `10`    | Pixels of slack at the right edge      |
| `text` / `successText`                      | `string`  | `''`    | Hint / success copy (empty = built-in) |
| `disabled`                                  | `boolean` | `false` | Blocks dragging                        |
| `backgroundColor` / `activeBackgroundColor` | `string`  | `''`    | Track colors                           |
| `customClass` / `customStyle`               | `string`  | `''`    | Root class / inline style              |

> **Not implemented**: The puzzle-piece background (needs canvas) and the free-form icon props (`icon` / `successIcon` / `iconPrefix` / `cssIcon` / `iconSize` / `successIconSize`) — the two glyphs are fixed and replaced through the `icon` / `success-icon` slots. This build verifies distance only, so it is a "confirm you are human" gesture, not a bot filter.

## Events

| Event     | Description                              | Payload |
| --------- | ---------------------------------------- | ------- |
| `success` | The handle reached the end               | —       |
| `fail`    | The handle was released short of the end | —       |

## Exposed API

| Member  | Signature    | Description                    |
| ------- | ------------ | ------------------------------ |
| `init`  | `() => void` | Re-measure the track width     |
| `reset` | `() => void` | Return the handle to the start |

## Slots

| Slot           | Description         |
| -------------- | ------------------- |
| `text`         | Custom hint text    |
| `success-text` | Custom success text |
| `icon`         | Custom handle icon  |
| `success-icon` | Custom success icon |

## Theme tokens

| Token                                 | Purpose                      |
| ------------------------------------- | ---------------------------- |
| `--sn-mp-color-background-soft`       | Track fill                   |
| `--sn-mp-color-feedback-success-soft` | Verified track fill          |
| `--sn-mp-color-feedback-success`      | Verified text + handle glyph |
| `--sn-mp-color-background-elevated`   | Handle plate                 |
| `--sn-mp-color-action-primary`        | Idle handle glyph            |
| `--sn-mp-color-text-tertiary`         | Hint text                    |
| `--sn-mp-radius-md`                   | Track + handle corners       |
| `--sn-mp-shadow-sm`                   | Handle shadow                |

## Accessibility

- Root is `role="group"` with `aria-label` carrying the hint text.
- The handle is `role="button"` with `aria-label`; `tabindex="-1"` when disabled or verified.
- The track carries `aria-disabled`.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:
