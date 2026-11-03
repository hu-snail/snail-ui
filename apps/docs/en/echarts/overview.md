# ECharts Charts

`@snui/echarts` is snail-aui's **chart plugin**: it adds a host-integration layer on top of Apache ECharts rather than replacing the chart library.

ECharts decides **what is drawn** — the `option` contract, coordinate systems, series types; every line of option you write stays valid. This package covers **everything around the chart**: how theme colours follow the host, how layout stays consistent, how icons are configured in one place, and how the tooltip becomes a DOM layer that can hold rich content. The two concerns are orthogonal, which is why the package is thin — ECharts still does the work.

> Status: **experimental** (§79). The public API is not frozen; breaking changes go through a changeset.

---

## Why not use ECharts directly

Inside a component library, every chart page re-solves the same four problems:

| Common problem with raw ECharts                                                              | What this package does                                                                                         |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Colours hard-coded into the option, so dark mode / Style Pack switches don't reach the chart | `theme` states intent; colours compile to `var(--sn-web-*)` references and follow the token cascade            |
| Every page writes its own `grid` / `legend` padding, so charts don't look alike              | 5 layout presets + partial overrides, and `grid` only reserves space for chrome that actually renders          |
| Icons configured in four places (legend, series symbol, toolbox, title)                      | One `icons` object covers every icon slot, with built-in filled glyphs (stroke icons paint nothing in ECharts) |
| ECharts' tooltip is canvas-drawn: no buttons, no rich text, no components                    | A token-styled **DOM tooltip** by default, plus a `#tooltip` slot for full control                             |

---

## Install

```bash
pnpm add @snui/echarts echarts
```

`echarts` is a **peerDependency** (`^5.6.0 || ^6.0.0`): the host owns the version, the on-demand registration and the bundle size, and `@snui/echarts` does not bundle it again. `@snui/vue-web` is a regular dependency, used for primitives such as loading / empty.

Import the bundled styles once (tooltip skin, entirely `--sn-web-*` tokens):

```ts
import '@snui/echarts/styles';
```

Style-Pack themes and the token cascade come from `@snui/vue-web/styles`; the two are meant to be used together.

---

## Quick start

Pass `option` and nothing else — the rest is derived:

```vue
<script setup lang="ts">
import { SnChart } from '@snui/echarts';
import type { SnEChartsOption } from '@snui/echarts';

const option: SnEChartsOption = {
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', name: 'Visits', smooth: true, data: [820, 932, 901, 934, 1290] },
    { type: 'bar', name: 'Orders', data: [220, 282, 291, 334, 390] },
  ],
};
</script>

<template>
  <SnChart :option="option" :height="280" />
</template>
```

<Demo name="echarts-web-basic" description="Only an option: two series produce the legend automatically, colours come from tokens, and the tooltip is this package's own DOM layer." />

Or register it globally:

```ts
import { createApp } from 'vue';
import SnUIECharts from '@snui/echarts';
import '@snui/echarts/styles';

createApp(App).use(SnUIECharts); // registers <SnChart>
```

---

## Capability map

| Capability                                                            | Entry point                      | Docs                                                 |
| --------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------- |
| Theme colours (palette / brand / semantic / font size / escape hatch) | `theme` prop                     | [Usage · Theme](/en/echarts/usage#theme)             |
| Layout presets and partial overrides                                  | `layout` prop                    | [Usage · Layout](/en/echarts/usage#layout)           |
| One-stop icon configuration                                           | `icons` prop                     | [Usage · Icons](/en/echarts/usage#icons)             |
| Deep tooltip customisation (custom / slot / native fallback)          | `tooltip` prop + `#tooltip` slot | [Usage · Tooltip](/en/echarts/usage#tooltip)         |
| Loading / empty states                                                | `loading` prop + `#empty` slot   | [Usage · States](/en/echarts/usage#states)           |
| Instance-level capabilities (export image / dispatch action)          | the `ref` handle                 | [Usage · Ref methods](/en/echarts/usage#ref-methods) |
| Framework-agnostic layer (generate options in Node / SSR / AI tools)  | `@snui/echarts/core`             | [Framework-agnostic core](#framework-agnostic-core)  |

---

## Design principles

1. **The `option` contract is unchanged.** Your option is merged last and always wins; the package only fills in derived configuration around it.
2. **Tokens, not literals.** The default `colorSource: 'tokens'` keeps colours as `var(--sn-web-*)` references, so switching dark mode or a Style Pack repaints the canvas **without rebuilding the instance**. Switch to `'resolved'` snapshots for image export or non-DOM hosts.
3. **Platform differences are detected, not branched.** Theme mode probes `<html data-theme>` → `.dark` → `prefers-color-scheme` and then follows changes with a `MutationObserver` and a media-query listener.
4. **Everything is disposable.** The instance, `ResizeObserver`, window listener, theme `MutationObserver`, media-query listener, every ECharts handler and any pending timer / rAF are released on unmount (§41); a resize queued right before unmount cannot touch a disposed instance (§82).

---

## Framework-agnostic core

Theme building, layout resolution, the icon registry, tooltip rendering and option merging contain no Vue code:

```ts
import { buildChartTheme, buildChartOption, resolveChartLayout } from '@snui/echarts/core';

// Generate a valid option in a Node script / SSR pass / AI tool —
// no Vue, and no echarts runtime.
const { option, layout, customTooltip } = buildChartOption({
  option: rawOption,
  layout: 'compact',
  theme,
});
```

The `@snui/echarts` entry re-exports this layer, so Vue apps only need the main entry.

---

## Relationship to ECharts

- **Not a fork, and not a partial re-export of ECharts**: every series type, coordinate system, `graphic`, `dataset` and custom series is available.
- **Does not register ECharts components**: the main entry uses the full `echarts` build. To slim it down, import `echarts/core` in the host and register what you need, or wait for the on-demand entry.
- **Does not fetch data**: `option` is the only input; the package reads from nowhere (§18).

## Known trade-offs

| Trade-off                    | Notes                                                                                                                         |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| ECharts is a peer dependency | The host owns version and bundle size; upgrading ECharts needs no release here                                                |
| Full build                   | The main entry uses the full `echarts` package; a slim on-demand entry is not available yet                                   |
| Theme is bound at `init`     | ECharts' `setTheme` is private, so theme changes dispose and re-init, gated by a content signature to avoid needless rebuilds |
| Icons are filled paths       | ECharts paints `path://` filled, so stroke icons (lucide and friends) render blank; the package ships filled glyphs           |
| uni / mini-program ends      | Only the web component ships today (it depends on `@snui/vue-web`); multi-end rendering is out of scope                       |
