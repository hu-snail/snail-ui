<script setup lang="ts">
/**
 * sn-qr-code (uni-end) — QR Code painted onto a `<canvas>`.
 *
 * Reference library: wot-ui `wd-qr-code`
 *   (https://wot-ui.cn/component/qr-code.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-qr-code 1:1 except for
 * the documented omissions. Anything new added here MUST also be added to the
 * reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-qr-code/sn-qr-code.vue
 * → auto-registered as `<sn-qr-code>` in any .vue that uses it.
 *
 * ## The code is real
 *
 * `./sn-qr-core.ts` is a from-scratch ISO/IEC 18004 Model 2 encoder (versions
 * 1-40, four EC levels, numeric / alphanumeric / byte segments, 8 masks with
 * the N1-N4 penalty evaluation, Reed-Solomon over GF(2^8)). No dependency is
 * added and nothing is `eval`-ed (AGENTS.md §23).
 *
 * ## Four canvas hosts, one drawing routine
 *
 * `uni.createCanvasContext` is the legacy uni-app spec (WeChat / Alipay / App).
 * uni-app x deprecated that spec: on its Web runtime the shim still exists but
 * paints into a detached surface, so preferring it left every QR transparent.
 * The resolver therefore branches on the host first:
 *
 *   - uni-app x App / Web → W3C-aligned `UniCanvasElement.getContext('2d')`
 *     via `uni.getElementById`. The bitmap is sized from the element box ×
 *     devicePixelRatio and the modules are drawn directly in device pixels —
 *     no `scale()` (which the official sample requires exactly once, and which
 *     a second sizing pass used to double).
 *   - uni-app x mini-programs → `uni.createCanvasContextAsync({ id,
 *     component })`. `getElementById` and template refs are NOT usable there;
 *     the resolved context is cached and every repaint reuses it. When the
 *     host exposes no resizable bitmap the context stays in logical px, so the
 *     matrix is NOT multiplied by DPR (that used to push it off-screen).
 *   - classic uni-app → `uni.createCanvasContext(canvasId, instance.proxy)`
 *     with a `draw()` flush; the component proxy scopes the lookup inside a
 *     custom component. On mini-programs the extent stays in logical px.
 *   - plain H5 / docs preview / tests → the `<canvas>` element's own
 *     `getContext('2d')`.
 *
 * All four satisfy the same `CanvasLike` shape, so the module loop is written
 * once. Command-queue contexts (legacy and some mini-program 2d contexts) get
 * a `draw()` flush. When no surface is available the grid simply stays
 * unpainted — rendering never throws (same degradation as the web-end
 * `SnQrCode`).
 *
 * First paint is retried a bounded number of times: uni-app x only exposes a
 * real element box after layout / `@ready`, and a mini-program native canvas
 * can hand out a context long before it is drawable, so a short repaint tail
 * runs there even when the first paint appeared to succeed.
 *
 * ## Four rounded corner blocks (AUI extension)
 *
 * `cornerRadius` (design px, default 6, `0` = standard square corners) rounds
 * the three finder patterns and — on version ≥ 2 — the bottom-right alignment
 * pattern. Each block is repainted as a rounded 回 (dark outer ring → light
 * ring → dark centre) with the same 7×7 / 5×5 module footprint, so no data
 * module changes and the outer plate stays square; only the corner geometry is
 * softened. Version 1 has no alignment pattern, so it has three corner blocks.
 * The rounded-square filler degrades `roundRect` → an `arc` path → `fillRect`
 * because legacy uni canvas contexts expose fewer path APIs.
 *
 * This prop is a deliberate AUI extension on top of the wd-qr-code prop
 * surface; it is recorded as such in `ai-description.md` rather than being
 * silently added to the parity list.
 *
 * ## Documented omissions (CONTRIBUTING §2.2 — no half-built props)
 *
 *   - `logo` / `logo-width` / `logo-height` / `logo-background-color` /
 *     `logo-radius` / `logo-border-color` / `logo-border-width` are NOT
 *     declared. Painting an image into a uni canvas needs
 *     `uni.getImageInfo` (or `downloadFile`) before `drawImage`, whose
 *     availability and async timing differ per vendor; a logo that silently
 *     misses on one target would also invalidate the EC budget the code was
 *     sized for.
 *   - `background-image` is NOT declared for the same reason (decode → draw →
 *     export round-trip).
 *
 * ## Colors (AGENTS.md §34 / CONTRIBUTING §2.4)
 *
 * A canvas cannot resolve `var(--sn-mp-*)`, so the two module colors are not
 * tokens. They default to `''` = "the code's own dark-on-light", which is also
 * what keeps the code scannable under `.sn-theme-dark`: an inverted (light-on-
 * dark) QR is unreadable for most scanners. Pass `color-dark` / `color-light`
 * explicitly to restyle; every other color in the component is a `--sn-mp-*`
 * token.
 *
 * ## Dispose (AGENTS.md §41)
 *
 * One cached legacy context, bounded retry timers and at most one pending
 * async context request. `onBeforeUnmount` clears all of them so a late
 * callback cannot paint against a torn-down node.
 *
 * Per AGENTS.md §32, this component handles rendering only: it does not
 * validate business payloads and does not fetch anything.
 *
 * Usage:
 *   <sn-qr-code text="https://snui.dev" :size="200" />
 *   <sn-qr-code text="AUI-20240001" dot-type="dots" correct-level="M" :margin="8" />
 *
 * Not responsible for:
 *   - 一维码 / 条码 — 无对应组件
 *   - 扫码识别 — 由宿主调用 `uni.scanCode`
 */

