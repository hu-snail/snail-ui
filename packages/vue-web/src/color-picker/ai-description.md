# SnColorPicker (Web)

Web-end color picker component for `@snui/vue-web`. Value contract mirrors
naive-ui `n-color-picker`; panel layout follows TDesign `t-color-picker`
(format select, channel inputs, recent + preset sections, panel-only mode).

## When to use

Use SnColorPicker when the user must choose a color — theme editors,
branding settings, chart series coloring. Prefer it over a free-text
input when the value must be a valid CSS color. Use `panelOnly` to embed
the picker panel directly (settings pages, toolbars) without a trigger.

## Props

| Prop                      | Type                                                 | Default                 | Notes                                                                                                                                                                   |
| ------------------------- | ---------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| modelValue                | `string \| null`                                     | `null`                  | `v-model`. CSS color: `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, `rgb()`, `rgba()`, `hsl()`, `hsla()` (case-insensitive). Internal canonical form is lowercase `#rrggbb`. |
| modes                     | `('rgb' \| 'hsl' \| 'hex')[]`                        | `['rgb', 'hex']`        | Format dropdown options (Hex / RGB / HSL). The active format decides the field layout and the commit format.                                                            |
| showAlpha                 | `boolean`                                            | `false`                 | Adds the alpha rail (over a checkerboard) + percent input; output becomes `rgba(...)` / `hsla(...)` / `#rrggbbaa` when alpha < 1.                                       |
| swatches                  | `string[]`                                           | `[]`                    | 系统预设颜色 preset section. Invalid entries are dropped; the aria-label / selected value is the normalized hex.                                                        |
| panelOnly                 | `boolean`                                            | `false`                 | Renders the panel inline without the trigger: no teleport, no popper positioning, always visible (`role="group"`). `defaultShow` is ignored.                            |
| size                      | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'`              | Trigger height + font preset.                                                                                                                                           |
| disabled                  | `boolean`                                            | `false`                 | Blocks open / drag / input / clear.                                                                                                                                     |
| readonly                  | `boolean`                                            | `false`                 | Visible but inert.                                                                                                                                                      |
| clearable                 | `boolean`                                            | `false`                 | × button restores the default color `#000000` and emits `clear`.                                                                                                        |
| defaultShow               | `boolean`                                            | `false`                 | Opens the panel on mount (popup mode only).                                                                                                                             |
| placeholder               | `string`                                             | `'Please pick a color'` | Empty-state text.                                                                                                                                                       |
| ariaLabel                 | `string`                                             | `''`                    | Accessible name (fallback: `'Color picker'`).                                                                                                                           |
| customClass / customStyle | `string` / `string \| object`                        | —                       | Root wrapper passthrough.                                                                                                                                               |

## Events

| Event             | Payload          | Notes                                                                   |
| ----------------- | ---------------- | ----------------------------------------------------------------------- |
| update:modelValue | `string \| null` | Live while dragging (SV / hue / alpha) + on every commit.               |
| change            | `string`         | Committed on pointer release, swatch click, valid input, keyboard step. |
| clear             | —                | Clear button activated (model already reset to `#000000`).              |
| focus / blur      | `FocusEvent`     | From the trigger.                                                       |

## Value contract

- Input parsing accepts every supported form; output is canonicalized
  to the active format: `#rrggbb` (hex), `rgb(r, g, b)` / `rgba(r, g, b, a)`
  (rgb), `hsl(h, s%, l%)` / `hsla(...)` (hsl). With `showAlpha` and
  alpha < 1 the alpha part is appended (`#rrggbbaa`, `rgba`, `hsla`).
- Alpha is quantized to 2 decimals on display; `#rrggbbaa` is the
  255-scaled rounding of that value.
- Empty model (`null` / `''`) shows the placeholder and the trigger
  swatch renders the default `#000000`.

## Panel layout

- SV square (draggable round handle) on top.
- Rails row: hue rail + optional alpha rail (checkerboard underlay) with
  the current-color preview swatch on the right.
