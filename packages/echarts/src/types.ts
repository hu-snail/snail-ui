/**
 * @snui/echarts — shared types for the framework-agnostic core layer.
 *
 * The core layer (`@snui/echarts/core`) never imports Vue: theme building,
 * layout presets, the icon registry, the tooltip renderer and option merging
 * are pure functions over plain objects. That keeps a Node-side option
 * generator (SSR / build script / AI tool) usable without pulling Vue in.
 *
 * ECharts types are imported type-only from `echarts` (a peer dependency) so
 * the emitted `dist/core.js` carries no runtime echarts import.
 */

import type { EChartsOption } from 'echarts';

/** Re-export of the upstream option type so consumers import it from here. */
export type SnEChartsOption = EChartsOption;

/** Theme mode the chart renders against. */
export type SnChartThemeMode = 'light' | 'dark';

/** How a theme colour reaches the chart. */
export type SnChartColorScheme = 'light' | 'dark';

/**
 * Token source for a chart theme.
 *
 *   - `'tokens'` (default): colours are CSS `var(--sn-web-*)` references, so
 *     the chart follows the host's token cascade live — switching the
 *     `<html data-theme>` (or a Style Pack) repaints the chart on the next
 *     render without rebuilding the option.
 *   - `'resolved'`: colours are literal values snapshotted from the cascade
 *     at build time (via `resolveTokenColors()` reading the live DOM). Use
 *     this when the target cannot resolve CSS variables (e.g. a canvas
 *     exported to an image, or a non-DOM host).
 */
export type SnChartColorSource = 'tokens' | 'resolved';

/** Semantic token names the theme builder consumes. */
export interface SnChartTokenColorMap {
  readonly primary: string;
  readonly primaryHover: string;
  readonly primarySoft: string;
  readonly success: string;
  readonly warning: string;
  readonly danger: string;
  readonly info: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textTertiary: string;
  readonly textOnPrimary: string;
  readonly surface: string;
  readonly surfaceSubtle: string;
  readonly surfaceElevated: string;
  readonly borderDefault: string;
  readonly borderSubtle: string;
}

/**
 * Theme colour configuration — the `theme` prop / `buildChartTheme()` input.
 *
 * Everything is optional: an omitted field keeps the token-derived default.
 * The object is intentionally flat (no nesting) so it maps 1:1 onto the
 * public props and onto a design-tool config panel.
 */
export interface SnChartThemeConfig {
  /**
   * Palette for the series colour cycle. Order matters — ECharts walks it in
   * sequence. Omitted → the token-driven palette
   * (primary / success / warning / danger / purple / teal …).
   */
  readonly palette?: readonly string[] | undefined;
  /**
   * Brand colour. Sets `--sn-chart-color-primary` and the first palette slot.
   * Accepts any CSS colour (`#1677ff`, `rgb(...)`, `var(--brand)`) — it is
   * passed to ECharts verbatim.
   */
  readonly colorPrimary?: string | undefined;
  /** Success / positive colour. */
  readonly colorSuccess?: string | undefined;
  /** Warning colour. */
  readonly colorWarning?: string | undefined;
  /** Danger / negative colour. */
  readonly colorDanger?: string | undefined;
  /** Info / neutral-accent colour. */
  readonly colorInfo?: string | undefined;
  /** Primary text colour (title, axis labels, legend text). */
  readonly textColor?: string | undefined;
  /** Secondary text colour (axis names, subtitles). */
  readonly textColorSecondary?: string | undefined;
  /** Tertiary text colour (axis ticks, minor labels). */
  readonly textColorTertiary?: string | undefined;
  /** Plot / card background. Default transparent (the host card paints it). */
  readonly backgroundColor?: string | undefined;
  /** Split line + axis line colour. */
  readonly borderColor?: string | undefined;
  /** Font family override. Default follows `--sn-web-font-family-body`. */
  readonly fontFamily?: string | undefined;
  /** Base font size in px for axis / legend / title. Default 12. */
  readonly fontSize?: number | undefined;
  /**
   * `'tokens'` (default) keeps `var(--sn-web-*)` references so the chart
   * follows the live cascade; `'resolved'` snapshots literals (see
   * `SnChartColorSource`).
   */
  readonly colorSource?: SnChartColorSource | undefined;
  /**
   * Extra keys merged into the ECharts theme object verbatim. Escape hatch for
   * theme-level options this wrapper does not model (e.g. `categoryAxis`
   * specifics). Applied last, so it wins.
   */
  readonly themeOverrides?: Record<string, unknown> | undefined;
}

/** Layout preset names — the `layout` prop. */
export type SnChartLayoutPreset = 'default' | 'compact' | 'spacious' | 'fullscreen' | 'minimal';

/**
 * Layout configuration — the `layout` prop.
 *
 * Either a preset name or an object. The object form starts from the
 * `'default'` preset and applies only the provided fields, so a caller can
 * tweak `legend.position` without restating every padding.
 */
