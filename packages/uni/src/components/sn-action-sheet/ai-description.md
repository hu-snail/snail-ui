# sn-action-sheet — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-action-sheet component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Bottom action panel: a list of tappable rows and/or an icon grid, plus an
optional cancel button. Composed on `sn-popup` (`position="bottom"` + `round`),
so the scrim, slide animation and scroll lock are the popup's.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-action-sheet`
(https://wot-ui.cn/component/action-sheet.html). New props added here MUST also
be added to the wd-action-sheet parity list.

## Not implemented (documented divergences)

- `root-portal` — no portal host on miniprogram.
- `panels` accepts `Panel[]` and `Panel[][]`; a nested array is rendered row by
  row and reported as `{ item, rowIndex, colIndex }`.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-action-sheet v-model="open" :actions="actions" cancel-text="取消" />
```

```ts
import { SnActionSheet } from '@snui/uni';
```

## Props

| Name                  | Type                      | Default | Required | Description                                  |
| --------------------- | ------------------------- | ------- | -------- | -------------------------------------------- |
| `modelValue`          | `boolean`                 | `false` | no       | Visibility (v-model).                        |
| `actions`             | `SnActionSheetAction[]`   | `[]`    | no       | List rows.                                   |
| `panels`              | `Array<Panel \| Panel[]>` | `[]`    | no       | Grid cells; a nested array is multiple rows. |
| `title`               | `string`                  | `''`    | no       | Title above the list.                        |
| `cancelText`          | `string`                  | `''`    | no       | Cancel label; empty hides the button.        |
| `closeOnClickAction`  | `boolean`                 | `true`  | no       | Close after a row / cell is selected.        |
| `closeOnClickModal`   | `boolean`                 | `true`  | no       | Close on scrim tap.                          |
| `duration`            | `number`                  | `200`   | no       | Animation duration in ms.                    |
| `zIndex`              | `number`                  | `10`    | no       | Stacking level.                              |
| `lazyRender`          | `boolean`                 | `true`  | no       | Defer content rendering until first open.    |
| `safeAreaInsetBottom` | `boolean`                 | `true`  | no       | Pad the sheet for the device safe area.      |
| `customTitleClass`    | `string`                  | `''`    | no       | Custom class for the title area.             |
| `customClass`         | `string`                  | `''`    | no       | Custom class for the root node.              |
| `customStyle`         | `string`                  | `''`    | no       | Custom inline style for the panel.           |

`SnActionSheetAction` = `{ name?, description?, color?, icon?, disabled? }`.
`SnActionSheetPanel` = `{ title?, name?, icon? }`.

## Events

| Event                                             | Payload                                             | Description                               |
| ------------------------------------------------- | --------------------------------------------------- | ----------------------------------------- |
| `update:modelValue`                               | `boolean`                                           | v-model sync.                             |
| `select`                                          | `{ item, index }` or `{ item, rowIndex, colIndex }` | Row / cell tapped.                        |
| `cancel`                                          | —                                                   | Cancel tapped.                            |
| `close`                                           | —                                                   | Panel closed (forwarded from `sn-popup`). |
| `click-modal`                                     | —                                                   | Scrim tapped (forwarded from `sn-popup`). |
| `enter` / `after-enter` / `leave` / `after-leave` | —                                                   | Animation legs (forwarded).               |

## Slots

| Slot      | Description                               |
| --------- | ----------------------------------------- |
| `default` | Content above the list, inside the panel. |

## Tokens Consumed (end: mp)

| Token               | CSS Variable                        | Purpose               |
| ------------------- | ----------------------------------- | --------------------- |
| Text primary        | `--sn-mp-color-text-primary`        | Row labels            |
| Text secondary      | `--sn-mp-color-text-secondary`      | Title + grid captions |
| Text tertiary       | `--sn-mp-color-text-tertiary`       | Row descriptions      |
| Text disabled       | `--sn-mp-color-text-disabled`       | Disabled rows         |
| Action primary      | `--sn-mp-color-action-primary`      | Grid icons            |
| Background elevated | `--sn-mp-color-background-elevated` | Cancel button         |
| Background subtle   | `--sn-mp-color-background-subtle`   | Gap strip             |
| Border subtle       | `--sn-mp-color-border-subtle`       | Row separators        |
| Font size SM / LG   | `--sn-mp-font-size-sm` / `-lg`      | Captions / row labels |
| Line height normal  | `--sn-mp-font-line-height-normal`   | All text              |
| Spacing 2–5         | `--sn-mp-spacing-2` … `-5`          | Padding + gaps        |

## Accessibility

- Each row / grid cell: `role="button"` + `aria-disabled`.
- Cancel button: `role="button"`.
- Panel semantics come from `sn-popup` (`role="dialog"` + `aria-modal="true"`).

## Dispose

Nothing of its own: the animation timer and the touchmove interception live in
`sn-popup`, which clears them in `onBeforeUnmount`.

## Versioning

`@snui/uni@0.5.0` — initial release.
