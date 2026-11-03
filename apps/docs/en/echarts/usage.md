# Usage

Every input, event, slot and instance method of `SnChart`, plus the four ways to customise it deeply. All examples need only `@snui/echarts` + `echarts`.

---

## Basic shape

```vue
<script setup lang="ts">
import { SnChart } from '@snui/echarts';
import type { SnEChartsOption } from '@snui/echarts';

const option: SnEChartsOption = {/* any standard ECharts option */};
</script>

<template>
  <SnChart :option="option" :height="320" aria-label="Accessible name of the chart" />
</template>
```

Give the chart a height — via `height`, or by giving the parent box one. Otherwise the container is 0 px tall.

---

## Props

| Name               | Type                                 | Default     | Description                                                           |
| ------------------ | ------------------------------------ | ----------- | --------------------------------------------------------------------- |
| `option`           | `EChartsOption`                      | —           | A standard ECharts option. **Merged last, always wins.**              |
| `theme`            | `SnChartThemeConfig`                 | —           | Theme colours / palette / font size / `themeOverrides`.               |
| `themeMode`        | `'light' \| 'dark' \| 'auto'`        | `'auto'`    | `'auto'` probes the host: `data-theme` / `.dark` / system preference. |
| `layout`           | preset name \| `SnChartLayoutConfig` | `'default'` | Layout preset or partial override.                                    |
| `icons`            | `SnChartIconsConfig`                 | —           | Legend / series symbol / toolbox / title icons.                       |
| `tooltip`          | `SnChartTooltipConfig`               | —           | Tooltip config; omitting it enables the custom DOM tooltip.           |
| `loading`          | `boolean`                            | `false`     | Show the loading overlay.                                             |
| `loadingText`      | `string`                             | —           | Loading text.                                                         |
| `renderer`         | `'canvas' \| 'svg'`                  | `'canvas'`  | Renderer; `'svg'` is sharper for print / export.                      |
| `height`           | `number \| string`                   | —           | Fixed height (number = px); otherwise fills the parent.               |
| `width`            | `number \| string`                   | —           | Fixed width (number = px).                                            |
| `devicePixelRatio` | `number`                             | —           | Canvas pixel-ratio override.                                          |
| `useDirtyRect`     | `boolean`                            | `false`     | Dirty-rect rendering (large data sets).                               |
| `notMerge`         | `boolean`                            | `false`     | `setOption` merge strategy; merges by default.                        |
| `lazyUpdate`       | `boolean`                            | `true`      | Throttle updates when the option changes rapidly.                     |
| `ariaLabel`        | `string`                             | —           | Accessible name for the chart region.                                 |
| `autoResize`       | `boolean`                            | `true`      | Turn off the built-in `ResizeObserver`.                               |

---

## Events

| Event                 | Payload               | Description                                                      |
| --------------------- | --------------------- | ---------------------------------------------------------------- |
| `click`               | `SnChartPointEvent`   | A data item / graphic element was clicked.                       |
| `dblclick`            | `SnChartPointEvent`   | Double click.                                                    |
| `mouseover`           | `SnChartPointEvent`   | Pointer entered a data item.                                     |
| `mouseout`            | `SnChartPointEvent`   | Pointer left a data item.                                        |
| `legendselectchanged` | `{ name, selected }`  | Legend selection changed.                                        |
| `datazoom`            | `{ start?, end? }`    | The dataZoom window changed.                                     |
| `rendered`            | —                     | One render finished.                                             |
| `ready`               | `EChartsType`         | The instance was created / rebuilt; attach custom handlers here. |
| `tooltipshow`         | `SnChartTooltipModel` | The custom tooltip is about to show; read the model.             |

```vue
<SnChart
  :option="option"
  @click="({ name, value }) => console.log(name, value)"
  @legendselectchanged="({ selected }) => console.log(selected)"
/>
```

---

## Slots

| Name      | Slot props         | Description                                                                                            |
| --------- | ------------------ | ------------------------------------------------------------------------------------------------------ |
| `tooltip` | `{ model, items }` | Takes over the custom tooltip's content entirely (positioning and visibility stay with the component). |
| `empty`   | —                  | Content shown when there is no data; defaults to `SnEmpty`.                                            |

---

## Ref methods

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { SnChart } from '@snui/echarts';
import type { SnChartHandle } from '@snui/echarts';

const chart = ref<SnChartHandle | null>(null);
</script>

<template>
  <SnChart ref="chart" :option="option" :height="320" />