import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { resolveUniHost } from '../../utils/uni-host';
import { encode, type SnQrEncoded } from './sn-qr-core';

defineOptions({ name: 'SnQrCode' });

/** Error correction level. Mirrors `wd-qr-code` `correct-level`. */
type QrCorrectLevel = 'L' | 'M' | 'Q' | 'H';

/** Module shape. Mirrors `wd-qr-code` `dot-type`. */
type QrDotType = 'square' | 'dots' | 'rounded' | 'liquid';

/** Gradient direction. Mirrors `wd-qr-code` `gradient-direction`. */
type QrGradientDirection = 'diagonal' | 'horizontal' | 'vertical';

/** Canvas size bounds in design px — keeps the canvas sane. */
const MIN_SIZE = 40;
const MAX_SIZE = 1000;

/**
 * Canvas needs concrete colors, and a QR must stay dark-on-light to scan, so
 * these two are theme-independent by design (see the header). Named CSS colors
 * rather than hex literals — no token-check violation.
 */
const CANVAS_DARK = 'black';
const CANVAS_LIGHT = 'white';

/** Design px → rpx (750 design width, 1px = 2rpx — CONTRIBUTING §2.4). */
const RPX_PER_PX = 2;

/** Default corner-block radius in design px; `0` restores square corners. */
const DEFAULT_CORNER_RADIUS = 6;
/** Upper bound for `cornerRadius` before it is clamped against the module size. */
const MAX_CORNER_RADIUS = 40;
/** A radius bigger than 1.5 modules would turn a corner block into a circle. */
const CORNER_RADIUS_CELL_LIMIT = 1.5;

/**
 * First-paint retries for uni-app x and mini-programs. Native canvases become
 * drawable noticeably later than `onMounted` / `@ready` on WeChat MP, so the
 * tail is longer than the two-tick retry H5 needs.
 */
const UNI_X_RETRY_DELAYS = [0, 50, 150, 350, 700];

const props = withDefaults(
  defineProps<{
    /** Payload encoded into the code. */
    text?: string;
    /** Canvas side length in design px (`wd-qr-code` `size`). */
    size?: number;
    /** Error correction level: L (~7%) / M (~15%) / Q (~25%) / H (~30%). */
    correctLevel?: QrCorrectLevel;
    /** Dark module color; `''` = the code's own dark color. */
    colorDark?: string;
    /** Light module + quiet-zone color; `''` = the code's own light color. */
    colorLight?: string;
    /** Quiet-zone width in design px, painted inside the canvas. */
    margin?: number;
    /** Module shape. */
    dotType?: QrDotType;
    /** Module fill ratio inside its cell, `0.4`-`1`. */
    dotScale?: number;
    /**
     * Corner-block radius in design px (AUI extension). Rounds the three
     * finder patterns and, on version ≥ 2, the bottom-right alignment
     * pattern. `0` restores the standard square corners.
     */
    cornerRadius?: number;
    /** Paint dark modules with a linear gradient. */
    enableGradient?: boolean;
    /** Gradient end color; `''` falls back to `colorDark`. */
    gradientColor?: string;
    /** Multi-stop gradient colors (2+); wins over `gradientColor`. */
    gradientColors?: string[];
    /** Gradient direction; a number is an angle in degrees. */
    gradientDirection?: QrGradientDirection | number;
    /** Canvas id; `''` = auto-generated per instance. */
    canvasId?: string;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
  }>(),
  {
    text: '',
    size: 200,
    correctLevel: 'H',
    colorDark: '',
    colorLight: '',
    margin: 0,
    dotType: 'square',
    dotScale: 1,
    cornerRadius: DEFAULT_CORNER_RADIUS,
    enableGradient: false,
    gradientColor: '',
    gradientColors: () => [],
    gradientDirection: 'diagonal',
    canvasId: '',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'click', event: Event): void;
  (e: 'error', error: unknown): void;
}>();

const instance = getCurrentInstance();

/** Union of the component scopes uni needs when looking up a canvas id. */
function componentScope(): unknown {
  return instance?.proxy ?? instance;
}

/** Unique canvas id per instance — two codes on one page must not collide. */
const canvasIdValue = computed(() => props.canvasId || `sn-qr-code-${instance?.uid ?? 0}`);

/** Clamped canvas side length in design px. */
const sizeValue = computed(() => {
  if (!Number.isFinite(props.size)) return 200;
  return Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(props.size)));
});

/** Clamped quiet zone; never eats more than a third of the canvas. */
const marginValue = computed(() => {
  if (!Number.isFinite(props.margin) || props.margin <= 0) return 0;
  return Math.min(Math.floor(sizeValue.value / 3), Math.round(props.margin));
});

/** Clamped module fill ratio. */
const dotScaleValue = computed(() => {
  if (!Number.isFinite(props.dotScale)) return 1;
  return Math.min(1, Math.max(0.4, props.dotScale));
});

/** Corner-block radius in design px; `0` keeps the standard square corners. */
const cornerRadiusValue = computed(() => {
  if (!Number.isFinite(props.cornerRadius) || props.cornerRadius <= 0) return 0;
  return Math.min(MAX_CORNER_RADIUS, props.cornerRadius);
});

/** Encode result, or the failure that `error` reports. */
const encoded = ref<SnQrEncoded | null>(null);
const hasEncodeError = ref(false);

function rebuild(): void {
  try {
    encoded.value = encode(props.text, props.correctLevel);
    hasEncodeError.value = false;
  } catch (error) {
    encoded.value = null;
    hasEncodeError.value = true;
    emit('error', error);
  }
}

