# SnChart — AI-Friendly Component Description

> Human-readable + AI-parseable description of the chart component. Consumed
> by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A Vue 3 wrapper around Apache ECharts that keeps the chart inside the AUI
design system: token-driven colours, layout presets, one-place icon
configuration, a swappable DOM tooltip, and a fully disposable instance
lifecycle.

## Reference library

Per AGENTS.md §112, a component mirrors a reference library's API surface.
naive-ui has **no chart component**, so this component's reference is ECharts
itself: the `option` prop is a verbatim `EChartsOption`, and every addition is
opt-in and removable. ECharts is also this package's `peerDependency` — the
host owns the version and the module registration.

## Import

```ts
import { SnChart } from '@snui/echarts';
// Framework-agnostic layer (no Vue, no echarts at runtime):
import { buildChartTheme, buildChartOption } from '@snui/echarts/core';
```

## Props

| Name               | Type                                         | Default     | Required | Description                                                                                                                                      |
| ------------------ | -------------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `option`           | `EChartsOption`                              | —           | no       | Native ECharts option. Merged last, so it always wins over the wrapper's derived defaults.                                                       |
| `theme`            | `SnChartThemeConfig`                         | —           | no       | Colour / font / palette overrides plus a `themeOverrides` escape hatch. See below.                                                               |
| `themeMode`        | `'light' \| 'dark' \| 'auto'`                | `'auto'`    | no       | `'auto'` reads `<html data-theme>`, `.dark`, then `prefers-color-scheme`. Changing it re-creates the instance (ECharts binds the theme at init). |
| `layout`           | `SnChartLayoutPreset \| SnChartLayoutConfig` | `'default'` | no       | Preset name or a partial layout config applied on top of `'default'`.                                                                            |
| `icons`            | `SnChartIconsConfig`                         | —           | no       | One place for legend / symbol / toolbox / per-series-type / title glyphs.                                                                        |
| `tooltip`          | `SnChartTooltipConfig`                       | —           | no       | Tooltip mode (`'custom'` default / `'native'` / `false`) and content config.                                                                     |
| `loading`          | `boolean`                                    | `false`     | no       | Show a loading overlay (renders `SnLoading` from `@snui/vue-web`).                                                                               |
| `loadingText`      | `string`                                     | —           | no       | Loading copy.                                                                                                                                    |
| `renderer`         | `'canvas' \| 'svg'`                          | `'canvas'`  | no       | `'svg'` is sharper for print / export.                                                                                                           |
| `height`           | `number \| string`                           | —           | no       | A number is interpreted as px. Omitted → the chart fills its parent box.                                                                         |
| `width`            | `number \| string`                           | —           | no       | Same convention as `height`.                                                                                                                     |
| `devicePixelRatio` | `number`                                     | —           | no       | Canvas pixel-ratio override.                                                                                                                     |
| `useDirtyRect`     | `boolean`                                    | `false`     | no       | ECharts' dirty-rect rendering (large data sets).                                                                                                 |
| `notMerge`         | `boolean`                                    | `false`     | no       | `setOption` merge strategy.                                                                                                                      |
| `lazyUpdate`       | `boolean`                                    | `true`      | no       | Throttle rendering when the option changes rapidly.                                                                                              |
| `ariaLabel`        | `string`                                     | —           | no       | Accessible name for the chart region (§52).                                                                                                      |
| `autoResize`       | `boolean`                                    | `true`      | no       | Observe the container with `ResizeObserver` (window listener fallback).                                                                          |

### `theme` (SnChartThemeConfig)

| Field                                                         | Type                      | Description                                                                                                                                                                                                                             |
| ------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `palette`                                                     | `string[]`                | Full series colour cycle replacement.                                                                                                                                                                                                   |
| `colorPrimary`                                                | `string`                  | Brand colour (palette slot 0). Passed to ECharts verbatim.                                                                                                                                                                              |
| `colorSuccess` / `colorWarning` / `colorDanger` / `colorInfo` | `string`                  | Semantic feedback colours.                                                                                                                                                                                                              |
| `textColor` / `textColorSecondary` / `textColorTertiary`      | `string`                  | Text ramp.                                                                                                                                                                                                                              |
| `backgroundColor`                                             | `string`                  | Plot background. Default transparent (the host card paints it).                                                                                                                                                                         |
| `borderColor`                                                 | `string`                  | Split line + axis line colour.                                                                                                                                                                                                          |
| `fontFamily` / `fontSize`                                     | `string` / `number`       | Base font stack / size.                                                                                                                                                                                                                 |
| `colorSource`                                                 | `'tokens' \| 'resolved'`  | `'tokens'` keeps `var(--sn-web-*)` references; `'resolved'` snapshots literals.                                                                                                                                                         |
| `themeOverrides`                                              | `Record<string, unknown>` | Extra theme keys, merged **recursively** into the generated theme and applied last. Arrays (e.g. `color`) replace wholesale; nested blocks such as `legend.textStyle` merge key by key, and an explicit `undefined` never erases a key. |

