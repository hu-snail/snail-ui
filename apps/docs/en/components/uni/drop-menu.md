# DropMenu · uni-app

`sn-drop-menu` is the filter drop-menu of `@snui/uni` (mobile / miniprogram / H5): a menu bar plus a sliding option panel, the "sort / filter" bar at the top of a list page. Auto-registered through easycom (`components/sn-drop-menu/sn-drop-menu.vue` → `<sn-drop-menu>`); geometry uses `rpx`.

> **Implementation notes**
>
> - The option list is driven by this component's `options` array (`{ label, value, tip }`, with `labelKey` / `valueKey` / `tipKey` for renaming) rather than composed child components — uni-app easycom cannot guarantee parent/child wiring under `v-for`.
> - `root-portal` is declared but **not implemented** (no portal host on miniprogram).
> - `custom-popup-class` / `custom-popup-style` target the inline option panel, not a separate popup instance.

## Basic usage

`v-model` holds the selected value; `change` reports `{ value, selectedItem }`. When `title` is set the bar shows the title instead of the selected label.

<Demo name="drop-menu-mp-basic" description="Sort menu with one disabled row; picking a row reports selectedItem." />

## Expansion direction

`direction="down"` (the default) opens downwards; `direction="up"` opens upwards and the bar arrow flips with it:

<Demo name="drop-menu-mp-direction" description="Down / up comparison; the arrow follows the direction." />

## Option icons

Every row supports three icon sources, precedence `iconData` (object) > `iconUrl` (image) > `icon` (name resolution chain); `iconSize` sets the row and check-glyph size (tier names tiny/small/medium/large/xlarge map to `--sn-mp-icon-size-*`, empty = medium), and `iconName` picks the selected-row glyph:

<Demo name="drop-menu-mp-icon" description="Three icon sources compared: IconData object, name resolution, image URL; iconSize tiers; selected-row check glyph." />

## Expansion stacking (z-index)

While open, the panel and scrim are raised to `--sn-drop-menu-overlay-z-index` (never below 90) — page chrome (navigation bar, floating button, toast) can no longer cover an open menu; on close the level returns to the authored `zIndex` (default 12). An explicit `zIndex` above 90 wins:

- Idle: `--sn-drop-menu-z-index` (= the `zIndex` prop)
- Open: `--sn-drop-menu-overlay-z-index` (= `max(zIndex, 90)`)

## Toggle guard / field keys

- `direction="up"` opens the panel upwards
- `beforeToggle` receives `{ status }`; returning `false` (or a promise of it) blocks the toggle
- `labelKey` / `valueKey` / `tipKey` adapt to backend field names

<Demo name="drop-menu-mp-guard" description="Upwards panel + beforeToggle blocking the first two taps + custom field names." />

## No scrim / panel height / custom panel

- `modal=false` renders no scrim
- `closeOnClickModal=false` keeps the scrim from closing the menu
- `popupHeight` caps the panel height (80vh max by default)
- `customPopupClass` / `customPopupStyle` target the option panel
- `disabled` disables the whole bar
- `duration` sets the open / close animation length
- the default slot replaces the option list

<Demo name="drop-menu-mp-panel" description="modal=false; close-on-click-modal=false; popup-height cap; custom-popup-class / custom-popup-style; disabled; default slot." />
## Props

| Prop                | Type                                          | Default        | Description                                         |
| ------------------- | --------------------------------------------- | -------------- | --------------------------------------------------- |
| `modelValue`        | `string \| number`                            | `''`           | Current selected value (`v-model`)                  |
| `options`           | `SnDropMenuOption[]`                          | `[]`           | Option rows                                         |
| `direction`         | `'up' \| 'down'`                              | `'down'`       | Expansion direction                                 |
| `zIndex`            | `number`                                      | `12`           | Scrim and panel stacking level                      |
| `modal`             | `boolean`                                     | `true`         | Render the scrim                                    |
| `closeOnClickModal` | `boolean`                                     | `true`         | Close on a scrim tap                                |
| `duration`          | `number`                                      | `200`          | Open / close animation duration (ms)                |
| `disabled`          | `boolean`                                     | `false`        | Disable the whole menu                              |
| `iconName`          | `string`                                      | `'check'`      | `sn-icon` name of the selected-row glyph            |
| `title`             | `string`                                      | `''`           | Menu title; overrides the selected label            |
| `icon`              | `string`                                      | `'caret-down'` | `sn-icon` name of the bar arrow                     |
| `iconSize`          | `string \| number`                            | `''`           | Icon size (tier names map to `--sn-mp-icon-size-*`, numbers are px; empty = medium tier) |
| `beforeToggle`      | `({ status }) => boolean \| Promise<boolean>` | —              | Toggle guard                                        |
| `valueKey`          | `string`                                      | `'value'`      | Option value field name                             |
| `labelKey`          | `string`                                      | `'label'`      | Option label field name                             |
| `tipKey`            | `string`                                      | `'tip'`        | Option tip field name                               |
| `customPopupClass`  | `string`                                      | `''`           | Custom class on the option panel                    |
| `customPopupStyle`  | `string`                                      | `''`           | Custom inline style on the option panel             |
| `popupHeight`       | `string`                                      | `''`           | Panel height; empty = at most 80% of the viewport   |
| `customClass`       | `string`                                      | `''`           | Root class                                          |
| `customStyle`       | `string`                                      | `''`           | Root inline style                                   |
| `rootPortal`        | `boolean`                                     | `false`        | **Not implemented** (no portal host on miniprogram) |

