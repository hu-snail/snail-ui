/**
 * @snui/echarts — layout presets + layout application.
 *
 * Layout is a first-class concern here: a chart dropped into an AUI card
 * should not need hand-written `grid` / `legend` / `title` numbers, and the
 * same chart should work at five densities. The presets below encode those
 * numbers once; `applyChartLayout()` merges them under the caller's own
 * option (caller wins, per AGENTS.md §10 Minimal Change).
 *
 * All values are px numbers so they scale with the chart's own font size
 * rather than the page's rem base — ECharts renders in px.
 */

import type {
  SnChartGridPadding,
  SnChartLayout,
  SnChartLayoutConfig,
  SnChartLayoutPreset,
  SnChartResolved,
} from './types';

/** Every preset, fully resolved. */
export const CHART_LAYOUT_PRESETS: Readonly<Record<SnChartLayoutPreset, SnChartLayout>> = {
  /** Balanced default for a card-sized chart (~320-420px tall). */
  default: {
    padding: 12,
    grid: [16, 16, 16, 16],
    legend: { show: true, position: 'top', align: 'center', icon: '', orient: 'horizontal' },
    title: { show: false, position: 'left', subtext: false },
    toolbox: { show: false, position: 'outer', align: 'right' },
    dataZoom: { show: false, type: 'inside', position: 'bottom' },
    axis: {
      show: true,
      showLabel: true,
      showSplitLine: true,
      showAxisLine: true,
      labelRotate: 0,
      labelMaxLength: 0,
    },
  },
  /** Dense dashboards — tighter gaps, smaller legend, no axis line. */
  compact: {
    padding: 8,
    grid: [8, 12, 8, 8],
    legend: { show: true, position: 'top', align: 'center', icon: '', orient: 'horizontal' },
    title: { show: false, position: 'left', subtext: false },
    toolbox: { show: false, position: 'outer', align: 'right' },
    dataZoom: { show: false, type: 'inside', position: 'bottom' },
    axis: {
      show: true,
      showLabel: true,
      showSplitLine: true,
      showAxisLine: false,
      labelRotate: 0,
      labelMaxLength: 8,
    },
  },
  /** Presentation / report — generous whitespace, legend at the bottom. */
  spacious: {
    padding: 20,
    grid: [28, 28, 32, 28],
    legend: { show: true, position: 'bottom', align: 'center', icon: '', orient: 'horizontal' },
    title: { show: true, position: 'left', subtext: true },
    toolbox: { show: false, position: 'outer', align: 'right' },
    dataZoom: { show: false, type: 'inside', position: 'bottom' },
    axis: {
      show: true,
      showLabel: true,
      showSplitLine: true,
      showAxisLine: false,
      labelRotate: 0,
      labelMaxLength: 0,
    },
  },
  /** Edge-to-edge — for a full-bleed panel where the host paints the frame. */
  fullscreen: {
    padding: 0,
    grid: [8, 8, 8, 8],
    legend: { show: true, position: 'top', align: 'right', icon: '', orient: 'horizontal' },
    title: { show: false, position: 'left', subtext: false },
    toolbox: { show: true, position: 'inner', align: 'right' },
    dataZoom: { show: false, type: 'inside', position: 'bottom' },
    axis: {
      show: true,
      showLabel: true,
      showSplitLine: true,
      showAxisLine: false,
      labelRotate: 0,
      labelMaxLength: 0,
    },
  },
  /** Sparkline / KPI tile — no legend, no title, minimal chrome. */
  minimal: {
    padding: 0,
    grid: [4, 4, 4, 4],
    legend: { show: false, position: 'top', align: 'center', icon: '', orient: 'horizontal' },
    title: { show: false, position: 'left', subtext: false },
    toolbox: { show: false, position: 'outer', align: 'right' },
    dataZoom: { show: false, type: 'inside', position: 'bottom' },
    axis: {
      show: false,
      showLabel: false,
      showSplitLine: false,
      showAxisLine: false,
      labelRotate: 0,
      labelMaxLength: 0,
    },
  },
} as const;

/**
 * Resolve a preset name or a partial config into a full `SnChartLayout`.
 *
 * The object form starts from `'default'` and applies only provided fields —
 * `{ legend: { position: 'right' } }` keeps every other default, which is what
 * a config-panel caller wants. Idempotent: resolving a resolved layout returns
 * the same values (AGENTS.md §27).
 */
