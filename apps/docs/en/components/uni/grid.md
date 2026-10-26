# Grid · uni-app

`sn-grid` is the icon-grid container of `@snui/uni` (mobile / miniprogram / H5); `sn-grid-item` is a single cell. Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## Basic usage

`column` sets the column count; each `sn-grid-item` carries an icon and a label:

<Demo name="grid-mp-basic" description="column=3 gives three columns; border draws the inner rules; icon resolves through the icon registry; value renders a badge." />

## Columns, gutters and flow

`gutter` spaces the cells, `square` forces square cells, and `direction` / `reverse` reflow the content:

<Demo name="grid-mp-layout" description="column=4 with gutter and square cells; direction=horizontal flows the content horizontally; reverse swaps icon and label." />

## Background colour, tap feedback and icon size

`bg-color` overrides the grid background, `clickable` enables cell tap feedback with `hover-class` press state, `center` controls centring, `icon-size` sets the icon size, and `custom-class` / `custom-style` land on the root:

<Demo name="grid-mp-feedback" description="bg-color background; clickable + hover-class feedback; center=false top alignment; icon-size; custom-class / custom-style." />

## Auto registration (easycom)

The component follows the easycom convention, so **no import is needed in a template**:

```vue
<sn-grid :column="3">
  <sn-grid-item text="Home" icon="Home" />
</sn-grid>
```

For an explicit import:

```ts
import { SnGrid } from '@snui/uni/components/sn-grid/sn-grid.vue'
import { SnGridItem } from '@snui/uni/components/sn-grid/sn-grid-item.vue'
```

## Props

### sn-grid

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `column` | `number` | `3` | Column count |
| `border` | `boolean` | `false` | Draw the inner rules |
| `gutter` | `number` | `0` | Cell gutter in px |
| `square` | `boolean` | `false` | Force square cells |
| `clickable` | `boolean` | `false` | Enable tap feedback on every cell |
| `bgColor` | `string` | `''` | Background colour override |
| `hoverClass` | `string` | `'sn-grid-item__content--hover'` | Pressed-state class |
| `center` | `boolean` | `true` | Centre the cell content |
| `direction` | `'horizontal' \| 'vertical'` | `'vertical'` | Cell content flow |
| `reverse` | `boolean` | `false` | Swap icon and label |
| `iconSize` | `string` | `'28px'` | Icon size (px by default) |
| `customClass` | `string` | `''` | Extra class on the root node |
| `customStyle` | `string` | `''` | Inline style on the root node |

### sn-grid-item

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | `''` | Cell label |
| `ellipsis` | `boolean` | `false` | Truncate overflowing text |
| `icon` | `string` | `''` | Icon name (registered via `registerSnIcons()`) |
| `iconColor` | `string` | `''` | Icon colour override |
| `iconPrefix` | `string` | `''` | Iconfont class prefix |
| `cssIcon` | `boolean \| string` | `false` | Render a font icon |
| `isDot` | `boolean` | `false` | Render a dot badge on the icon |
| `value` | `string \| number` | `undefined` | Badge value |
| `max` | `number` | `99` | Badge ceiling; above it renders `{max}+` |
| `url` | `string` | `''` | Target path (forwarded through `click` only) |
| `linkType` | `'navigateTo' \| 'switchTab' \| 'reLaunch' \| 'redirectTo'` | `'navigateTo'` | Navigation mode (forwarded through `click` only) |
| `customClass` | `string` | `''` | Extra class on the cell root |
| `customStyle` | `string` | `''` | Inline style on the cell root |

> **Routing**: `url` / `linkType` are forwarded through `click` only — the component never navigates by itself, because routing belongs to the host AppBridge capability (AGENTS.md §60).

## Events

| Event | Description | Payload |
| --- | --- | --- |
| `click` | Cell tapped while `clickable` or when `url` is set | `({ url, linkType })` |

## Slots

| Slot | Description |
| --- | --- |
| `default` (grid) | Grid content (`sn-grid-item` children) |
| `default` (item) | Custom cell content |
| `icon` (item) | Icon area |
| `text` (item) | Text area |

## Theme variables

| Variable | Purpose |
| --- | --- |
| `--sn-mp-color-background-surface` | Grid surface |
| `--sn-mp-color-background-soft` | Tap feedback fill |
| `--sn-mp-color-border-subtle` | Inner rules |
| `--sn-mp-color-text-secondary` | Icon colour |
| `--sn-mp-color-text-primary` | Label colour |
| `--sn-mp-color-feedback-danger` | Badge fill |
| `--sn-mp-color-text-on-primary` | Badge text |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-xs` | Label / badge size |
| `--sn-mp-font-line-height-tight` | Label line height |
| `--sn-mp-radius-full` | Badge radius |
| `--sn-mp-spacing-2` / `--sn-mp-spacing-4` | Cell padding / vertical padding |

## Accessibility

- The grid is `role="list"` and every cell is `role="listitem"`.
- Badges are decorative text inside the cell; `text` carries the meaning.
- Icons are decorative; the icon name is not announced.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-grid` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`: the grid surface flips to the dark surface, inner rules use the dark border token, icons move to the dark secondary text and labels to the dark primary text, and badges keep the danger hue.

Verify it by wrapping in sn-config-provider 的 theme 设为 dark:


## Related

- Column grid: [`sn-layout`](/en/components/uni/layout)
- Cells: [`sn-cell`](/en/components/uni/cell)
- Badge: [`sn-badge`](/en/components/uni/badge)
