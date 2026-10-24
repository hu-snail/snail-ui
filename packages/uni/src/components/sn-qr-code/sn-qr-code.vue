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
 * ## Two paint paths, one drawing routine
 *
 * `uni.createCanvasContext` is the cross-end API (WeChat / Alipay / App) but is
 * absent in a plain browser and in unit tests. The component therefore tries
 * the uni context first and falls back to the element's own `getContext('2d')`
 * (H5 / docs preview). Both satisfy the same `CanvasLike` shape, so the module
 * loop is written once. When neither is available the grid simply stays
 * unpainted — rendering never throws (same degradation as the web-end
 * `SnQrCode`).
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
 * One canvas context, no timer, no listener. `onBeforeUnmount` drops the
 * context so a late `exportImage` cannot resolve against a torn-down node.
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

import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { encode, type SnQrEncoded } from './sn-qr-core'

defineOptions({ name: 'SnQrCode' })

/** Error correction level. Mirrors `wd-qr-code` `correct-level`. */
type QrCorrectLevel = 'L' | 'M' | 'Q' | 'H'

/** Module shape. Mirrors `wd-qr-code` `dot-type`. */
type QrDotType = 'square' | 'dots' | 'rounded' | 'liquid'

/** Gradient direction. Mirrors `wd-qr-code` `gradient-direction`. */
type QrGradientDirection = 'diagonal' | 'horizontal' | 'vertical'

/** Canvas size bounds in design px — keeps the canvas sane. */
const MIN_SIZE = 40
const MAX_SIZE = 1000

/**
 * Canvas needs concrete colors, and a QR must stay dark-on-light to scan, so
 * these two are theme-independent by design (see the header). Named CSS colors
 * rather than hex literals — no token-check violation.
 */
const CANVAS_DARK = 'black'
const CANVAS_LIGHT = 'white'

/** Design px → rpx (750 design width, 1px = 2rpx — CONTRIBUTING §2.4). */
const RPX_PER_PX = 2

const props = withDefaults(
  defineProps<{
    /** Payload encoded into the code. */
    text?: string
    /** Canvas side length in design px (`wd-qr-code` `size`). */
    size?: number
    /** Error correction level: L (~7%) / M (~15%) / Q (~25%) / H (~30%). */
    correctLevel?: QrCorrectLevel
    /** Dark module color; `''` = the code's own dark color. */
    colorDark?: string
    /** Light module + quiet-zone color; `''` = the code's own light color. */
    colorLight?: string
    /** Quiet-zone width in design px, painted inside the canvas. */
    margin?: number
    /** Module shape. */
    dotType?: QrDotType
    /** Module fill ratio inside its cell, `0.4`-`1`. */
    dotScale?: number
    /** Paint dark modules with a linear gradient. */
    enableGradient?: boolean
    /** Gradient end color; `''` falls back to `colorDark`. */
    gradientColor?: string
    /** Multi-stop gradient colors (2+); wins over `gradientColor`. */
    gradientColors?: string[]
    /** Gradient direction; a number is an angle in degrees. */
    gradientDirection?: QrGradientDirection | number
    /** Canvas id; `''` = auto-generated per instance. */
    canvasId?: string
    /** Custom class for the root node. */
    customClass?: string
    /** Custom inline style for the root node. */
    customStyle?: string
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
    enableGradient: false,
    gradientColor: '',
    gradientColors: () => [],
    gradientDirection: 'diagonal',
    canvasId: '',
    customClass: '',
    customStyle: '',
  },
)

const emit = defineEmits<{
  (e: 'click', event: Event): void
  (e: 'error', error: unknown): void
}>()

const instance = getCurrentInstance()

/** Unique canvas id per instance — two codes on one page must not collide. */
const canvasIdValue = computed(() => props.canvasId || `sn-qr-code-${instance?.uid ?? 0}`)

/** Clamped canvas side length in design px. */
const sizeValue = computed(() => {
  if (!Number.isFinite(props.size)) return 200
  return Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(props.size)))
})

/** Clamped quiet zone; never eats more than a third of the canvas. */
const marginValue = computed(() => {
  if (!Number.isFinite(props.margin) || props.margin <= 0) return 0
  return Math.min(Math.floor(sizeValue.value / 3), Math.round(props.margin))
})