### `layout` presets

`'default'` (card, padding 12) · `'compact'` (dense dashboard, padding 8) ·
`'spacious'` (report, padding 20, bottom legend, title shown) ·
`'fullscreen'` (edge-to-edge, inner toolbox) · `'minimal'` (KPI tile, no legend,
no axes).

An object form starts from `'default'` and applies only provided fields:
`{ legend: { position: 'right' }, grid: 24 }`.

### `icons` (SnChartIconsConfig)

| Field        | Type                     | Description                                                            |
| ------------ | ------------------------ | ---------------------------------------------------------------------- |
| `legend`     | `string`                 | Legend marker (ECharts `legend.icon`).                                 |
| `symbol`     | `string`                 | Series symbol (`line` / `bar` / `scatter` / `radar` / `pictorialBar`). |
| `toolbox`    | `Record<string, string>` | Toolbox feature icons keyed by feature name.                           |
| `seriesType` | `Record<string, string>` | Series type → glyph, applied automatically per series.                 |
| `title`      | `string`                 | Title glyph.                                                           |

Icon references accept: a registered glyph name, a ready `path://…` /
`image://…` string, an `http(s)://` URL (wrapped into `image://`), or raw SVG
path data (wrapped into `path://`).

### `tooltip` (SnChartTooltipConfig)

