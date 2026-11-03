<script setup lang="ts">
/**
 * SnChart — AUI's ECharts wrapper (AUI-WEB-CHART-001).
 *
 * Reference library: Apache ECharts 5/6 (`echarts`), not naive-ui — a chart
 * engine is out of naive-ui's scope, so §112's "mirror the reference library"
 * rule maps onto "mirror ECharts' own option contract": the `option` prop is a
 * verbatim `EChartsOption` and everything this component adds is opt-in and
 * removable.
 *
 * ## What the wrapper owns
 *
 *   - instance lifecycle: `init` / `setOption` / `resize` / `dispose`;
 *   - container sizing: `ResizeObserver` (falling back to a window resize
 *     listener), so a chart inside a collapsible sider / dialog resizes;
 *   - theme: the token-driven theme from `@snui/echarts` (see theme.ts), rebuilt
 *     when the mode or the theme config changes;
 *   - layout: preset / partial layout config applied under the caller's option;
 *   - icons: one config object for legend / symbol / toolbox glyphs;
 *   - tooltip: a token-styled DOM tooltip (default) or ECharts' native one;
 *   - events: `click` / `dblclick` / `mouseover` / `mouseout` / `legendselectchanged`
 *     forwarded as typed payloads.
 *
 * ## What the wrapper does not own
 *
 * No data fetching, no business state, no routing (§18 Runtime boundary). It
 * renders what `option` says.
 *
 * ## Disposal (§41)
 *
 * The instance, the ResizeObserver, the window listener, every ECharts event
 * handler and the pending `requestAnimationFrame` are released on unmount.
 * `dispose()` is guarded by an `isDisposed` flag so a resize callback queued
 * right before unmount cannot touch a disposed instance.
 *
 * ## Why the tooltip is DOM, not canvas
 *
 * ECharts' tooltip is drawn on the canvas: it cannot use the host's fonts,
 * cannot be styled with tokens, and is clipped by the canvas box. The DOM
 * tooltip here is token-styled, supports a slot, and stays inside the chart
 * container (no `Teleport`, so it inherits the container's cascade). The
 * `mode: 'native'` escape hatch exists for hosts that need ECharts' own
 * behaviour (e.g. `axisPointer` labels).
 *
 * ## Theme switching
 *
 * A theme is bound at `init` and cannot be swapped on a live instance
 * (ECharts' `setTheme` is private and deprecated), so a mode change disposes
 * and re-inits, then re-applies the option. `colorSource: 'tokens'` avoids the
 * re-init entirely by keeping colours as CSS variables — the cascade repaints
 * the canvas. Both paths are supported; the default is the token path.
 *
 * Usage:
 *   <SnChart :option="option" />
 *   <SnChart :option="option" layout="compact" :tooltip="{ trigger: 'axis' }" />
 *   <SnChart :option="option" :icons="{ seriesType: { line: 'line' } }">
 *     <template #tooltip="{ model }">…custom tooltip…</template>
 *   </SnChart>
 */

import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type CSSProperties,
} from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption, EChartsType } from 'echarts';

import {
  buildChartCssVariables,
  buildChartTheme,
  detectThemeMode,
  resolveTokenColors,
} from './theme';
import { buildChartOption } from './options';
// Loading / empty primitives come from @snui/vue-web (this package's declared
// dependency). Re-implementing them here would fork the visuals.
import { SnEmpty, SnLoading } from '@snui/vue-web';
import type { SnChartIconsConfig } from './icons';
import { buildTooltipModel, formatPercent, formatTooltipValue } from './tooltip';
import type {
  SnChartHandle,
  SnChartLayoutConfig,
  SnChartLayoutPreset,
  SnChartPointEvent,
  SnChartThemeConfig,
  SnChartThemeMode,
  SnChartTooltipConfig,
  SnChartTooltipItem,
  SnChartTooltipModel,
} from './types';

defineOptions({ name: 'SnChart' });