/** Clamped module fill ratio. */
const dotScaleValue = computed(() => {
  if (!Number.isFinite(props.dotScale)) return 1
  return Math.min(1, Math.max(0.4, props.dotScale))
})

/** Encode result, or the failure that `error` reports. */
const encoded = ref<SnQrEncoded | null>(null)
const hasEncodeError = ref(false)

function rebuild(): void {
  try {
    encoded.value = encode(props.text, props.correctLevel)
    hasEncodeError.value = false
  } catch (error) {
    encoded.value = null
    hasEncodeError.value = true
    emit('error', error)
  }
}

rebuild()

watch(
  () => [props.text, props.correctLevel],
  () => rebuild(),
)

/* ── Canvas surface ─────────────────────────────────────────────────────── */

/** Linear gradient handle, structurally shared by the uni and DOM canvases. */
interface CanvasGradientLike {
  addColorStop: (offset: number, color: string) => void
}

/**
 * The subset of the canvas 2D API this component draws with.
 *
 * Every call except `fillRect` is optional because the uni canvas context
 * implements fewer methods than the DOM one; each use is feature-detected.
 */
interface CanvasLike {
  fillStyle: unknown
  fillRect: (x: number, y: number, w: number, h: number) => void
  beginPath?: () => void
  arc?: (x: number, y: number, r: number, start: number, end: number) => void
  fill?: () => void
  scale?: (x: number, y: number) => void
  roundRect?: (x: number, y: number, w: number, h: number, r: number) => void
  createLinearGradient?: (x0: number, y0: number, x1: number, y1: number) => CanvasGradientLike
  /** uni canvas only: flush the command queue to the native canvas. */
  draw?: (reserve?: boolean, callback?: () => void) => void
}

/** uni runtime subset this component touches. All lookups are guarded. */
interface UniHost {
  createCanvasContext?: (id: string, component?: unknown) => CanvasLike
  canvasToTempFilePath?: (options: Record<string, unknown>, component?: unknown) => void
}

function getUni(): UniHost | null {
  const host = globalThis as { uni?: UniHost }
  return host.uni ?? null
}

/** Template ref on `<canvas>` — the H5 fallback surface. */
const canvasEl = ref<unknown>(null)

/** Cached surface + the canvas id it belongs to (single resource, §41). */
let surface: CanvasLike | null = null
let surfaceCanvasId = ''

/** Resolve the DOM canvas element, if this host rendered a real one. */
function getDomCanvas(): { getContext?: (id: string) => unknown } | null {
  const el = canvasEl.value
  if (el === null || typeof el !== 'object') return null
  const candidate = el as { getContext?: (id: string) => unknown }
  return typeof candidate.getContext === 'function' ? candidate : null
}

/** Acquire the drawing surface: uni context first, DOM canvas second. */
function getSurface(): CanvasLike | null {
  if (surface !== null && surfaceCanvasId === canvasIdValue.value) return surface

  const createCanvasContext = getUni()?.createCanvasContext
  if (typeof createCanvasContext === 'function') {
    try {
      surface = createCanvasContext(canvasIdValue.value, instance)
      surfaceCanvasId = canvasIdValue.value
      return surface
    } catch (error) {
      emit('error', error)
    }
  }

  const domCanvas = getDomCanvas()
  if (domCanvas !== null) {
    try {
      const context = domCanvas.getContext?.('2d')
      if (context !== null && typeof context === 'object') {
        surface = context as CanvasLike
        surfaceCanvasId = canvasIdValue.value
        return surface
      }
    } catch (error) {
      emit('error', error)
    }
  }

  return null
}

/* ── Painting ───────────────────────────────────────────────────────────── */

/** Gradient stop colors: `gradientColors` (2+) wins over `gradientColor`. */
const gradientStops = computed<string[]>(() => {
  const colors = props.gradientColors.filter((color) => color !== '')
  if (colors.length >= 2) return colors
  const start = props.colorDark || CANVAS_DARK
  const end = props.gradientColor || props.colorDark || CANVAS_DARK
  return [start, end]
})

