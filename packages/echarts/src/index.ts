/**
 * @snui/echarts — Vue entry.
 *
 * Two public surfaces, deliberately split (AGENTS.md §14 — explicit, minimal,
 * testable):
 *
 *   - `@snui/echarts` (this file) — the Vue component (`SnChart`), the install
 *     plugin, and re-exports of the core layer for convenience;
 *   - `@snui/echarts/core` — the framework-agnostic layer only (theme / layout
 *     / icons / tooltip / option merge), importable from a Node script or a
 *     non-Vue host without pulling Vue or ECharts into the graph.
 *
 * Version: experimental (§79). The public API is not frozen yet.
 */

import type { App, Plugin } from 'vue';
import SnChart from './SnChart.vue';

/** Default export — `app.use(SnUIECharts)`. */
const SnUIECharts: Plugin = {
  install(app: App) {
    app.component('SnChart', SnChart);
  },
};

export default SnUIECharts;
export { SnChart };

/* ── Core layer (re-exported for convenience) ─────────────────────────────── */

export {
  buildChartTheme,
  buildChartPalette,
  buildTintRamp,
  tintColor,
  buildChartCssVariables,
  resolveTokenColors,
  detectThemeMode,
  CHART_TOKEN_ALIASES,
  CHART_FALLBACK_COLORS,
  CHART_CSS_VARIABLES,
} from './theme';
export type { BuildChartThemeOptions } from './theme';

export {
  CHART_LAYOUT_PRESETS,
  resolveChartLayout,
  normalizeGrid,
  legendPlacement,
  titlePlacement,
  gridBox,
} from './layout';

export {
  BUILTIN_CHART_ICONS,
  DEFAULT_SERIES_TYPE_ICONS,
  registerChartIcons,
  clearChartIcons,
  listChartIconNames,
  listRegisteredChartIcons,
  getChartIconDefinition,
  resolveChartIcon,
  applyChartIcons,
  svgToPathData,
} from './icons';
export type { SnChartIconsConfig } from './icons';

export {
  buildTooltipModel,
  buildNativeTooltipOption,
  formatNativeTooltipText,
  formatTooltipValue,
  formatNumber,
  formatPercent,
  deriveExtraRows,
} from './tooltip';

export { buildChartOption, mergeOption, cloneOption, truncateLabel } from './options';
export type { BuildChartOptionOptions, BuiltChartOption } from './options';

export type {
  SnEChartsOption,
  SnChartThemeMode,
  SnChartColorSource,
  SnChartTokenColorMap,
  SnChartThemeConfig,
  SnChartLayoutPreset,
  SnChartLayoutConfig,
  SnChartLayout,
  SnChartGridPadding,
  SnChartLegendLayout,
  SnChartTitleLayout,
  SnChartToolboxLayout,
  SnChartDataZoomLayout,
  SnChartAxisLayout,
  SnChartTooltipConfig,
  SnChartTooltipItem,
  SnChartTooltipExtraRow,
  SnChartTooltipModel,
  SnChartIcon,
  SnChartIconDefinition,
  SnChartPointEvent,
  SnChartHandle,
} from './types';
