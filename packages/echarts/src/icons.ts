/**
 * @snui/echarts — icon configuration layer.
 *
 * ECharts draws icons as *filled* paths (`path://<svg path data>`), not as
 * stroke-based SVG components: `legend.icon`, `series.symbol`, `toolbox`
 * feature icons and `title.icon` all resolve through `zrender`'s path parser.
 * A lucide-style stroke icon therefore cannot be dropped in directly — filling
 * a 2px stroke outline paints nothing. This module is the bridge:
 *
 *   - a built-in, filled glyph set authored as path data (chart-type legend
 *     icons, toolbox actions, common KPI symbols);
 *   - `registerChartIcons()` for host-supplied glyphs (`path` / `svg` /
 *     `image`), where `svg` markup is parsed down to path data;
 *   - one config object (`SnChartIconsConfig`) that maps every icon slot a
 *     chart has (legend / toolbox / symbol / title) so a host configures icons
 *     in a single place instead of touching four different option branches.
 *
 * Per AGENTS.md §81 the glyphs are stored as short path strings (a few hundred
 * bytes total) — no icon library is pulled in.
 */

import type { SnChartIcon, SnChartIconDefinition } from './types';

/** Icon slot names a chart can carry. */
export interface SnChartIconsConfig {
  /** Legend marker icon — the ECharts `legend.icon` value. */
  readonly legend?: string | undefined;
  /** Series symbol — the ECharts `series.symbol` value. */
  readonly symbol?: string | undefined;
  /** Toolbox feature icons, keyed by feature name (`dataView`, `saveAsImage`…). */
  readonly toolbox?: Readonly<Record<string, string>> | undefined;
  /** Chart-type → legend icon map, keyed by series type. */
  readonly seriesType?: Readonly<Record<string, string>> | undefined;
  /** Title glyph shown left of the title text. */
  readonly title?: string | undefined;
}

/**
 * Built-in glyph set — filled paths only, drawn inside a 24 × 24 box so every
 * glyph shares one coordinate space (ECharts scales a `path://` to the
 * requested symbol size, and a shared box keeps them optically consistent).
 */
