<script setup lang="ts">
/**
 * SnScratchcard (uni-end) — 刮刮乐（业务组件 AUI-BIZ-005）。
 *
 * Reference library: lime-ui `l-scratchcard`
 *   (https://limeuix.qcoon.cn/components/scratchcard)
 * Prop 语义对齐参考：coverColor / coverImg / ratio / scratchRadius /
 * watermark 系 / title 系；刮开比例超过 `ratio` 时派发 `open`。
 *
 * ## 双端渲染策略（显式降级，AGENTS.md §85）
 *
 * - **真刮擦**（uni-app x App / H5）：元素级 2d canvas —— 指针移动时以
 *   `destination-out` 合成擦除，touchend 用 `getImageData` 采样透明比例；
 *   canvas 元素不可用或位图尺寸为 0 时按官方样式手动设位图尺寸。
 * - **点按揭示降级**（小程序 / App-vue 等无元素 canvas 的宿主）：老版
 *   `createCanvasContext` 不支持合成擦除，此时封面退化为普通视图，
 *   点按整层揭示并派发 `open`。行为可预期、可测试。
 *
 * Per AGENTS.md §116.2: class 选择器、文字 <text>；无遗留定时器。
 *
 * Not responsible for: 奖品与核销逻辑 —— 宿主在 `open` 后处理。
 */

import { computed, getCurrentInstance, onMounted, ref } from 'vue'

defineOptions({ name: 'SnScratchcard' })

const props = withDefaults(
  defineProps<{
    /** 封面颜色（coverImg 优先）。 */
    coverColor?: string
    /** 封面图片。 */
    coverImg?: string
    /** 刮开比例阈值（0-1）。 */
    ratio?: number
    /** 刮擦半径（px）。 */
    scratchRadius?: number
    /** 封面水印文字。 */
    watermarkText?: string
    /** 水印字号（px）。 */
    watermarkSize?: number
    /** 水印颜色。 */
    watermarkColor?: string
    /** 封面标题文字。 */
    title?: string
    /** 标题字号（px）。 */
    titleSize?: number
    /** 标题颜色。 */
    titleColor?: string
    /** 根节点自定义类名。 */
    customClass?: string
    /** 根节点自定义样式（至少提供 width / height）。 */
    customStyle?: string
  }>(),
  {
    coverColor: '#C5C5C5',
    coverImg: '',
    ratio: 0.8,
    scratchRadius: 10,
    watermarkText: '',
    watermarkSize: 14,
    watermarkColor: 'rgba(0, 0, 0, 0.1)',
    title: '',
    titleSize: 24,
    titleColor: 'rgba(0, 0, 0, 0.8)',
    customClass: '',
    customStyle: '',
  },
)

const emit = defineEmits<{
  (e: 'open'): void
}>()

defineSlots<{
  /** 刮层下方的奖品内容。 */
  default?(): unknown
}>()

interface UniHost {
  /** 旧版 canvas 上下文（仅老 uni 宿主存在）。 */
  createCanvasContext?: (id: string, component?: unknown) => unknown
}

function getUni(): UniHost | null {
  const host = globalThis as { uni?: UniHost }
  return host.uni ?? null
}

const instance = getCurrentInstance()
const canvasId = computed(() => `sn-scratchcard-${instance?.uid ?? 0}`)

const canvasEl = ref<unknown>(null)
/** false = 宿主无元素 canvas，走点按揭示降级。 */
const realScratch = ref(true)
const revealed = ref(false)
const opened = ref(false)

interface Ctx2D {
  clearRect: (x: number, y: number, w: number, h: number) => void
  fillRect?: (x: number, y: number, w: number, h: number) => void
  fillText?: (text: string, x: number, y: number) => void
  beginPath?: () => void
  arc?: (x: number, y: number, r: number, start: number, end: number) => void
  fill?: () => void
  moveTo?: (x: number, y: number) => void
  lineTo?: (x: number, y: number) => void
  stroke?: () => void
  save?: () => void
  restore?: () => void
  scale?: (x: number, y: number) => void
  getImageData?: (x: number, y: number, w: number, h: number) => { data: ArrayLike<number> } | undefined
  createImage?: () => { src: string; onload?: (() => void) | null; onerror?: (() => void) | null }
  drawImage?: (image: unknown, x: number, y: number, w: number, h: number) => void
  font?: string
  textAlign?: string
  textBaseline?: string
  fillStyle?: unknown
  strokeStyle?: unknown
  lineWidth?: number
  lineCap?: string
  lineJoin?: string
  globalCompositeOperation?: string
}