const props = withDefaults(
  defineProps<{
    /** ECharts option — merged last, so the caller always wins. */
    option?: EChartsOption | undefined;
    /** Theme colour config (palette / brand colour / text / font). */
    theme?: SnChartThemeConfig | undefined;
    /**
     * Theme mode. Omitted → auto-detected from the host (`<html data-theme>`,
     * `.dark`, then `prefers-color-scheme`), and kept in sync when the host
     * flips.
     */
    themeMode?: SnChartThemeMode | 'auto' | undefined;
    /** Layout preset name, or a partial layout config. */
    layout?: SnChartLayoutPreset | SnChartLayoutConfig | undefined;
    /** Icon configuration (legend / symbol / toolbox / per-series-type). */
    icons?: SnChartIconsConfig | undefined;
    /** Tooltip configuration. Omitted → the token-styled DOM tooltip. */
    tooltip?: SnChartTooltipConfig | undefined;
    /** Show the loading overlay. */
    loading?: boolean;
    /** Loading text. */
    loadingText?: string | undefined;
    /** Renderer. Default 'canvas'; 'svg' is sharper for print / export. */
    renderer?: 'canvas' | 'svg' | undefined;
    /** Fixed height (number = px). Omitted → fills the parent box. */
    height?: number | string | undefined;
    /** Fixed width (number = px). Omitted → fills the parent box. */
    width?: number | string | undefined;
    /** Device pixel ratio override for the canvas. */
    devicePixelRatio?: number | undefined;
    /** Enable ECharts' dirty-rect rendering (large data sets). */
    useDirtyRect?: boolean;
    /** Merge strategy for `setOption`. Default: merge (`notMerge: false`). */
    notMerge?: boolean;
    /** Throttle `setOption` when the option changes rapidly. Default true. */
    lazyUpdate?: boolean;
    /** Accessible label for the chart region (§52). */
    ariaLabel?: string | undefined;
    /** Disable the automatic resize observer. */
    autoResize?: boolean;
  }>(),
  {
    option: undefined,
    theme: undefined,
    themeMode: 'auto',
    layout: 'default',
    icons: undefined,
    tooltip: undefined,
    loading: false,
    loadingText: undefined,
    renderer: 'canvas',
    height: undefined,
    width: undefined,
    devicePixelRatio: undefined,
    useDirtyRect: false,
    notMerge: false,
    lazyUpdate: true,
    ariaLabel: undefined,
    autoResize: true,
  },
);

/**
 * Emits use the call-signature form — the tuple form (`{ click: [payload] }`)
 * requires Vue 3.3+ runtime typings, and vue-tsc 2.2 in this workspace
 * resolves `defineEmits` against the `EmitsOptions` overload for that shape.
 */
const emit = defineEmits<{
  /** A data item / series element was clicked. */
  (e: 'click', event: SnChartPointEvent): void;
  (e: 'dblclick', event: SnChartPointEvent): void;
  /** Pointer entered a data item / series element. */
  (e: 'mouseover', event: SnChartPointEvent): void;
  (e: 'mouseout', event: SnChartPointEvent): void;
  /** Legend selection changed. */
  (e: 'legendselectchanged', payload: { name: string; selected: Record<string, boolean> }): void;
  /** A `dataZoom` view changed. */
  (e: 'datazoom', payload: { start?: number | undefined; end?: number | undefined }): void;
  /** The chart finished rendering. */
  (e: 'rendered'): void;
  /** The ECharts instance was (re)created — hosts can attach custom handlers. */
  (e: 'ready', instance: EChartsType): void;
  /** A custom tooltip is about to show — hosts can read the model. */
  (e: 'tooltipshow', model: SnChartTooltipModel): void;
}>();

/* ── DOM refs + instance ──────────────────────────────────────────────────── */

/** Chart mount point (ECharts' canvas host). */
const chartRef = ref<HTMLDivElement | null>(null);
/** Container the tooltip positions against (same box as the canvas). */
const rootRef = ref<HTMLDivElement | null>(null);

const instance = shallowRef<EChartsType | null>(null);
/** Guard: a queued rAF / resize callback must not touch a disposed instance. */
let isDisposed = false;
let resizeObserver: ResizeObserver | null = null;
let rafId = 0;

/* ── Theme ────────────────────────────────────────────────────────────────── */

const detectedMode = ref<SnChartThemeMode>('light');

const resolvedMode = computed<SnChartThemeMode>(() =>
  props.themeMode === 'auto' || props.themeMode === undefined
    ? detectedMode.value
    : props.themeMode,
);

/**
 * Theme object. `colorSource` defaults to `'tokens'` for the live path (the
 * cascade repaints the canvas, no re-init needed); the caller can opt into
 * `'resolved'` literals for export / SSR.
 */
