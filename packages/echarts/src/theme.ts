/**
 * @snui/echarts — token-driven ECharts theme builder.
 *
 * The theme is the single place that turns AUI design tokens into an ECharts
 * theme object. Two colour sources are supported:
 *
 *   - `'tokens'` (default) — every colour is a CSS `var(--sn-web-*)` reference.
 *     ECharts passes the string straight to the canvas `fillStyle`, and the
 *     browser resolves the variable against the element's cascade, so a
 *     `<html data-theme="dark">` flip (or a Style Pack switch) repaints the
 *     chart on the next frame without rebuilding the option. This is why the
 *     wrapper does not need to re-`setOption` on theme change.
 *   - `'resolved'` — literal values read from the cascade at build time.
 *     Needed when the option leaves the DOM (image export, SSR, a non-DOM
 *     host). `resolveTokenColors()` reads the variables off a probe element.
 *
 * Per AGENTS.md §34, no raw hex values are authored in component CSS or in the
 * theme: the palette derives from `--sn-web-color-*` tokens. A caller-supplied
 * colour (`colorPrimary` etc.) is passed through verbatim — it is data, not
 * component styling.
 */

import type {
  SnChartColorSource,
  SnChartThemeConfig,
  SnChartThemeMode,
  SnChartTokenColorMap,
} from './types';

/** `--sn-web-*` alias names the chart theme consumes. */
export const CHART_TOKEN_ALIASES = {
  primary: '--sn-web-color-action-primary',
  primaryHover: '--sn-web-color-action-primary-hover',
  primarySoft: '--sn-web-color-action-primary-soft',
  success: '--sn-web-color-feedback-success',
  warning: '--sn-web-color-feedback-warning',
  danger: '--sn-web-color-feedback-danger',
  info: '--sn-web-color-feedback-info',
  textPrimary: '--sn-web-color-text-primary',
  textSecondary: '--sn-web-color-text-secondary',
  textTertiary: '--sn-web-color-text-tertiary',
  textOnPrimary: '--sn-web-color-text-on-primary',
  surface: '--sn-web-color-background-surface',
  surfaceSubtle: '--sn-web-color-background-subtle',
  surfaceElevated: '--sn-web-color-background-elevated',
  borderDefault: '--sn-web-color-border-default',
  borderSubtle: '--sn-web-color-border-subtle',
  fontFamily: '--sn-web-font-family-body',
} as const satisfies Record<string, string>;

/**
 * Fallback literals, used when the host does not ship
 * `@snui/vue-web/styles` (a chart in isolation) or when running headless.
 *
 * Values mirror the token defaults in `@snui/tokens` so a chart rendered
 * without the stylesheet still looks like a snail-ui surface instead of
 * falling back to ECharts' default blue/red.
 */
export const CHART_FALLBACK_COLORS: Readonly<Record<SnChartThemeMode, SnChartTokenColorMap>> = {
  light: {
    primary: '#1677ff',
    primaryHover: '#60a5fa',
    primarySoft: '#eff6ff',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#71717a',
    textPrimary: '#09090b',
    textSecondary: '#71717a',
    textTertiary: '#a1a1aa',
    textOnPrimary: '#ffffff',
    surface: '#ffffff',
    surfaceSubtle: '#f4f4f5',
    surfaceElevated: '#ffffff',
    borderDefault: '#e4e4e7',
    borderSubtle: '#f4f4f5',
  },
  dark: {
    primary: '#1677ff',
    primaryHover: '#60a5fa',
    primarySoft: '#eff6ff',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#7f1d1d',
    info: '#71717a',
    textPrimary: '#fafafa',
    textSecondary: '#a1a1aa',
    textTertiary: '#71717a',
    textOnPrimary: '#ffffff',
    surface: '#09090b',
    surfaceSubtle: '#27272a',
    surfaceElevated: '#18181b',
    borderDefault: '#27272a',
    borderSubtle: '#27272a',
  },
} as const;

/** CSS variable names the theme writes for its own downstream consumers. */
export const CHART_CSS_VARIABLES = {
  primary: '--sn-chart-color-primary',
  success: '--sn-chart-color-success',
  warning: '--sn-chart-color-warning',
  danger: '--sn-chart-color-danger',
  info: '--sn-chart-color-info',
  text: '--sn-chart-color-text',
  textSecondary: '--sn-chart-color-text-secondary',
  surface: '--sn-chart-color-surface',
  border: '--sn-chart-color-border',
} as const;

