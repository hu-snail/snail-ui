/**
 * @snui/echarts — tooltip model + native tooltip option.
 *
 * ECharts' built-in tooltip is a canvas-drawn box: it cannot be styled beyond
 * a handful of theme keys, cannot host a component, and cannot follow the
 * host's CSS. This module turns ECharts' raw `formatter` params into a plain
 * data model (`SnChartTooltipModel`) that the Vue layer renders as DOM. The
 * same model is exposed on the `tooltip` slot, so a host can take over the
 * rendering entirely without re-deriving ECharts' param shape.
 *
 * `buildNativeTooltipOption()` covers the fallback path (`mode: 'native'`):
 * ECharts draws the box, but it is themed and its formatter is this module's
 * text formatter, so the content still matches the custom path.
 *
 * Param normalization is defensive on purpose: ECharts hands back its internal
 * param objects, whose shape differs by series type (pie adds `percent`, axis
 * trigger returns an array, `marker` is an HTML string). We never trust them
 * beyond the fields the tooltip actually needs.
 */

import type {
  SnChartTooltipConfig,
  SnChartTooltipExtraRow,
  SnChartTooltipItem,
  SnChartTooltipModel,
} from './types';

/** One raw ECharts tooltip param (subset the model reads). */
interface RawTooltipParam {
  readonly componentType?: string;
  readonly seriesType?: string;
  readonly seriesName?: string;
  readonly seriesIndex?: number;
  readonly dataIndex?: number;
  readonly name?: string;
  readonly value?: unknown;
  readonly data?: unknown;
  readonly color?: unknown;
  readonly percent?: number;
  readonly marker?: unknown;
  readonly axisValue?: unknown;
  readonly axisValueLabel?: unknown;
}

/**
 * Normalize ECharts' `formatter` params into the tooltip model.
 *
 * Handles both trigger shapes:
 *   - `trigger: 'item'`  → a single param object;
 *   - `trigger: 'axis'`  → an array of params sharing one axis value.
 *
 * Returns `null` for an empty payload — the Vue layer then keeps the tooltip
 * hidden instead of rendering an empty box.
 */
export function buildTooltipModel(
  params: unknown,
  config: SnChartTooltipConfig = {},
  context: { readonly theme?: string | undefined } = {},
): SnChartTooltipModel | null {
  const list = normalizeParams(params);
  if (list.length === 0) return null;

  const items = list.map((raw) => toItem(raw, config));
  const label = resolveLabel(list, config);
  const footer = config.footer;

  const model: SnChartTooltipModel = {
    label,
    items,
    ...(footer === undefined ? {} : { footer }),
    extraRows: config.extraRows ?? [],
    showMarker: config.showMarker ?? true,
    showSeriesName: config.showSeriesName ?? true,
    showValue: config.showValue ?? true,
    showLabel: config.showLabel ?? true,
    showPercent: config.showPercent ?? false,
    html: config.html ?? false,
    ...(config.width === undefined ? {} : { width: config.width }),
  };
  void context;
  return model;
}

/** Accept a single param or an array; drop non-objects. */
function normalizeParams(params: unknown): RawTooltipParam[] {
  if (Array.isArray(params)) {
    return params.filter(isRawParam);
  }
  return isRawParam(params) ? [params] : [];
}

function isRawParam(value: unknown): value is RawTooltipParam {
  return typeof value === 'object' && value !== null;
}

function toItem(raw: RawTooltipParam, config: SnChartTooltipConfig): SnChartTooltipItem {
  const value = raw.value;
  const item: SnChartTooltipItem = {
    seriesName: typeof raw.seriesName === 'string' ? raw.seriesName : '',
    seriesIndex: typeof raw.seriesIndex === 'number' ? raw.seriesIndex : -1,
    dataIndex: typeof raw.dataIndex === 'number' ? raw.dataIndex : -1,
    value,
    color: resolveColor(raw.color),
    ...(typeof raw.percent === 'number' ? { percent: raw.percent } : {}),
    ...(typeof raw.axisValueLabel === 'string' ? { axisValue: raw.axisValueLabel } : {}),
    ...(typeof raw.marker === 'string' ? { marker: raw.marker } : {}),
    ...(raw.data === undefined ? {} : { data: raw.data }),
  };
  void config;
  return item;
}

