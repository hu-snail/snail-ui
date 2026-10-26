# SnColorPicker (Web)

Web-end color picker component for `@snui/vue-web`. Mirrors naive-ui
`n-color-picker` core surface 1:1 (value string, modes tabs, SV square,
hue / alpha rails, swatches, keyboard stepping).

## When to use

Use SnColorPicker when the user must choose a color — theme editors,
branding settings, chart series coloring. Prefer it over a free-text
input when the value must be a valid CSS color.

## Props

| Prop                      | Type                                                 | Default                 | Notes                                                                                                                                                                   |
| ------------------------- | ---------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| modelValue                | `string \| null`                                     | `null`                  | `v-model`. CSS color: `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, `rgb()`, `rgba()`, `hsl()`, `hsla()` (case-insensitive). Internal canonical form is lowercase `#rrggbb`. |
| modes                     | `('rgb' \| 'hsl' \| 'hex')[]`                        | `['rgb', 'hex']`        | Panel-top tab set. The active tab decides the text-input format and the commit format.                                                                                  |
| showAlpha                 | `boolean`                                            | `false`                 | Adds the alpha rail; output becomes `rgba(...)` / `hsla(...)` / `#rrggbbaa` when alpha < 1.                                                                             |
| swatches                  | `string[]`                                           | `[]`                    | Preset swatch row. Invalid entries are dropped; the aria-label / selected value is the normalized hex.                                                                  |
| size                      | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'`              | Trigger height + font preset.                                                                                                                                           |
| disabled                  | `boolean`                                            | `false`                 | Blocks open / drag / clear.                                                                                                                                             |
| readonly                  | `boolean`                                            | `false`                 | Visible but inert.                                                                                                                                                      |
| clearable                 | `boolean`                                            | `false`                 | × button restores the default color `#000000` and emits `clear`.                                                                                                        |
| defaultShow               | `boolean`                                            | `false`                 | Opens the panel on mount.                                                                                                                                               |
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
  to the active mode: `#rrggbb` (hex), `rgb(r, g, b)` / `rgba(r, g, b, a)`
  (rgb), `hsl(h, s%, l%)` / `hsla(...)` (hsl). With `showAlpha` and
  alpha < 1 the alpha part is appended (`#rrggbbaa`, `rgba`, `hsla`).
- Alpha is quantized to 2 decimals on display; `#rrggbbaa` is the
  255-scaled rounding of that value.
- Empty model (`null` / `''`) shows the placeholder and the trigger
  swatch renders the default `#000000`.

## Interaction

- Trigger click / Enter / Space toggles the panel; Escape closes.
- Panel: mode tabs (top), SV square with draggable round handle,
  hue rail + optional alpha rail, current-color preview + mode text
  input, swatch row.
- Dragging: `pointerdown` applies immediately, `document`-level
  `pointermove` keeps applying (live `update:modelValue`),
  `pointerup` commits (`change`). Listeners are registered on mount
  and removed on `onBeforeUnmount` (§41/§42).
- Keyboard: panel handles are `role="slider"`; Arrow keys step
  hue/saturation/value ±1 (Shift ±10), alpha rail ±0.01 (Shift ±0.1).
  Enter/blur on the text input commits when parseable (and changed),
  otherwise reverts to the formatted draft. A no-op confirm does not
  re-emit.
- Outside `mousedown` dismisses the panel.

## Accessibility

- Trigger: `role="combobox"`, `aria-expanded`, `aria-controls`,
  `aria-haspopup="dialog"`, `aria-readonly`, `aria-disabled`.
- Panel: `role="dialog"`; mode tabs are a `role="tablist"` with
  `aria-selected`; SV handle and rails are `role="slider"` with
  min/max/now/valuetext.

## Tokens

All styles run through `--sn-web-color-picker-*` aliases with
`--sn-web-color-*` fallbacks (sizes, radii, panel z-index, swatch
size, rail height, etc.). Swatch / preview / SV-hue backgrounds are
DATA (inline styles bound to the current value or the `swatches`
prop), not stylesheet styling.

## Out of scope (not ported in this pass)

- `on-update:value` / `on-complete` / per-channel granular events
  (only `update:modelValue` + `change` + `clear` are emitted).
- Gradient mode (`type="gradient"`) — single solid color only.
- `render-label` / `render-swatch` custom renderers.
- Internal action-bar slot (`actions` prop).
- `children`/labeled swatches (`labeled-swatches`).
- Color namings dictionary (`red`, `blue` keyword input).
- `on-blur`-style panel events beyond the trigger's focus/blur.
- Vertical / custom rail orientation (`placement` of rails).
- Scroll-aware repositioning (panel positions once on open — same
  simplified popper strategy as SnSelect / SnTimePicker).

## Files

- `SnColorPicker.vue` — component (template + script + scoped styles).
- `sn-color-picker-types.ts` — pure helpers: `parseColor`, `rgbToHex`,
  `rgbaToHex`, `rgbToHsl`, `hslToRgb`, `rgbToHsv`, `hsvToRgb`,
  formatters, `clamp`.
- `sn-color-picker-icons.ts` — inlined chevron / close icons (per
  sn-time-picker-icons.ts precedent).
- `SnColorPicker.test.ts` — behavior tests (36 cases).

Not wired into `install.ts` / `index.ts` / `resolver.ts` / `config.ts`
per task scope.
