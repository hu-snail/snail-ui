# PickerView · uni-app

`sn-picker-view` is the roller body of `@snui/uni` (the core of `sn-picker`): multi-column wheels, option-key resolution and cascade derivation. easycom auto-registration (`components/sn-picker-view/sn-picker-view.vue` → `<sn-picker-view>`); geometry in `rpx`. Because the cross-end element allowlist in CONTRIBUTING §2.3 has no native `picker-view`, the wheel is built from `<view>` + `transform: translateY()` + touch events. Drag state is plain component state, reset on `touchend` / `touchcancel` and gone with the component — no global listeners, no timers.

## Basic usage

Single-column roller: pass a string array as `columns` and tap a row to select it.

<Demo name="picker-view-mp-basic" description="Single-column roller: pass a string array as `columns` and tap a row to select it." />

## Cascade & disabled (`cascade` / `disabled` / `valueKey`)

With `cascade`, `columns` is a tree and the following columns are derived from the path; `disabled` freezes every column.

<Demo name="picker-view-mp-cascade" description="With `cascade`, `columns` is a tree and the following columns are derived from the path; `disabled` freezes every column." />

## Geometry & custom field names (`itemHeight` / `visibleItemCount` / `valueKey` / `labelKey` / `childrenKey`)

`item-height` is the row height (px design units → rpx) and `visible-item-count` the number of visible rows; `value-key` / `label-key` / `children-key` read business fields, so data need not be reshaped into `value` / `label` / `children`.

<Demo name="picker-view-mp-keys-geometry" description="`itemHeight` / `visibleItemCount` tune row height and visible rows; `valueKey` / `labelKey` / `childrenKey` read custom field names." />

## Live commit while dragging & root styling (`immediateChange` / `customClass` / `customStyle`)

`immediate-change` commits continuously while dragging (not only on release); `custom-class` / `custom-style` land on the root and restyle the roller frame.

<Demo name="picker-view-mp-immediate-custom" description="`immediateChange` fires `change` continuously while dragging; `customClass` / `customStyle` restyle the root frame and fill." />

## Props

| Prop                                    | Type                                       | Default                              | Description                                    |
| --------------------------------------- | ------------------------------------------ | ------------------------------------ | ---------------------------------------------- |
| `modelValue`                            | `Array<string \| number>`                  | `[]`                                 | Selected value per column                      |
| `columns`                               | `Array<Array<string \| number \| object>>` | `[]`                                 | Columns; the option tree when `cascade` is set |
| `itemHeight`                            | `number`                                   | `44`                                 | Row height in px design units                  |
| `visibleItemCount`                      | `number`                                   | `6`                                  | Number of visible rows                         |
| `valueKey` / `labelKey` / `childrenKey` | `string`                                   | `'value'` / `'label'` / `'children'` | Option keys                                    |
| `immediateChange`                       | `boolean`                                  | `false`                              | Emit `change` while dragging                   |
| `cascade`                               | `boolean`                                  | `false`                              | Treat `columns` as a nested tree               |
| `disabled`                              | `boolean`                                  | `false`                              | Disables the roller                            |
| `customClass` / `customStyle`           | `string`                                   | `''`                                 | Root class / inline style                      |

## Events

| Event                   | Description                                            | Payload                   |
| ----------------------- | ------------------------------------------------------ | ------------------------- |
| `update:modelValue`     | Selection changed                                      | `(value: Array)`          |
| `change`                | Selection settled (or per move with `immediateChange`) | `PickerViewChangePayload` |
| `pickstart` / `pickend` | Touch drag start / end                                 | —                         |

## Exposed API

| Member                                | Signature           | Description                                    |
| ------------------------------------- | ------------------- | ---------------------------------------------- |
| `getSelectedValues`                   | `() => Array`       | Current value per column                       |
| `getSelectedOptions`                  | `() => Array`       | Current raw option per column                  |
| `getSelectedLabels`                   | `() => string[]`    | Current label per column                       |
| `getSelectedIndex` / `getColumnIndex` | `() => number[]`    | Selected row index per column                  |
| `getColumnsData` / `getColumnData`    | `(index?) => Array` | Normalized column data                         |
| `resetColumns`                        | `() => void`        | Reset every column to its first selectable row |

## Slots

This component exposes no slots.

## Theme tokens

| Token                                                       | Purpose                       |
| ----------------------------------------------------------- | ----------------------------- |
| `--sn-mp-color-background-elevated`                         | Roller surface                |
| ``--sn-mp-color-text-primary` / `-secondary` / `-disabled`` | Active / idle / disabled rows |
| `--sn-mp-color-border-subtle`                               | Selection indicator           |
| `--sn-mp-font-size-md`                                      | Row text size                 |
| `--sn-mp-font-weight-semibold`                              | Active row weight             |
| ``--sn-mp-spacing-2` / `-3``                                | Indicator inset / row padding |

## Accessibility

- Root is `role="group"` with `aria-disabled`.
- Each row is `role="button"` with `aria-selected` / `aria-disabled`.

## Desktop H5 input

Beyond touch, the H5 build accepts desktop input on the roller: hold the left mouse button and drag up or down to scroll, or turn the mouse wheel — one committed row per notch (disabled rows are skipped, both ends clamp). The wheel gesture drives the roller instead of scrolling the page; clicking a row selects it directly. Mini-program targets stay touch-only.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:
