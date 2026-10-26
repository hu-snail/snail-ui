# sn-sn-select-picker — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end Single / multi select sheet with an optional search field, min / max limits and a confirm footer..
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Single / multi select sheet with an optional search field, min / max limits and a confirm footer.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-select-picker`
(https://wot-ui.cn/component/select-picker.html). New props added here MUST also be
added to the parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-select-picker v-model="picked" v-model:visible="open" :columns="options" type="checkbox" :max="2" />
```

```ts
import SnSelectPicker from '@snui/uni-src/components/sn-select-picker/sn-select-picker.vue';
```

## Props

| Name                               | Type                                                        | Default               | Description                              |
| ---------------------------------- | ----------------------------------------------------------- | --------------------- | ---------------------------------------- |
| `modelValue`                       | `string \| number \| boolean \| Array<...>`                 | `undefined`           | Scalar for radio, array for checkbox.    |
| `visible`                          | `boolean`                                                   | `false`               | Sheet visibility (`v-model:visible`).    |
| `title`                            | `string`                                                    | `'选择器'`            | Toolbar title.                           |
| `checkedColor`                     | `string`                                                    | `''`                  | Checked accent color.                    |
| `min` / `max`                      | `number`                                                    | `0`                   | Selection limits (`0` = unconstrained).  |
| `type`                             | `'checkbox' \| 'radio'`                                     | `'checkbox'`          | Selection type.                          |
| `valueKey` / `labelKey`            | `string`                                                    | `'value'` / `'label'` | Option keys.                             |
| `confirmButtonText`                | `string`                                                    | `'确认'`              | Confirm label.                           |
| `loading` / `loadingColor`         | `boolean` / `string`                                        | `false` / `''`        | Loading state of the list.               |
| `closeOnClickModal`                | `boolean`                                                   | `true`                | Mask tap closes.                         |
| `columns`                          | `Record<string, unknown>[]`                                 | `[]`                  | Option list.                             |
| `beforeConfirm`                    | `({ value, selectedItems }) => boolean \| Promise<boolean>` | `undefined`           | Veto hook for confirm.                   |
| `zIndex` / `safeAreaInsetBottom`   | `number` / `boolean`                                        | `15` / `true`         | Sheet placement.                         |
| `filterable` / `filterPlaceholder` | `boolean` / `string`                                        | `false` / `'搜索'`    | Search field.                            |
| `scrollIntoView`                   | `boolean`                                                   | `true`                | Scroll the active row into view on open. |
| `customContentClass`               | `string`                                                    | `''`                  | Option-list wrapper class.               |
| `showConfirm`                      | `boolean`                                                   | `true`                | Render the confirm button.               |
| `customClass` / `customStyle`      | `string`                                                    | `''`                  | Root forwarding.                         |

## Events

| Name                        | Payload                    | When                           |
| --------------------------- | -------------------------- | ------------------------------ |
| `update:modelValue`         | `(value)`                  | Selection changed.             |
| `update:visible`            | `(value: boolean)`         | Sheet shown / hidden.          |
| `change`                    | `{ value }`                | Selection changed (same tick). |
| `confirm`                   | `{ value, selectedItems }` | Confirm pressed and accepted.  |
| `cancel` / `open` / `close` | —                          | Sheet lifecycle.               |

## Not Implemented

`root-portal` — uni-app miniprograms have no portal host.

## Tokens Consumed (end: mp)

| Token                                                     | Purpose                     |
| --------------------------------------------------------- | --------------------------- |
| `--sn-mp-color-background-elevated`                       | Sheet surface               |
| `--sn-mp-color-background-soft`                           | Search field fill           |
| `--sn-mp-color-action-primary`                            | Checked label / check glyph |
| `--sn-mp-color-text-on-primary`                           | Confirm label               |
| `--sn-mp-color-text-primary` / `-secondary` / `-tertiary` | Row / footer / meta text    |
| `--sn-mp-color-border-subtle`                             | Row + footer rules          |
| `--sn-mp-radius-md` / `-full`                             | Corners                     |

## Accessibility

- Each row is `role="button"` with `aria-pressed` and `aria-disabled`.
- The loading state is `role="status"` + `aria-live="polite"`.
- Cancel / confirm are `role="button"` with `aria-label`.

## Versioning

`@snui/uni@0.5.0` — initial release.