| Field                                                       | Type                            | Default    | Description                                                                                      |
| ----------------------------------------------------------- | ------------------------------- | ---------- | ------------------------------------------------------------------------------------------------ |
| `mode`                                                      | `'custom' \| 'native' \| false` | `'custom'` | DOM tooltip / ECharts' own / disabled.                                                           |
| `trigger`                                                   | `'item' \| 'axis' \| 'none'`    | `'item'`   | Pointer gesture that opens it.                                                                   |
| `followPointer`                                             | `boolean`                       | `true`     | Follow the pointer instead of pinning to the item.                                               |
| `offset`                                                    | `[number, number]`              | `[12, 12]` | Offset from the pointer.                                                                         |
| `showMarker` / `showSeriesName` / `showValue` / `showLabel` | `boolean`                       | `true`     | Row switches.                                                                                    |
| `showPercent`                                               | `boolean`                       | `false`    | Append the percentage (pie-like data).                                                           |
| `precision`                                                 | `number`                        | —          | Decimals, clamped to 0–20 (ECharts' own cap); non-finite input falls back to default formatting. |
| `valueFormatter`                                            | `(value, item) => string`       | —          | Custom value formatter (wins over `precision`).                                                  |
| `labelFormatter`                                            | `(label, items) => string`      | —          | Custom heading formatter.                                                                        |
| `footer`                                                    | `string`                        | —          | Footer row.                                                                                      |
| `html`                                                      | `boolean`                       | `false`    | Render `footer` as HTML (off by default — XSS-safe).                                             |
| `extraRows`                                                 | `{ label, value, color? }[]`    | —          | Extra rows after the series rows.                                                                |
| `width`                                                     | `number`                        | —          | Fixed width in px (otherwise content-sized, max 240).                                            |
| `transition`                                                | `number`                        | `120`      | Enter / leave duration in ms.                                                                    |
| `keepOnHover`                                               | `boolean`                       | `true`     | Keep the tooltip while the pointer is over it.                                                   |
| `nativeOverrides`                                           | `Record<string, unknown>`       | —          | Extra keys merged into the native tooltip option.                                                |

## Events

| Event                    | Payload               | Description                                     |
| ------------------------ | --------------------- | ----------------------------------------------- |
| `click` / `dblclick`     | `SnChartPointEvent`   | A data item / series element was clicked.       |
| `mouseover` / `mouseout` | `SnChartPointEvent`   | Pointer entered / left an item.                 |
| `legendselectchanged`    | `{ name, selected }`  | Legend selection changed.                       |
| `datazoom`               | `{ start?, end? }`    | A dataZoom view changed.                        |
| `rendered`               | —                     | The chart finished rendering.                   |
| `ready`                  | `EChartsType`         | Instance created (attach custom handlers here). |
| `tooltipshow`            | `SnChartTooltipModel` | A custom tooltip is about to show.              |

`SnChartPointEvent`: `{ componentType, seriesType?, seriesIndex?, seriesName?, dataIndex?, name?, value?, data?, color?, percent? }`.

## Slots

| Name      | Slot props         | Description                                                      |
| --------- | ------------------ | ---------------------------------------------------------------- |
| `tooltip` | `{ model, items }` | Replaces the whole tooltip body.                                 |
| `empty`   | —                  | Content shown when the option has no series (default `SnEmpty`). |

## Exposed ref methods (SnChartHandle)

| Method                                                | Description                                         |
| ----------------------------------------------------- | --------------------------------------------------- |
| `instance`                                            | Underlying ECharts instance (`null` when disposed). |
| `resize()`                                            | Re-run `resize()` on the next frame.                |
| `setOption(option, opts?)`                            | Imperative option patch.                            |
| `getOption()`                                         | Read the live option back.                          |
| `dispatchAction(payload)`                             | Trigger an ECharts action.                          |
| `getDataURL({ type, pixelRatio?, backgroundColor? })` | Export png / jpeg / svg.                            |
| `refreshTheme()`                                      | Rebuild the theme (re-creates the instance).        |

## Framework-agnostic core

`@snui/echarts/core` exports, with no Vue and no runtime `echarts` import:

`buildChartTheme` · `buildChartPalette` · `buildChartCssVariables` ·
`resolveTokenColors` · `detectThemeMode` · `CHART_TOKEN_ALIASES` ·
`CHART_FALLBACK_COLORS` · `CHART_CSS_VARIABLES` · `CHART_LAYOUT_PRESETS` ·
`resolveChartLayout` · `normalizeGrid` · `legendPlacement` · `titlePlacement` ·
`gridBox` · `BUILTIN_CHART_ICONS` · `DEFAULT_SERIES_TYPE_ICONS` ·
`registerChartIcons` · `clearChartIcons` · `listChartIconNames` ·
`listRegisteredChartIcons` · `getChartIconDefinition` · `resolveChartIcon` ·
`applyChartIcons` · `svgToPathData` · `buildTooltipModel` ·
`buildNativeTooltipOption` · `formatNativeTooltipText` · `formatTooltipValue` ·
`formatNumber` · `formatPercent` · `deriveExtraRows` · `buildChartOption` ·
`mergeOption` · `cloneOption` · `truncateLabel`.

## Behaviour notes

- **Weight class: heavy.** The component pulls ECharts (host dependency) and
  inits a real chart instance. Colour tokens are CSS variables, so the canvas
  does not re-init on a theme flip when `colorSource: 'tokens'`.
- **The wrapper never fetches data.** `option` is the only input (§18).
- **The custom tooltip disables ECharts' own tooltip** so the two never draw
  at once; `mode: 'native'` switches back.
- **Disposal.** Instance, `ResizeObserver`, window listener, theme
  `MutationObserver`, media-query listener, every ECharts handler and pending
  timers / rAF are released on unmount (§41). A resize queued right before
  unmount cannot touch a disposed instance.
- **Canvas vs SVG.** `renderer: 'svg'` is supported and is what the package's
  own tests run on (happy-dom provides no canvas 2D context).
- **Derived options are caller-first.** Layout presets generate `grid` /
  `legend` / `title` / `toolbox` / `dataZoom` / axes, then the caller's
  `option` overrides them. Two shorthands are normalised rather than forwarded:
  `legend: false` becomes `{ show: false }` (and stops the grid reserving a
  legend band), and `dataZoom: []` means "no zoom window" instead of
  "nothing to tune".

## Anti-patterns

```vue
<!-- ✗ ECharts' tooltip and the wrapper's tooltip at the same time -->
<SnChart :option="{ tooltip: { show: true } }" />

<!-- ✗ 描边图标（lucide 组件路径）—— ECharts 画填充路径，形状画不出来 -->
<SnChart :icons="{ legend: 'M12 3v18' }" />

<!-- ✗ hard-coded colours per chart instead of theme tokens -->
<SnChart :option="{ color: ['#1677ff'] }" />

<!-- ✓ preferred -->
<SnChart :option="option" :theme="{ colorPrimary: 'var(--brand)' }" />
```

## See also

`packages/echarts/README.md` · `.ai/decisions/0007-echarts-package.md` ·
`packages/echarts/src/theme.ts` · `packages/echarts/src/layout.ts` ·
`packages/echarts/src/icons.ts` · `packages/echarts/src/tooltip.ts`