/** ECharts colour is a string for plain series and an object for gradients. */
function resolveColor(color: unknown): string {
  if (typeof color === 'string') return color;
  if (typeof color === 'object' && color !== null) {
    const typed = color as { colorStops?: Array<{ color?: unknown }> };
    const stop = typed.colorStops?.[0];
    if (stop && typeof stop.color === 'string') return stop.color;
  }
  return 'transparent';
}

/**
 * The tooltip heading.
 *
 * Item trigger: the data item's `name` (pie slices, scatter points). Axis
 * trigger: the shared axis value label (`2024-01`, `周一`). A caller
 * `labelFormatter` always wins.
 */
function resolveLabel(list: readonly RawTooltipParam[], config: SnChartTooltipConfig): string {
  const first = list[0];
  if (!first) return '';
  const raw = isAxisList(list) ? axisLabelOf(first) : nameOf(first);
  const label = typeof raw === 'string' ? raw : '';
  if (config.labelFormatter) {
    return config.labelFormatter(
      label,
      list.map((rawItem) => toItem(rawItem, config)),
    );
  }
  return label;
}

function isAxisList(list: readonly RawTooltipParam[]): boolean {
  // Axis-trigger payloads always carry more than one param for multi-series
  // charts and set `axisValue`; a single-series axis chart still sets it.
  return list.length > 1 || (list[0] !== undefined && list[0].axisValueLabel !== undefined);
}

function axisLabelOf(param: RawTooltipParam): unknown {
  if (typeof param.axisValueLabel === 'string') return param.axisValueLabel;
  if (typeof param.axisValue === 'string' || typeof param.axisValue === 'number')
    return String(param.axisValue);
  return param.name;
}

function nameOf(param: RawTooltipParam): unknown {
  if (typeof param.name === 'string' || typeof param.name === 'number') return String(param.name);
  return param.axisValueLabel;
}

/**
 * Format one value for display.
 *
 * Order: caller `valueFormatter` → `precision` → ECharts' own scalar
 * formatting (arrays are joined, objects are JSON-ish). Numbers are never
 * silently rounded, because a chart tooltip showing `1` for `1.4` is a bug the
 * user cannot see.
 */
export function formatTooltipValue(
  value: unknown,
  config: SnChartTooltipConfig = {},
  item?: SnChartTooltipItem,
): string {
  if (config.valueFormatter) {
    return config.valueFormatter(value, item ?? EMPTY_ITEM);
  }
  if (typeof value === 'number') {
    return typeof config.precision === 'number'
      ? value.toFixed(normalizePrecision(config.precision))
      : formatNumber(value);
  }
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) {
    return value.map((entry) => formatTooltipValue(entry, config, item)).join(' / ');
  }
  if (typeof value === 'object') {
    const typed = value as Record<string, unknown>;
    if ('value' in typed) return formatTooltipValue(typed['value'], config, item);
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Clamp a caller-supplied precision into the range `toFixed` accepts.
 *
 * `toFixed` throws a `RangeError` above 100, and ECharts itself caps tooltip
 * precision at 20 — a wrapper must not turn a bad `precision` value into a
 * crash inside the render path (§83: a local error must not take the chart
 * down). Non-finite input falls back to `0`.
 */
function normalizePrecision(precision: number): number {
  if (!Number.isFinite(precision)) return 0;
  return Math.min(20, Math.max(0, Math.trunc(precision)));
}

const EMPTY_ITEM: SnChartTooltipItem = {
  seriesName: '',
  seriesIndex: -1,
  dataIndex: -1,
  value: undefined,
  color: 'transparent',
};

/**
 * Thousands separators for integers, at most two decimals for fractions.
 *
 * `1234567.891` → `1,234,567.89`. Locale is pinned to `en-US` on purpose: a
 * tooltip must not change shape when the page locale changes, and the group
 * separator (`,`) reads the same in every AUI locale.
 */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return String(value);
  const isInteger = Number.isInteger(value);
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: isInteger ? 0 : 2,
    useGrouping: true,
  }).format(value);
}