export const BUILTIN_CHART_ICONS: Readonly<Record<string, SnChartIconDefinition>> = {
  // ── Chart types (legend icons) ───────────────────────────────────────────
  bar: { path: 'M3 20h4V9H3zM10 20h4V4h-4zM17 20h4v-7h-4z' },
  column: { path: 'M4 20h4V8H4zM10 20h4V3h-4zM16 20h4v-9h-4z' },
  line: {
    path: 'M2 18l6-7 4 3 5-6 5 4v3l-5-4-5 6-4-3-6 7z',
  },
  area: {
    path: 'M2 20h20v-4l-5-5-4 3-5-6-6 7z',
  },
  pie: {
    path: 'M12 3a9 9 0 100 18 9 9 0 000-18zm0 4v5h5a5 5 0 10-5-5z',
  },
  doughnut: {
    path: 'M12 3a9 9 0 100 18 9 9 0 000-18zm0 4a5 5 0 110 10 5 5 0 010-10z',
  },
  scatter: {
    path: 'M5 5a2 2 0 104 0 2 2 0 10-4 0zm8 3a1.6 1.6 0 103.2 0 1.6 1.6 0 10-3.2 0zm-2 7a2.2 2.2 0 104.4 0 2.2 2.2 0 10-4.4 0zM3 15a1.4 1.4 0 102.8 0 1.4 1.4 0 10-2.8 0z',
  },
  radar: {
    path: 'M12 2l8.7 6.3-3.3 10.2h-10.8L3.3 8.3zm0 4.4L7 9.4l1.9 5.9h6.2L17 9.4z',
  },
  gauge: {
    path: 'M12 3a9 9 0 019 9H3a9 9 0 019-9zm0 3.5a5.5 5.5 0 00-5.4 4.4h10.8A5.5 5.5 0 0012 6.5zM11 12h2l2.5 5h-7z',
  },
  funnel: {
    path: 'M2 3h20l-7 8v9l-6 3v-12z',
  },
  tree: {
    path: 'M11 2h2v4h-2zM5 9h2v4H5zM11 9h2v4h-2zM17 9h2v4h-2zM2 16h2v4H2zM8 16h2v4h-2zM14 16h2v4h-2zM20 16h2v4h-2zM3 7h18v2H3z',
  },
  map: {
    path: 'M9 2l6 3 6-2v17l-6 2-6-3-6 2V4zm0 3.2v12.6l5 2.5V5.7zm7 1.6v12.6l4-1.3V5.3z',
  },
  heatmap: {
    path: 'M3 3h4v4H3zm7 0h4v4h-4zm7 0h4v4h-4zM3 9h4v4H3zm7 0h4v4h-4zm7 0h4v4h-4zM3 15h4v4H3zm7 0h4v4h-4zm7 0h4v4h-4z',
  },
  sankey: {
    path: 'M3 4h5v3H3zM3 17h5v3H3zM16 9h5v3h-5zM16 15h5v3h-5zM8 5.5h5v2H8zM13 5.5v10.5h2V5.5zM8 8.5h5v2H8z',
  },

  // ── Toolbox actions ──────────────────────────────────────────────────────
  refresh: {
    path: 'M12 4a8 8 0 017.6 5.4h-3.2A5 5 0 007 9.4V12L2.6 7.4 7 3v3a8 8 0 015 0zm0 16a8 8 0 01-7.6-5.4h3.2A5 5 0 0017 14.6V12l4.4 4.6L17 21v-3a8 8 0 01-5 2z',
  },
  download: {
    path: 'M10 2h4v9h4.5L12 19 1.5 11H6zM2 21h20v2H2z',
  },
  fullscreen: {
    path: 'M2 2h7v2H4v5H2zm13 0h7v7h-2V4h-5zM2 15h2v5h5v2H2zm18 0h2v7h-7v-2h5z',
  },
  'zoom-in': {
    path: 'M9 2a7 7 0 015.5 11.3l5.6 5.6-1.4 1.4-5.6-5.6A7 7 0 119 2zm0 2a5 5 0 100 10 5 5 0 000-10zm-1 2h2v2h2v2h-2v2H8v-2H6v-2h2z',
  },
  'zoom-out': {
    path: 'M9 2a7 7 0 015.5 11.3l5.6 5.6-1.4 1.4-5.6-5.6A7 7 0 119 2zm0 2a5 5 0 100 10 5 5 0 000-10zM6 8h6v2H6z',
  },
  back: {
    path: 'M11 3l-9 9 9 9v-6h12V9H11z',
  },
  table: {
    path: 'M2 4h20v3H2zm0 5h9v4H2zm11 0h9v4h-9zM2 15h9v5H2zm11 0h9v5h-9z',
  },
  save: {
    path: 'M3 3h13l5 5v13H3zm3 2v6h10V7zm-1 9v5h12v-5z',
  },
  trend: {
    path: 'M3 17l6-7 4 3 7-9 3 2-9 12-4-3-4 5z',
  },
  warning: {
    path: 'M12 2l11 19H1zm-1 6h2v7h-2zm0 9h2v2h-2z',
  },
  info: {
    path: 'M12 2a10 10 0 100 20 10 10 0 000-20zm-1 4h2v2h-2zm0 4h2v8h-2z',
  },
  dot: {
    path: 'M12 7a5 5 0 100 10 5 5 0 000-10z',
  },
} as const;

/** Names of every built-in glyph (used for docs + validation). */
export function listChartIconNames(): string[] {
  return Object.keys(BUILTIN_CHART_ICONS);
}

/**
 * Host-supplied registry, layered over the built-ins.
 *
 * Module state is intentional and bounded: it is written once at app bootstrap
 * (`registerChartIcons({ … })`) and read on every option build. `clearChartIcons()`
 * restores the built-in set, which is what tests and the docs site use.
 */
const registeredIcons = new Map<string, SnChartIconDefinition>();