- Input row: format dropdown (Hex / RGB / HSL) + value field. `rgb`
  renders three 0–255 channel inputs; `hex` a text field with a
  decorative `#` prefix (typed input works with or without `#`); `hsl`
  a plain text field. With `showAlpha` a 0–100 percent field with a `%`
  suffix follows.
- Sections: 最近使用颜色 (session recent history; `暂无` when empty) and
  系统预设颜色 (`swatches` prop).

## Recent colors

Every committed change (drag release, swatch click, valid input, keyboard
step) records the normalized hex into a module-scoped in-memory list shared
by all picker instances on the page: most recent first, deduped, capped at 10. No persistence (no localStorage) — the history lives for the page
session only (SSR-safe, no surprise data retention).

## Interaction

- Trigger click / Enter / Space toggles the panel; Escape closes.
- Format dropdown: opens on click / Enter / Space / ArrowDown; options
  rove with ArrowUp / ArrowDown; Escape or a press outside the select
  closes it. Selecting an option reformats the value fields live.
- Value fields: Enter / blur commits when parseable (and changed),
  otherwise reverts to the formatted draft. A no-op confirm does not
  re-emit. Fields update live while dragging.
- Dragging: `pointerdown` applies immediately, `document`-level
  `pointermove` keeps applying (live `update:modelValue`),
  `pointerup` commits (`change`). Listeners are registered on mount
  and removed on `onBeforeUnmount` (§41/§42).
- Keyboard: panel handles are `role="slider"`; Arrow keys step
  hue/saturation/value ±1 (Shift ±10), alpha rail ±0.01 (Shift ±0.1).
- Outside `mousedown` dismisses the popup panel; the panel-only panel
  never dismisses.

## Accessibility

- Trigger: `role="combobox"`, `aria-expanded`, `aria-controls`,
  `aria-haspopup="dialog"`, `aria-readonly`, `aria-disabled`.
- Panel: `role="dialog"` (popup) / `role="group"` (panel-only); the
  format dropdown is `aria-haspopup="listbox"` + `aria-expanded` with a
  `role="listbox"` menu and `role="option"` entries (`aria-selected`);
  SV handle and rails are `role="slider"` with min/max/now/valuetext.
- Value fields carry aria-labels (Color value / Red / Green / Blue /
  Opacity percent) and are disabled when the picker is disabled.

## Tokens

All styles run through `--sn-web-color-picker-*` aliases with
`--sn-web-color-*` fallbacks (sizes, radii, panel z-index/width, swatch
size, rail height, field affixes, section titles, etc.). Swatch /
preview / SV-hue backgrounds are DATA (inline styles bound to the
current value or the `swatches` prop), not stylesheet styling.

## Out of scope (not ported in this pass)

- `on-update:value` / `on-complete` / per-channel granular events
  (only `update:modelValue` + `change` + `clear` are emitted).
- Gradient mode (`type="gradient"`) — single solid color only.
- `render-label` / `render-swatch` custom renderers.
- Internal action-bar slot (`actions` prop).
- `children`/labeled swatches (`labeled-swatches`).
- Color namings dictionary (`red`, `blue` keyword input).
- `on-blur`-style panel events beyond the trigger's focus/blur.
- Persistent (localStorage) recent colors.
- Scroll-aware repositioning (panel positions once on open — same
  simplified popper strategy as SnSelect / SnTimePicker).

## Files

- `SnColorPicker.vue` — component (template + script + scoped styles).
- `sn-color-picker-types.ts` — pure helpers: `parseColor`, `rgbToHex`,
  `rgbaToHex`, `rgbToHsl`, `hslToRgb`, `rgbToHsv`, `hsvToRgb`,
  formatters, `clamp`.
- `sn-color-picker-recent.ts` — session-wide recently-used-colors store
  (`recordRecentColor`, `recentColors`, `resetRecentColors` test hook).
- `sn-color-picker-icons.ts` — inlined chevron / close icons (per
  sn-time-picker-icons.ts precedent).
- `SnColorPicker.test.ts` — behavior tests (53 cases).