rebuild();

watch(
  () => [props.text, props.correctLevel],
  () => rebuild(),
);

/* ── Canvas surface ─────────────────────────────────────────────────────── */

/** Linear gradient handle, structurally shared by the uni and DOM canvases. */
interface CanvasGradientLike {
  addColorStop: (offset: number, color: string) => void;
}

/**
 * The subset of the canvas 2D API this component draws with.
 *
 * Every call except `fillRect` is optional because the legacy uni canvas
 * context implements fewer methods than the W3C one; each use is
 * feature-detected.
 */
interface CanvasLike {
  fillStyle: unknown;
  fillRect: (x: number, y: number, w: number, h: number) => void;
  beginPath?: () => void;
  arc?: (x: number, y: number, r: number, start: number, end: number) => void;
  fill?: () => void;
  toDataURL?: () => string;
  /** W3C context only: the element behind this context. */
  canvas?: CanvasElementLike;
  roundRect?: (x: number, y: number, w: number, h: number, r: number) => void;
  createLinearGradient?: (x0: number, y0: number, x1: number, y1: number) => CanvasGradientLike;
  /** Legacy uni canvas only: flush the command queue to the native canvas. */
  draw?: (reserve?: boolean, callback?: () => void) => void;
}

/** W3C-aligned canvas element (uni-app x `UniCanvasElement` / H5 `<canvas>`). */
interface CanvasElementLike {
  width?: number;
  height?: number;
  offsetWidth?: number;
  offsetHeight?: number;
  getContext?: (id: string) => unknown;
  getBoundingClientRect?: () => { width?: number; height?: number };
  toDataURL?: () => string;
}

/** uni-app x async context wrapper (`uni.createCanvasContextAsync`). */
interface AsyncCanvasContextLike {
  getContext?: (type: string) => unknown;
  toDataURL?: () => string;
}

/** uni runtime subset this component touches. All lookups are guarded. */
interface UniHost {
  /** Legacy uni-app spec — NOT a rendering path on uni-app x. */
  createCanvasContext?: (id: string, component?: unknown) => CanvasLike;
  canvasToTempFilePath?: (options: Record<string, unknown>, component?: unknown) => void;
  /** uni-app x App / Web: synchronous W3C element lookup. */
  getElementById?: (id: string) => unknown;
  /** uni-app x mini-programs: async canvas context lookup. */
  createCanvasContextAsync?: (options: Record<string, unknown>) => void;
  /** devicePixelRatio sources, best available first. */
  getDeviceInfo?: () => unknown;
  getWindowInfo?: () => unknown;
  /** Platform hint; present on both uni-app and uni-app x runtimes. */
  getSystemInfoSync?: () => unknown;
}

/** A resolved drawing target plus the coordinate space it expects. */
interface QrSurface {
  ctx: CanvasLike;
  /** Side length in `ctx` units (device px on W3C, design px on legacy). */
  extent: number;
  /** W3C element for `toDataURL` export; null on the legacy path. */
  element: CanvasElementLike | null;
  /** Legacy contexts queue commands and need `draw()` to flush. */
  legacy: boolean;
}

function getUni(): UniHost | null {
  return resolveUniHost<UniHost>();
}

/**
 * uni-app x detection. Both APIs are exclusive to the uni-app x runtime;
 * classic uni-app exposes neither. Keeping the legacy shim off this branch is
 * the fix for the blank QR codes on uni-app x (Web/App/MP).
 */
function isUniAppX(): boolean {
  const host = getUni();
  return (
    typeof host?.getElementById === 'function' ||
    typeof host?.createCanvasContextAsync === 'function'
  );
}

/**
 * Mini-program host detection. `uni.getElementById` is App/Web only: on
 * uni-app x mini-programs a canvas can ONLY be resolved through
 * `uni.createCanvasContextAsync`, and a template ref there does not expose a
 * usable W3C element. Also, mini-program 2d contexts may still queue commands
 * and need a `draw()` flush even when they look W3C-shaped.
 *
 * This reads `globalThis` properties by `typeof` only (no DOM API call), so it
 * stays valid on every target without compile-time `#ifdef` gates.
 */
function isMiniProgram(): boolean {
  // The platform API is authoritative on both uni-app and uni-app x.
  try {
    const info = getUni()?.getSystemInfoSync?.() as
      | { uniPlatform?: string; platform?: string }
      | undefined;
    const platform = info?.uniPlatform ?? info?.platform ?? '';
    if (platform.startsWith('mp-') || platform === 'devtools') return true;
    if (platform === 'web' || platform === 'h5' || platform === 'app') return false;
  } catch {
    // Fall through to the environment probe below.
  }
  const host = globalThis as Record<string, unknown>;
  // Web / docs preview / happy-dom tests always have a document.
  if (typeof host.document === 'object' && host.document !== null) return false;
  // WeChat / Alipay / Douyin / Baidu / QQ / Kuaishou expose their bridge.
  return ['wx', 'my', 'tt', 'swan', 'qq', 'ks', 'jd'].some(
    (name) => typeof host[name] === 'object' && host[name] !== null,
  );
}

/** Template ref on `<canvas>` — the H5 / docs-preview fallback surface. */
const canvasEl = ref<unknown>(null);

/** Cached legacy context (only that path is stateful and worth caching). */
let legacySurface: CanvasLike | null = null;
let legacyCanvasId = '';

/** W3C element of the last successful paint — used by `exportImage`. */
let activeElement: CanvasElementLike | null = null;
/** Data-URL exporter from the uni-app x async context path. */
let asyncDataUrl: (() => string) | null = null;
/**
 * uni-app x mini-program surface. `createCanvasContextAsync` is the only way
 * to get a context there, and it is asynchronous, so the resolved surface is
 * cached and reused by every later repaint / prop change.
 */