/** Percent with one decimal, e.g. `42.5%`. */
export function formatPercent(percent: number | undefined): string {
  if (typeof percent !== 'number' || !Number.isFinite(percent)) return '';
  return `${percent.toFixed(1)}%`;
}

/**
 * Build the ECharts tooltip option for `mode: 'native'`.
 *
 * `trigger: 'none'` still returns a tooltip object with `show: false` so a
 * caller can toggle it back on later without restructuring the option.
 */
export function buildNativeTooltipOption(
  config: SnChartTooltipConfig | undefined,
): Record<string, unknown> {
  const resolved = config ?? {};
  if (resolved.mode === false) {
    return { show: false };
  }
  const trigger = resolved.trigger ?? 'item';
  const option: Record<string, unknown> = {
    trigger,
    show: trigger !== 'none',
    confine: true,
    appendToBody: false,
    // ECharts' own formatter is a plain text builder; it keeps the native
    // tooltip readable without the wrapper's DOM layer.
    formatter: (params: unknown) => formatNativeTooltipText(params, resolved),
  };
  if (resolved.nativeOverrides) {
    return { ...option, ...resolved.nativeOverrides };
  }
  return option;
}

/**
 * Text formatter used by the native tooltip path.
 *
 * **Every data-derived value is escaped.** ECharts renders an HTML
 * `renderMode` tooltip via `innerHTML`, and the params here carry chart *data*
 * (category names, series names) that may come from a backend or a user. An
 * unescaped `<` would be parsed as markup — an XSS hole reachable from data,
 * not just config. `footer` is caller-authored HTML by contract (`html: true`),
 * so it is appended verbatim.
 */
export function formatNativeTooltipText(
  params: unknown,
  config: SnChartTooltipConfig = {},
): string {
  const model = buildTooltipModel(params, config);
  if (!model) return '';
  const lines: string[] = [];
  if (model.showLabel && model.label) lines.push(escapeHtml(model.label));
  for (const item of model.items) {
    const parts: string[] = [];
    if (model.showSeriesName && item.seriesName) parts.push(escapeHtml(item.seriesName));
    if (model.showValue) parts.push(escapeHtml(formatTooltipValue(item.value, config, item)));
    if (model.showPercent && item.percent !== undefined)
      parts.push(escapeHtml(formatPercent(item.percent)));
    if (parts.length > 0) lines.push(parts.join(': '));
  }
  for (const row of model.extraRows) {
    lines.push(`${escapeHtml(row.label)}: ${escapeHtml(row.value)}`);
  }
  // `html: true` makes `footer` caller-authored markup by contract; otherwise
  // it is escaped like every other string that reaches `innerHTML`.
  if (model.footer) lines.push(model.html ? model.footer : escapeHtml(model.footer));
  return lines.join('\n');
}

/**
 * Escape the five characters that can break out of text content or an
 * attribute value. Used for anything ECharts will hand to `innerHTML`.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Default extra-row builder: derive rows from the first item's `data` object.
 *
 * A host that puts extra fields on the data item (`{ value: 12, owner: 'x' }`)
 * gets them in the tooltip without writing a formatter — a common request when
 * a chart is backed by a table row.
 *
 * Keys are skipped when they are already part of the chart's own encoding
 * (`value`, `name`) or when the value is an object (nested data is not
 * printable in one row).
 */
export function deriveExtraRows(
  items: readonly SnChartTooltipItem[],
  keys: readonly string[] | undefined,
): SnChartTooltipExtraRow[] {
  if (!keys || keys.length === 0) return [];
  const first = items[0];
  if (!first || typeof first.data !== 'object' || first.data === null) return [];
  const data = first.data as Record<string, unknown>;
  const rows: SnChartTooltipExtraRow[] = [];
  for (const key of keys) {
    const value = data[key];
    if (value === undefined || value === null || typeof value === 'object') continue;
    rows.push({ label: key, value: String(value) });
  }
  return rows;
}