export interface SnChartLayoutConfig {
  /** Grid padding in px (number) or any CSS length (string). */
  readonly padding?: number | string | undefined;
  /** Inner padding for the plotting area — [top, right, bottom, left]. */
  readonly grid?: SnChartGridPadding | undefined;
  /** Legend placement + visibility. */
  readonly legend?: SnChartLegendLayout | undefined;
  /** Title placement + visibility. */
  readonly title?: SnChartTitleLayout | undefined;
  /** Toolbox placement + visibility. */
  readonly toolbox?: SnChartToolboxLayout | undefined;
  /** Show `dataZoom` inside scrolling axes when the option has one. */
  readonly dataZoom?: SnChartDataZoomLayout | undefined;
  /** Show axis names / ticks. */
  readonly axis?: SnChartAxisLayout | undefined;
}

/** Grid padding tuple or a scalar applied on all sides. */
export type SnChartGridPadding =
  number | string | readonly [number | string, number | string, number | string, number | string];

export interface SnChartLegendLayout {
  readonly show?: boolean | undefined;
  readonly position?: 'top' | 'bottom' | 'left' | 'right' | undefined;
  /** Horizontal anchoring of the legend group. */
  readonly align?: 'left' | 'center' | 'right' | undefined;
  /** Legend glyph (ECharts `legend.icon`); usually set via `icons.legend`. */
  readonly icon?: string | undefined;
  /** Orient legend items. Default follows `position`. */
  readonly orient?: 'horizontal' | 'vertical' | undefined;
}

export interface SnChartTitleLayout {
  readonly show?: boolean | undefined;
  readonly position?: 'left' | 'center' | 'right' | undefined;
  readonly subtext?: boolean | undefined;
}

export interface SnChartToolboxLayout {
  readonly show?: boolean | undefined;
  readonly position?: 'inner' | 'outer' | undefined;
  readonly align?: 'left' | 'right' | undefined;
}

export interface SnChartDataZoomLayout {
  readonly show?: boolean | undefined;
  readonly type?: 'inside' | 'slider' | 'both' | undefined;
  readonly position?: 'top' | 'bottom' | undefined;
}

export interface SnChartAxisLayout {
  readonly show?: boolean | undefined;
  readonly showLabel?: boolean | undefined;
  readonly showSplitLine?: boolean | undefined;
  readonly showAxisLine?: boolean | undefined;
  /** Rotate x-axis labels in degrees. */
  readonly labelRotate?: number | undefined;
  /** Truncate axis labels longer than N chars with an ellipsis. */
  readonly labelMaxLength?: number | undefined;
}

/**
 * A fully-resolved sub-shape: every field required *and* non-undefined.
 *
 * `Required<T>` alone is not enough under `exactOptionalPropertyTypes`: a
 * `foo?: X | undefined` field becomes `foo: X | undefined` with `Required`,
 * so `layout.legend.show` would still be optional for a consumer. This mapped
 * type strips `undefined` as well, which is what a resolved preset actually
 * guarantees.
 */
export type SnChartResolved<T> = { readonly [K in keyof T]-?: Exclude<T[K], undefined> };

/** Resolved layout — every field filled, produced by `resolveChartLayout()`. */
export interface SnChartLayout {
  readonly padding: number | string;
  readonly grid: readonly [number | string, number | string, number | string, number | string];
  readonly legend: SnChartResolved<SnChartLegendLayout>;
  readonly title: SnChartResolved<SnChartTitleLayout>;
  readonly toolbox: SnChartResolved<SnChartToolboxLayout>;
  readonly dataZoom: SnChartResolved<SnChartDataZoomLayout>;
  readonly axis: SnChartResolved<SnChartAxisLayout>;
}

/**
 * Tooltip configuration — the `tooltip` prop.
 *
 * The wrapper renders its own DOM tooltip (token-styled, follows the host
 * theme, supports rich rows / footer / custom content) instead of ECharts'
 * built-in canvas tooltip. Set `mode: 'native'` to fall back to ECharts'
 * own tooltip with only the theme applied.
 */
export interface SnChartTooltipConfig {
  /**
   * `'custom'` (default) → the wrapper's token-styled DOM tooltip;
   * `'native'` → ECharts' built-in canvas tooltip (themed but not restyled);
   * `false` → tooltip disabled.
   */
  readonly mode?: 'custom' | 'native' | false | undefined;
  /** Which pointer gesture opens the tooltip. Default 'item'. */
  readonly trigger?: 'item' | 'axis' | 'none' | undefined;
  /** Follow the pointer instead of pinning to the data item. Default true. */
  readonly followPointer?: boolean | undefined;
  /** Offset from the pointer in px. Default [12, 12]. */
  readonly offset?: readonly [number, number] | undefined;
  /** Show a coloured dot per series. Default true. */
  readonly showMarker?: boolean | undefined;
  /** Show the series name row. Default true. */
  readonly showSeriesName?: boolean | undefined;
  /** Show the value row. Default true. */
  readonly showValue?: boolean | undefined;
  /** Show the axis / category name as the tooltip heading. Default true. */
  readonly showLabel?: boolean | undefined;
  /** Append the series' percentage of the total (pie-like data). Default false. */
  readonly showPercent?: boolean | undefined;
  /** Number of decimals for values. Default: leave ECharts' formatting alone. */
  readonly precision?: number | undefined;
  /** Custom value formatter — wins over `precision`. */
  readonly valueFormatter?: ((value: unknown, params: SnChartTooltipItem) => string) | undefined;
  /** Heading formatter — wins over `showLabel`. */
  readonly labelFormatter?:
    ((label: string, params: readonly SnChartTooltipItem[]) => string) | undefined;
  /** Rich footer row (plain text or HTML string when `html` is true). */
  readonly footer?: string | undefined;
  /** Render `footer` as HTML. Default false (plain text, XSS-safe). */
  readonly html?: boolean | undefined;
  /** Extra rows appended after the series rows. */
  readonly extraRows?: readonly SnChartTooltipExtraRow[] | undefined;
  /** Fixed width in px. Omitted → content-sized with a 240px max. */
  readonly width?: number | undefined;
  /** Enter / leave transition duration in ms. Default 120. */
  readonly transition?: number | undefined;
  /** Keep the tooltip pinned while the pointer is over it. Default true. */
  readonly keepOnHover?: boolean | undefined;
  /** Escape hatch: extra props merged into the native tooltip option. */
  readonly nativeOverrides?: Record<string, unknown> | undefined;
}

/** One series entry inside a custom tooltip. */
export interface SnChartTooltipItem {
  readonly seriesName: string;
  readonly seriesIndex: number;
  readonly dataIndex: number;
  readonly value: unknown;
  readonly color: string;
  readonly percent?: number | undefined;
  readonly axisValue?: string | undefined;
  readonly marker?: string | undefined;
  readonly data?: unknown;
}

/** An extra tooltip row (label + value pairs from `extraRows`). */
export interface SnChartTooltipExtraRow {
  readonly label: string;
  readonly value: string;
  readonly color?: string | undefined;
}

/** Payload the tooltip model is built from — also the `tooltip` slot's props. */
export interface SnChartTooltipModel {
  readonly label: string;
  readonly items: readonly SnChartTooltipItem[];
  readonly footer?: string | undefined;
  readonly extraRows: readonly SnChartTooltipExtraRow[];
  readonly showMarker: boolean;
  readonly showSeriesName: boolean;
  readonly showValue: boolean;
  readonly showLabel: boolean;
  readonly showPercent: boolean;
  readonly html: boolean;
  readonly width?: number | undefined;
}

/** A resolved icon: what ECharts needs to draw it. */
export interface SnChartIcon {
  /** `path://<svg path>` / `image://<url>` string ECharts understands. */
  readonly value: string;
  /** Original name it was registered under. */
  readonly name: string;
}

/** Icon registry entry. */
export interface SnChartIconDefinition {
  /** SVG path data (`M…`), an `image://` URL, or a raw `<svg>` element. */
  readonly path?: string | undefined;
  /** SVG source — parsed into path data on registration. */
  readonly svg?: string | undefined;
  /** Image URL — wrapped into `image://<url>`. */
  readonly image?: string | undefined;
  /**
   * `fill` (default) keeps the shape filled with the series colour;
   * `stroke` is for outline icons — ECharts cannot stroke a path, so
   * stroke-only icons are converted to filled geometry where possible.
   */
  readonly kind?: 'fill' | 'stroke' | undefined;
}

/** Public events the chart wrapper emits. */
export interface SnChartPointEvent {
  readonly componentType: string;
  readonly seriesType?: string | undefined;
  readonly seriesIndex?: number | undefined;
  readonly seriesName?: string | undefined;
  readonly dataIndex?: number | undefined;
  readonly name?: string | undefined;
  readonly value?: unknown;
  readonly data?: unknown;
  readonly color?: string | undefined;
  readonly percent?: number | undefined;
}

/** Handle exposed by `<SnChart ref="…">` — the imperative escape hatch. */
export interface SnChartHandle {
  /** Underlying ECharts instance (null before init / after dispose). */
  readonly instance: unknown;
  /** Re-run `resize()` — e.g. after the container's size changed. */
  resize(): void;
  /** Imperative option patch (merged onto the current option). */
  setOption(option: SnEChartsOption, opts?: { notMerge?: boolean; lazyUpdate?: boolean }): void;
  /** Read the live option back (useful for debugging / export). */
  getOption(): SnEChartsOption | undefined;
  /** Trigger an ECharts action (`highlight` / `downplay` / `showTip` …). */
  dispatchAction(payload: Record<string, unknown>): void;
  /** Export the chart as a data URL (png / jpeg / svg). */
  getDataURL(opts?: {
    type?: 'png' | 'jpeg' | 'svg';
    pixelRatio?: number;
    backgroundColor?: string;
  }): string;
  /** Manually rebuild the theme (e.g. after a token override outside Vue). */
  refreshTheme(): void;
}