export function resolveChartLayout(
  input: SnChartLayoutPreset | SnChartLayoutConfig | undefined,
  fallbackPreset: SnChartLayoutPreset = 'default',
): SnChartLayout {
  const base = CHART_LAYOUT_PRESETS[fallbackPreset] ?? CHART_LAYOUT_PRESETS.default;

  if (input === undefined || typeof input === 'string') {
    return CHART_LAYOUT_PRESETS[input ?? fallbackPreset] ?? base;
  }

  return {
    padding: input.padding ?? base.padding,
    grid: normalizeGrid(input.grid) ?? base.grid,
    legend: mergeSection(base.legend, input.legend),
    title: mergeSection(base.title, input.title),
    toolbox: mergeSection(base.toolbox, input.toolbox),
    dataZoom: mergeSection(base.dataZoom, input.dataZoom),
    axis: mergeSection(base.axis, input.axis),
  };
}

/**
 * Merge one layout section over its resolved base.
 *
 * `undefined` values are treated as "not provided" so a prop that defaults to
 * `undefined` cannot erase a preset value, and the result is typed as fully
 * resolved (`SnChartResolved`) — the preset guarantees every field.
 */
function mergeSection<T extends object>(
  base: SnChartResolved<T>,
  input: T | undefined,
): SnChartResolved<T> {
  if (!input) return base;
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) out[key] = value;
  }
  return out as SnChartResolved<T>;
}

/** A scalar grid padding applies on all four sides. */
export function normalizeGrid(
  grid: SnChartGridPadding | undefined,
): readonly [number | string, number | string, number | string, number | string] | undefined {
  if (grid === undefined) return undefined;
  if (typeof grid === 'number' || typeof grid === 'string') return [grid, grid, grid, grid];
  return grid;
}

/** Legend `position` → concrete ECharts legend placement. */
export function legendPlacement(
  position: SnChartLayout['legend']['position'],
  align: SnChartLayout['legend']['align'],
): Record<string, unknown> {
  switch (position) {
    case 'bottom':
      return { bottom: 0, left: alignAnchor(align), orient: 'horizontal' };
    case 'left':
      return { left: 0, top: 'middle', orient: 'vertical' };
    case 'right':
      return { right: 0, top: 'middle', orient: 'vertical' };
    case 'top':
    default:
      return { top: 0, left: alignAnchor(align), orient: 'horizontal' };
  }
}

function alignAnchor(align: SnChartLayout['legend']['align']): string {
  if (align === 'left') return 'left';
  if (align === 'right') return 'right';
  return 'center';
}

/** Title `position` → concrete ECharts title placement. */
export function titlePlacement(
  position: SnChartLayout['title']['position'],
): Record<string, unknown> {
  return { left: alignAnchor(position), top: 0 };
}

/**
 * The grid box for a resolved layout, adjusted so the plot area does not sit
 * under a top/bottom legend or an inner toolbox.
 *
 * `containLabel: true` is the important part: with it, ECharts reserves space
 * for axis labels inside the grid, so the caller's padding is the gap between
 * the card edge and the *labels*, not the plot — which is what "padding" means
 * in every other AUI component.
 */
export function gridBox(
  layout: SnChartLayout,
  options: {
    readonly hasLegend?: boolean;
    readonly hasTitle?: boolean;
    readonly hasToolbox?: boolean;
  } = {},
): Record<string, unknown> {
  const [top, right, bottom, left] = layout.grid;
  let extraTop = 0;
  let extraBottom = 0;
  let extraRight = 0;
  let extraLeft = 0;

  if (options.hasLegend) {
    if (layout.legend.position === 'top') extraTop += 28;
    if (layout.legend.position === 'bottom') extraBottom += 28;
    if (layout.legend.position === 'right') extraRight += 88;
    if (layout.legend.position === 'left') extraLeft += 88;
  }
  if (options.hasTitle && layout.title.show) extraTop += 32;
  if (options.hasToolbox && layout.toolbox.show && layout.toolbox.position === 'inner')
    extraTop += 24;

  return {
    top: addLength(top, extraTop),
    right: addLength(right, extraRight),
    bottom: addLength(bottom, extraBottom),
    left: addLength(left, extraLeft),
    containLabel: true,
  };
}

function addLength(base: number | string, extra: number): number | string {
  if (extra === 0) return base;
  if (typeof base === 'number') return base + extra;
  return `calc(${base} + ${extra}px)`;
}
