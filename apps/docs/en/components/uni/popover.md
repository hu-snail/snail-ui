# Popover · uni-app

`sn-popover` is the bubble card of `@snui/uni` (mobile / miniprogram / H5): a trigger plus a bubble in `normal` (plain text / custom content) or `menu` (tappable option list) mode. Auto-registered through easycom (`components/sn-popover/sn-popover.vue` → `<sn-popover>`); geometry uses `rpx`.

> **Divergences from wot-ui**
>
> - Miniprogram has no `hover`, so the trigger always taps to toggle — there is no `trigger` prop.
> - `root-portal` is declared but **not implemented** (no portal host on miniprogram).
> - `updatePosition()` is a compatibility no-op: the bubble is placed by CSS.
> - `iconClass` is an `sn-icon` registry name or image URL, not a CSS class (uni has no font-icon layer).

## Basic usage

In `normal` mode `content` is a string; `showClose` adds a close button inside the bubble.

<Demo name="popover-mp-basic" description="normal mode + close button; tapping the trigger toggles it." />

## Menu mode

With `mode="menu"` the `content` prop is an option array. Tapping a row emits `menuclick` with `{ item, index }`; `disabled` rows are inert.

<Demo name="popover-mp-menu" description="Menu mode with sn-icon registry icons and one disabled row." />

## Placement / arrow / disabled

- `placement` has four groups — `top` / `bottom` / `left` / `right` — each with `-start` / `-end` variants (12 total)
- `visibleArrow=false` removes the arrow
- `offset` accepts a `number`, `[x, y]` or `{ x, y }` in design px
- `disabled` makes the trigger inert

<Demo name="popover-mp-placement" description="top / right-start (no arrow) / disabled." />

## Image icons / content slot / node classes

- a menu row's `iconClass` is either an `sn-icon` registry name or an image source (values starting with `http` / `//` / `/` / `./` render as `<image>`)
- the `content` slot replaces the bubble body entirely, in both normal and menu mode
- `custom-arrow` / `custom-pop` append a class to the arrow node / bubble node
- `offset` and `custom-style` both act on the root

<Demo name="popover-mp-slot" description="image icons in menu mode; content slot body; custom-arrow / custom-pop classes; offset and custom-style." />
## Props

| Prop           | Type                               | Default    | Description                                               |
| -------------- | ---------------------------------- | ---------- | --------------------------------------------------------- |
| `modelValue`   | `boolean`                          | `false`    | Whether the bubble is shown (`v-model`)                   |
| `content`      | `string \| SnPopoverMenuItem[]`    | `''`       | A string in `normal` mode, an option array in `menu` mode |
| `mode`         | `'normal' \| 'menu'`               | `'normal'` | Display mode                                              |
| `placement`    | 12-direction union                 | `'bottom'` | Bubble anchor                                             |
| `offset`       | `number \| number[] \| { x?, y? }` | `0`        | Offset in design px                                       |
| `visibleArrow` | `boolean`                          | `true`     | Render the arrow                                          |
| `disabled`     | `boolean`                          | `false`    | Disable the trigger                                       |
| `showClose`    | `boolean`                          | `false`    | Render a close button                                     |
| `customClass`  | `string`                           | `''`       | Root class                                                |
| `customStyle`  | `string`                           | `''`       | Root inline style                                         |
| `customArrow`  | `string`                           | `''`       | Extra class on the arrow node                             |
| `customPop`    | `string`                           | `''`       | Extra class on the bubble node                            |
| `rootPortal`   | `boolean`                          | `false`    | **Not implemented** (no portal host on miniprogram)       |

### SnPopoverMenuItem

| Field       | Type      | Description                              |
| ----------- | --------- | ---------------------------------------- |
| `content`   | `string`  | Row label                                |
| `iconClass` | `string`  | `sn-icon` registry name, or an image URL |
| `disabled`  | `boolean` | Disable the row                          |

## Events

| Event               | Description             | Payload                                      |
| ------------------- | ----------------------- | -------------------------------------------- |
| `update:modelValue` | Visibility changed      | `(value: boolean)`                           |
| `open`              | Bubble shown            | —                                            |
| `close`             | Bubble hidden           | —                                            |
| `change`            | Visibility changed      | `{ show: boolean }`                          |
| `menuclick`         | A `menu` row was tapped | `{ item: SnPopoverMenuItem, index: number }` |

## Slots

| Slot      | Description                                          |
| --------- | ---------------------------------------------------- |
| `default` | Trigger content                                      |
| `content` | Custom bubble body; replaces `content` in both modes |

## Methods

| Method             | Description         |
| ------------------ | ------------------- |
| `open()`           | Show the bubble     |
| `close()`          | Hide the bubble     |
| `updatePosition()` | Compatibility no-op |

## Tokens

| Variable                                                        | Purpose                  |
| --------------------------------------------------------------- | ------------------------ |
| `--sn-mp-color-background-elevated`                             | Bubble background        |
| `--sn-mp-color-text-primary`                                    | Bubble / row text        |
| `--sn-mp-color-text-secondary`                                  | Row icon                 |
| `--sn-mp-color-text-disabled`                                   | Disabled row             |
| `--sn-mp-color-border-subtle`                                   | Bubble and arrow outline |
| `--sn-mp-shadow-md`                                             | Bubble shadow            |
| `--sn-mp-radius-md`                                             | Bubble corners           |
| `--sn-mp-spacing-2` / `--sn-mp-spacing-3` / `--sn-mp-spacing-4` | Padding and gaps         |
| `--sn-mp-font-size-sm`                                          | Bubble font size         |

## Accessibility

- Trigger carries `role="button"` + `aria-expanded` + `aria-disabled`
- Bubble carries `role="dialog"`; the arrow is `aria-hidden="true"`
- `menu` rows carry `role="menuitem"` + `aria-disabled`
- Interaction uses `@tap`; no keyboard focus trap on mobile

## Dark mode

The bubble uses `--sn-mp-color-background-elevated` for its fill and `--sn-mp-color-text-primary` for text, both overridden in the `page.sn-theme-dark, .sn-theme-dark` block of `@snui/tokens-mp/styles`, so dark mode adapts automatically. Verify by wrapping the demo in `<sn-config-provider theme="dark">`.

## Related

- Plain text hint: [`sn-tooltip`](/en/components/uni/tooltip)
- Page-level filter bar: `sn-drop-menu`
