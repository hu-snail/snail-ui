# Tooltip · uni-app

`sn-tooltip` is the text hint bubble of `@snui/uni` (mobile / miniprogram / H5): a trigger element plus a short hint, with the 12 wot-ui `placement` directions. Auto-registered through easycom (`components/sn-tooltip/sn-tooltip.vue` → `<sn-tooltip>`); geometry uses `rpx`.

> **Divergences from wot-ui**
>
> - Miniprogram / touch devices have no `hover`, so the trigger **taps** to toggle.
> - `root-portal` is declared but **not implemented** (no portal host on miniprogram).
> - `updatePosition()` is a compatibility no-op: the bubble is placed by CSS.

## Basic usage

`v-model` controls visibility; `content` is the hint text. Tapping the trigger again closes it.

<Demo name="tooltip-mp-basic" description="Tap the button to toggle the bubble; tapping outside does not close it." />

## Placement

`placement` has four groups — `top` / `bottom` / `left` / `right` — each with `-start` / `-end` alignment variants (12 in total). The arrow follows the placement automatically.

<Demo name="tooltip-mp-placement" description="Four directions, one open at a time." />

## Arrow / close button / offset

- `visibleArrow=false` removes the arrow
- `showClose` renders a close button inside the bubble
- `offset` accepts a `number`, `[x, y]` or `{ x, y }`, in design px, and is published as `--sn-tooltip-offset-x` / `--sn-tooltip-offset-y`
- `disabled` makes the trigger inert and keeps the bubble closed

<Demo name="tooltip-mp-config" description="No arrow / close button + offset / disabled." />

## Multi-line content and the content slot

An array `content` renders one line per entry (objects contribute whichever of `label` / `text` / `content` / `name` is present); the `content` slot replaces the bubble body entirely with any structure:

<Demo name="tooltip-mp-content" description="array content renders multiple lines; the content slot carries a custom structure; offset as [x, y] and { x, y }." />
## Props

| Prop           | Type                                                                         | Default    | Description                                                                                               |
| -------------- | ---------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| `modelValue`   | `boolean`                                                                    | `false`    | Whether the bubble is shown (`v-model`)                                                                   |
| `content`      | `string \| Array<Record<string, unknown> \| string>`                         | `''`       | Hint text; an array renders one line per entry (`label` / `text` / `content` / `name`, or a plain string) |
| `placement`    | 12-direction union (`top` / `bottom` / `left` / `right` + `-start` / `-end`) | `'bottom'` | Bubble anchor                                                                                             |
| `offset`       | `number \| number[] \| { x?, y? }`                                           | `0`        | Gap from the trigger, in design px                                                                        |
| `visibleArrow` | `boolean`                                                                    | `true`     | Render the arrow                                                                                          |
| `disabled`     | `boolean`                                                                    | `false`    | Disable the trigger                                                                                       |
| `showClose`    | `boolean`                                                                    | `false`    | Render a close button                                                                                     |
| `customArrow`  | `string`                                                                     | `''`       | Extra class on the arrow node                                                                             |
| `customPop`    | `string`                                                                     | `''`       | Extra class on the bubble node                                                                            |
| `customClass`  | `string`                                                                     | `''`       | Root class                                                                                                |
| `customStyle`  | `string`                                                                     | `''`       | Root inline style                                                                                         |
| `rootPortal`   | `boolean`                                                                    | `false`    | **Not implemented** (no portal host on miniprogram)                                                       |

## Events

| Event               | Description        | Payload             |
| ------------------- | ------------------ | ------------------- |
| `update:modelValue` | Visibility changed | `(value: boolean)`  |
| `open`              | Bubble shown       | —                   |
| `close`             | Bubble hidden      | —                   |
| `change`            | Visibility changed | `{ show: boolean }` |

## Slots

| Slot      | Description                            |
| --------- | -------------------------------------- |
| `default` | Trigger content                        |
| `content` | Custom bubble body; replaces `content` |

## Methods

| Method             | Description         |
| ------------------ | ------------------- |
| `open()`           | Show the bubble     |
| `close()`          | Hide the bubble     |
| `updatePosition()` | Compatibility no-op |

## Tokens

| Variable                                                        | Purpose                                                  |
| --------------------------------------------------------------- | -------------------------------------------------------- |
| `--sn-mp-color-text-primary`                                    | Bubble background (inverted surface, flips in dark mode) |
| `--sn-mp-color-background-elevated`                             | Bubble text / close glyph                                |
| `--sn-mp-shadow-md`                                             | Bubble shadow                                            |
| `--sn-mp-radius-md`                                             | Bubble corners                                           |
| `--sn-mp-spacing-2` / `--sn-mp-spacing-3` / `--sn-mp-spacing-4` | Bubble padding and gaps                                  |
| `--sn-mp-font-size-sm`                                          | Bubble font size                                         |
| `--sn-mp-font-line-height-normal`                               | Bubble line height                                       |

## Accessibility

- Trigger carries `role="button"` + `aria-expanded` + `aria-disabled`
- Bubble carries `role="tooltip"`; the arrow is `aria-hidden="true"`
- Close button carries `role="button"` + `aria-label="close"`
- Interaction uses `@tap`; no keyboard focus trap on mobile

## Dark mode

The bubble uses an inverted surface: the fill is `--sn-mp-color-text-primary` and the text is `--sn-mp-color-background-elevated`. Both are overridden in the `page.sn-theme-dark, .sn-theme-dark` block of `@snui/tokens-mp/styles`, so dark mode becomes light-on-dark text automatically. Verify by wrapping the demo in `<sn-config-provider theme="dark">`.

## Related

- Bubble with menu items / rich content: [`sn-popover`](/en/components/uni/popover)
- Page-level filter bar: `sn-drop-menu`