/**
 * Extra palette slots beyond the semantic feedback colours.
 *
 * Only variables that actually exist in `@snui/tokens/styles` are referenced —
 * a missing custom property resolves to the invalid-value state, and zrender
 * silently keeps the previous `fillStyle`, so a wrong slot paints the wrong
 * series rather than failing loudly. The brand layer (`--sn-color-*`) is used
 * for hues the semantic layer does not expose, since web components may not
 * reference `--aui-*` directly (§34).
 */
const EXTRA_PALETTE_TOKENS = {
  purple: 'var(--sn-color-purple)',
  teal: '#14b8a6',
  indigo: 'var(--aui-color-blue-700)',
  volcano: 'var(--sn-color-volcano)',
  pink: 'var(--sn-color-pink)',
  cyan: 'var(--sn-color-cyan)',
  lightblue: 'var(--sn-color-lightblue)',
} as const;

const EXTRA_PALETTE_FALLBACK = {
  purple: '#7c3aed',
  teal: '#14b8a6',
  indigo: '#1d4ed8',
  volcano: '#fa541c',
  pink: '#eb2f96',
  cyan: '#13c2c2',
  lightblue: '#40a9ff',
} as const;

/**
 * The series colour cycle, in ECharts order.
 *
 * Slots 1-5 are semantic (primary / success / warning / danger / info) so a
 * chart reads as part of the design system; slots 6-12 extend the ramp with
 * primitives. A caller can replace the whole cycle via `theme.palette`.
 */
export function buildChartPalette(
  source: SnChartColorSource = 'tokens',
  mode: SnChartThemeMode = 'light',
  overrides: SnChartThemeConfig = {},
): string[] {
  const fallback = CHART_FALLBACK_COLORS[mode];
  const primary =
    overrides.colorPrimary ?? pick(source, CHART_TOKEN_ALIASES.primary, fallback.primary);
  const success =
    overrides.colorSuccess ?? pick(source, CHART_TOKEN_ALIASES.success, fallback.success);
  const warning =
    overrides.colorWarning ?? pick(source, CHART_TOKEN_ALIASES.warning, fallback.warning);
  const danger = overrides.colorDanger ?? pick(source, CHART_TOKEN_ALIASES.danger, fallback.danger);
  const info = overrides.colorInfo ?? pick(source, CHART_TOKEN_ALIASES.info, fallback.info);

  if (overrides.palette && overrides.palette.length > 0) {
    return [...overrides.palette];
  }

  const extras = (
    Object.keys(EXTRA_PALETTE_TOKENS) as Array<keyof typeof EXTRA_PALETTE_TOKENS>
  ).map((key) => (source === 'tokens' ? EXTRA_PALETTE_TOKENS[key] : EXTRA_PALETTE_FALLBACK[key]));

  return [primary, success, warning, danger, info, ...extras];
}

/** Resolve a colour from either the token reference or the literal fallback. */
function pick(source: SnChartColorSource, alias: string, fallback: string): string {
  return source === 'tokens' ? `var(${alias})` : fallback;
}

/** Options for `buildChartTheme()`. */
export interface BuildChartThemeOptions {
  /** Theme colour config (the `theme` prop). */
  readonly config?: SnChartThemeConfig | undefined;
  /** Light / dark mode. Default 'light'. */
  readonly mode?: SnChartThemeMode | undefined;
  /**
   * Resolved literals, produced by `resolveTokenColors()`. When provided they
   * win over both the token references and the fallback table — this is how a
   * `colorSource: 'resolved'` theme gets real values in a non-DOM context.
   */
  readonly resolved?: Partial<SnChartTokenColorMap> | undefined;
}

/**
 * Build the ECharts theme object for `echarts.init(dom, theme, opts)`.
 *
 * The returned object is a plain dictionary (ECharts' own `ThemeOption` type),
 * so it can also be passed to `echarts.registerTheme()` by a host that wants
 * to share one theme across charts it creates directly.
 *
 * The theme covers what a chart needs to look native: series palette, text
 * colour ramp, axis / split-line colours, tooltip + legend + title + toolbox
 * chrome, and the animation curve used by AUI's motion tokens.
 */