/**
 * Register custom glyphs. Later registrations override earlier ones and the
 * built-in set (an explicit host icon always wins).
 */
export function registerChartIcons(icons: Readonly<Record<string, SnChartIconDefinition>>): void {
  for (const [name, definition] of Object.entries(icons)) {
    registeredIcons.set(name, definition);
  }
}

/** Remove every host-registered glyph, restoring the built-in set only. */
export function clearChartIcons(): void {
  registeredIcons.clear();
}

/** Registered (non-built-in) glyph names. */
export function listRegisteredChartIcons(): string[] {
  return [...registeredIcons.keys()];
}

/** Look up a glyph definition without resolving it to a path. */
export function getChartIconDefinition(name: string): SnChartIconDefinition | undefined {
  return registeredIcons.get(name) ?? BUILTIN_CHART_ICONS[name];
}

/**
 * Resolve an icon reference to what ECharts consumes.
 *
 * Accepts:
 *   - a registered name (`'bar'`, `'refresh'`, a host-registered name);
 *   - a ready `path://…` / `image://…` string (passed through untouched);
 *   - an `http(s)://` or relative URL (wrapped into `image://`);
 *   - raw SVG path data starting with a path command (`M`, `m`) — wrapped into
 *     `path://`.
 *
 * Returns `undefined` when nothing matches, so the caller keeps its default.
 */
export function resolveChartIcon(name: string | undefined): SnChartIcon | undefined {
  if (!name) return undefined;
  const value = name.trim();
  if (value.length === 0) return undefined;

  if (value.startsWith('path://') || value.startsWith('image://')) {
    return { name: value, value };
  }
  if (
    /^(https?:)?\/\//.test(value) ||
    value.startsWith('data:image/') ||
    // Relative paths: `/icons/a.svg`, `./a.svg`, `../a.svg`.
    /^\.{0,2}\//.test(value)
  ) {
    return { name: value, value: `image://${value}` };
  }
  if (/^[Mm][\s0-9.,-]/.test(value)) {
    return { name: value, value: `path://${value}` };
  }

  const definition = getChartIconDefinition(value);
  if (!definition) return undefined;
  const resolved = definitionToValue(value, definition);
  return resolved ? { name: value, value: resolved } : undefined;
}

/** Convert a definition object into a `path://` / `image://` value. */
function definitionToValue(name: string, definition: SnChartIconDefinition): string | undefined {
  if (definition.image) return `image://${definition.image}`;
  if (definition.path) {
    const path = definition.path.trim();
    if (path.startsWith('path://') || path.startsWith('image://')) return path;
    return `path://${path}`;
  }
  if (definition.svg) {
    const path = svgToPathData(definition.svg);
    if (path.length > 0) return `path://${path}`;
    return undefined;
  }
  // A definition with no usable source is a host bug, not a silent fallback.
  if (typeof console !== 'undefined' && typeof console.warn === 'function') {
    console.warn(`[snui/echarts] icon "${name}" has no path / svg / image source and was ignored.`);
  }
  return undefined;
}

/**
 * Flatten SVG markup into a single `path://`-ready path string.
 *
 * Only geometry a canvas path can express is kept: `<path d>`, `<circle>`,
 * `<ellipse>`, `<rect>`, `<polygon>`, `<polyline>`. Everything else (gradients,
 * filters, `<use>`, text) is dropped — ECharts icons are monochrome filled
 * glyphs, and rendering something else would be worse than rendering nothing.
 *
 * Shapes are emitted **in document order** and their attributes are read
 * independently of each other: serialisers vary attribute order
 * (`<circle r="6" cx="12" cy="12"/>`) and may omit positional defaults
 * (`<rect width="10" height="10"/>` means x=0,y=0), both of which an
 * order-dependent regex silently drops. A dropped shape is invisible to the
 * caller, which is exactly the failure mode this function must not have.
 */
