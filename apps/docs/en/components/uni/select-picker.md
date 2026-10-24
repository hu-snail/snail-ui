# SelectPicker · uni-app

`sn-select-picker` is the single / multi select sheet of `@snui/uni`: a list with an optional search field and a confirm footer. easycom auto-registration (`components/sn-select-picker/sn-select-picker.vue` → `<sn-select-picker>`); geometry in `rpx`. `type="checkbox"` takes an array `v-model`, `type="radio"` a scalar; the component normalizes both into one internal set and writes back the declared shape.

## Basic usage

The checkbox type takes an array `v-model`; min / max cap the selection; tapping a row toggles it.

<Demo name="select-picker-mp-basic" description="The checkbox type takes an array `v-model`; min / max cap the selection; tapping a row toggles it." />

## Radio & search (`type` / `filterable` / `checkedColor`)

`type="radio"` writes a scalar; `filterable` adds a search box that filters on the label; `checkedColor` overrides the accent.

<Demo name="select-picker-mp-radio-filter" description="`type=radio` writes a scalar; `filterable` adds a search box that filters on the label; `checkedColor` overrides the accent." />
## Field mapping & buttons (`valueKey` / `labelKey` / `confirmButtonText` / `showConfirm` / `selectSize`)

`valueKey` / `labelKey` map options whose keys are named anything; `confirmButtonText` renames the confirm button and `showConfirm=false` hides it. `selectSize` (`mini` / `small` / `medium` / `large`) is the wot-ui chip-size parity prop; this build derives row height from tokens, so it is **declared but not rendered**.

<Demo name="select-picker-mp-fields-size" description="valueKey / labelKey mapping; confirmButtonText; showConfirm=false; selectSize (declared but not rendered)." />

## Loading state & sheet (`loading` / `loadingColor` / `beforeConfirm` / `scrollIntoView` / scrim and stacking / `custom*`)

`loading` swaps the list for a loading placeholder and `loadingColor` tints the spinner; `beforeConfirm` can veto the confirm; `scrollIntoView` scrolls the selected row into view on open. `closeOnClickModal` / `safeAreaInsetBottom` / `zIndex` / `rootPortal` are forwarded to `sn-popup`; `customClass` / `customStyle` land on the sheet and `customContentClass` on the option container.

<Demo name="select-picker-mp-loading-sheet" description="loading / loadingColor; beforeConfirm; closeOnClickModal; safeAreaInsetBottom; zIndex; rootPortal; scrollIntoView; customClass / customStyle / customContentClass." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| boolean \| Array<...>` | `undefined` | Scalar for radio, array for checkbox |
| `visible` | `boolean` | `false` | Sheet visibility |
| `title` | `string` | `'选择器'` | Toolbar title |
| `checkedColor` | `string` | `''` | Checked accent color |
| `min` / `max` | `number` | `0` | Selection limits (`0` = unconstrained) |
| `type` | `'checkbox' \| 'radio'` | `'checkbox'` | Selection type |
| `valueKey` / `labelKey` | `string` | `'value'` / `'label'` | Option keys |
| `confirmButtonText` | `string` | `'确认'` | Confirm label |
| `loading` / `loadingColor` | `boolean` / `string` | `false` / `''` | Loading state + color |
| `closeOnClickModal` | `boolean` | `true` | Mask tap closes |
| `columns` | `Record<string, unknown>[]` | `[]` | Option list |
| `beforeConfirm` | `({ value, selectedItems }) => boolean \| Promise<boolean>` | `undefined` | Veto hook for confirm |
| `zIndex` / `safeAreaInsetBottom` | `number` / `boolean` | `15` / `true` | Sheet placement |
| `filterable` / `filterPlaceholder` | `boolean` / `string` | `false` / `'搜索'` | Search field |
| `scrollIntoView` | `boolean` | `true` | Scroll the active row into view on open |
| `customContentClass` | `string` | `''` | Option-list wrapper class |
| `showConfirm` | `boolean` | `true` | Render the confirm button |
| `customClass` / `customStyle` | `string` | `''` | Root class / inline style |

> **Not implemented**: `root-portal`: uni-app mini-programs have no portal host.

## Events

| Event | Description | Payload |
| --- | --- | --- |
| `update:modelValue` | Selection changed | `(value)` |
| `update:visible` | Sheet shown / hidden | `(value: boolean)` |
| `change` | Selection changed (same tick) | `{ value }` |
| `confirm` | Confirm pressed and accepted | `{ value, selectedItems }` |
| `cancel` / `open` / `close` | Sheet lifecycle | — |

## Slots

This component exposes no slots.

## Theme tokens

| Token | Purpose |
| --- | --- |
| ``--sn-mp-color-background-elevated`` | Sheet surface |
| ``--sn-mp-color-background-soft`` | Search field fill |
| ``--sn-mp-color-action-primary`` | Checked label / check glyph |
| ``--sn-mp-color-text-on-primary`` | Confirm label |
| ``--sn-mp-color-text-primary` / `-secondary` / `-tertiary`` | Row / footer / meta text |
| ``--sn-mp-color-border-subtle`` | Row + footer rules |
| ``--sn-mp-radius-md` / `-full`` | Corners |

## Accessibility

- Each row is `role="button"` with `aria-pressed` / `aria-disabled`.
- The loading state is `role="status"` + `aria-live="polite"`.
- Cancel / confirm are `role="button"` with `aria-label`.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` / `page.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:

