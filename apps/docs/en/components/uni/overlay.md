# Overlay · uni-app

`sn-overlay` is the full-screen scrim of `@snui/uni` (mobile / miniprogram / H5): a translucent layer that can host centred content, with a fade in / out animation and a "tap the scrim emits `click`" contract. Auto-registered through easycom (`components/sn-overlay/sn-overlay.vue` → `<sn-overlay>`); geometry uses `rpx`.

## Basic usage

`show` controls visibility; a scrim tap emits `click`, and the consumer decides whether to close.

<Demo name="overlay-mp-basic" description="Scrim taps are counted; content on the scrim uses @tap.stop to keep the scrim open." />

## Animation and scroll lock

- `duration` accepts a number (ms), `false` (no animation) or `{ enter, leave }` (per leg)
- `lockScroll` (default `true`) intercepts `touchmove` on the scrim — the same effect as uni-app's `catchtouchmove`
- `zIndex` is written straight into the root `style`
- `customStyle` / `customClass` are forwarded to the root

<Demo name="overlay-mp-config" description="duration=false / duration=800 + zIndex / lockScroll=false + customStyle." />

## Props

| Prop          | Type                                          | Default | Description                                                                   |
| ------------- | --------------------------------------------- | ------- | ----------------------------------------------------------------------------- |
| `show`        | `boolean`                                     | `false` | Whether the overlay is shown                                                  |
| `duration`    | `number \| boolean \| Record<string, number>` | `300`   | Animation duration; `false` disables, an object sets enter / leave separately |
| `lockScroll`  | `boolean`                                     | `true`  | Lock background scroll                                                        |
| `zIndex`      | `number`                                      | `10`    | Stacking level                                                                |
| `customStyle` | `string`                                      | `''`    | Root inline style                                                             |
| `customClass` | `string`                                      | `''`    | Root class                                                                    |

## Events

| Event          | Description                | Payload          |
| -------------- | -------------------------- | ---------------- |
| `click`        | The overlay was tapped     | `(event: Event)` |
| `before-enter` | Before the enter animation | —                |
| `enter`        | Enter animation started    | —                |
| `after-enter`  | Enter animation finished   | —                |
| `before-leave` | Before the leave animation | —                |
| `leave`        | Leave animation started    | —                |
| `after-leave`  | Leave animation finished   | —                |

## Slots

| Slot      | Description                                    |
| --------- | ---------------------------------------------- |
| `default` | Content rendered on top of the scrim (centred) |

## Tokens

| Variable                           | Purpose                           |
| ---------------------------------- | --------------------------------- |
| `--sn-mp-color-background-overlay` | Scrim color                       |
| `--sn-mp-color-text-on-primary`    | Content text color over the scrim |

## Accessibility

- Root carries `data-snui-component="overlay"`; the whole scrim is the tap target
- Decorative by default — the content inside carries the accessible name
- Interaction uses `@tap`; no keyboard focus trap on mobile

## Dark mode

The scrim uses `--sn-mp-color-background-overlay`, already overridden in the `.sn-theme-dark` block of `@snui/tokens-mp/styles` (a deeper near-black), so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:

## Related

- Panel with anchor animations: [`sn-popup`](/en/components/uni/popup)
