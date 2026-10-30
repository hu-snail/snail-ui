# Popover · uni-app

`sn-popover` is the bubble card of `@snui/uni` (mobile / miniprogram / H5): a trigger plus a bubble in `normal` (plain text / custom content) or `menu` (tappable option list) mode. Auto-registered through easycom (`components/sn-popover/sn-popover.vue` → `<sn-popover>`); geometry uses `rpx`.

## When to use

- A supplementary note next to an anchor element, without interrupting the page flow
- A "more actions" menu (edit / share / delete) that acts immediately on tap
- Hints whose length is not fixed — the bubble must size to its content instead of clipping it
- Not for: lightweight plain-text hints (use [`sn-tooltip`](/en/components/uni/tooltip)); page-level filter bars (use `sn-drop-menu`); modal content that must block the page (use `sn-dialog`)

## Code demos

### Basic usage

In `normal` mode `content` is a string; `showClose` adds a close button inside the bubble. Tapping anywhere outside the bubble (a transparent mask takes the outside tap) or the trigger again closes it.

<Demo name="popover-mp-basic" description="normal mode + close button; the trigger toggles it, an outside tap closes it." />

### Auto height

The bubble height follows its content: long text wraps inside the bubble max width and the bubble grows downwards instead of clipping the body; long menu labels wrap the same way. Row glyphs and the close glyph are sized by tokens (`--sn-popover-menu-icon-size` / `--sn-popover-close-icon-size`), so a bigger icon grows the row instead of overflowing.

<Demo name="popover-mp-height" description="Long-text normal bubble + long menu label + bigger glyph (44rpx); the bubble sizes to its content." />

### Menu mode and icon configuration

With `mode="menu"` the `content` prop is an option array. Tapping a row emits `menuclick` with `{ item, index }`; `disabled` rows are inert.

Row glyphs resolve from three sources, highest precedence first:

1. `iconData` — an inline `IconData` object (`{ viewBox, paths }`); no registration step, pass a built-in icon set object directly
2. `iconUrl` — an image address rendered as `<image>` (values starting with `http` / `data:` / `//` / `/` / `./`)
3. `icon` — a name resolved through the SnIcon chain: registry (`registerSnIcons`) → built-in catalog → `prefix:rest` provider

The legacy `iconClass` field keeps working: a URL-shaped value renders as an image, anything else resolves as a name (lowest precedence).

<Demo name="popover-mp-menu" description="Menu mode showing all four glyph styles side by side: iconData / icon / iconUrl / iconClass (legacy), with one disabled row." />

### Placement / arrow / disabled / colors

- `placement` has four groups — `top` / `bottom` / `left` / `right` — each with `-start` / `-end` variants (12 total)
- `visibleArrow=false` removes the arrow
- `offset` accepts a `number`, `[x, y]` or `{ x, y }` in design px
- `disabled` makes the trigger inert
- Bubble colors are overridden through `--sn-popover-bg` / `--sn-popover-color`; the default is a white fill with dark text (see "Tokens")

<Demo name="popover-mp-placement" description="All 12 directions in a grid, one open at a time." />

### Legacy icon field / content slot / node classes

- the legacy `iconClass` field is either an icon name or an image source (values starting with `http` / `//` / `/` / `./` render as `<image>`)
- the `content` slot replaces the bubble body entirely, in both normal and menu mode
- `custom-arrow` / `custom-pop` append a class to the arrow node / bubble node
- `offset` and `custom-style` both act on the root

<Demo name="popover-mp-slot" description="legacy iconClass in menu mode; content slot body; custom-arrow / custom-pop classes; offset and custom-style." />

### Close behavior

- `closeOnClickOutside` defaults to `true`: while the bubble is open it renders a **transparent full-viewport mask**; a tap anywhere outside closes it and never reaches the page behind
- the mask does not dim the page — a popover is a lightweight pointer surface, not a modal
- the mask covers sibling triggers, so switching between two bubbles costs a close tap plus an open tap; pass `closeOnClickOutside="false"` to get one-gesture switching
- the page-root channel stays available: bind `@tap="closeOutside"` (`useQueue`) on the page root to close every registered overlay at once

```vue
<sn-popover v-model="open" :close-on-click-outside="false" content="one-gesture switching">
  <sn-button>More</sn-button>
</sn-popover>
```

## Props

| Prop                  | Type                               | Default    | Description                                                |
| --------------------- | ---------------------------------- | ---------- | ---------------------------------------------------------- |
| `modelValue`          | `boolean`                          | `false`    | Whether the bubble is shown (`v-model`)                    |
| `content`             | `string \| SnPopoverMenuItem[]`    | `''`       | A string in `normal` mode, an option array in `menu` mode  |
| `mode`                | `'normal' \| 'menu'`               | `'normal'` | Display mode                                               |
| `placement`           | 12-direction union                 | `'bottom'` | Bubble anchor                                              |
| `offset`              | `number \| number[] \| { x?, y? }` | `0`        | Offset in design px                                        |
| `visibleArrow`        | `boolean`                          | `true`     | Render the arrow                                           |
| `disabled`            | `boolean`                          | `false`    | Disable the trigger                                        |
| `showClose`           | `boolean`                          | `false`    | Render a close button                                      |
| `closeOnClickOutside` | `boolean`                          | `true`     | Close on an outside tap (a transparent mask takes the tap) |
| `customClass`         | `string`                           | `''`       | Root class                                                 |
| `customStyle`         | `string`                           | `''`       | Root inline style                                          |
| `customArrow`         | `string`                           | `''`       | Extra class on the arrow node                              |
| `customPop`           | `string`                           | `''`       | Extra class on the bubble node                             |
| `rootPortal`          | `boolean`                          | `false`    | **Not implemented** (no portal host on miniprogram)        |