const chartTheme = computed<Record<string, unknown>>(() => {
  const config = props.theme ?? {};
  const source = config.colorSource ?? 'tokens';
  // The probe element is the ambient `document`, not `chartRef`: reading the
  // chart's own ref would make this computed depend on it, and the ref flips
  // from null to the element during mount — re-creating the instance one tick
  // after the first one was built (two `ready` events, first instance orphaned).
  const resolved = source === 'resolved' ? resolveTokenColors() : undefined;
  return buildChartTheme({
    config: { ...config, colorSource: source },
    mode: resolvedMode.value,
    ...(resolved ? { resolved } : {}),
  });
});

/** Chart colours exposed as CSS variables for the DOM tooltip / user styles. */
const chartCssVariables = computed<Record<string, string>>(() =>
  buildChartCssVariables(chartTheme.value),
);

/* ── Option ───────────────────────────────────────────────────────────────── */

const built = computed(() =>
  buildChartOption({
    option: props.option,
    layout: props.layout,
    icons: props.icons,
    tooltip: props.tooltip,
    // Axis-trigger payloads only exist inside ECharts' own tooltip formatter,
    // so the custom DOM tooltip is fed from there (see `customTooltipOption`).
    tooltipCapture: showTooltipFromParams,
  }),
);

/** The option ECharts receives. */
const chartOption = computed<EChartsOption>(() => built.value.option);

/** Resolved layout (drives the container's CSS padding). */
const layout = computed(() => built.value.layout);

/** True when the wrapper renders its own DOM tooltip (ECharts' is disabled). */
const customTooltip = computed(() => built.value.customTooltip);
/**
 * True when the option carries at least one series. An option without series
 * renders a blank canvas, so the component shows the empty state instead.
 */
const hasSeries = computed(() => {
  const series = props.option?.series;
  if (series === undefined || series === null) return false;
  return Array.isArray(series) ? series.length > 0 : true;
});

/* ── Container style ──────────────────────────────────────────────────────── */

const containerStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    padding: toLength(layout.value.padding),
    ...chartCssVariables.value,
  };
  if (props.height !== undefined) style.height = toLength(props.height);
  if (props.width !== undefined) style.width = toLength(props.width);
  return style as CSSProperties;
});

function toLength(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value;
}

/* ── Tooltip state ────────────────────────────────────────────────────────── */

const tooltipModel = ref<SnChartTooltipModel | null>(null);
const tooltipVisible = ref(false);
const tooltipPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });
/** Hide timer — lets the pointer travel from the item into the tooltip. */
let tooltipHideTimer = 0;
let tooltipShowTimer = 0;

const tooltipConfig = computed<SnChartTooltipConfig>(() => props.tooltip ?? {});

const tooltipStyle = computed<CSSProperties>(() => {
  const width = tooltipModel.value?.width ?? tooltipConfig.value.width;
  const style: CSSProperties = {
    transform: `translate3d(${tooltipPosition.value.x}px, ${tooltipPosition.value.y}px, 0)`,
    ...(width === undefined ? {} : { width: `${width}px` }),
  };
  const transition = tooltipConfig.value.transition;
  if (transition !== undefined) {
    style.transitionDuration = `${transition}ms`;
  }
  return style;
});

/* ── ECharts event wiring ─────────────────────────────────────────────────── */

/** ECharts event names forwarded to the component's emits. */
const POINT_EVENTS = ['click', 'dblclick', 'mouseover', 'mouseout'] as const;

/** Raw handler references, kept so `off()` can remove exactly what `on()` added. */
const handlers: Array<{ name: string; fn: (payload: unknown) => void }> = [];

function toPointEvent(payload: unknown): SnChartPointEvent {
  const raw = (payload ?? {}) as Record<string, unknown>;
  return {
    componentType: typeof raw['componentType'] === 'string' ? raw['componentType'] : '',
    seriesType: typeof raw['seriesType'] === 'string' ? raw['seriesType'] : undefined,
    seriesIndex: typeof raw['seriesIndex'] === 'number' ? raw['seriesIndex'] : undefined,
    seriesName: typeof raw['seriesName'] === 'string' ? raw['seriesName'] : undefined,
    dataIndex: typeof raw['dataIndex'] === 'number' ? raw['dataIndex'] : undefined,
    name:
      typeof raw['name'] === 'string' || typeof raw['name'] === 'number'
        ? String(raw['name'])
        : undefined,
    value: raw['value'],
    data: raw['data'],
    color: typeof raw['color'] === 'string' ? raw['color'] : undefined,
    percent: typeof raw['percent'] === 'number' ? raw['percent'] : undefined,
  };
}