export function svgToPathData(svg: string): string {
  const parts: string[] = [];
  const tagRe = /<(path|circle|ellipse|rect|polygon|polyline)\b([^>]*)>/gi;

  for (const match of svg.matchAll(tagRe)) {
    const tag = (match[1] ?? '').toLowerCase();
    const attrs = match[2] ?? '';
    // `<path d>` / `<polygon points>` tolerate `>` inside the value only if the
    // attribute is quoted; the attribute reader above already stopped at the
    // unquoted `>` that terminates the tag.
    switch (tag) {
      case 'path': {
        const d = readAttr(attrs, 'd')?.trim();
        if (d) parts.push(d);
        break;
      }
      case 'circle': {
        const cx = toNumber(readAttr(attrs, 'cx') ?? '0');
        const cy = toNumber(readAttr(attrs, 'cy') ?? '0');
        const r = toNumber(readAttr(attrs, 'r'));
        if (cx !== undefined && cy !== undefined && r !== undefined && r > 0) {
          parts.push(circlePath(cx, cy, r));
        }
        break;
      }
      case 'ellipse': {
        const cx = toNumber(readAttr(attrs, 'cx') ?? '0');
        const cy = toNumber(readAttr(attrs, 'cy') ?? '0');
        const rx = toNumber(readAttr(attrs, 'rx'));
        const ry = toNumber(readAttr(attrs, 'ry'));
        if (cx !== undefined && cy !== undefined && rx !== undefined && ry !== undefined) {
          parts.push(ellipsePath(cx, cy, rx, ry));
        }
        break;
      }
      case 'rect': {
        const x = toNumber(readAttr(attrs, 'x') ?? '0') ?? 0;
        const y = toNumber(readAttr(attrs, 'y') ?? '0') ?? 0;
        const w = toNumber(readAttr(attrs, 'width'));
        const h = toNumber(readAttr(attrs, 'height'));
        if (w !== undefined && h !== undefined && w > 0 && h > 0) {
          parts.push(`M${x} ${y}H${x + w}V${y + h}H${x}Z`);
        }
        break;
      }
      case 'polygon': {
        const points = readAttr(attrs, 'points')?.trim();
        if (points) parts.push(`M${normalizePoints(points)}Z`);
        break;
      }
      case 'polyline': {
        const points = readAttr(attrs, 'points')?.trim();
        // Kept open on purpose: a polyline that happens to be its own outline
        // is the caller's business, not this parser's.
        if (points) parts.push(`M${normalizePoints(points)}`);
        break;
      }
      default:
        break;
    }
  }

  return parts.join(' ').trim();
}

/**
 * Read one attribute out of a tag's attribute block, order-independent.
 *
 * Handles double- and single-quoted values; an unquoted value is read up to the
 * next whitespace. Returns `undefined` when the attribute is absent — the caller
 * decides whether a default applies.
 */