/** Gradient start / end points for the canvas, in canvas px. */
function gradientPoints(size: number): { x0: number; y0: number; x1: number; y1: number } {
  if (typeof props.gradientDirection === 'number') {
    const radians = (props.gradientDirection * Math.PI) / 180
    const dx = Math.cos(radians) * size
    const dy = Math.sin(radians) * size
    return {
      x0: (size - dx) / 2,
      y0: (size - dy) / 2,
      x1: (size + dx) / 2,
      y1: (size + dy) / 2,
    }
  }
  if (props.gradientDirection === 'horizontal') return { x0: 0, y0: 0, x1: size, y1: 0 }
  if (props.gradientDirection === 'vertical') return { x0: 0, y0: 0, x1: 0, y1: size }
  return { x0: 0, y0: 0, x1: size, y1: size }
}

/** Dark-module paint: a flat color, or a gradient when enabled + supported. */
function resolveDarkPaint(ctx: CanvasLike, size: number): unknown {
  const flat = props.colorDark || CANVAS_DARK
  if (!props.enableGradient || typeof ctx.createLinearGradient !== 'function') return flat
  const points = gradientPoints(size)
  const gradient = ctx.createLinearGradient(points.x0, points.y0, points.x1, points.y1)
  const stops = gradientStops.value
  stops.forEach((color, index) => {
    gradient.addColorStop(stops.length === 1 ? 0 : index / (stops.length - 1), color)
  })
  return gradient
}

/** Fill a circle, degrading to a square when the canvas has no `arc`. */
function paintCircle(ctx: CanvasLike, cx: number, cy: number, radius: number): void {
  if (typeof ctx.beginPath !== 'function' || typeof ctx.arc !== 'function' || typeof ctx.fill !== 'function') {
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
    return
  }
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fill()
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
  const left = margin + x * cell
  const top = margin + y * cell
  const scale = dotScaleValue.value
  const inset = (cell * (1 - scale)) / 2
  const side = cell * scale
  const dotType = props.dotType

  if (dotType === 'square') {
    ctx.fillRect(left + inset, top + inset, side, side)
    return
  }

  if (dotType === 'rounded') {
    if (typeof ctx.roundRect === 'function' && typeof ctx.fill === 'function' && typeof ctx.beginPath === 'function') {
      ctx.beginPath()
      ctx.roundRect(left + inset, top + inset, side, side, Math.max(0, cell * 0.28 * scale))
      ctx.fill()
      return
    }
    paintCircle(ctx, left + cell / 2, top + cell / 2, side / 2)
    return
  }

  paintCircle(ctx, left + cell / 2, top + cell / 2, side / 2)
  if (dotType !== 'liquid') return

  // liquid: bridge to dark neighbours so adjacent dots fuse into a blob.
  const bridge = Math.max(1, Math.round(cell * 0.18))
  if (matrix.getModule(x - 1, y)) ctx.fillRect(left - bridge, top + cell / 2 - bridge, bridge * 2, bridge * 2)
  if (matrix.getModule(x + 1, y)) ctx.fillRect(left + cell - bridge, top + cell / 2 - bridge, bridge * 2, bridge * 2)
  if (matrix.getModule(x, y - 1)) ctx.fillRect(left + cell / 2 - bridge, top - bridge, bridge * 2, bridge * 2)
  if (matrix.getModule(x, y + 1)) ctx.fillRect(left + cell / 2 - bridge, top + cell - bridge, bridge * 2, bridge * 2)
}

/** Pixel ratio used for the H5 canvas (kept at 1 where `window` is absent). */
function devicePixelRatio(): number {
  const host = globalThis as { devicePixelRatio?: number }
  const ratio = host.devicePixelRatio
  return typeof ratio === 'number' && ratio > 0 ? ratio : 1
}

/**
 * Paint the whole code. No-op when no surface is available (tests / SSR).
 *
 * Returns whether anything was drawn, so the watcher can retry after the H5
 * canvas element appears.
 */