/**
 * Pointer position inside the chart container, taken from ECharts' own event.
 *
 * `offsetX` / `offsetY` are relative to the canvas, which is the same box the
 * DOM tooltip is positioned against. Returns `null` when ECharts did not report
 * a position (programmatic events), so the caller keeps the previous anchor.
 */
function pointerAnchorOf(payload: unknown): { x: number; y: number } | null {
  const raw = (payload ?? {}) as Record<string, unknown>;
  const event = raw['event'];
  if (typeof event !== 'object' || event === null) return null;
  const typed = event as Record<string, unknown>;
  const x = typed['offsetX'];
  const y = typed['offsetY'];
  if (typeof x !== 'number' || typeof y !== 'number') return null;
  const offset = tooltipConfig.value.offset ?? [12, 12];
  return { x: x + offset[0], y: y + offset[1] };
}

function attachEvents(chart: EChartsType): void {
  for (const name of POINT_EVENTS) {
    const fn = (payload: unknown) => {
      const point = toPointEvent(payload);
      if (name === 'click') emit('click', point);
      else if (name === 'dblclick') emit('dblclick', point);
      else if (name === 'mouseover') {
        emit('mouseover', point);
        if (customTooltip.value) {
          // ECharts reports the pointer position relative to the canvas. It is
          // the anchor for `followPointer: false` (the bubble then stays on the
          // data item while the pointer travels).
          const anchor = pointerAnchorOf(payload);
          if (anchor) tooltipPosition.value = anchor;
          showTooltip(point);
        }
      } else {
        emit('mouseout', point);
        if (customTooltip.value) scheduleTooltipHide();
      }
    };
    chart.on(name, fn);
    handlers.push({ name, fn });
  }

  const legendHandler = (payload: unknown) => {
    const raw = (payload ?? {}) as Record<string, unknown>;
    const selected = (raw['selected'] ?? {}) as Record<string, boolean>;
    emit('legendselectchanged', {
      name: typeof raw['name'] === 'string' ? raw['name'] : '',
      selected,
    });
  };
  chart.on('legendselectchanged', legendHandler);
  handlers.push({ name: 'legendselectchanged', fn: legendHandler });

  const zoomHandler = (payload: unknown) => {
    const raw = (payload ?? {}) as Record<string, unknown>;
    emit('datazoom', {
      ...(typeof raw['start'] === 'number' ? { start: raw['start'] } : {}),
      ...(typeof raw['end'] === 'number' ? { end: raw['end'] } : {}),
    });
  };
  chart.on('datazoom', zoomHandler);
  handlers.push({ name: 'datazoom', fn: zoomHandler });

  const renderedHandler = () => emit('rendered');
  chart.on('rendered', renderedHandler);
  handlers.push({ name: 'rendered', fn: renderedHandler });
}

function detachEvents(chart: EChartsType): void {
  for (const { name, fn } of handlers) {
    chart.off(name, fn);
  }
  handlers.length = 0;
}

/* ── Tooltip behaviour ────────────────────────────────────────────────────── */

function showTooltip(point: SnChartPointEvent): void {
  presentTooltip(rawTooltipParams(point));
}

/**
 * Entry point for the axis trigger: ECharts hands us the grouped payload from
 * its own tooltip formatter (the only place it exists). Called on every pointer
 * move while the tooltip is open, so it must stay cheap and idempotent.
 */
function showTooltipFromParams(params: unknown): void {
  presentTooltip(params);
}

/** Build the model from a raw ECharts payload and show the bubble. */
function presentTooltip(params: unknown): void {
  if (!customTooltip.value) return;
  if (tooltipHideTimer) {
    window.clearTimeout(tooltipHideTimer);
    tooltipHideTimer = 0;
  }
  const model = buildTooltipModel(params, tooltipConfig.value);
  if (!model) return;
  tooltipModel.value = model;
  emit('tooltipshow', model);
  // Defer by the configured enter transition so the tooltip does not flicker
  // while the pointer sweeps across a dense series.
  const delay = tooltipConfig.value.transition ?? 0;
  if (tooltipShowTimer) window.clearTimeout(tooltipShowTimer);
  tooltipShowTimer = window.setTimeout(
    () => {
      tooltipVisible.value = true;
    },
    Math.min(delay, 200),
  );
}

function scheduleTooltipHide(): void {
  if (!customTooltip.value) return;
  if (tooltipConfig.value.keepOnHover === false) {
    hideTooltip();
    return;
  }
  if (tooltipShowTimer) {
    window.clearTimeout(tooltipShowTimer);
    tooltipShowTimer = 0;
  }
  tooltipHideTimer = window.setTimeout(() => {
    tooltipVisible.value = false;
    tooltipHideTimer = 0;
  }, 120);
}