</template>
```

| Member                     | Description                                     |
| -------------------------- | ----------------------------------------------- |
| `instance`                 | The underlying `EChartsType` (may be `null`).   |
| `resize()`                 | Recompute the size manually.                    |
| `setOption(option, opts?)` | Write the option directly.                      |
| `getOption()`              | Read the current option.                        |
| `dispatchAction(payload)`  | Dispatch an ECharts action.                     |
| `getDataURL(opts?)`        | Export an image (base64).                       |
| `refreshTheme()`           | Force an instance rebuild after a theme change. |

---

## Theme

`theme` states **intent**; the token ↔ ECharts theme mapping is the package's job.

| Field                                                         | Description                                                                               |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `colorPrimary`                                                | Brand colour, occupying the first palette slot.                                           |
| `colorSuccess` / `colorWarning` / `colorDanger` / `colorInfo` | Semantic colours.                                                                         |
| `palette`                                                     | Series colour cycle; order is the order colours are drawn.                                |
| `textColor` / `textColorSecondary` / `textColorTertiary`      | Text ramp.                                                                                |
| `backgroundColor`                                             | Plot background; transparent by default (the host card paints it).                        |
| `borderColor`                                                 | Split-line / axis colour.                                                                 |
| `fontFamily` / `fontSize`                                     | Font stack / base size.                                                                   |
| `colorSource`                                                 | `'tokens'` (default) keeps `var(--sn-web-*)` references; `'resolved'` snapshots literals. |
| `themeOverrides`                                              | Escape hatch: any key merged recursively into the ECharts theme, siblings preserved.      |

<Demo name="echarts-web-theme" description="A brand colour + custom palette + a legend.textStyle escape hatch; colours stay token references, so a dark-mode flip repaints the canvas." />

```vue
<SnChart :option="option" :theme="{ colorPrimary: '#7c3aed', palette: ['#7c3aed', '#06b6d4'] }" />
```

For image export, or a host without a DOM, let the colours degrade to literals:

```vue
<SnChart :option="option" :theme="{ colorSource: 'resolved' }" />
```

---

## Layout

Layout decides everything _around_ the plot: `grid` padding, legend placement, title, toolbox, dataZoom and the axis switches.

| Preset       | Use case                                                      |
| ------------ | ------------------------------------------------------------- |
| `default`    | Card-sized chart (12 px padding, legend centred on top).      |
| `compact`    | Dense dashboards (8 px padding, axis labels truncated).       |
| `spacious`   | Reports / big screens (20 px padding, bottom legend + title). |
| `fullscreen` | Full-panel (0 padding, inner toolbox).                        |
| `minimal`    | KPI tile / sparkline (no legend, no axes).                    |

<Demo name="echarts-web-layout" description="One option switched across default / compact / spacious / minimal — only the layout prop changes." />

The object form starts from `default` and applies only the fields you provide:

```vue
<SnChart
  :option="option"
  :layout="{ legend: { position: 'right', align: 'center' }, grid: 16, axis: { showSplitLine: false } }"
/>
```

**Derived-option conventions** (the caller always wins):

| Written as          | Behaviour                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| `legend: false`     | Normalised to `{ show: false }`, and the grid stops reserving a legend band.                     |
| `legend: { … }`     | Overrides the preset legend key by key; unmentioned keys survive.                                |
| `dataZoom: []`      | Explicitly empty: no zoom window is generated even if the preset enables one.                    |
| `dataZoom: [{ … }]` | Matched to a preset entry by `type`; without a `type` it tunes the first one (usually `inside`). |

`grid` only reserves space for legend / title / toolbox chrome that **actually renders**, so a chart with the legend hidden does not waste an edge.

---

## Icons

ECharts paints `path://` **filled**, so stroke icons (lucide and friends) render blank when dropped in. The package ships a 24×24 filled glyph set and configures every icon slot through one object.

| Field        | Description                                                      |
| ------------ | ---------------------------------------------------------------- |
| `legend`     | Legend marker (ECharts `legend.icon`).                           |
| `symbol`     | Series symbol (`series.symbol`) for every series.                |
| `seriesType` | Per-type symbols: `{ line: 'trend', bar: 'column' }`.            |
| `toolbox`    | Toolbox button icons by feature name: `{ saveAsImage: 'save' }`. |
| `title`      | Glyph shown left of the title text.                              |

<Demo name="echarts-web-icons" description="legend / seriesType / toolbox configured in one place; the built-in glyphs cover the common chart types and tool actions." />

An icon value can be any of:

| Form                        | Example                                    |
| --------------------------- | ------------------------------------------ |
| A built-in glyph name       | `'trend'` / `'save'`                       |
| A ready path / image string | `'path://M0 0h24v24H0z'` / `'image://…'`   |
| An `http(s)` URL            | `'https://cdn.example.com/logo.svg'`       |
| A relative path             | `'/icons/sq.svg'` / `'./sq.svg'`           |
| Raw SVG source              | `'<svg …>…</svg>'` (parsed into path data) |

Built-in glyphs: `bar` `column` `line` `area` `pie` `doughnut` `scatter` `radar` `gauge` `funnel` `tree` `map` `heatmap` `sankey` `refresh` `download` `fullscreen` `zoom-in` `zoom-out` `back` `table` `save` `trend` `warning` `info` `dot`.

Register your own:

```ts
import { registerChartIcons } from '@snui/echarts';

registerChartIcons({ rocket: { svg: '<svg viewBox="0 0 24 24">…</svg>' } });
// now icons={{ legend: 'rocket' }} works
```

