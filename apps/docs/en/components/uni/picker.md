# Picker · uni-app

`sn-picker` is the sheet picker of `@snui/uni`: `sn-popup` supplies the scrim / animation, `sn-picker-view` supplies the roller, and this component owns the toolbar and the draft value. easycom auto-registration (`components/sn-picker/sn-picker.vue` → `<sn-picker>`); geometry in `rpx`. By default (`immediateChange: false`) rolling only updates the draft and `v-model` is written on confirm — the wot-ui contract.

## Basic usage

Sheet picker: `v-model:visible` drives the sheet; rolling only updates the draft and `v-model` is written on confirm.

<Demo name="picker-mp-basic" description="Sheet picker: `v-model:visible` drives the sheet; rolling only updates the draft and `v-model` is written on confirm." />

## Cascade & confirm guard (`cascade` / `beforeConfirm`)

`cascade` turns `columns` into a tree and confirm returns the path; a `beforeConfirm` that returns false keeps the sheet open and leaves `v-model` untouched.

<Demo name="picker-mp-cascade-confirm" description="`cascade` turns `columns` into a tree and confirm returns the path; a `beforeConfirm` that returns false keeps the sheet open and leaves `v-model` untouched." />
## Field mapping & button labels (`valueKey` / `labelKey` / `childrenKey` / `cancelButtonText`)

`valueKey` / `labelKey` / `childrenKey` map options whose keys are named anything to value / label / children (`childrenKey` is only read in `cascade` mode); `cancelButtonText` renames the cancel button.

<Demo name="picker-mp-fields" description="valueKey / labelKey / childrenKey mapping; cancelButtonText; confirmButtonText." />

## Roller geometry & sheet (`itemHeight` / `visibleItemCount` / `immediateChange` / scrim and stacking / `custom*`)

`itemHeight` (px design value) and `visibleItemCount` set the row height and how many rows are visible; `immediateChange` writes `v-model` on every roll; `closeOnClickModal` / `safeAreaInsetBottom` / `zIndex` / `rootPortal` are forwarded to `sn-popup`; `customClass` / `customStyle` land on the sheet and `customViewClass` on the roller body.

<Demo name="picker-mp-rows-sheet" description="itemHeight / visibleItemCount; immediateChange; closeOnClickModal=false; safeAreaInsetBottom; zIndex; rootPortal; customClass / customStyle / customViewClass." />

## Props

| Prop                                              | Type                                                        | Default                              | Description                                   |
| ------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------ | --------------------------------------------- |
| `modelValue`                                      | `Array<string \| number>`                                   | `[]`                                 | Confirmed value per column                    |
| `visible`                                         | `boolean`                                                   | `false`                              | Sheet visibility (`v-model:visible`)          |
| `columns`                                         | `Array<Array<...>>`                                         | `[]`                                 | Columns, or the option tree in `cascade` mode |
| `cascade`                                         | `boolean`                                                   | `false`                              | Treat `columns` as a tree                     |
| `title`                                           | `string`                                                    | `''`                                 | Toolbar title (empty = no title row)          |
| `cancelButtonText` / `confirmButtonText`          | `string`                                                    | `'取消'` / `'确认'`                  | Toolbar labels                                |
| `valueKey` / `labelKey` / `childrenKey`           | `string`                                                    | `'value'` / `'label'` / `'children'` | Option keys                                   |
| `itemHeight` / `visibleItemCount`                 | `number`                                                    | `44` / `6`                           | Row geometry                                  |
| `beforeConfirm`                                   | `({ value, selectedItems }) => boolean \| Promise<boolean>` | `undefined`                          | Veto hook for confirm                         |
| `closeOnClickModal`                               | `boolean`                                                   | `true`                               | Mask tap closes                               |
| `zIndex`                                          | `number`                                                    | `15`                                 | Stacking level                                |
| `safeAreaInsetBottom`                             | `boolean`                                                   | `true`                               | Safe-area padding                             |
| `immediateChange`                                 | `boolean`                                                   | `false`                              | Write `v-model` on every roll                 |
| `customClass` / `customStyle` / `customViewClass` | `string`                                                    | `''`                                 | Root / sheet / roller classes                 |

> **Not implemented**: `root-portal`: uni-app mini-programs have no portal host, so the sheet cannot be reparented to the page root (same divergence as `sn-popup`).

## Events

| Event               | Description                                      | Payload                    |
| ------------------- | ------------------------------------------------ | -------------------------- |
| `update:modelValue` | Confirmed (or every roll with `immediateChange`) | `(value: Array)`           |
| `update:visible`    | Sheet shown / hidden                             | `(value: boolean)`         |
| `confirm`           | Confirm pressed and accepted                     | `{ value, selectedItems }` |
| `cancel`            | Cancel pressed                                   | —                          |
| `open`              | Sheet opened                                     | —                          |

## Slots

This component exposes no slots.

## Theme tokens

| Token                                         | Purpose              |
| --------------------------------------------- | -------------------- |
| `--sn-mp-color-background-elevated`           | Sheet surface        |
| `--sn-mp-color-border-subtle`                 | Toolbar rule         |
| ``--sn-mp-color-text-primary` / `-secondary`` | Title / cancel label |
| `--sn-mp-color-action-primary`                | Confirm label        |
| `--sn-mp-font-size-md`                        | Toolbar text         |
| ``--sn-mp-spacing-2` / `-3` / `-4``           | Toolbar padding      |

## Accessibility

- Cancel / confirm are `role="button"` with `aria-label`.
- The sheet itself is the `sn-popup` panel, already `role="dialog"` + `aria-modal`.

## Desktop H5 input

Beyond touch, the H5 build accepts desktop input on the sheet roller: hold the left mouse button and drag up or down to scroll, or turn the mouse wheel — one committed row per notch (disabled rows are skipped, both ends clamp). The wheel gesture drives the roller instead of scrolling the page; clicking a row selects it directly. Mini-program targets stay touch-only.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` / `page.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:
