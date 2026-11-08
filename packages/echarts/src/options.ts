/**
 * @snui/echarts — option assembly.
 *
 * `buildChartOption()` is the one function the Vue layer calls per render. It
 * layers, in order:
 *
 *   1. layout preset → `grid` / `legend` / `title` / `toolbox` / `dataZoom` /
 *      axis chrome defaults;
 *   2. icon config → legend icon, per-type symbols, toolbox feature icons;
 *   3. tooltip config → native tooltip option (or `show: false` for the
 *      custom DOM path, which the Vue layer renders itself);
 *   4. the caller's own option — **always wins**, per AGENTS.md §10.
 *
 * The caller's option is deep-cloned before merging: a Vue `props` object is a
 * reactive proxy, and handing that proxy to ECharts lets it hold references to
 * reactive state, which leaks memory and produces "component was made a
 * reactive object" warnings (§82).
 */

import type {
  SnChartLayout,
  SnChartLayoutConfig,
  SnChartLayoutPreset,
  SnEChartsOption,
} from './types';
import type { SnChartIconsConfig } from './icons';
import type { SnChartTooltipConfig } from './types';
import { gridBox, legendPlacement, resolveChartLayout, titlePlacement } from './layout';
import { applyChartIcons } from './icons';
import { buildNativeTooltipOption } from './tooltip';

/** Inputs for `buildChartOption()`. */
export interface BuildChartOptionOptions {
  /** The caller's option — merged last, so it wins. */
  readonly option?: SnEChartsOption | undefined;
  /** Layout preset or partial layout config. */
  readonly layout?: SnChartLayoutPreset | SnChartLayoutConfig | undefined;
  /** Icon configuration. */
  readonly icons?: SnChartIconsConfig | undefined;
  /** Tooltip configuration. */
  readonly tooltip?: SnChartTooltipConfig | undefined;
  /**
   * Axis-trigger capture. ECharts only reports an axis payload (all series at
   * one category) through its own tooltip formatter, so the custom DOM tooltip
   * subscribes here and re-renders from what this callback receives. Ignored
   * when the tooltip is not in custom mode with `trigger: 'axis'`.
   */
  readonly tooltipCapture?: ((params: unknown) => void) | undefined;
}

/** Result of `buildChartOption()` — the option plus what the Vue layer needs. */
export interface BuiltChartOption {
  readonly option: SnEChartsOption;
  readonly layout: SnChartLayout;
  /** True when the wrapper renders its own DOM tooltip. */
  readonly customTooltip: boolean;
}

/**
 * Assemble the final option.
 *
 * Returns the resolved layout too: the Vue layer needs `layout.padding` for the
 * container's CSS and `customTooltip` to decide whether to attach the pointer
 * listeners.
 */
export function buildChartOption(input: BuildChartOptionOptions = {}): BuiltChartOption {
  const layout = resolveChartLayout(input.layout);
  const caller: Record<string, unknown> = cloneOption(input.option) ?? {};

  const seriesList = normalizeSeries(caller['series']);
  // A caller may suppress the legend with `legend: false` — the shorthand other
  // chart wrappers use. ECharts only understands `{ show: false }`, so the
  // literal is normalised here: left alone it reaches the option tree and
  // ECharts still builds a legend component, with its default (visible) state.
  const legendOption = caller['legend'];
  const legendSuppressed =
    legendOption === false || (isPlainObject(legendOption) && legendOption['show'] === false);
  if (legendOption === false) caller['legend'] = { show: false };

  const hasLegend = !legendSuppressed && (seriesList.length > 1 || legendOption !== undefined);
  const hasTitle = caller['title'] !== undefined;
  const hasToolbox = caller['toolbox'] !== undefined;

  const base: Record<string, unknown> = {};

  // ── Grid ────────────────────────────────────────────────────────────────
  // Only charts with a cartesian grid need it; pie / radar / gauge must not
  // receive a grid or ECharts warns about a component with no coordinate
  // system.
  if (needsGrid(seriesList)) {
    // Reserve space only for chrome that is actually rendered — a layout that
    // suppresses the legend (`minimal`) must not shrink the plot for it.
    base['grid'] = gridBox(layout, {
      hasLegend: hasLegend && layout.legend.show,
      hasTitle: hasTitle && layout.title.show,
      hasToolbox: hasToolbox && layout.toolbox.show,
    });
  }

  // ── Legend ──────────────────────────────────────────────────────────────
  if (hasLegend && layout.legend.show) {
    const placement = legendPlacement(layout.legend.position, layout.legend.align);
    const orient = layout.legend.orient;
    base['legend'] = {
      ...placement,
      ...(orient ? { orient } : {}),
      ...(layout.legend.icon ? { icon: layout.legend.icon } : {}),
    };
  }

  // ── Title ───────────────────────────────────────────────────────────────
  if (hasTitle && layout.title.show) {
    base['title'] = {
      ...titlePlacement(layout.title.position),
      ...(layout.title.subtext ? {} : { subtext: '' }),
    };
  }

  // ── Toolbox ─────────────────────────────────────────────────────────────
  if (hasToolbox && layout.toolbox.show) {
    base['toolbox'] = toolboxPlacement(layout);
  }

  // ── dataZoom ────────────────────────────────────────────────────────────
  // The layout supplies the `dataZoom` shape (type / position) and the caller
  // tunes it: entries are matched by `type` so `dataZoom: [{ start: 0 }]`
  // keeps the layout's `type: 'inside'` while overriding the window.
  if (layout.dataZoom.show) {
    base['dataZoom'] = mergeDataZoom(dataZoomOption(layout), caller['dataZoom']);
    // The caller's raw array would otherwise replace the merged entries in the
    // final `mergeOption` pass (arrays always replace). Drop it there and
    // re-attach the merged result below.
    delete caller['dataZoom'];
  }

  // ── Axis chrome ─────────────────────────────────────────────────────────
  if (needsGrid(seriesList)) {
    base['xAxis'] = axisDefaults(layout, 'x');
    base['yAxis'] = axisDefaults(layout, 'y');
  }

  // ── Tooltip ─────────────────────────────────────────────────────────────
  const tooltipConfig = input.tooltip;
  const customTooltip = resolveCustomTooltip(tooltipConfig);
  base['tooltip'] = customTooltip
    ? customTooltipOption(tooltipConfig, input.tooltipCapture)
    : buildNativeTooltipOption(tooltipConfig);

  let option = mergeOption(base, caller);
  option = applyChartIcons(option, input.icons);

  return {
    option: option as SnEChartsOption,
    layout,
    customTooltip,
  };
}

/**
 * ECharts tooltip option for the wrapper's own DOM tooltip.
 *
 * The DOM tooltip is the visible one, so ECharts' box is switched off
 * (`show: false`) for the item trigger — the payload arrives through the
 * instance's `mouseover` event instead.
 *
 * The **axis** trigger is different: ECharts only assembles the multi-series
 * payload inside its own tooltip formatter, and no event carries it. So the
 * tooltip stays enabled with an invisible style and a formatter that forwards
 * the payload to the wrapper and returns an empty string — that keeps the axis
 * pointer and the grouped payload without a second visible box.
 */
function customTooltipOption(
  config: SnChartTooltipConfig | undefined,
  capture: ((params: unknown) => void) | undefined,
): Record<string, unknown> {
  if (config?.trigger !== 'axis') {
    return { show: false };
  }
  return {
    trigger: 'axis',
    // Rendered but invisible: `padding: 0` + a zero-size box means it never
    // paints, while ECharts still runs the formatter on every pointer move.
    show: true,
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    textStyle: { color: 'transparent' },
    extraCssText: 'padding:0;border:0;box-shadow:none;width:0;height:0;overflow:hidden;',
    ...(capture
      ? {
          formatter: (params: unknown) => {
            capture(params);
            return '';
          },
        }
      : {}),
  };
}

/** `false` / `mode: false` / `trigger: 'none'` all mean "no tooltip". */
function resolveCustomTooltip(config: SnChartTooltipConfig | undefined): boolean {
  if (!config) return true;
  if (config.mode === false) return false;
  if (config.mode === 'native') return false;
  if (config.trigger === 'none') return false;
  return true;
}

/** Pie / radar / gauge / funnel / tree / map / sankey render without a grid. */
function needsGrid(series: readonly unknown[]): boolean {
  if (series.length === 0) return true;
  const noGrid = new Set([
    'pie',
    'radar',
    'gauge',
    'funnel',
    'tree',
    'treemap',
    'sunburst',
    'map',
    'sankey',
    'graph',
    'themeRiver',
    'calendar',
  ]);
  return series.some((item) => {
    if (typeof item !== 'object' || item === null) return true;
    const type = (item as { type?: unknown }).type;
    return typeof type !== 'string' || !noGrid.has(type);
  });
}

function normalizeSeries(series: unknown): unknown[] {
  if (Array.isArray(series)) return series;
  if (series === undefined || series === null) return [];
  return [series];
}

function toolboxPlacement(layout: SnChartLayout): Record<string, unknown> {
  if (layout.toolbox.position === 'inner') {
    const anchor =
      layout.toolbox.align === 'left' ? { left: 0, right: 'auto' } : { right: 0, left: 'auto' };
    return { top: 0, ...anchor };
  }
  return { top: 0, right: 0 };
}