function readAttr(attrs: string, name: string): string | undefined {
  const re = new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`, 'i');
  const match = re.exec(attrs);
  if (!match) return undefined;
  return match[1] ?? match[2] ?? match[3];
}

/**
 * Collapse whitespace in an SVG `points` list. Commas are left alone —
 * zrender's path parser accepts both separators, and rewriting them would
 * change valid input for no reason.
 */
function normalizePoints(points: string): string {
  return points.replace(/\s+/g, ' ').trim();
}

/** Four-arc circle (zrender's path parser accepts `A` commands). */
function circlePath(cx: number, cy: number, r: number): string {
  return `M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}A${r} ${r} 0 0 1 ${cx - r} ${cy}Z`;
}

function ellipsePath(cx: number, cy: number, rx: number, ry: number): string {
  return `M${cx - rx} ${cy}A${rx} ${ry} 0 0 1 ${cx + rx} ${cy}A${rx} ${ry} 0 0 1 ${cx - rx} ${cy}Z`;
}

function toNumber(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const parsed = Number.parseFloat(value.trim().replace(/[a-z%]+$/i, ''));
  return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * Apply an `SnChartIconsConfig` to one option.
 *
 * Precedence per AGENTS.md §10 / the package contract: the caller's own option
 * always wins, so a glyph is only written where the caller left the icon slot
 * **unset**. `icons` therefore fills defaults; an explicit `legend.icon`,
 * `series[i].symbol`, `title.icon` or `toolbox.feature[*].icon` in `option`
 * is never overwritten. A caller that wants the icon config to win should
 * clear the corresponding option key.
 */
export function applyChartIcons(
  option: Record<string, unknown>,
  icons: SnChartIconsConfig | undefined,
): Record<string, unknown> {
  if (!icons) return option;
  const out: Record<string, unknown> = { ...option };

  const legendIcon = resolveChartIcon(icons.legend);
  if (legendIcon) {
    const legend = out['legend'];
    const first = Array.isArray(legend) ? legend[0] : legend;
    const base = isPlainObject(first) ? first : {};
    if (base['icon'] === undefined) {
      const next = { ...base, icon: legendIcon.value };
      out['legend'] = Array.isArray(legend) ? [next, ...legend.slice(1)] : next;
    }
  }

  const toolbox = out['toolbox'];
  if (icons.toolbox && isPlainObject(toolbox)) {
    const feature = toolbox['feature'];
    if (isPlainObject(feature)) {
      const nextFeature: Record<string, unknown> = { ...feature };
      for (const [key, iconName] of Object.entries(icons.toolbox)) {
        const icon = resolveChartIcon(iconName);
        if (!icon) continue;
        const current = nextFeature[key];
        if (isPlainObject(current)) {
          if (current['icon'] !== undefined) continue;
          nextFeature[key] = { ...current, icon: icon.value };
        } else {
          nextFeature[key] = { icon: icon.value };
        }
      }
      out['toolbox'] = { ...toolbox, feature: nextFeature };
    }
  }

  const seriesIcon = resolveChartIcon(icons.symbol);
  const typeIcons = icons.seriesType;
  if (seriesIcon || typeIcons) {
    const series = out['series'];
    const list = Array.isArray(series) ? series : series === undefined ? [] : [series];
    const mapped = list.map((item) => {
      if (!isPlainObject(item)) return item;
      // An explicit symbol in the option wins.
      if (item['symbol'] !== undefined) return item;
      const type = typeof item['type'] === 'string' ? item['type'] : '';
      const typeIcon = typeIcons && type ? resolveChartIcon(typeIcons[type]) : undefined;
      const symbol = typeIcon?.value ?? seriesIcon?.value;
      if (!symbol) return item;
      // Pie / gauge / funnel / tree / map have no symbol slot — injecting one
      // would be ignored at best and confuse the option reader at worst.
      if (!isSymbolSeries(type)) return item;
      return { ...item, symbol };
    });
    out['series'] = Array.isArray(series) ? mapped : mapped[0];
  }

  const titleIcon = resolveChartIcon(icons.title);
  if (titleIcon) {
    const title = out['title'];
    const base = isPlainObject(title) ? title : {};
    if (base['icon'] === undefined) {
      out['title'] = { ...base, icon: titleIcon.value };
    }
  }

  return out;
}

/** Series types that accept a `symbol`. */
function isSymbolSeries(type: string): boolean {
  return [
    'line',
    'scatter',
    'effectScatter',
    'bar',
    'pictorialBar',
    'radar',
    'graph',
    'lines',
  ].includes(type);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Default series-type → legend-icon mapping.
 *
 * A chart with `line` + `bar` series gets a line glyph next to the line entry
 * and a bar glyph next to the bar entry, instead of ECharts' generic square —
 * without the caller writing `legend.icon` per series.
 */
export const DEFAULT_SERIES_TYPE_ICONS: Readonly<Record<string, string>> = {
  line: 'line',
  bar: 'bar',
  column: 'column',
  scatter: 'scatter',
  effectScatter: 'scatter',
  pie: 'pie',
  doughnut: 'doughnut',
  radar: 'radar',
  gauge: 'gauge',
  funnel: 'funnel',
  tree: 'tree',
  treemap: 'tree',
  sunburst: 'doughnut',
  map: 'map',
  heatmap: 'heatmap',
  sankey: 'sankey',
} as const;