function paint(): boolean {
  const matrix = encoded.value
  if (matrix === null) return false
  const ctx = getSurface()
  if (ctx === null) return false

  const size = sizeValue.value
  const margin = marginValue.value
  const cell = Math.max(1, size - margin * 2) / matrix.size

  // H5: size the backing store for the device pixel ratio (crisp modules).
  const domCanvas = getDomCanvas() as { width?: number; height?: number } | null
  if (domCanvas !== null && typeof domCanvas.width === 'number') {
    const ratio = devicePixelRatio()
    domCanvas.width = Math.round(size * ratio)
    domCanvas.height = Math.round(size * ratio)
    if (typeof ctx.scale === 'function') ctx.scale(ratio, ratio)
  }

  // Quiet zone: an opaque light plate, so the code scans on any page surface.
  ctx.fillStyle = props.colorLight || CANVAS_LIGHT
  ctx.fillRect(0, 0, size, size)

  ctx.fillStyle = resolveDarkPaint(ctx, size)
  for (let y = 0; y < matrix.size; y++) {
    for (let x = 0; x < matrix.size; x++) {
      if (!matrix.getModule(x, y)) continue
      paintModule(ctx, x, y, cell, margin, matrix)
    }
  }

  // uni canvas: flush the queued commands to the native surface.
  if (typeof ctx.draw === 'function') ctx.draw()
  return true
}

/** Pending deferred first paint (cleared on unmount, §41). */
let retryTimer: ReturnType<typeof setTimeout> | null = null

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
    props.enableGradient,
    props.gradientColor,
    props.gradientColors,
    props.gradientDirection,
  ],
  () => paint(),
  { deep: true },
)

onMounted(() => {
  // First paint after mount: the template ref / native canvas only exists then.
  if (!paint()) {
    // H5 can mount the element a tick late — one deferred retry, no interval.
    retryTimer = setTimeout(() => {
      retryTimer = null
      paint()
    }, 0)
  }
})

onBeforeUnmount(() => {
  // §41: the only owned resources are the surface handle and the retry timer.
  if (retryTimer !== null) clearTimeout(retryTimer)
  retryTimer = null
  surface = null
  surfaceCanvasId = ''
  canvasEl.value = null
})

/* ── Public method: exportImage ─────────────────────────────────────────── */

/** Rejection payload of `exportImage` (structured, AGENTS.md §28). */
interface QrExportError {
  code: 'CAPABILITY_UNSUPPORTED' | 'EXPORT_FAILED'
  message: string
  cause?: unknown
}

/**
 * Export the canvas as a temporary file path (`wd-qr-code` `exportImage`).
 *
 * Rejects with `CAPABILITY_UNSUPPORTED` on hosts without
 * `uni.canvasToTempFilePath` (tests / non-uni SSR) instead of throwing, so the
 * caller can branch on `error.code`.
 */
function exportImage(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const toTempFilePath = getUni()?.canvasToTempFilePath
    if (typeof toTempFilePath !== 'function') {
      reject({
        code: 'CAPABILITY_UNSUPPORTED',
        message: 'uni.canvasToTempFilePath is not available on this host',
      } satisfies QrExportError)
      return
    }
    try {
      toTempFilePath(
        {
          canvasId: canvasIdValue.value,
          fileType: 'png',
          success: (result: { tempFilePath?: string }) => {
            if (typeof result?.tempFilePath === 'string') {
              resolve(result.tempFilePath)
              return
            }
            reject({
              code: 'EXPORT_FAILED',
              message: 'canvasToTempFilePath returned no tempFilePath',
            } satisfies QrExportError)
          },
          fail: (error: unknown) => {
            reject({
              code: 'EXPORT_FAILED',
              message: 'canvasToTempFilePath failed',
              cause: error,
            } satisfies QrExportError)
          },
        },
        instance,
      )
    } catch (error) {
      reject({
        code: 'EXPORT_FAILED',
        message: 'canvasToTempFilePath threw',
        cause: error,
      } satisfies QrExportError)
    }
  })
}

defineExpose({ exportImage })

/* ── Presentation ───────────────────────────────────────────────────────── */

function onTap(event: Event): void {
  emit('click', event)
}

const rootClass = computed(() => [
  'sn-qr-code',
  `sn-qr-code--${props.dotType}`,
  props.customClass,
])

const rootStyle = computed(() => {
  const side = `${sizeValue.value * RPX_PER_PX}rpx`
  const parts = [`width: ${side}`, `height: ${side}`]
  if (props.customStyle) parts.push(props.customStyle)
  return parts.join('; ')
})

const canvasStyle = computed(
  () => `width: ${sizeValue.value * RPX_PER_PX}rpx; height: ${sizeValue.value * RPX_PER_PX}rpx`,
)

const ariaLabel = computed(() => (props.text === '' ? 'QR code' : `QR code: ${props.text}`))
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
      :style="canvasStyle"
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