**Only unset slots are filled**: an icon written explicitly into `option` is never overwritten, so global configuration and per-chart overrides coexist.

---

## Tooltip

The default tooltip is a **DOM layer** the package draws itself — token-styled, following the host theme, happy with rich text / links / components — rather than ECharts' canvas painting.

| Field                                                       | Default    | Description                                                        |
| ----------------------------------------------------------- | ---------- | ------------------------------------------------------------------ |
| `mode`                                                      | `'custom'` | `'custom'` DOM layer / `'native'` ECharts' own / `false` disabled. |
| `trigger`                                                   | `'item'`   | `'item'` per item / `'axis'` per axis / `'none'` never.            |
| `followPointer`                                             | `true`     | Follow the pointer; `false` pins it to the data item.              |
| `offset`                                                    | `[12, 12]` | Offset from the pointer.                                           |
| `showMarker` / `showSeriesName` / `showValue` / `showLabel` | `true`     | Content switches.                                                  |
| `showPercent`                                               | `false`    | Append the share (pie-like data).                                  |
| `precision`                                                 | —          | Decimals (clamped to 0–20).                                        |
| `valueFormatter`                                            | —          | Custom value formatting; wins over `precision`.                    |
| `labelFormatter`                                            | —          | Custom heading formatting; wins over `showLabel`.                  |
| `footer`                                                    | —          | Footer line.                                                       |
| `html`                                                      | `false`    | Render `footer` as HTML (escaped when off, XSS-safe).              |
| `extraRows`                                                 | —          | Extra rows `[{ label, value, color? }]`.                           |
| `width`                                                     | —          | Fixed width in px; otherwise content-sized with a 240 px cap.      |
| `transition`                                                | `120`      | Enter / leave duration in ms.                                      |
| `keepOnHover`                                               | `true`     | Keep it visible while the pointer is over the tooltip.             |
| `nativeOverrides`                                           | —          | Escape hatch: extra keys merged into the native tooltip option.    |

### Config-driven

<Demo name="echarts-web-tooltip" description="showPercent + precision + footer + extraRows: content switches cover most reporting needs." />

### Fully custom via the slot

`#tooltip` receives `model` (heading / series rows / extra rows / switches) and `items`, so you can drop the default layout and draw your own — positioning and visibility stay with the component:

<Demo name="echarts-web-tooltip-slot" description="Custom tooltip content: colour dot + series name + value + a custom footer, while coordinates and animation stay with the component." />

### Native fallback

For ECharts' original interaction (an `axis` pointer, say), switch back:

<Demo name="echarts-web-native" description="mode='native' + trigger='axis': the tooltip returns to ECharts and only inherits the theme colours." />

> `mode: 'custom'` with `trigger: 'axis'` is supported too: ECharts only assembles the multi-series axis payload inside its own tooltip formatter, so the native tooltip stays enabled but invisible — purely to forward the data to the DOM layer. The two never paint at the same time.

---

## States

```vue
<SnChart :option="option" :loading="loading" loading-text="Loading…" :height="320">
  <template #empty>
    <span>No data</span>
  </template>
</SnChart>
```

When there is no data (the series are empty or all-empty), the `#empty` slot renders — `SnEmpty` from `@snui/vue-web` by default. `loading` and the empty state are mutually exclusive, and loading wins.

---

## Deep customisation

The package never gets in ECharts' way: any option key is usable directly, and only the "around the chart" part goes through config.

```vue
<SnChart
  :option="option"
  :theme="{ colorPrimary: 'var(--brand-500)', themeOverrides: { categoryAxis: { axisTick: { show: false } } } }"
  :tooltip="{ mode: 'native', nativeOverrides: { formatter: (p) => `${p.name}: ${p.value}` } }"
  :icons="{ seriesType: { line: 'trend' } }"
  :layout="{ legend: { position: 'bottom' }, axis: { labelMaxLength: 6 } }"
/>
```

How the three escape hatches divide up:

| Escape hatch              | Scope                                       |
| ------------------------- | ------------------------------------------- |
| `option`                  | Everything — merged last, highest priority. |
| `theme.themeOverrides`    | The ECharts theme layer (global styles).    |
| `tooltip.nativeOverrides` | The native tooltip option layer.            |

---

## FAQ

**The chart doesn't show up / is 0 px tall?** Give `height`, or make the parent box determinate. `autoResize` only recomputes on container changes; it cannot grow the container.

**Dark mode doesn't apply?** `themeMode: 'auto'` relies on the host's `<html data-theme="dark">`, a `.dark` class or the system preference. If the host has its own switch, pass `themeMode` explicitly — that is always the most reliable.

**I want buttons or components inside the tooltip?** Use the `#tooltip` slot rather than `footer` + `html`: the slot is rendered by Vue, so events and components behave normally.

**Exported images have the wrong colours?** The default colours are `var(--sn-web-*)` references, which may not resolve when drawn to a canvas. Set `colorSource: 'resolved'` for export.