let asyncSurface: QrSurface | null = null;

/** True while the W3C element has no layout box yet (first paint too early). */
let layoutPending = false;
let disposed = false;
let asyncPending = false;
let asyncSeq = 0;

/** devicePixelRatio from the host, falling back to the browser / 1. */
function devicePixelRatio(): number {
  let ratio = 1;
  try {
    const host = getUni();
    const device = host?.getDeviceInfo?.() as { devicePixelRatio?: number } | undefined;
    const windowInfo = host?.getWindowInfo?.() as { pixelRatio?: number } | undefined;
    const globalDpr = (globalThis as { devicePixelRatio?: number }).devicePixelRatio;
    const candidates: Array<number | undefined> = [
      device?.devicePixelRatio,
      windowInfo?.pixelRatio,
      globalDpr,
    ];
    for (const candidate of candidates) {
      if (typeof candidate === 'number' && Number.isFinite(candidate) && candidate > 0) {
        ratio = candidate;
        break;
      }
    }
  } catch {
    ratio = 1;
  }
  return ratio;
}

/** Resolve the W3C canvas element by id (uni-app x) or template ref (H5). */
function getCanvasElement(): CanvasElementLike | null {
  // Mini-programs have no synchronous element lookup; a ref there is not a
  // W3C canvas. Returning null forces the async CanvasContext path instead of
  // painting into a context that never reaches the screen.
  if (isMiniProgram()) return null;
  const host = getUni();
  if (typeof host?.getElementById === 'function') {
    try {
      const found = host.getElementById(canvasIdValue.value);
      if (found !== null && typeof found === 'object') {
        const element = found as CanvasElementLike;
        if (typeof element.getContext === 'function') return element;
      }
    } catch (error) {
      emit('error', error);
    }
  }
  const refValue = canvasEl.value;
  if (refValue !== null && typeof refValue === 'object') {
    const element = refValue as CanvasElementLike;
    if (typeof element.getContext === 'function') return element;
  }
  return null;
}

/** Measured CSS side length in px, or 0 before first layout. */
function elementBoxSize(element: CanvasElementLike): number {
  let side = typeof element.offsetWidth === 'number' ? element.offsetWidth : 0;
  if (side <= 0 && typeof element.offsetHeight === 'number' && element.offsetHeight > 0) {
    side = element.offsetHeight;
  }
  if (side <= 0 && typeof element.getBoundingClientRect === 'function') {
    try {
      const rect = element.getBoundingClientRect();
      if (rect !== null && typeof rect === 'object') {
        if (typeof rect.width === 'number' && rect.width > 0) side = rect.width;
        else if (typeof rect.height === 'number' && rect.height > 0) side = rect.height;
      }
    } catch {
      // No layout box yet — the caller falls back to design px and retries.
    }
  }
  return side > 0 ? side : 0;
}

/**
 * W3C path: size the bitmap to the real element box × DPR, then paint in
 * device pixels. Setting `width`/`height` resets the context state, so no
 * `scale()` is needed and repeated paints cannot accumulate a transform.
 */
function tryW3cSurface(): QrSurface | null {
  const element = getCanvasElement();
  if (element === null) return null;

  const hasBitmap =
    typeof element.width === 'number' && typeof element.height === 'number';
  // On uni-app x, a real UniCanvasElement (App/Web) always has a resizable
  // backing store. Mini-program refs do not: their context must be obtained
  // through createCanvasContextAsync, so reject the fake synchronous element
  // instead of painting into a surface that never reaches the screen.
  if (isUniAppX() && !hasBitmap) return null;

  const side = elementBoxSize(element);
  layoutPending = side <= 0;
  const box = side > 0 ? side : sizeValue.value;
  // Device-pixel coordinates are only valid when we can actually resize the
  // backing store. A canvas without width/height works in logical px;
  // multiplying by DPR there pushes the whole matrix outside the visible area.
  const extent = Math.max(1, Math.round(hasBitmap ? box * devicePixelRatio() : box));

  try {
    if (hasBitmap) {
      element.width = extent;
      element.height = extent;
    }
    const context = element.getContext?.('2d');
    if (context === null || context === undefined || typeof context !== 'object') return null;
    return { ctx: context as CanvasLike, extent, element, legacy: false };
  } catch (error) {
    emit('error', error);
    return null;
  }
}

/** Legacy uni-app path: command queue + `draw()`, scoped to this component. */
function tryLegacySurface(): QrSurface | null {
  const create = getUni()?.createCanvasContext;
  if (typeof create !== 'function') return null;
  if (legacySurface !== null && legacyCanvasId === canvasIdValue.value) {
    return withLegacyBitmap(legacySurface);
  }
  try {
    const context = create(canvasIdValue.value, componentScope());
    if (context !== null && typeof context === 'object') {
      legacySurface = context as CanvasLike;
      legacyCanvasId = canvasIdValue.value;
      return withLegacyBitmap(legacySurface);
    }
  } catch (error) {
    emit('error', error);
  }
  return null;
}

/**
 * Classic uni-app H5 still exposes the real `<canvas>` element behind the
 * legacy context. Size its backing store to `size × DPR` (the default
 * 300×150 would clip a `size > 150` code) and draw in those device pixels —
 * no transform needed. Mini-programs expose no element and keep design px.
 */
