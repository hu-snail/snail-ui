# Layout · uni-app

`sn-layout` is the 24-column grid row of `@snui/uni` (mobile / miniprogram / H5); `sn-col` is a column. Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## Basic usage

`span` measures the column in 24ths; a row's columns usually add up to 24:

<Demo name="layout-mp-basic" description="span is the column count out of 24; the three common splits are 24, 12+12 and 8+8+8." />

## Gutters, offsets and alignment

`gutter` spaces the columns, `offset` pushes a column right, and `justify` / `align` control alignment:

<Demo name="layout-mp-gutter" description="gutter=16 spaces the columns; offset=8 pushes a column right; justify=space-between with align=middle aligns the row." />

## Every alignment step and custom styles

All six `justify` steps and all three `align` steps work on their own; `custom-class` / `custom-style` land on the row and column roots:

<Demo name="layout-mp-align" description="justify center / end / space-around / space-evenly; align middle / bottom; row-level and column-level customClass / customStyle." />

## Auto registration (easycom)

The component follows the easycom convention, so **no import is needed in a template**:

```vue
<sn-layout :gutter="16">
  <sn-col :span="12">Left</sn-col>
  <sn-col :span="12">Right</sn-col>
</sn-layout>
```

For an explicit import:

```ts
import { SnLayout } from '@snui/uni/components/sn-layout/sn-layout.vue';
import { SnCol } from '@snui/uni/components/sn-layout/sn-col.vue';
```

## Props

### sn-layout

| Prop          | Type                                                                                  | Default   | Description                   |
| ------------- | ------------------------------------------------------------------------------------- | --------- | ----------------------------- |
| `gutter`      | `number`                                                                              | `0`       | Column gutter in px           |
| `justify`     | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around' \| 'space-evenly'` | `'start'` | Main-axis alignment           |
| `align`       | `'top' \| 'middle' \| 'bottom'`                                                       | `'top'`   | Cross-axis alignment          |
| `customClass` | `string`                                                                              | `''`      | Extra class on the root node  |
| `customStyle` | `string`                                                                              | `''`      | Inline style on the root node |

### sn-col

| Prop          | Type     | Default | Description                     |
| ------------- | -------- | ------- | ------------------------------- |
| `span`        | `number` | `24`    | Column width in 24ths           |
| `offset`      | `number` | `0`     | Left offset in 24ths            |
| `customClass` | `string` | `''`    | Extra class on the column root  |
| `customStyle` | `string` | `''`    | Inline style on the column root |

## Events

None. `sn-layout` / `sn-col` are pure layout components with no interaction surface (AGENTS.md §32).

## Slots

| Slot               | Description                     |
| ------------------ | ------------------------------- |
| `default` (layout) | Row content (`sn-col` children) |
| `default` (col)    | Column content                  |

## Theme variables

`sn-layout` / `sn-col` consume no colour tokens: they emit geometry only (`flex-basis` / `margin` / `padding`), and colour comes entirely from the content inside each column. That is deliberate — a layout component should not have a look of its own.

## Accessibility

- The components add no role or aria attributes: they are pure layout containers and the inner content carries the semantics.
- No keyboard interaction, so no `tabindex`.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

`sn-layout` / `sn-col` declare no colours, so dark mode needs no adaptation: backgrounds and text come from the content's own `--sn-mp-color-*` tokens, which flip automatically under `.sn-theme-dark`.

Verify it by wrapping in sn-config-provider 的 theme 设为 dark:

## Related

- Grid: [`sn-grid`](/en/components/uni/grid)
- Cells: [`sn-cell`](/en/components/uni/cell)
- Gap: [`sn-gap`](/en/components/uni/gap)