function hideTooltip(): void {
  tooltipVisible.value = false;
  tooltipModel.value = null;
}

/**
 * Reconstruct an ECharts-shaped param from the forwarded point event.
 *
 * ECharts' `mouseover` payload already carries everything the tooltip model
 * needs, and `toPointEvent()` preserves those fields 1:1 — so the model builder
 * gets a faithful param without a second ECharts listener.
 */
function rawTooltipParams(point: SnChartPointEvent): Record<string, unknown> {
  return {
    componentType: point.componentType,
    seriesType: point.seriesType,
    seriesName: point.seriesName,
    seriesIndex: point.seriesIndex,
    dataIndex: point.dataIndex,
    name: point.name,
    value: point.value,
    data: point.data,
    color: point.color,
    percent: point.percent,
  };
}

/**
 * Move the DOM tooltip with the pointer.
 *
 * Also the only place a pending hide is cancelled: the bubble itself is
 * `pointer-events: none` (it must never swallow clicks aimed at the canvas), so
 * a pointer moving from the data item onto the bubble still produces
 * `pointermove` here — without the cancel, `keepOnHover` could never work.
 */
function onRootPointerMove(event: PointerEvent): void {
  if (!customTooltip.value) return;
  if (tooltipHideTimer) {
    window.clearTimeout(tooltipHideTimer);
    tooltipHideTimer = 0;
  }
  if (!tooltipVisible.value || !rootRef.value) return;
  // With `followPointer: false` the bubble stays where it was anchored (the
  // data item's position, set in `showTooltip`), so the move is ignored.
  if (!(tooltipConfig.value.followPointer ?? true)) return;
  const rect = rootRef.value.getBoundingClientRect();
  const offset = tooltipConfig.value.offset ?? [12, 12];
  tooltipPosition.value = {
    x: event.clientX - rect.left + offset[0],
    y: event.clientY - rect.top + offset[1],
  };
}

/* ── Lifecycle ────────────────────────────────────────────────────────────── */

/**
 * Create the instance (or recreate it after a theme change).
 *
 * The theme mode is baked into the theme object, so a mode flip reaches this
 * function through the `chartTheme` watcher — there is no separate mode watcher,
 * which also removes the risk of two watchers racing into a double rebuild.
 */
function createInstance(): void {
  const el = chartRef.value;
  if (!el) return;
  // A previous instance on the same DOM node would leak its canvas + zrender
  // loop, so it is always disposed first.
  destroyInstance();

  const opts: Record<string, unknown> = {
    renderer: props.renderer,
  };
  if (props.devicePixelRatio !== undefined) opts['devicePixelRatio'] = props.devicePixelRatio;
  if (props.useDirtyRect) opts['useDirtyRect'] = true;

  const chart = echarts.init(el, chartTheme.value, opts as never);
  instance.value = chart;
  attachEvents(chart);
  chart.setOption(chartOption.value, { notMerge: props.notMerge, lazyUpdate: props.lazyUpdate });
  syncLoading();
  emit('ready', chart);
}

/** Dispose the live instance + its handlers (idempotent). */
function destroyInstance(): void {
  const chart = instance.value;
  if (!chart) return;
  detachEvents(chart);
  // `isDisposed` stops the shared `zrender` resize path from firing after the
  // canvas is gone (ECharts warns "instance has been disposed" otherwise).
  chart.dispose();
  instance.value = null;
}

/**
 * Toggle ECharts' built-in loading state.
 *
 * The DOM overlay (`SnLoading`) is what the user sees; `showLoading` is still
 * driven so the canvas is masked behind it and `getDataURL` does not export a
 * half-painted plot. Hiding first keeps a loading-text change from leaving the
 * old text on screen.
 */
function syncLoading(): void {
  const chart = instance.value;
  if (!chart) return;
  chart.hideLoading();
  if (!props.loading) return;
  chart.showLoading('default', {
    text: props.loadingText ?? '',
    color: 'var(--sn-chart-color-primary, var(--sn-web-color-action-primary))',
    textColor: 'var(--sn-chart-color-text-secondary, var(--sn-web-color-text-secondary))',
    maskColor: 'var(--sn-web-color-background-surface)',
    showSpinner: true,
    spinnerRadius: 8,
    lineWidth: 2,
    fontSize: 12,
  });
}