export function buildChartTheme(options: BuildChartThemeOptions = {}): Record<string, unknown> {
  const config = options.config ?? {};
  const mode = options.mode ?? 'light';
  // `'tokens'` is the documented default (types.ts SnChartColorSource): the
  // emitted colours stay `var(--sn-web-*)` references so the host cascade
  // resolves them. Callers that need literals (image export / SSR) opt into
  // `'resolved'` and supply `options.resolved`.
  const source: SnChartColorSource = config.colorSource ?? 'tokens';
  const fallback = CHART_FALLBACK_COLORS[mode];
  const resolved = options.resolved ?? {};

  const color = (key: keyof SnChartTokenColorMap, override?: string): string => {
    if (override) return override;
    const fromResolved = resolved[key];
    if (fromResolved) return fromResolved;
    return pick(source, CHART_TOKEN_ALIASES[key], fallback[key]);
  };

  const primary = color('primary', config.colorPrimary);
  const success = color('success', config.colorSuccess);
  const warning = color('warning', config.colorWarning);
  const danger = color('danger', config.colorDanger);
  const info = color('info', config.colorInfo);
  const textPrimary = color('textPrimary', config.textColor);
  const textSecondary = color('textSecondary', config.textColorSecondary);
  const textTertiary = color('textTertiary', config.textColorTertiary);
  const surface = config.backgroundColor ?? (resolved.surface || fallback.surface);
  const border = color('borderDefault', config.borderColor);
  const fontFamily =
    config.fontFamily ??
    (source === 'tokens'
      ? `var(${CHART_TOKEN_ALIASES.fontFamily})`
      : 'system-ui, -apple-system, "Segoe UI", sans-serif');
  const fontSize = config.fontSize ?? 12;

  const palette = buildChartPalette(source, mode, {
    ...config,
    ...(resolved.primary ? { colorPrimary: resolved.primary } : {}),
    ...(resolved.success ? { colorSuccess: resolved.success } : {}),
    ...(resolved.warning ? { colorWarning: resolved.warning } : {}),
    ...(resolved.danger ? { colorDanger: resolved.danger } : {}),
    ...(resolved.info ? { colorInfo: resolved.info } : {}),
  });

  const axisLabel = {
    color: textSecondary,
    fontSize,
    fontFamily,
  };

  const axisLine = {
    lineStyle: {
      color: border,
    },
  };

  const splitLine = {
    lineStyle: {
      color: border,
      type: 'dashed',
    },
  };

  const theme: Record<string, unknown> = {
    color: palette,
    backgroundColor: surface === fallback.surface ? 'transparent' : surface,
    textStyle: {
      color: textPrimary,
      fontFamily,
      fontSize,
    },
    // Animation follows the AUI motion tokens: a 300ms cubic-bezier ease-out
    // is the semantic `--aui-motion-duration-base` / `--aui-motion-easing-standard`.
    animationDuration: 300,
    animationEasing: 'cubicOut',
    animationDurationUpdate: 200,
    animationEasingUpdate: 'cubicOut',

    // Series chrome — every chart type inherits these unless the option says
    // otherwise.
    title: {
      textStyle: {
        color: textPrimary,
        fontFamily,
        fontWeight: 600,
        fontSize: fontSize + 4,
      },
      subtextStyle: {
        color: textSecondary,
        fontFamily,
        fontSize,
      },
    },
    legend: {
      textStyle: {
        color: textSecondary,
        fontFamily,
        fontSize,
      },
      itemGap: 16,
      itemWidth: 12,
      itemHeight: 8,
    },
    tooltip: {
      backgroundColor: resolved.surfaceElevated || fallback.surfaceElevated,
      borderColor: border,
      borderWidth: 1,
      textStyle: {
        color: textPrimary,
        fontFamily,
        fontSize,
      },
      axisPointer: {
        lineStyle: {
          color: primary,
        },
        crossStyle: {
          color: primary,
        },
        label: {
          backgroundColor: primary,
          color: color('textOnPrimary'),
        },
      },
    },
    toolbox: {
      iconStyle: {
        borderColor: textSecondary,
      },
      emphasis: {
        iconStyle: {
          borderColor: primary,
        },
      },
    },
    categoryAxis: {
      axisLine,
      axisTick: { show: false, lineStyle: { color: border } },
      axisLabel,
      splitLine: { show: false },
    },
    valueAxis: {
      axisLine: { show: false, lineStyle: { color: border } },
      axisTick: { show: false, lineStyle: { color: border } },
      axisLabel,
      splitLine,
    },
    logAxis: {
      axisLine: { show: false, lineStyle: { color: border } },
      axisLabel,
      splitLine,
    },
    timeAxis: {
      axisLine: { show: false, lineStyle: { color: border } },
      axisLabel,
      splitLine,
    },
    line: {
      itemStyle: { borderWidth: 2 },
      lineStyle: { width: 2 },
      symbolSize: 6,
      symbol: 'circle',
      smooth: false,
    },
    bar: {
      itemStyle: { barBorderRadius: [4, 4, 0, 0] },
    },
    pie: {
      // Slice separators use the surface token, not the plot-background literal,
      // so the gaps follow the host theme.
      itemStyle: { borderColor: color('surface'), borderWidth: 1 },
    },
    gauge: {
      axisLine: {
        lineStyle: { color: [[1, border]] },
      },
      splitLine: { lineStyle: { color: border } },
      axisLabel,
    },
    radar: {
      axisName: { color: textSecondary },
      splitLine: { lineStyle: { color: border } },
      splitArea: { areaStyle: { color: ['transparent', 'transparent'] } },
    },
    dataZoom: {
      textStyle: { color: textSecondary },
      borderColor: border,
      fillerColor: primary,
      handleStyle: { color: surface, borderColor: border },
    },
    visualMap: {
      textStyle: { color: textSecondary },
    },
  };

  // Semantic feedback colours stay reachable from downstream code (the DOM
  // tooltip reads them to draw its marker dots) without re-deriving them.
  theme['snSemantic'] = {
    primary,
    primaryHover: color('primaryHover'),
    primarySoft: color('primarySoft'),
    success,
    warning,
    danger,
    info,
    textPrimary,
    textSecondary,
    textTertiary,
    textOnPrimary: color('textOnPrimary'),
    // The surface the DOM tooltip paints with. `color('surface')` keeps the
    // `var(--sn-web-*)` reference in token mode, so a host whose surface token
    // differs from this package's fallback still gets a matching tooltip —
    // `surface` (raw literal) is only the plot background decision above.
    surface: color('surface'),
    surfaceSubtle: color('surfaceSubtle'),
    surfaceElevated: color('surfaceElevated'),
    borderDefault: border,
    borderSubtle: color('borderSubtle'),
  };

  if (config.themeOverrides) {
    return mergeTheme(theme, config.themeOverrides);
  }
  return theme;
}