### SnDropMenuOption

| Field      | Type               | Description                                         |
| ---------- | ------------------ | --------------------------------------------------- |
| `label`    | `string`           | Row label (key configurable)                        |
| `value`    | `string \| number` | Value reported through `v-model` (key configurable) |
| `tip`      | `string`           | Secondary tip line (key configurable)               |
| `disabled` | `boolean`          | Disable the row                                     |
| `iconData` | `IconData`         | Row icon: built-in set object (highest precedence)  |
| `iconUrl`  | `string`           | Row icon: image URL rendered as `<image>` (below `iconData`) |
| `icon`     | `string`           | Row icon: name resolution chain (lowest precedence) |

## Events

| Event               | Description                                    | Payload                     |
| ------------------- | ---------------------------------------------- | --------------------------- |
| `update:modelValue` | Selected value changed                         | `(value: string \| number)` |
| `change`            | A row was picked                               | `{ value, selectedItem }`   |
| `open`              | The menu started expanding                     | —                           |
| `opened`            | The expansion animation finished               | —                           |
| `close`             | The menu started closing                       | —                           |
| `closed`            | The close animation finished (panel unmounted) | —                           |

## Slots

| Slot      | Description                                         |
| --------- | --------------------------------------------------- |
| `default` | Custom panel body; replaces the default option list |

## Methods

| Method         | Description                              |
| -------------- | ---------------------------------------- |
| `getShowPop()` | Whether the menu is currently open       |
| `open()`       | Open the menu (respects `beforeToggle`)  |
| `close()`      | Close the menu (respects `beforeToggle`) |
| `toggle()`     | Toggle the menu                          |

## Tokens

| Variable                                                        | Purpose                      |
| --------------------------------------------------------------- | ---------------------------- |
| `--sn-mp-color-background-elevated`                             | Bar / panel background       |
| `--sn-mp-color-background-overlay`                              | Scrim                        |
| `--sn-mp-color-text-primary`                                    | Bar and row text             |
| `--sn-mp-color-text-secondary` / `--sn-mp-color-text-tertiary`  | Placeholder, tip line, arrow |
| `--sn-mp-color-action-primary`                                  | Active row and arrow         |
| `--sn-mp-color-text-disabled`                                   | Disabled state               |
| `--sn-mp-color-border-subtle`                                   | Panel and row separators     |
| `--sn-mp-shadow-md`                                             | Panel shadow                 |
| `--sn-mp-spacing-2` / `--sn-mp-spacing-3` / `--sn-mp-spacing-4` | Padding                      |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-xs`                 | Row text and tip line        |
| `--sn-mp-icon-size-medium` (tier default)                       | Row and check glyph size     |

## AI Patch Boundary

- AI may patch `options` (label / value / disabled / icon config), `title` / `disabled` / `direction` and other display configs.
- `modelValue` / `change` and the `open` / `close` event family are runtime interaction; patches must not fake toggles or picks.
- `zIndex` is a host-level decision; patches should adjust `options` and display fields only, never raise global stacking casually.
- Default slot content is business data; patches should only adjust container configs, never rewrite slot internals.

## Accessibility

- The bar carries `role="button"` + `aria-expanded` + `aria-disabled`
- Option rows carry `role="menuitem"` + `aria-disabled`
- The scrim is `aria-hidden="true"`
- Interaction uses `@tap`; no keyboard focus trap on mobile

## Dark mode

The bar and panel use `--sn-mp-color-background-elevated`, separators use `--sn-mp-color-border-subtle` and the scrim uses `--sn-mp-color-background-overlay` — all three are overridden in the `.sn-theme-dark` block of `@snui/tokens-mp/styles`, so dark mode adapts automatically. Verify by wrapping the demo in `<sn-config-provider theme="dark">`.

## Related

- Bubble action menu: [`sn-popover`](/en/components/uni/popover)
- Bottom action panel: [`sn-action-sheet`](/en/components/uni/action-sheet)
