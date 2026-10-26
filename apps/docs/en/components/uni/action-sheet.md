# ActionSheet · uni-app

`sn-action-sheet` is the bottom action panel of `@snui/uni` (mobile / miniprogram / H5): a list of tappable rows plus an optional icon grid, with a cancel button. It is composed on `sn-popup` (`position="bottom"` + `round`), so the scrim, slide animation and scroll lock are the popup's. Auto-registered through easycom (`components/sn-action-sheet/sn-action-sheet.vue` → `<sn-action-sheet>`); geometry uses `rpx`.

> **Not implemented**
>
> - `root-portal` is not implemented (no portal host on miniprogram).
> - A nested `panels` array renders row by row and `select` reports `{ item, rowIndex, colIndex }`.

## Basic usage

Each `actions` entry renders one row; an empty `cancelText` hides the cancel button.

<Demo name="action-sheet-mp-basic" description="List rows plus a cancel button, with one disabled entry." />

## Icon grid

`panels` accepts a flat `Panel[]` or a nested `Panel[][]`; a nested array renders row by row and `select` reports `{ item, rowIndex, colIndex }`.

<Demo name="action-sheet-mp-panels" description="Single-row and multi-row grids, icons from the sn-icon registry." />

## Close behaviour and animation

- `closeOnClickAction=false` keeps the sheet open after a row is picked, so another row can follow
- `closeOnClickModal=false` still emits `click-modal` on a scrim tap but keeps the sheet open
- `duration` sets the enter / leave timing and `zIndex` the stacking level

<Demo name="action-sheet-mp-behavior" description="Stays open after selecting / scrim tap does not close / duration=600 + zIndex=200." />

## Custom styles and render timing

`customTitleClass` adds a class to the title, `customStyle` lands on the panel, `lazyRender=false` renders the content before the first open and `safeAreaInsetBottom=false` drops the bottom safe-area padding.

<Demo name="action-sheet-mp-custom" description="Title class + panel inline style + eager render + no safe-area padding." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| modelValue | boolean | false | Visibility (`v-model`) |
| actions | SnActionSheetAction[] | [] | List rows |
| panels | Array<Panel \| Panel[]> | [] | Grid cells; a nested array means multiple rows |
| title | string | '' | Title text |
| cancelText | string | '' | Cancel label; an empty string hides the button |
| closeOnClickAction | boolean | true | Close after a row is selected |
| closeOnClickModal | boolean | true | Close on scrim tap |
| duration | number | 200 | Animation duration in ms |
| zIndex | number | 10 | Stacking level |
| lazyRender | boolean | true | Defer content rendering until first open |
| safeAreaInsetBottom | boolean | true | Pad the sheet for the device safe area |
| customTitleClass | string | '' | Custom class for the title area |
| customClass | string | '' | Custom class for the root node |
| customStyle | string | '' | Custom inline style for the panel |

`SnActionSheetAction` = `{ name?, description?, color?, icon?, disabled? }`; `SnActionSheetPanel` = `{ title?, name?, icon? }`.

## Events

| Event | Description | Payload |
| --- | --- | --- |
| update:modelValue | `v-model` sync | boolean |
| select | Row / cell tapped | `{ item, index }` or `{ item, rowIndex, colIndex }` |
| cancel | Cancel tapped | — |
| close | Panel closed (forwarded from `sn-popup`) | — |
| click-modal | Scrim tapped (forwarded from `sn-popup`) | — |
| enter` / `after-enter` / `leave` / `after-leave | Animation legs (forwarded from `sn-popup`) | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Custom content above the list, inside the panel |

## Theme variables

| Variable | Purpose |
| --- | --- |
| --sn-mp-color-text-primary | Row labels |
| --sn-mp-color-text-secondary | Title / grid captions |
| --sn-mp-color-text-tertiary | Row descriptions |
| --sn-mp-color-text-disabled | Disabled rows |
| --sn-mp-color-action-primary | Grid icons |
| --sn-mp-color-background-elevated | Cancel button surface |
| --sn-mp-color-background-subtle | Gap strip |
| --sn-mp-color-border-subtle | Row separators |
| --sn-mp-font-size-sm` / `--sn-mp-font-size-lg | Caption / row label size |
| --sn-mp-font-line-height-normal | All text line height |
| --sn-mp-spacing-2` … `--sn-mp-spacing-5 | Padding and gaps |

## Accessibility

- Each row / grid cell: `role="button"` + `aria-disabled`
- Cancel button: `role="button"`
- Panel semantics come from `sn-popup` (`role="dialog"` + `aria-modal="true"`)

## Dark mode

The panel surface, text and status colors all come from semantic tokens (`--sn-mp-color-background-elevated` / `--sn-mp-color-text-*` / `--sn-mp-color-border-subtle`), all overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:


## Related

- Centred modal: [`sn-dialog`](/en/components/uni/dialog)
- Generic layer: [`sn-popup`](/en/components/uni/popup)