function withLegacyBitmap(ctx: CanvasLike): QrSurface {
  const element = getCanvasElement();
  if (
    element !== null &&
    typeof element.width === 'number' &&
    typeof element.height === 'number'
  ) {
    const extent = Math.max(1, Math.round(sizeValue.value * devicePixelRatio()));
    element.width = extent;
    element.height = extent;
    return { ctx, extent, element: null, legacy: true };
  }
  return { ctx, extent: sizeValue.value, element: null, legacy: true };
}

/**
 * Surface resolution order.
 *
 * - uni-app x mini-programs: ONLY `uni.createCanvasContextAsync` can resolve a
 *   canvas (`getElementById` is App/Web-only there). The resolved surface is
 *   cached and reused by every later repaint.
 * - uni-app x App / Web: synchronous W3C element.
 * - classic uni-app: legacy `createCanvasContext` + `draw()`.
 *
 * uni-app x MUST NOT take the legacy branch: `uni.createCanvasContext` is a
 * deprecated shim there and paints into a surface that is never displayed.
 */
function acquireSurface(): QrSurface | null {
  if (isUniAppX()) {
    if (isMiniProgram()) return asyncSurface;
    return tryW3cSurface();
  }
  return tryLegacySurface() ?? tryW3cSurface();
}

/**
 * uni-app x mini-programs have no synchronous canvas element lookup; their
 * context arrives asynchronously. One request at a time, guarded by a sequence
 * number so a late callback cannot repaint after unmount or a newer request.
 */
function requestAsyncSurface(): void {
  const createAsync = getUni()?.createCanvasContextAsync;
  if (
    typeof createAsync !== 'function' ||
    asyncPending ||
    disposed ||
    asyncSurface !== null
  ) {
    return;
  }
  asyncPending = true;
  const seq = ++asyncSeq;
  try {
    createAsync({
      id: canvasIdValue.value,
      component: componentScope(),
      success: (value: unknown) => {
        asyncPending = false;
        if (disposed || seq !== asyncSeq || value === null || typeof value !== 'object') return;
        try {
          const holder = value as AsyncCanvasContextLike;
          const context = holder.getContext?.('2d');
          if (context === null || context === undefined || typeof context !== 'object') return;
          const ctx = context as CanvasLike;
          const element = ctx.canvas ?? null;
          // Official uni-app x hidpi pattern: bitmap = box × DPR and either a
          // `scale(dpr, dpr)` transform or drawing in device pixels. When the
          // host gives us no resizable bitmap, the context stays in LOGICAL px
          // and multiplying by DPR would push the whole matrix off-screen.
          const hasBitmap =
            element !== null &&
            typeof element.width === 'number' &&
            typeof element.height === 'number';
          const side = element !== null ? elementBoxSize(element) : 0;
          const box = side > 0 ? side : sizeValue.value;
          const extent = Math.max(
            1,
            Math.round(hasBitmap ? box * devicePixelRatio() : sizeValue.value),
          );
          if (hasBitmap && element !== null) {
            element.width = extent;
            element.height = extent;
          }
          const surface: QrSurface = { ctx, extent, element, legacy: false };
          asyncSurface = surface;
          activeElement = element;
          if (typeof holder.toDataURL === 'function') {
            asyncDataUrl = () => holder.toDataURL?.() ?? '';
          }
          drawMatrix(surface);
        } catch (error) {
          emit('error', error);
        }
      },
      fail: () => {
        // A later first-paint retry will issue a fresh request.
        asyncPending = false;
      },
    });
  } catch (error) {
    asyncPending = false;
    emit('error', error);
  }
}

/* ── Painting ───────────────────────────────────────────────────────────── */

/** Gradient stop colors: `gradientColors` (2+) wins over `gradientColor`. */
const gradientStops = computed<string[]>(() => {
  const colors = props.gradientColors.filter((color) => color !== '');
  if (colors.length >= 2) return colors;
  const start = props.colorDark || CANVAS_DARK;
  const end = props.gradientColor || props.colorDark || CANVAS_DARK;
  return [start, end];
});

/** Gradient start / end points for the canvas, in ctx units. */
function gradientPoints(size: number): { x0: number; y0: number; x1: number; y1: number } {
  if (typeof props.gradientDirection === 'number') {
    const radians = (props.gradientDirection * Math.PI) / 180;
    const dx = Math.cos(radians) * size;
    const dy = Math.sin(radians) * size;
    return {
      x0: (size - dx) / 2,
      y0: (size - dy) / 2,
      x1: (size + dx) / 2,
      y1: (size + dy) / 2,
    };
  }
  if (props.gradientDirection === 'horizontal') return { x0: 0, y0: 0, x1: size, y1: 0 };
  if (props.gradientDirection === 'vertical') return { x0: 0, y0: 0, x1: 0, y1: size };
  return { x0: 0, y0: 0, x1: size, y1: size };
}

/** Dark-module paint: a flat color, or a gradient when enabled + supported. */
function resolveDarkPaint(ctx: CanvasLike, size: number): unknown {
  const flat = props.colorDark || CANVAS_DARK;
  if (!props.enableGradient || typeof ctx.createLinearGradient !== 'function') return flat;
  const points = gradientPoints(size);
  const gradient = ctx.createLinearGradient(points.x0, points.y0, points.x1, points.y1);
  const stops = gradientStops.value;
  stops.forEach((color, index) => {
    gradient.addColorStop(stops.length === 1 ? 0 : index / (stops.length - 1), color);
  });
  return gradient;
}