/** Resize on the next frame, coalescing repeated triggers into one call. */
function scheduleResize(): void {
  if (rafId) return;
  rafId = window.requestAnimationFrame(() => {
    rafId = 0;
    if (isDisposed) return;
    instance.value?.resize();
  });
}

function observeResize(): void {
  if (!props.autoResize || !rootRef.value) return;
  if (typeof ResizeObserver === 'function') {
    resizeObserver = new ResizeObserver(() => scheduleResize());
    resizeObserver.observe(rootRef.value);
    return;
  }
  // Older environments: window-level fallback (less precise, still correct).
  window.addEventListener('resize', scheduleResize);
}

function unobserveResize(): void {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  window.removeEventListener('resize', scheduleResize);
  if (rafId) {
    window.cancelAnimationFrame(rafId);
    rafId = 0;
  }
}

/* ── Host theme tracking ──────────────────────────────────────────────────── */

let themeObserver: MutationObserver | null = null;
let mediaQuery: MediaQueryList | null = null;

function onHostThemeChange(): void {
  detectedMode.value = detectThemeMode();
}

function observeHostTheme(): void {
  if (typeof document === 'undefined') return;
  const host = document.documentElement;
  if (typeof MutationObserver === 'function') {
    themeObserver = new MutationObserver(onHostThemeChange);
    themeObserver.observe(host, { attributes: true, attributeFilter: ['data-theme', 'class'] });
  }
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    // `addEventListener` is the modern path; `addListener` is the Safari < 14
    // fallback. Both are removed in `dispose`.
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', onHostThemeChange);
    } else {
      mediaQuery.addListener(onHostThemeChange);
    }
  }
}

function unobserveHostTheme(): void {
  themeObserver?.disconnect();
  themeObserver = null;
  if (mediaQuery) {
    if (typeof mediaQuery.removeEventListener === 'function') {
      mediaQuery.removeEventListener('change', onHostThemeChange);
    } else {
      mediaQuery.removeListener(onHostThemeChange);
    }
    mediaQuery = null;
  }
}

/* ── Watchers ─────────────────────────────────────────────────────────────── */

// Option changes go through `setOption` (never a re-init) so ECharts keeps its
// own transition / animation state.
watch(
  chartOption,
  (next) => {
    const chart = instance.value;
    if (!chart) return;
    chart.setOption(next, { notMerge: props.notMerge, lazyUpdate: props.lazyUpdate });
  },
  { deep: true },
);

/**
 * Content signature of the theme.
 *
 * The watcher must compare *content*, not object identity: `chartTheme` is a
 * computed that returns a fresh object, so an inline `:theme="{ … }"` — exactly
 * the README example — would otherwise dispose and re-init the chart on every
 * parent re-render, throwing away ECharts' animation and dataZoom state.
 *
 * `JSON.stringify` is safe here because a theme object is made of the caller's
 * `SnChartThemeConfig` (plain JSON-ish) plus the resolved literals; a function
 * value is not part of the theme contract. Key order is stable because both
 * sides are produced by `buildChartTheme`.
 */
const themeSignature = computed(() =>
  JSON.stringify([resolvedMode.value, props.theme ?? null, chartTheme.value]),
);

watch(themeSignature, () => {
  if (!instance.value) return;
  // ECharts binds the theme at `init`, so a real theme change needs a new
  // instance (its `setTheme` is private and deprecated).
  createInstance();
});

watch(
  () => props.loading,
  () => syncLoading(),
);
watch(
  () => props.loadingText,
  () => syncLoading(),
);

/* ── Imperative handle ────────────────────────────────────────────────────── */

const handle: SnChartHandle = {
  get instance() {
    return instance.value;
  },
  resize() {
    scheduleResize();
  },
  setOption(option, opts) {
    instance.value?.setOption(option, opts ?? { notMerge: false, lazyUpdate: true });
  },
  getOption() {
    return instance.value?.getOption() as EChartsOption | undefined;
  },
  dispatchAction(payload) {
    // ECharts types its payload as a discriminated union keyed by `type`;
    // the handle keeps it loose so a host can pass any registered action.
    instance.value?.dispatchAction(payload as never);
  },
  getDataURL(opts) {
    const chart = instance.value;
    if (!chart) return '';
    const type = opts?.type ?? 'png';
    if (type === 'svg') return chart.getDataURL({ type: 'svg' });
    return chart.getDataURL({
      type,
      pixelRatio: opts?.pixelRatio ?? 2,
      ...(opts?.backgroundColor === undefined ? {} : { backgroundColor: opts.backgroundColor }),
    });
  },
  refreshTheme() {
    if (instance.value) createInstance();
  },
};