interface CanvasBox {
  width?: number
  height?: number
  offsetWidth?: number
  offsetHeight?: number
  getContext?: (type: string) => unknown
}

let ctx: Ctx2D | null = null
let box: CanvasBox | null = null
let dpr = 1
let prevPoint: { x: number; y: number } | null = null
let scratchedLength = 0

const rootClass = computed(() => ['sn-scratchcard', props.customClass])

/** uni-app x：canvas 位图默认 0×0，按官方样式用元素盒 × dpr 手动设尺寸。 */
function applyBitmapSize(): void {
  const el = box as CanvasBox | null
  if (el === null || ctx === null) return
  const width = el.offsetWidth ?? 0
  const height = el.offsetHeight ?? 0
  if (width <= 0 || height <= 0) return
  const deviceInfo = (getUni() as { getDeviceInfo?: () => { devicePixelRatio?: number } } | null)?.getDeviceInfo?.()
  dpr = deviceInfo?.devicePixelRatio ?? 1
  el.width = Math.round(width * dpr)
  el.height = Math.round(height * dpr)
  ctx.scale?.(dpr, dpr)
}

function paintCover(): void {
  if (ctx === null || box === null) return
  const width = box.offsetWidth ?? 0
  const height = box.offsetHeight ?? 0
  ctx.fillStyle = props.coverColor
  ctx.fillRect?.(0, 0, width, height)
  if (props.watermarkText !== '') {
    ctx.save?.()
    ctx.fillStyle = props.watermarkColor
    ctx.font = `${props.watermarkSize}px sans-serif`
    for (let y = 24; y < height + 40; y += 56) {
      for (let x = (y / 56) % 2 === 0 ? 8 : 48; x < width; x += 96) {
        ctx.fillText?.(props.watermarkText, x, y)
      }
    }
    ctx.restore?.()
  }
  if (props.title !== '') {
    ctx.save?.()
    ctx.fillStyle = props.titleColor
    ctx.font = `bold ${props.titleSize}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText?.(props.title, width / 2, height / 2)
    ctx.restore?.()
  }
}

function paintCoverImage(): void {
  if (ctx === null || box === null) return
  const width = box.offsetWidth ?? 0
  const height = box.offsetHeight ?? 0
  const createImage = ctx.createImage?.()
  if (createImage === undefined) {
    paintCover()
    return
  }
  createImage.src = props.coverImg
  createImage.onload = () => {
    ctx?.drawImage?.(createImage, 0, 0, width, height)
  }
  createImage.onerror = () => {
    paintCover()
  }
}

function initCanvas(): void {
  const el = canvasEl.value
  if (el === null || typeof el !== 'object') {
    realScratch.value = false
    return
  }
  const candidate = el as CanvasBox
  const context = typeof candidate.getContext === 'function' ? (candidate.getContext('2d') as Ctx2D | null) : null
  if (context === null || typeof context !== 'object') {
    realScratch.value = false
    return
  }
  box = candidate
  ctx = context
  realScratch.value = true
  applyBitmapSize()
  if ((box.offsetWidth ?? 0) <= 0) {
    // 布局未就绪：位图无法定尺寸，退化点按揭示（可预期行为）。
    realScratch.value = false
    return
  }
  if (props.coverImg !== '') paintCoverImage()
  else paintCover()
}

onMounted(() => {
  initCanvas()
})

/** 重置：重绘封面，可再次刮。 */
function reset(): void {
  opened.value = false
  revealed.value = false
  scratchedLength = 0
  prevPoint = null
  if (realScratch.value && ctx !== null) {
    if (props.coverImg !== '') paintCoverImage()
    else paintCover()
  }
}

function touchPoint(event: unknown): { x: number; y: number } | null {
  const touches = (event as { touches?: { clientX?: number; clientY?: number }[] })?.touches
  const touch = touches?.[0]
  if (touch?.clientX === undefined || touch.clientY === undefined || box === null) return null
  // 触摸坐标以画布为原点：减去 canvas 元素的视口偏移。
  const rect = (canvasEl.value as { getBoundingClientRect?: () => { left: number; top: number } } | null)
    ?.getBoundingClientRect?.()
  return { x: touch.clientX - (rect?.left ?? 0), y: touch.clientY - (rect?.top ?? 0) }
}

function scratchTo(point: { x: number; y: number }): void {
  if (ctx === null) return
  ctx.globalCompositeOperation = 'destination-out'
  ctx.lineWidth = props.scratchRadius * 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  if (prevPoint !== null && ctx.moveTo !== undefined && ctx.lineTo !== undefined && ctx.stroke !== undefined) {
    ctx.beginPath?.()
    ctx.moveTo(prevPoint.x, prevPoint.y)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
  }
  if (ctx.beginPath !== undefined && ctx.arc !== undefined && ctx.fill !== undefined) {
    ctx.beginPath()
    ctx.arc(point.x, point.y, props.scratchRadius, 0, Math.PI * 2)
    ctx.fill()
  }
  const step =
    prevPoint !== null ? Math.hypot(point.x - prevPoint.x, point.y - prevPoint.y) : props.scratchRadius
  scratchedLength += step
  prevPoint = point
}

/** 透明比例采样：网格步进读 alpha；不可用时退化为笔画长度启发式。 */
function scratchedRatio(): number {
  if (ctx === null || box === null) return 0
  const width = box.offsetWidth ?? 0
  const height = box.offsetHeight ?? 0
  if (width <= 0 || height <= 0) return 0
  const imageData = ctx.getImageData?.(0, 0, Math.round(width * dpr), Math.round(height * dpr))
  if (imageData === undefined || imageData === null) {
    const area = width * height
    const strokeArea = scratchedLength * props.scratchRadius * 2
    return Math.min(1, strokeArea / area)
  }
  const data = imageData.data
  let clear = 0
  let total = 0
  const stride = 16 * 4
  for (let i = 3; i < data.length; i += stride) {
    total += 1
    if ((data as ArrayLike<number>)[i]! < 32) clear += 1
  }
  return total === 0 ? 0 : clear / total
}

function finishIfReached(): void {
  if (opened.value) return
  if (scratchedRatio() >= Math.min(1, Math.max(0, props.ratio))) {
    opened.value = true
    ctx?.clearRect?.(0, 0, (box?.offsetWidth ?? 0) + 1, (box?.offsetHeight ?? 0) + 1)
    emit('open')
  }
}

function onTouchStart(event: unknown): void {
  if (opened.value) return
  prevPoint = touchPoint(event)
}

function onTouchMove(event: unknown): void {
  if (opened.value || !realScratch.value) return
  const point = touchPoint(event)
  if (point === null) return
  scratchTo(point)
}

function onTouchEnd(): void {
  if (opened.value) return
  prevPoint = null
  if (realScratch.value) finishIfReached()
}

/** 降级模式：点按整层揭示。 */
function onCoverTap(): void {
  if (!realScratch.value && !opened.value) {
    opened.value = true
    revealed.value = true
    emit('open')
  }
}

defineExpose({ reset })
</script>

<template>
  <view :class="rootClass" :style="customStyle" :aria-label="title !== '' ? title : 'scratchcard'">
    <view class="sn-scratchcard__content">
      <slot />
    </view>

    <canvas
      v-if="realScratch"
      ref="canvasEl"
      :id="canvasId"
      class="sn-scratchcard__canvas"
      @touchstart="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    />
    <view
      v-else
      class="sn-scratchcard__cover"
      :class="{ 'sn-scratchcard__cover--revealed': revealed }"
      :style="`background-color: ${props.coverColor}`"
      :hover-class="opened ? 'none' : 'sn-scratchcard__cover--down'"
      @tap="onCoverTap"
    >
      <text class="sn-scratchcard__cover-title" :style="`color: ${props.titleColor}; font-size: ${props.titleSize}px`">
        {{ title !== '' ? title : '刮一刮' }}
      </text>
    </view>
  </view>
</template>

<style scoped>
.sn-scratchcard {
  position: relative;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  border-radius: var(--sn-mp-radius-md);
  overflow: hidden;
}

.sn-scratchcard__content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sn-scratchcard__canvas {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.sn-scratchcard__cover {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  transition: opacity 0.25s;
}

.sn-scratchcard__cover--down {
  opacity: 0.9;
}

.sn-scratchcard__cover--revealed {
  opacity: 0;
}
</style>
