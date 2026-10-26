# FloatingPanel · uni-app

`sn-floating-panel` is the draggable bottom panel of `@snui/uni` (mobile / miniprogram / H5): drag the handle (or the content) to resize, release to snap to the nearest anchor. Used by map POI sheets, players and editors. Auto-registered through easycom (`components/sn-floating-panel/sn-floating-panel.vue` → `<sn-floating-panel>`); geometry uses `rpx`.

> **Height unit**
>
> `v-model:height` and `anchors` are both in **design px** (the rpx conversion happens inside the component). `height=0` starts at the first anchor.

## Basic usage

`anchors` sets the snap points; `update:height` fires continuously while dragging and `heightChange` fires once the snap settled.

<Demo name="floating-panel-mp-basic" description="Drag the bar to resize; anchors at 120 / 320 with the current and settled height shown live." />

## Controlled height / no animation / content not draggable

- Changing `height` from outside drives the panel (the finger wins during a drag)
- `duration=0` disables the snap animation
- `content-draggable=false` allows only the handle to drag
- `show-scrollbar=false` hides the content scrollbar
- `safeAreaInsetBottom` pads the bottom safe area

<Demo name="floating-panel-mp-config" description="Button-controlled height + duration=0 + content not draggable + hidden scrollbar + safe area." />

## Custom class and style

`customStyle` is merged with the component's own `height` / `duration` custom properties and written on the root node; `customClass` appends a root class.

<Demo name="floating-panel-mp-custom" description="custom-style radius / custom-class shadow, with snapping still working on the handle." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `height` | `number` | `0` | Panel height in design px (`v-model:height`) |
| `anchors` | `number[]` | `[]` | Snap points in design px; empty = `[100, viewportHeight * 0.6]` |
| `duration` | `number` | `300` | Snap animation duration (ms); `0` disables it |
| `contentDraggable` | `boolean` | `true` | Let the content area drag the panel |
| `safeAreaInsetBottom` | `boolean` | `false` | Pad for the bottom safe area |
| `showScrollbar` | `boolean` | `true` | Render the content scrollbar |
| `customClass` | `string` | `''` | Root class |
| `customStyle` | `string` | `''` | Root inline style |

## Events

| Event | Description | Payload |
| --- | --- | --- |
| `update:height` | Height changed (continuously while dragging, once more on the snap) | `(height: number)` |
| `heightChange` | The drag settled and the snap finished (once per gesture) | `{ height: number }` |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Panel content (scrolls inside the panel) |

## Gestures and snapping

- `touchstart` / `touchmove` / `touchend` / `touchcancel` live on the component's own nodes — no global listener (miniprogram has no `document`)
- Dragging up grows the panel (`height = startHeight - dy`); the value never goes below 0
- A tap on the handle does not change the height
- `touchcancel` snaps to the nearest anchor from the current height
- A new drag interrupts a running snap immediately

## Anchors

The wot-ui default is `[100, viewportHeight * 0.6]`. There is no `window` on miniprogram, so the default is resolved from `globalThis.uni.getSystemInfoSync()`, falling back to the single `100` anchor. An explicit `anchors` array always wins; it is sorted and non-finite / negative values are dropped.

## Tokens

| Variable | Purpose |
| --- | --- |
| `--sn-mp-color-background-elevated` | Panel background |
| `--sn-mp-color-text-primary` | Panel text |
| `--sn-mp-color-border-default` | Handle bar (rest) |
| `--sn-mp-color-action-primary` | Handle bar (dragging) |
| `--sn-mp-shadow-lg` | Panel shadow |
| `--sn-mp-radius-xl` / `--sn-mp-radius-full` | Panel / handle corners |
| `--sn-mp-spacing-4` | Content padding |

## Accessibility

- The handle carries `role="separator"` + `aria-orientation="horizontal"` + `aria-valuenow` (current height)
- The handle bar is `aria-hidden="true"` (decorative)
- Interaction uses touch events; no keyboard path on mobile

## Dark mode

The panel background uses `--sn-mp-color-background-elevated`, the text `--sn-mp-color-text-primary`, and the handle and shadow are tokens too — all overridden in the `page.sn-theme-dark, .sn-theme-dark` block of `@snui/tokens-mp/styles`, so dark mode adapts automatically. Verify by wrapping the demo in `<sn-config-provider theme="dark">`.

## Related

- General popup / scrim: [`sn-popup`](/en/components/uni/popup)
- Bottom action panel: [`sn-action-sheet`](/en/components/uni/action-sheet)