defineExpose(handle);

/* ── Mount / unmount ──────────────────────────────────────────────────────── */

onMounted(() => {
  isDisposed = false;
  detectedMode.value =
    props.themeMode === 'auto' || props.themeMode === undefined
      ? detectThemeMode()
      : detectedMode.value;
  observeHostTheme();
  createInstance();
  observeResize();
});

onBeforeUnmount(() => {
  isDisposed = true;
  unobserveHostTheme();
  unobserveResize();
  if (tooltipHideTimer) window.clearTimeout(tooltipHideTimer);
  if (tooltipShowTimer) window.clearTimeout(tooltipShowTimer);
  hideTooltip();
  destroyInstance();
});

/* ── Tooltip render helpers (template-only) ───────────────────────────────── */

function itemValue(item: SnChartTooltipItem): string {
  return formatTooltipValue(item.value, tooltipConfig.value, item);
}

function itemPercent(item: SnChartTooltipItem): string {
  return formatPercent(item.percent);
}
</script>

<template>
  <div
    ref="rootRef"
    data-snui-component="SnChart"
    class="sn-chart"
    :class="{ 'sn-chart--loading': loading }"
    :style="containerStyle"
    role="img"
    :aria-label="ariaLabel"
    @pointermove="onRootPointerMove"
    @pointerleave="scheduleTooltipHide"
  >
    <div ref="chartRef" class="sn-chart__canvas" />

    <!-- Loading overlay: the chart stays mounted (ECharts keeps its canvas), so
         a spinner can sit on top without re-initialising. -->
    <Transition name="sn-chart-fade">
      <div v-if="loading" class="sn-chart__loading" role="status" aria-live="polite">
        <SnLoading
          size="small"
          v-bind="loadingText === undefined ? {} : { description: loadingText }"
        />
      </div>
    </Transition>

    <!-- Custom DOM tooltip (the default). ECharts' own tooltip is disabled while
         this is active, so the two never draw at once. -->
    <Transition name="sn-chart-tooltip">
      <div
        v-if="customTooltip && tooltipVisible && tooltipModel"
        class="sn-chart__tooltip"
        :style="tooltipStyle"
        data-snui-component="SnChartTooltip"
        role="tooltip"
      >
        <slot name="tooltip" :model="tooltipModel" :items="tooltipModel.items">
          <!-- Default tooltip: heading + one row per series + extra rows + footer -->
          <div v-if="tooltipModel.showLabel && tooltipModel.label" class="sn-chart__tooltip-label">
            {{ tooltipModel.label }}
          </div>
          <div
            v-for="(item, index) in tooltipModel.items"
            :key="`${item.seriesIndex}-${item.dataIndex}-${index}`"
            class="sn-chart__tooltip-row"
          >
            <span
              v-if="tooltipModel.showMarker"
              class="sn-chart__tooltip-marker"
              :style="{ backgroundColor: item.color }"
            />
            <span
              v-if="tooltipModel.showSeriesName && item.seriesName"
              class="sn-chart__tooltip-name"
            >
              {{ item.seriesName }}
            </span>
            <span v-if="tooltipModel.showValue" class="sn-chart__tooltip-value">{{
              itemValue(item)
            }}</span>
            <span
              v-if="tooltipModel.showPercent && item.percent !== undefined"
              class="sn-chart__tooltip-percent"
            >
              {{ itemPercent(item) }}
            </span>
          </div>
          <!-- `label` alone is not unique: two `extraRows` entries may share a
               label (e.g. two series both exposing `min`), which would give Vue
               duplicate keys. The index keeps them distinct. -->
          <div
            v-for="(row, rowIndex) in tooltipModel.extraRows"
            :key="`${row.label}-${rowIndex}`"
            class="sn-chart__tooltip-row"
          >
            <span class="sn-chart__tooltip-name">{{ row.label }}</span>
            <span class="sn-chart__tooltip-value" :style="row.color ? { color: row.color } : {}">{{
              row.value
            }}</span>
          </div>
          <div
            v-if="tooltipModel.footer"
            class="sn-chart__tooltip-footer"
            :innerHTML="tooltipModel.html ? tooltipModel.footer : undefined"
          >
            <template v-if="!tooltipModel.html">{{ tooltipModel.footer }}</template>
          </div>
        </slot>
      </div>
    </Transition>

    <!-- Empty state: an option without series renders an empty canvas otherwise,
         which reads as a bug rather than as "no data". -->
    <div v-if="!hasSeries" class="sn-chart__empty">
      <slot name="empty">
        <SnEmpty description="暂无数据" size="small" />
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * Non-reactive helpers that must not live in `<script setup>`: a second
 * `<script>` block is the only place a SFC may declare module-level exports.
 */