### SnPopoverMenuItem

| Field       | Type       | Description                                                   |
| ----------- | ---------- | ------------------------------------------------------------- |
| `content`   | `string`   | Row label                                                     |
| `iconData`  | `IconData` | Inline icon data (highest precedence, no registration needed) |
| `iconUrl`   | `string`   | Image address, rendered as `<image>`                          |
| `icon`      | `string`   | Icon name (registry → built-in catalog → provider)            |
| `iconClass` | `string`   | Legacy field: icon name, or an image address (lowest)         |
| `disabled`  | `boolean`  | Disable the row                                               |

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

| Variable                                                        | Purpose                                                                                                                                     |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `--sn-popover-bg`                                               | Bubble fill (defaults to `--sn-mp-color-background-elevated` — white in the light theme; the arrow follows it; override via `custom-style`) |
| `--sn-popover-color`                                            | Bubble / row text color (defaults to `--sn-mp-color-text-primary`)                                                                          |
| `--sn-popover-menu-icon-size`                                   | Menu row glyph scale (defaults to `--sn-mp-icon-size-medium`)                                                                               |
| `--sn-popover-close-icon-size`                                  | Close glyph scale (defaults to `--sn-mp-icon-size-small`)                                                                                   |
| `--sn-mp-color-text-secondary`                                  | Row icon                                                                                                                                    |
| `--sn-mp-color-text-disabled`                                   | Disabled row                                                                                                                                |
| `--sn-mp-color-border-subtle`                                   | Bubble and arrow outline                                                                                                                    |
| `--sn-mp-shadow-md`                                             | Bubble shadow                                                                                                                               |
| `--sn-mp-radius-md`                                             | Bubble corners                                                                                                                              |
| `--sn-mp-spacing-2` / `--sn-mp-spacing-3` / `--sn-mp-spacing-4` | Padding and gaps                                                                                                                            |
| `--sn-mp-font-size-sm`                                          | Bubble font size                                                                                                                            |

## Accessibility

- Trigger carries `role="button"` + `aria-expanded` + `aria-disabled`
- Bubble carries `role="dialog"`; the arrow is `aria-hidden="true"`
- `menu` rows carry `role="menuitem"` + `aria-disabled`
- The outside-close mask is `aria-hidden="true"` and takes no screen-reader focus
- Interaction uses `@tap`; no keyboard focus trap on mobile

## Dark mode

The bubble uses `--sn-popover-bg` for its fill (default `--sn-mp-color-background-elevated` — white in the light theme) and `--sn-popover-color` for text (default `--sn-mp-color-text-primary`); both default tokens are overridden in the `.sn-theme-dark` block of `@snui/tokens-mp/styles`, so dark mode adapts automatically. To recolor the bubble, override `custom-style="--sn-popover-bg: …; --sn-popover-color: …"`; mind the dark-mode contrast yourself when you do. Verify by wrapping the demo in `<sn-config-provider theme="dark">`.

## AI Patch Boundary

When generating or repairing a schema, AI may only touch the fields marked writable below; the read-only entries are component contract and need a human gate.

| Field                                                       | Writable | Constraint                                                                                          |
| ----------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `modelValue`                                                | yes      | Boolean; a controlled use must also write back `update:modelValue`                                  |
| `content` (normal)                                          | yes      | String; long text wraps in the component — do not insert manual line breaks                         |
| `content` (menu)                                            | yes      | Array; each item allows only `content` / `iconData` / `iconUrl` / `icon` / `iconClass` / `disabled` |
| `mode`                                                      | yes      | `normal` \| `menu`; must match the `content` shape                                                  |
| `placement`                                                 | yes      | 12-value enum; out-of-range values must be validated before render                                  |
| `offset`                                                    | yes      | `number` / `[x, y]` / `{ x, y }` in design px                                                       |
| `visibleArrow` / `disabled`                                 | yes      | Boolean                                                                                             |
| `showClose`                                                 | yes      | Boolean                                                                                             |
| `closeOnClickOutside`                                       | yes      | Boolean; set `false` only when one-gesture bubble switching is required                             |
| `customClass` / `customStyle` / `customArrow` / `customPop` | yes      | Class / inline-style strings; no hard-coded non-token colors                                        |
| `rootPortal`                                                | no       | Declared but not implemented; writing it has no effect                                              |
| Events `open` / `close` / `change` / `menuclick`            | no       | Event names and payload shapes are fixed                                                            |
| Methods `open()` / `close()` / `updatePosition()`           | no       | Signatures are fixed                                                                                |
| `--sn-popover-*` theme variables                            | yes      | Override only; do not invent unregistered variable names                                            |

## Related

- Plain text hint: [`sn-tooltip`](/en/components/uni/tooltip)
- Page-level filter bar: `sn-drop-menu`
