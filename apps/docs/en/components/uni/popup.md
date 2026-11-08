# Popup · uni-app

`sn-popup` is the popup layer of `@snui/uni` (mobile / miniprogram / H5): a scrim plus a panel anchored by `position`, with enter / leave animations and a close-on-scrim-tap contract. Auto-registered through easycom (`components/sn-popup/sn-popup.vue` → `<sn-popup>`); geometry uses `rpx`, so it scales across devices.

## Basic usage

`v-model` controls visibility. `position="bottom"` is the common bottom sheet; `round` adapts the corners to the anchor (bottom → top corners only).

<Demo name="popup-mp-basic" description="Bottom sheet (bottom + round) and a centered popup (center + closable close button)." />

## Positions

`position` accepts `center` / `top` / `right` / `bottom` / `left`. When `transition` is omitted the animation follows the anchor: bottom → `slide-up`, top → `slide-down`, left → `slide-right`, right → `slide-left`, center → `fade`.

<Demo name="popup-mp-position" description="All five anchors with their auto-matched enter / leave animations." />

## Scrim and close behaviour

- `modal=false` renders no scrim (the panel still sits inside the viewport)
- `closeOnClickModal=false` still emits `click-modal` on a scrim tap but keeps the popup open
- `closable` renders the close button in the panel's top-right corner
- `hideWhenClose=false` keeps the node after closing (only adds `sn-popup--hidden`)

<Demo name="popup-mp-config" description="modal / closeOnClickModal / transition + duration, plus the animation events." />

## Locking background scroll

`lockScroll` (default `true`) intercepts the `touchmove` gesture on the scrim and calls `preventDefault()` — the same effect as uni-app's `catchtouchmove`. Miniprogram has no `document`, so no global listener is registered and there is nothing to unbind (AGENTS.md §41).

## Styles, lazy render and safe area

- `modalStyle` writes the scrim inline style and `customStyle` the panel inline style
- `lazyRender` (default `true`): panel content is not rendered before the first open; `false` renders it as soon as the popup mounts
- `safeAreaInsetBottom`: pads the bottom sheet for `env(safe-area-inset-bottom)`
- `rootPortal` is declared for parity only — miniprogram has no portal host
- `lockScroll` (default `true`) intercepts `touchmove` on the scrim; `hideWhenClose` (default `true`) removes the node after closing
- `zIndex` sets the stacking level

<Demo name="popup-mp-surface" description="Scrim inline style / panel inline style + safe area / lazy-render=false." />

<Demo name="popup-mp-scroll" description="lock-scroll=false / hide-when-close=false / zIndex=200 with leave events." />

## Props

| Prop                  | Type                                                                                                                                                          | Default    | Description                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------- |
| `modelValue`          | `boolean`                                                                                                                                                     | `false`    | Visibility (`v-model`)                                                        |
| `transition`          | `'fade' \| 'fade-up' \| 'fade-down' \| 'fade-left' \| 'fade-right' \| 'slide-up' \| 'slide-down' \| 'slide-left' \| 'slide-right' \| 'zoom-in' \| 'zoom-out'` | `''`       | Animation name; empty derives one from `position`                             |
| `closable`            | `boolean`                                                                                                                                                     | `false`    | Show the close button                                                         |
| `position`            | `'center' \| 'top' \| 'right' \| 'bottom' \| 'left'`                                                                                                          | `'center'` | Panel anchor                                                                  |
| `closeOnClickModal`   | `boolean`                                                                                                                                                     | `true`     | Scrim tap closes the popup                                                    |
| `duration`            | `number \| boolean \| Record<string, number>`                                                                                                                 | `300`      | Animation duration; `false` disables, an object sets enter / leave separately |
| `modal`               | `boolean`                                                                                                                                                     | `true`     | Render the scrim                                                              |
| `zIndex`              | `number`                                                                                                                                                      | `10`       | Stacking level                                                                |
| `hideWhenClose`       | `boolean`                                                                                                                                                     | `true`     | Remove the node on close                                                      |
| `modalStyle`          | `string`                                                                                                                                                      | `''`       | Inline style for the scrim                                                    |
| `safeAreaInsetBottom` | `boolean`                                                                                                                                                     | `false`    | Pad the bottom sheet for the device safe area                                 |
| `lazyRender`          | `boolean`                                                                                                                                                     | `true`     | Defer panel content rendering                                                 |
| `lockScroll`          | `boolean`                                                                                                                                                     | `true`     | Lock background scroll                                                        |
| `round`               | `boolean`                                                                                                                                                     | `false`    | Rounded corners, adapted to the anchor                                        |
| `customClass`         | `string`                                                                                                                                                      | `''`       | Custom class for the root node                                                |
| `customStyle`         | `string`                                                                                                                                                      | `''`       | Custom style for the panel                                                    |

> **Not implemented:** `root-portal` (escaping the page tree to fix a broken `fixed`). uni-app miniprogram has no portal host, so a popup cannot be reparented to the page root — avoid `sn-popup` inside a transformed ancestor.

## Events

| Event               | Description                                                         | Payload            |
| ------------------- | ------------------------------------------------------------------- | ------------------ |
| `update:modelValue` | Emitted when the component closes itself (close button / scrim tap) | `(value: boolean)` |
| `close`             | The user closed the popup                                           | —                  |
| `click-modal`       | Scrim tapped (fires even when `closeOnClickModal` is `false`)       | —                  |
| `before-enter`      | Before the enter animation                                          | —                  |
| `enter`             | Enter animation started                                             | —                  |
| `after-enter`       | Enter animation finished                                            | —                  |
| `before-leave`      | Before the leave animation                                          | —                  |
| `leave`             | Leave animation started                                             | —                  |
| `after-leave`       | Leave animation finished                                            | —                  |

## Slots

| Slot      | Description                                                           |
| --------- | --------------------------------------------------------------------- |
| `default` | Panel content (rendered after the first open when `lazyRender` is on) |

## Tokens

| Variable                            | Purpose            |
| ----------------------------------- | ------------------ |
| `--sn-mp-color-background-overlay`  | Scrim color        |
| `--sn-mp-color-background-elevated` | Panel background   |
| `--sn-mp-color-text-primary`        | Panel text         |
| `--sn-mp-color-text-secondary`      | Close-button glyph |
| `--sn-mp-radius-xl`                 | `round` corners    |
| `--sn-mp-font-line-height-normal`   | Panel line height  |

## Accessibility

- Panel carries `role="dialog"` + `aria-modal="true"`
- Scrim is `aria-hidden="true"` (decorative; the panel carries the semantics)
- Close button carries `role="button"` + `aria-label="close"`
- Interaction uses `@tap` (miniprogram has no `click`); no keyboard focus trap on mobile

## Dark mode

The scrim and panel use `--sn-mp-color-background-overlay` / `--sn-mp-color-background-elevated`, both overridden in the `.sn-theme-dark` block of `@snui/tokens-mp/styles`, so dark mode adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:

## Related

- Scrim only: [`sn-overlay`](/en/components/uni/overlay)
- Centered confirm dialog: `sn-dialog` (planned)