export {};
</script>

<style scoped>
/**
 * Container + tooltip styling.
 *
 * Every colour is a `--sn-web-*` token or a chart-scoped
 * `--sn-chart-*` variable the component writes from the built theme (§34 —
 * no hard-coded hex values in component CSS).
 */
.sn-chart {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 120px;
  font-family: var(--sn-web-font-family-body);
  color: var(--sn-web-color-text-primary);
  background: transparent;
}

.sn-chart__canvas {
  width: 100%;
  height: 100%;
}

/* ── Loading ──────────────────────────────────────────────────────────────── */

.sn-chart__loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--sn-web-color-background-surface) 82%, transparent);
  border-radius: var(--sn-web-radius-md, 4px);
  z-index: 2;
}

/* ── Tooltip ──────────────────────────────────────────────────────────────── */

.sn-chart__tooltip {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 8;
  max-width: 240px;
  padding: var(--sn-web-spacing-2, 4px) var(--sn-web-spacing-3, 8px);
  color: var(--sn-chart-color-text, var(--sn-web-color-text-primary));
  background: var(--sn-chart-color-surface, var(--sn-web-color-background-elevated));
  border: 1px solid var(--sn-chart-color-border, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-radius-md, 4px);
  box-shadow: var(--sn-web-shadow-md, 0 4px 12px rgb(0 0 0 / 12%));
  font-size: var(--sn-web-font-size-xs, 12px);
  line-height: var(--sn-web-font-line-height-normal, 1.5);
  pointer-events: none;
  transition-property: opacity, transform;
  transition-duration: 120ms;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

.sn-chart__tooltip-label {
  margin-bottom: var(--sn-web-spacing-1, 2px);
  padding-bottom: var(--sn-web-spacing-1, 2px);
  border-bottom: 1px solid var(--sn-chart-color-border, var(--sn-web-color-border-subtle));
  color: var(--sn-web-color-text-primary);
  font-weight: var(--sn-web-font-weight-medium, 500);
}

.sn-chart__tooltip-row {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-2, 4px);
  padding: 1px 0;
}

.sn-chart__tooltip-marker {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.sn-chart__tooltip-name {
  flex: 1 1 auto;
  overflow: hidden;
  color: var(--sn-web-color-text-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sn-chart__tooltip-value {
  flex: none;
  color: var(--sn-chart-color-text, var(--sn-web-color-text-primary));
  font-variant-numeric: tabular-nums;
  font-weight: var(--sn-web-font-weight-medium, 500);
}

.sn-chart__tooltip-percent {
  flex: none;
  color: var(--sn-web-color-text-tertiary);
}

.sn-chart__tooltip-footer {
  margin-top: var(--sn-web-spacing-1, 2px);
  padding-top: var(--sn-web-spacing-1, 2px);
  border-top: 1px solid var(--sn-chart-color-border, var(--sn-web-color-border-subtle));
  color: var(--sn-web-color-text-tertiary);
}

/* ── Empty state ──────────────────────────────────────────────────────────── */

.sn-chart__empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

/* ── Transitions ──────────────────────────────────────────────────────────── */

.sn-chart-fade-enter-active,
.sn-chart-fade-leave-active {
  transition: opacity 120ms cubic-bezier(0.16, 1, 0.3, 1);
}

.sn-chart-fade-enter-from,
.sn-chart-fade-leave-to {
  opacity: 0;
}

.sn-chart-tooltip-enter-active,
.sn-chart-tooltip-leave-active {
  transition: opacity 120ms cubic-bezier(0.16, 1, 0.3, 1);
}

.sn-chart-tooltip-enter-from,
.sn-chart-tooltip-leave-to {
  opacity: 0;
}

/* ── Reduced motion (§52 / global reduced-motion rule) ────────────────────── */

@media (prefers-reduced-motion: reduce) {
  .sn-chart__tooltip,
  .sn-chart-fade-enter-active,
  .sn-chart-fade-leave-active,
  .sn-chart-tooltip-enter-active,
  .sn-chart-tooltip-leave-active {
    transition-duration: 0.01ms;
  }
}
</style>