/**
 * Recursively merge extra theme keys into the generated theme.
 *
 * Recursion (rather than one level) matters because ECharts theme blocks nest
 * two levels in practice: overriding `legend.textStyle.color` must not drop
 * the sibling `textStyle.fontSize` the generated theme already set. Arrays —
 * `color`, `axisPointer.lineStyle`, … — replace wholesale, matching ECharts'
 * own `setOption` semantics. An explicit `undefined` never erases a key.
 */
function mergeTheme(
  base: Record<string, unknown>,
  extra: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(extra)) {
    if (value === undefined) continue;
    const current = out[key];
    out[key] = isPlainObject(current) && isPlainObject(value) ? mergeTheme(current, value) : value;
  }
  return out;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Read the live token values off the DOM so the theme can be snapshotted to
 * literals.
 *
 * `colorSource: 'resolved'` needs real values because the option may leave the
 * DOM (image export, SSR payload, a worker). The probe element inherits the
 * host cascade (`<html data-theme>`), so this returns the values the browser
 * would have resolved for the chart itself.
 *
 * Returns `null` when there is no DOM (SSR / Node) — the caller then falls
 * back to `CHART_FALLBACK_COLORS`.
 */
export function resolveTokenColors(
  root?: HTMLElement | Document | null,
): SnChartTokenColorMap | null {
  // An explicit `null` means "there is no DOM here" (SSR / Node); `undefined`
  // means "use the ambient document".
  const doc = root === null ? null : (root ?? (typeof document === 'undefined' ? null : document));
  if (!doc) return null;
  const host = 'documentElement' in doc ? doc.documentElement : doc;
  if (!host) return null;

  // `getComputedStyle(host).getPropertyValue('--x')` reads the value the
  // cascade produced for that element, which is exactly what the canvas would
  // have resolved. Values come back trimmed and possibly empty.
  const style = (
    typeof getComputedStyle === 'function' ? getComputedStyle(host) : null
  ) as CSSStyleDeclaration | null;
  if (!style) return null;

  const read = (alias: string, fallback: string): string => {
    const raw = style.getPropertyValue(alias).trim();
    return raw.length > 0 ? raw : fallback;
  };

  const mode: SnChartThemeMode = isDarkMode(host) ? 'dark' : 'light';
  const fallback = CHART_FALLBACK_COLORS[mode];

  return {
    primary: read(CHART_TOKEN_ALIASES.primary, fallback.primary),
    primaryHover: read(CHART_TOKEN_ALIASES.primaryHover, fallback.primaryHover),
    primarySoft: read(CHART_TOKEN_ALIASES.primarySoft, fallback.primarySoft),
    success: read(CHART_TOKEN_ALIASES.success, fallback.success),
    warning: read(CHART_TOKEN_ALIASES.warning, fallback.warning),
    danger: read(CHART_TOKEN_ALIASES.danger, fallback.danger),
    info: read(CHART_TOKEN_ALIASES.info, fallback.info),
    textPrimary: read(CHART_TOKEN_ALIASES.textPrimary, fallback.textPrimary),
    textSecondary: read(CHART_TOKEN_ALIASES.textSecondary, fallback.textSecondary),
    textTertiary: read(CHART_TOKEN_ALIASES.textTertiary, fallback.textTertiary),
    textOnPrimary: read(CHART_TOKEN_ALIASES.textOnPrimary, fallback.textOnPrimary),
    surface: read(CHART_TOKEN_ALIASES.surface, fallback.surface),
    surfaceSubtle: read(CHART_TOKEN_ALIASES.surfaceSubtle, fallback.surfaceSubtle),
    surfaceElevated: read(CHART_TOKEN_ALIASES.surfaceElevated, fallback.surfaceElevated),
    borderDefault: read(CHART_TOKEN_ALIASES.borderDefault, fallback.borderDefault),
    borderSubtle: read(CHART_TOKEN_ALIASES.borderSubtle, fallback.borderSubtle),
  };
}