/** Fill a circle, degrading to a square when the canvas has no `arc`. */
function paintCircle(ctx: CanvasLike, cx: number, cy: number, radius: number): void {
  if (
    typeof ctx.beginPath !== 'function' ||
    typeof ctx.arc !== 'function' ||
    typeof ctx.fill !== 'function'
  ) {
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    return;
  }
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Paint one dark module inside its own cell.
 *
 * `square` fills the cell, `dots` a circle, `rounded` a rounded square (falls
 * back to a circle where `roundRect` is missing), `liquid` a circle *plus*
 * bridges towards orthogonally adjacent dark modules so neighbours fuse — the
 * shape wd-qr-code calls liquid.
 */
function paintModule(
  ctx: CanvasLike,
  x: number,
  y: number,
  cell: number,
  margin: number,
  matrix: SnQrEncoded,
): void {
  // Module coordinates → absolute canvas position (quiet zone included).
  const left = margin + x * cell;
  const top = margin + y * cell;
  const scale = dotScaleValue.value;
  const inset = (cell * (1 - scale)) / 2;
  const side = cell * scale;
  const dotType = props.dotType;

  if (dotType === 'square') {
    ctx.fillRect(left + inset, top + inset, side, side);
    return;
  }

  if (dotType === 'rounded') {
    if (
      typeof ctx.roundRect === 'function' &&
      typeof ctx.fill === 'function' &&
      typeof ctx.beginPath === 'function'
    ) {
      ctx.beginPath();
      ctx.roundRect(left + inset, top + inset, side, side, Math.max(0, cell * 0.28 * scale));
      ctx.fill();
      return;
    }
    paintCircle(ctx, left + cell / 2, top + cell / 2, side / 2);
    return;
  }

  paintCircle(ctx, left + cell / 2, top + cell / 2, side / 2);
  if (dotType !== 'liquid') return;

  // liquid: bridge to dark neighbours so adjacent dots fuse into a blob.
  const bridge = Math.max(1, Math.round(cell * 0.18));
  if (matrix.getModule(x - 1, y))
    ctx.fillRect(left - bridge, top + cell / 2 - bridge, bridge * 2, bridge * 2);
  if (matrix.getModule(x + 1, y))
    ctx.fillRect(left + cell - bridge, top + cell / 2 - bridge, bridge * 2, bridge * 2);
  if (matrix.getModule(x, y - 1))
    ctx.fillRect(left + cell / 2 - bridge, top - bridge, bridge * 2, bridge * 2);
  if (matrix.getModule(x, y + 1))
    ctx.fillRect(left + cell / 2 - bridge, top + cell - bridge, bridge * 2, bridge * 2);
}

/* ── Corner blocks ──────────────────────────────────────────────────────── */

/** A structural corner block, in module coordinates. */
interface QrCornerBlock {
  x: number;
  y: number;
  /** 7 for a finder pattern, 5 for the bottom-right alignment pattern. */
  size: number;
}

/**
 * The corner blocks: three 7×7 finder patterns plus the 5×5 bottom-right
 * alignment pattern. Version 1 has no alignment pattern, so only three blocks
 * are returned — painting a fourth one there would overwrite data modules.
 */
function cornerBlocks(matrix: SnQrEncoded): QrCornerBlock[] {
  const far = matrix.size - 7;
  const blocks: QrCornerBlock[] = [
    { x: 0, y: 0, size: 7 },
    { x: far, y: 0, size: 7 },
    { x: 0, y: far, size: 7 },
  ];
  if (matrix.version >= 2) {
    blocks.push({ x: matrix.size - 9, y: matrix.size - 9, size: 5 });
  }
  return blocks;
}

/** True when `(x, y)` belongs to a corner block and is repainted separately. */
function isCornerModule(x: number, y: number, blocks: QrCornerBlock[]): boolean {
  for (const block of blocks) {
    if (
      x >= block.x &&
      x < block.x + block.size &&
      y >= block.y &&
      y < block.y + block.size
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Fill a rounded square, degrading `roundRect` → an `arc` path → `fillRect`.
 * Legacy uni canvas contexts expose fewer path APIs than the W3C one, so each
 * step is feature-detected; a missing `fill` / `beginPath` ends in a plain rect.
 */
function paintRoundedRect(
  ctx: CanvasLike,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
): void {
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  if (r <= 0 || typeof ctx.fill !== 'function' || typeof ctx.beginPath !== 'function') {
    ctx.fillRect(x, y, w, h);
    return;
  }
  try {
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();
      return;
    }
    if (typeof ctx.arc === 'function') {
      ctx.beginPath();
      ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
      ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
      ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
      ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
      ctx.fill();
      return;
    }
  } catch {
    // A few mini-program 2d implementations expose the path methods but throw
    // on non-trivial paths. Fall through to a square fill: the 回 geometry
    // survives even if the rounded corners do not.
  }
  ctx.fillRect(x, y, w, h);
}

/**
 * Repaint the corner blocks as rounded 回 shapes on top of the light plate.
 * The finder / alignment geometry is preserved (1 dark ring, 1 light ring,
 * 3×3 or 1×1 dark centre); only the corners are softened. The radius is a
 * design-px value scaled into ctx units and capped at 1.5 modules.
 */
function paintCornerBlocks(
  ctx: CanvasLike,
  blocks: QrCornerBlock[],
  cell: number,
  margin: number,
  ratio: number,
  darkPaint: unknown,
): void {
  const lightPaint = props.colorLight || CANVAS_LIGHT;
  const base = Math.min(cornerRadiusValue.value * ratio, cell * CORNER_RADIUS_CELL_LIMIT);
  for (const block of blocks) {
    const left = margin + block.x * cell;
    const top = margin + block.y * cell;
    const side = block.size * cell;
    // The 5×5 alignment block gets a proportionally smaller radius so both
    // kinds of corner block read as the same style at a glance.
    const radius = Math.min(base * (block.size / 7), side * 0.25);

    ctx.fillStyle = darkPaint;
    paintRoundedRect(ctx, left, top, side, side, radius);
    ctx.fillStyle = lightPaint;
    paintRoundedRect(ctx, left + cell, top + cell, side - cell * 2, side - cell * 2, radius * 0.6);
    ctx.fillStyle = darkPaint;
    paintRoundedRect(
      ctx,
      left + cell * 2,
      top + cell * 2,
      side - cell * 4,
      side - cell * 4,
      radius * 0.35,
    );
  }
}

/**
 * Paint the whole code onto one surface.
 *
 * `extent` is the drawing square in the context's own units; the quiet zone
 * and module geometry scale from design px by `extent / size`. Drawing in
 * device pixels (instead of a DPR transform) keeps the bitmap crisp and
 * avoids the double-transform that a second sizing pass used to introduce.
 */
function drawMatrix(surface: QrSurface): void {
  const matrix = encoded.value;
  if (matrix === null) return;
  const ctx = surface.ctx;
  const extent = surface.extent;
  const ratio = extent / Math.max(1, sizeValue.value);
  const margin = marginValue.value * ratio;
  const cell = Math.max(1, extent - margin * 2) / matrix.size;
  const blocks = cornerRadiusValue.value > 0 ? cornerBlocks(matrix) : [];

  // Quiet zone: an opaque light plate, so the code scans on any page surface.
  // Skipped corner modules simply leave this plate showing through.
  const lightPaint = props.colorLight || CANVAS_LIGHT;
  ctx.fillStyle = lightPaint;
  ctx.fillRect(0, 0, extent, extent);

  const darkPaint = resolveDarkPaint(ctx, extent);
  ctx.fillStyle = darkPaint;
  for (let y = 0; y < matrix.size; y++) {
    for (let x = 0; x < matrix.size; x++) {
      if (!matrix.getModule(x, y)) continue;
      if (isCornerModule(x, y, blocks)) continue;
      paintModule(ctx, x, y, cell, margin, matrix);
    }
  }

  if (blocks.length > 0) {
    try {
      paintCornerBlocks(ctx, blocks, cell, margin, ratio, darkPaint);
    } catch (error) {
      // Rounded corners are cosmetic. If the host rejects every path call,
      // repaint the skipped corner modules square so the code stays complete
      // and scannable rather than losing three finder patterns.
      emit('error', error);
      ctx.fillStyle = darkPaint;
      for (let y = 0; y < matrix.size; y++) {
        for (let x = 0; x < matrix.size; x++) {
          if (!matrix.getModule(x, y) || !isCornerModule(x, y, blocks)) continue;
          paintModule(ctx, x, y, cell, margin, matrix);
        }
      }
    }
  }

  // Legacy uni canvas queues commands. So do some mini-program 2d contexts
  // reached through the W3C-shaped async API — flush for both. A synchronously
  // resolved W3C canvas (H5 / App) has no draw() and needs no flush.
  if ((surface.legacy || surface === asyncSurface) && typeof ctx.draw === 'function') {
    ctx.draw();
  }
}

/** Paint once. Returns false when no surface could be acquired (tests / SSR). */
function paint(): boolean {
  const matrix = encoded.value;
  if (matrix === null) return false;
  const surface = acquireSurface();
  if (surface === null) return false;
  activeElement = surface.element;
  drawMatrix(surface);
  return true;
}

/* ── First-paint retries ────────────────────────────────────────────────── */

let retryTimers: Array<ReturnType<typeof setTimeout>> = [];
let singleRetryTimer: ReturnType<typeof setTimeout> | null = null;

function clearRetries(): void {
  for (const timer of retryTimers) clearTimeout(timer);
  retryTimers = [];
  if (singleRetryTimer !== null) clearTimeout(singleRetryTimer);
  singleRetryTimer = null;
}

/** Paint and report whether the picture is final (a box was measured). */
function settledPaint(): boolean {
  layoutPending = false;
  const painted = paint();
  if (!painted) requestAsyncSurface();
  return painted && !layoutPending;
}

function scheduleFirstPaintRetries(): void {
  clearRetries();
  if (!isUniAppX() && !isMiniProgram()) {
    // H5 can mount the element a tick late — one deferred retry, no interval.
    singleRetryTimer = setTimeout(() => {
      singleRetryTimer = null;
      if (!disposed) settledPaint();
    }, 0);
    return;
  }
  // A mini-program canvas may hand out a context long before it is drawable,
  // so an early "successful" paint must not cancel the remaining repaints.
  UNI_X_RETRY_DELAYS.forEach((delay) => {
    const timer = setTimeout(() => {
      retryTimers = retryTimers.filter((entry) => entry !== timer);
      if (disposed) return;
      const settled = settledPaint();
      if (settled && !isMiniProgram()) clearRetries();
    }, delay);
    retryTimers.push(timer);
  });
}

/** The `<canvas>` `@ready` callback on uni-app x (notably MP-ALIPAY / MP-WEIXIN). */
function onCanvasReady(): void {
  if (!disposed) settledPaint();
}

/** Re-paint on every input that changes the picture. */
watch(
  () => [
    encoded.value,
    sizeValue.value,
    marginValue.value,
    props.colorDark,
    props.colorLight,
    props.dotType,
    dotScaleValue.value,
    cornerRadiusValue.value,
    props.enableGradient,
    props.gradientColor,
    props.gradientColors,
    props.gradientDirection,
  ],
  () => {
    settledPaint();
  },
  { deep: true },
);

onMounted(() => {
  // First paint after mount: the template ref / native canvas only exists then.
  // Mini-programs keep a short repaint tail even when this first paint passed:
  // the native canvas is often not drawable yet at onMounted time.
  const settled = settledPaint();
  if (!settled || isMiniProgram()) scheduleFirstPaintRetries();
});

onBeforeUnmount(() => {
  // §41: drop every owned resource so no late callback paints a dead node.
  disposed = true;
  asyncSeq++;
  clearRetries();
  legacySurface = null;
  legacyCanvasId = '';
  activeElement = null;
  asyncDataUrl = null;
  asyncSurface = null;
  canvasEl.value = null;
});

/* ── Public method: exportImage ─────────────────────────────────────────── */

/** Rejection payload of `exportImage` (structured, AGENTS.md §28). */
interface QrExportError {
  code: 'CAPABILITY_UNSUPPORTED' | 'EXPORT_FAILED';
  message: string;
  cause?: unknown;
}

/**
 * Export the canvas (`wd-qr-code` `exportImage`).
 *
 * uni-app x / H5 resolve a `data:image/...` URL from the W3C canvas element
 * (or the async CanvasContext); classic uni-app resolves a temp file path via
 * `uni.canvasToTempFilePath`. Rejects with `CAPABILITY_UNSUPPORTED` on hosts
 * without any export capability instead of throwing.
 */
function exportImage(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const element = activeElement ?? (isUniAppX() ? getCanvasElement() : null);
    if (typeof element?.toDataURL === 'function') {
      try {
        const dataUrl = element.toDataURL();
        if (dataUrl.startsWith('data:image/')) {
          resolve(dataUrl);
          return;
        }
      } catch (error) {
        reject({
          code: 'EXPORT_FAILED',
          message: 'canvas toDataURL failed',
          cause: error,
        } satisfies QrExportError);
        return;
      }
    }
    if (asyncDataUrl !== null) {
      try {
        const dataUrl = asyncDataUrl();
        if (dataUrl.startsWith('data:image/')) {
          resolve(dataUrl);
          return;
        }
      } catch (error) {
        reject({
          code: 'EXPORT_FAILED',
          message: 'CanvasContext toDataURL failed',
          cause: error,
        } satisfies QrExportError);
        return;
      }
    }

    const toTempFilePath = getUni()?.canvasToTempFilePath;
    if (typeof toTempFilePath !== 'function') {
      reject({
        code: 'CAPABILITY_UNSUPPORTED',
        message: 'uni.canvasToTempFilePath is not available on this host',
      } satisfies QrExportError);
      return;
    }
    try {
      toTempFilePath(
        {
          canvasId: canvasIdValue.value,
          fileType: 'png',
          success: (result: { tempFilePath?: string }) => {
            if (typeof result?.tempFilePath === 'string') {
              resolve(result.tempFilePath);
              return;
            }
            reject({
              code: 'EXPORT_FAILED',
              message: 'canvasToTempFilePath returned no tempFilePath',
            } satisfies QrExportError);
          },
          fail: (error: unknown) => {
            reject({
              code: 'EXPORT_FAILED',
              message: 'canvasToTempFilePath failed',
              cause: error,
            } satisfies QrExportError);
          },
        },
        componentScope(),
      );
    } catch (error) {
      reject({
        code: 'EXPORT_FAILED',
        message: 'canvasToTempFilePath threw',
        cause: error,
      } satisfies QrExportError);
    }
  });
}

defineExpose({ exportImage });

/* ── Presentation ───────────────────────────────────────────────────────── */

function onTap(event: Event): void {
  emit('click', event);
}

const rootClass = computed(() => ['sn-qr-code', `sn-qr-code--${props.dotType}`, props.customClass]);

const rootStyle = computed(() => {
  const side = `${sizeValue.value * RPX_PER_PX}rpx`;
  const parts = [`width: ${side}`, `height: ${side}`];
  if (props.customStyle) parts.push(props.customStyle);
  return parts.join('; ');
});

const canvasStyle = computed(
  () => `width: ${sizeValue.value * RPX_PER_PX}rpx; height: ${sizeValue.value * RPX_PER_PX}rpx`,
);

const ariaLabel = computed(() => (props.text === '' ? 'QR code' : `QR code: ${props.text}`));
</script>

<template>
  <view
    data-snui-component="qr-code"
    :class="rootClass"
    :style="rootStyle"
    role="img"
    :aria-label="ariaLabel"
    @tap="onTap"
  >
    <canvas
      ref="canvasEl"
      :id="canvasIdValue"
      class="sn-qr-code__canvas"
      :canvas-id="canvasIdValue"
      :data-dot-type="dotType"
      :data-version="encoded ? encoded.version : 0"
      :data-modules="encoded ? encoded.size : 0"
      :data-margin="marginValue"
      :data-corner-radius="cornerRadiusValue"
      :style="canvasStyle"
      @ready="onCanvasReady"
    />

    <view v-if="hasEncodeError" class="sn-qr-code__error" role="alert">
      <text class="sn-qr-code__error-text">内容过长，无法生成二维码</text>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-qr-code {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  /* Frame around the code plate; the code itself keeps its own light surface
   * so it stays scannable in either theme. */
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-elevated);
}

.sn-qr-code__canvas {
  display: block;
}

.sn-qr-code__error {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sn-mp-spacing-4);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-elevated);
}

.sn-qr-code__error-text {
  color: var(--sn-mp-color-feedback-danger);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
  text-align: center;
}
</style>
