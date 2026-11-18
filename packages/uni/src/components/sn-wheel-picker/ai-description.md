# sn-wheel-picker — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end inline wheel-style
> roller picker. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Inline roller picker preset to the wheel style: the selected row sits on a
rounded pill band (action-primary text), rows two slots away fade out, and
sliding ticks a short haptic per detent (App / mini-program). Use it when the
page embeds a wheel directly (year roller, duration roller, multi-column time
roller). For a bottom sheet use `sn-picker` with `wheel` + `vibrateShort`; for
date columns use `sn-datetime-picker(-view)` with the same props.

## Composition

Thin preset over `sn-picker-view` — `wheel: true` fixed, `vibrateShort`
defaulting to `true`. The roller body, cascade derivation and gesture math
live in `sn-picker-view` / `sn-picker-view-drag`; this component adds no
geometry of its own.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-picker-view`
(https://wot-ui.cn/component/picker-view.html). wot-ui has no wheel-styled
picker — the wheel style and the slide haptic are AUI-additive
(AGENTS.md §112.3a).

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-wheel-picker v-model="year" :columns="[[1991, 1992, 1993]]" />
```

```ts
import SnWheelPicker from '@snui/uni-src/components/sn-wheel-picker/sn-wheel-picker.vue';
import type { PickerViewChangePayload } from '@snui/uni-src/components/sn-picker-view/sn-picker-view-types';
```

## Props

| Name                          | Type                                       | Default  | Required | Description                                        |
| ----------------------------- | ------------------------------------------ | -------- | -------- | -------------------------------------------------- |
| `modelValue`                  | `Array<string \| number>`                  | `[]`     | no       | Selected value per column.                         |
| `columns`                     | `Array<Array<string \| number \| object>>` | `[]`     | no       | Columns; the option tree when `cascade` is set.    |
| `itemHeight`                  | `number`                                   | `44`     | no       | Row height in px design units.                     |
| `visibleItemCount`            | `number`                                   | `6`      | no       | Number of visible rows.                            |
| `valueKey`                    | `string`                                   | `'value'`| no       | Option key holding the value.                      |
| `labelKey`                    | `string`                                   | `'label'`| no       | Option key holding the label.                      |
| `childrenKey`                 | `string`                                   | `'children'` | no   | Option key holding the children (cascade).         |
| `immediateChange`             | `boolean`                                  | `false`  | no       | Emit `change` while dragging.                      |
| `cascade`                     | `boolean`                                  | `false`  | no       | Treat `columns` as a nested tree.                  |
| `disabled`                    | `boolean`                                  | `false`  | no       | Disables the roller.                               |
| `vibrateShort`                | `boolean`                                  | `true`   | no       | Slide haptic per detent (App / MP; H5 skips).      |
| `customClass` / `customStyle` | `string`                                   | `''`     | no       | Root forwarding.                                   |

## Events

| Name                | Payload                   | When                                                    |
| ------------------- | ------------------------- | ------------------------------------------------------- |
| `update:modelValue` | `(value: Array)`          | Selection changed.                                      |
| `change`            | `PickerViewChangePayload` | Selection settled (or per move with `immediateChange`). |
| `pickstart`         | —                         | Touch drag started.                                     |
| `pickend`           | —                         | Touch drag ended.                                       |

## Exposed API

| Member                                | Signature           | Description                                     |
| ------------------------------------- | ------------------- | ----------------------------------------------- |
| `getSelectedValues`                   | `() => Array`       | Current value per column.                       |
| `getSelectedOptions`                  | `() => Array`       | Current raw option per column.                  |
| `getSelectedLabels`                   | `() => string[]`    | Current label per column.                       |
| `getSelectedIndex` / `getColumnIndex` | `() => number[]`    | Selected row index per column.                  |
| `getColumnsData` / `getColumnData`    | `(index?) => Array` | Normalized column data.                         |
| `resetColumns`                        | `() => void`        | Reset every column to its first selectable row. |

## AI Patch Boundary

| Field                | Patchable | Notes                                    |
| -------------------- | --------- | ---------------------------------------- |
| `modelValue`         | yes       | Values must exist in `columns`.          |
| `columns`            | yes       | Primitives or `{ value, label }` records.|
| `itemHeight`         | yes       | px design number.                        |
| `visibleItemCount`   | yes       | Odd numbers keep a centered selection.   |
| `cascade`            | yes       | Requires `childrenKey` tree data.        |
| `disabled`           | yes       | Freezes the roller.                      |
| `vibrateShort`       | yes       | `false` silences the slide haptic.       |
| internal drag state  | readonly  | Never patch gesture state.               |

## Tokens Consumed (end: mp)

| Token                                                     | Purpose                       |
| --------------------------------------------------------- | ----------------------------- |
| `--sn-mp-color-background-elevated`                       | Roller surface                |
| `--sn-mp-color-background-subtle`                         | Wheel pill band               |
| `--sn-mp-color-action-primary`                            | Active row text               |
| `--sn-mp-color-text-primary` / `-secondary` / `-tertiary` / `-disabled` | Row text fade   |
| `--sn-mp-font-size-md` / `--sn-mp-font-weight-semibold`   | Row text                      |
| `--sn-mp-spacing-2` / `-3`                                | Indicator inset / row padding |
| `--sn-picker-view-wheel-radius`                           | Pill band radius override     |

## Accessibility

- Root is `role="group"` with `aria-disabled`.
- Each row is `role="button"` with `aria-selected` / `aria-disabled`.
- Haptics are decorative; no interaction depends on the vibration succeeding.

## Versioning

`@snui/uni@0.5.0` — initial release (AUI-additive component).