/**
 * Detect the host's dark mode from the same hooks the token layer uses
 * (`[data-theme="dark"]` / `.dark`), falling back to the OS preference.
 */
export function detectThemeMode(root?: HTMLElement | Document | null): SnChartThemeMode {
  const doc = root ?? (typeof document === 'undefined' ? null : document);
  if (!doc) return 'light';
  const host = 'documentElement' in doc ? doc.documentElement : doc;
  if (!host) return 'light';
  return isDarkMode(host) ? 'dark' : 'light';
}

function isDarkMode(host: HTMLElement): boolean {
  const explicit = host.getAttribute('data-theme');
  if (explicit === 'dark') return true;
  if (explicit === 'light') return false;
  if (host.classList.contains('dark')) return true;
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

/**
 * CSS custom properties the wrapper writes onto the chart container, so
 * component CSS (the DOM tooltip, the loading overlay) and downstream user
 * styles read one set of chart colours.
 */
export function buildChartCssVariables(theme: Record<string, unknown>): Record<string, string> {
  const semantic = (theme['snSemantic'] ?? {}) as Partial<SnChartTokenColorMap>;
  const vars: Record<string, string> = {};
  const map: ReadonlyArray<
    readonly [keyof typeof CHART_CSS_VARIABLES, keyof SnChartTokenColorMap]
  > = [
    ['primary', 'primary'],
    ['success', 'success'],
    ['warning', 'warning'],
    ['danger', 'danger'],
    ['info', 'info'],
    ['text', 'textPrimary'],
    ['textSecondary', 'textSecondary'],
    ['surface', 'surface'],
    ['border', 'borderDefault'],
  ];
  for (const [cssKey, tokenKey] of map) {
    const value = semantic[tokenKey];
    if (typeof value === 'string' && value.length > 0) {
      vars[CHART_CSS_VARIABLES[cssKey]] = value;
    }
  }
  return vars;
}