function dataZoomOption(layout: SnChartLayout): Record<string, unknown>[] {
  const position = layout.dataZoom.position === 'top' ? { top: 4 } : { bottom: 4 };
  const entries: Record<string, unknown>[] = [];
  if (layout.dataZoom.type === 'inside' || layout.dataZoom.type === 'both') {
    entries.push({ type: 'inside', ...position });
  }
  if (layout.dataZoom.type === 'slider' || layout.dataZoom.type === 'both') {
    entries.push({ type: 'slider', height: 16, ...position });
  }
  return entries;
}

/**
 * Merge the caller's `dataZoom` over the layout-generated entries.
 *
 * Entries are matched by `type` (`inside` / `slider`), because that is the
 * only stable identity ECharts gives a dataZoom component. An unmatched caller
 * entry is appended — a caller adding a second zoom window keeps it.
 */
function mergeDataZoom(
  base: readonly Record<string, unknown>[],
  caller: unknown,
): Record<string, unknown>[] {
  // An explicit empty array is not "nothing to tune" — it is the caller asking
  // for no zoom window at all, which must beat the layout preset rather than
  // being silently ignored.
  if (Array.isArray(caller) && caller.length === 0) return [];
  const list = Array.isArray(caller) ? caller : caller === undefined ? [] : [caller];
  const out = base.map((entry) => ({ ...entry }));
  for (const item of list) {
    if (!isPlainObject(item)) continue;
    const type = item['type'];
    // A typed entry matches by `type`; an untyped one means "the zoom I
    // already have", so it tunes the first layout entry instead of adding a
    // second zoom window the caller never asked for.
    const target = typeof type === 'string' ? out.find((entry) => entry['type'] === type) : out[0];
    if (target) Object.assign(target, item);
    else out.push({ ...item });
  }
  return out;
}

/**
 * Axis defaults for one direction.
 *
 * `labelMaxLength` installs a truncating `axisLabel.formatter`; a caller that
 * already wrote its own formatter keeps it (the merge below replaces ours).
 */
function axisDefaults(layout: SnChartLayout, direction: 'x' | 'y'): Record<string, unknown> {
  const axis = layout.axis;
  const label: Record<string, unknown> = {
    show: axis.showLabel,
  };
  if (axis.labelRotate !== 0 && direction === 'x') label['rotate'] = axis.labelRotate;
  if (axis.labelMaxLength > 0) {
    const max = axis.labelMaxLength;
    label['formatter'] = (value: unknown) => truncateLabel(value, max);
  }

  return {
    show: axis.show,
    axisLine: { show: axis.showAxisLine },
    axisTick: { show: false },
    axisLabel: label,
    splitLine: { show: axis.showSplitLine },
  };
}

/** Truncate an axis label, keeping its numeric suffix where present. */
export function truncateLabel(value: unknown, maxLength: number): string {
  const text = typeof value === 'string' ? value : String(value ?? '');
  if (text.length <= maxLength || maxLength <= 0) return text;
  return `${text.slice(0, Math.max(1, maxLength - 1))}…`;
}

/**
 * Deep merge `extra` over `base`, returning a new object.
 *
 * Rules:
 *   - plain objects merge recursively;
 *   - arrays and scalars in `extra` **replace** the base value (a series list
 *     is an ordered contract, not a set — merging by index would silently
 *     reorder a caller's series);
 *   - `undefined` values in `extra` are ignored, so a prop that defaults to
 *     `undefined` cannot erase a base value.
 */
export function mergeOption(base: unknown, extra: unknown): Record<string, unknown> {
  if (!isPlainObject(base) || !isPlainObject(extra)) {
    return isPlainObject(extra) ? { ...extra } : {};
  }
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(extra)) {
    if (value === undefined) continue;
    const current = out[key];
    if (isPlainObject(current) && isPlainObject(value)) {
      out[key] = mergeOption(current, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

/**
 * Deep-clone an option.
 *
 * Functions are kept by reference (ECharts formatters are functions; cloning
 * them is impossible and pointless), `Date` / `RegExp` are preserved, arrays
 * are cloned element-wise. This is what keeps a reactive `props` proxy from
 * reaching ECharts (§82).
 */
export function cloneOption<T>(value: T): T {
  return cloneValue(value) as T;
}

function cloneValue(value: unknown): unknown {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);
  if (Array.isArray(value)) return value.map((item) => cloneValue(item));
  const proto = Object.getPrototypeOf(value) as object | null;
  // Only clone plain objects; class instances (ECharts graphic objects,
  // gradients) are passed through untouched.
  if (proto !== null && proto !== Object.prototype) return value;
  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    out[key] = cloneValue(item);
  }
  return out;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value) as object | null;
  return proto === null || proto === Object.prototype;
}
