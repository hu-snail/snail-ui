/**
 * @snui/echarts/core — framework-agnostic entry.
 *
 * Imports nothing from Vue and nothing from `echarts` at runtime (ECharts
 * types are `import type` only). A Node-side option generator, an SSR pass, or
 * a non-Vue host can use the whole theme / layout / icon / tooltip / merge
 * layer without pulling either library into the bundle.
 *
 * Consumers who render in a Vue app import `@snui/echarts` instead — it
 * re-exports everything here plus `SnChart`.
 */

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
