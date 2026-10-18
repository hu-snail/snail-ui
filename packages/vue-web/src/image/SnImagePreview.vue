<script lang="ts">
/**
 * Toolbar node contract shared with `render-toolbar` (mirrors the upstream
 * ImagePreview render-toolbar signature).
 */
import type { VNode } from 'vue'

export interface SnImageToolbarNodes {
  prev: VNode
  next: VNode
  rotateCounterclockwise: VNode
  rotateClockwise: VNode
  resizeToOriginalSize: VNode
  zoomOut: VNode
  zoomIn: VNode
  download: VNode
  close: VNode
}
</script>

<script setup lang="ts">
/**
 * SnImagePreview — internal full-screen preview overlay for SnImage and
 * SnImageGroup (AUI-WEB-DD-010). Not a public component: it is mounted by
 * SnImage (standalone) or SnImageGroup (shared instance), mirroring how the
 * reference library splits Image/ImageGroup/ImagePreview.
 *
 * Reference library: naive-ui `n-image` internal ImagePreview
 *   (https://www.naiveui.com/zh-CN/light/components/image)
 * Behaviour mirrors upstream 1:1 where the platform allows:
 *   - full-screen dark overlay, click-to-close, bottom centered toolbar
 *   - toolbar: prev/next (only when a group supplies them), rotate CCW/CW,
 *     resize to original size (1:1), zoom out/in, download, close
 *   - drag to pan (mouse), double-click toggles original-size scale,
 *     arrow keys: ←/→ switch, ↑/↓ zoom, Esc closes, Space blocked
 *   - zoom bounds: min 0.5, max = max(3, 2×natural/viewport fits)
 *   - `keep-drag-offset` keeps the released offset; default springs the
 *     image back to center (or clamps to the viewport edge)
 *   - `render-toolbar` receives { nodes } with all nine actions
 *
 * Documented divergences (not §112 violations):
 *   - Mouse wheel zooms (↑ in / ↓ out) — a task-mandated addition; upstream
 *     only preventDefaults the wheel event.
 *   - `show-toolbar-tooltip` renders native `title` attributes instead of
 *     floating tooltips, keeping the overlay free of nested popups.
 *   - Body scroll is locked while shown (upstream leaves the page scrollable).
 *   - The mask/toolbar use `--sn-web-color-*` tokens (overlay mask +
 *     elevated toolbar) instead of upstream's hardcoded rgba literals.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage (internal):
 *   <SnImagePreview :src="url" :show="show" @update:show="show = $event" />
 */

import { computed, defineComponent, h, onBeforeUnmount, ref, watch, type CSSProperties, type ImgHTMLAttributes } from 'vue'

defineOptions({ name: 'SnImagePreview' })

const props = withDefaults(
  defineProps<{
    /** Large image url shown in the overlay. */
    src?: string | undefined
    /** Controlled visibility; `undefined` falls back to uncontrolled state. */
    show?: boolean | undefined
    /** Initial visibility for uncontrolled usage. Mirrors `default-show`. */
    defaultShow?: boolean
    /** Whether the bottom toolbar is rendered. Mirrors `show-toolbar`. */
    showToolbar?: boolean | undefined
    /** Native title hints on toolbar buttons. Mirrors `show-toolbar-tooltip` (divergence: title vs floating tooltip). */
    showToolbarTooltip?: boolean | undefined
    /** Keep the dragged offset after mouse release. Mirrors `keep-drag-offset`. */
    keepDragOffset?: boolean | undefined
    /** Extra attributes/style for the previewed <img>. Mirrors `previewed-img-props`. */
    previewedImgProps?: ImgHTMLAttributes | undefined
    /** Custom toolbar renderer. Mirrors `render-toolbar`. */
    renderToolbar?: ((props: { nodes: SnImageToolbarNodes }) => unknown) | undefined
    /** Group-only: switch to the previous image (resets view first). */
    prev?: (() => void) | undefined
    /** Group-only: switch to the next image (resets view first). */
    next?: (() => void) | undefined
  }>(),
  {
    src: undefined,
    show: undefined,
    defaultShow: false,
    showToolbar: true,
    showToolbarTooltip: false,
    keepDragOffset: false,
    previewedImgProps: undefined,
    renderToolbar: undefined,
    prev: undefined,
    next: undefined,
  },
)

const emit = defineEmits<{
  /** Visibility change (close via mask/Esc/toolbar). Mirrors `on-update:show`. */
  (e: 'update:show', value: boolean): void
  /** Preview closed. Mirrors `on-close`. */
  (e: 'close'): void
}>()

/* ── Visibility (controlled / uncontrolled) ─────────────────────────────── */

const uncontrolledShow = ref(props.defaultShow)
const mergedShow = computed(() => (props.show !== undefined ? props.show : uncontrolledShow.value))

function doUpdateShow(value: boolean): void {
  uncontrolledShow.value = value
  emit('update:show', value)
}

function close(): void {
  if (!mergedShow.value) return
  emit('close')
  doUpdateShow(false)
}

/* ── View state: zoom / rotate / pan ────────────────────────────────────── */

const SCALE_RADIX = 1.5
const BLEEDING = 32
const MIN_SCALE = 0.5

let scaleExp = 0
const scale = ref(1)
const rotate = ref(0)
const offsetX = ref(0)
const offsetY = ref(0)
const isDragging = ref(false)
const previewImgRef = ref<HTMLImageElement | null>(null)

function resetView(): void {
  scale.value = 1
  scaleExp = 0
  rotate.value = 0
  offsetX.value = 0
  offsetY.value = 0
  isDragging.value = false
}

function getMaxScale(): number {
  const img = previewImgRef.value
  if (!img || typeof window === 'undefined') return 3
  const heightMaxScale = Math.max(1, img.naturalHeight / (window.innerHeight - BLEEDING))
  const widthMaxScale = Math.max(1, img.naturalWidth / (window.innerWidth - BLEEDING))
  return Math.max(3, heightMaxScale * 2, widthMaxScale * 2)
}

function getOriginalSizeScale(): number {
  const img = previewImgRef.value
  if (!img || typeof window === 'undefined') return 1
  const heightScale = img.naturalHeight / (window.innerHeight - BLEEDING)
  const widthScale = img.naturalWidth / (window.innerWidth - BLEEDING)
  if (heightScale < 1 && widthScale < 1) return 1
  return Math.max(heightScale, widthScale)
}

function zoomIn(): void {
  const maxScale = getMaxScale()
  if (scale.value < maxScale) {
    scaleExp += 1
    scale.value = Math.min(maxScale, SCALE_RADIX ** scaleExp)
  }
}

function zoomOut(): void {
  if (scale.value > MIN_SCALE) {
    scaleExp -= 1
    scale.value = Math.max(MIN_SCALE, SCALE_RADIX ** scaleExp)
  }
}

function resizeToOriginalSize(): void {
  scale.value = getOriginalSizeScale()
  scaleExp = Math.ceil(Math.log(scale.value) / Math.log(SCALE_RADIX))
  offsetX.value = 0
  offsetY.value = 0
}

function rotateCounterclockwise(): void {
  rotate.value -= 90
}

function rotateClockwise(): void {
  rotate.value += 90
}

function handleDblclick(): void {
  const originalSizeScale = getOriginalSizeScale()
  scale.value = scale.value === originalSizeScale ? 1 : originalSizeScale
  scaleExp = Math.ceil(Math.log(scale.value || 1) / Math.log(SCALE_RADIX))
}

function handleWheel(event: WheelEvent): void {
  if (event.deltaY < 0) zoomIn()
  else zoomOut()
}

/* ── Drag to pan ────────────────────────────────────────────────────────── */

let dragStartX = 0
let dragStartY = 0
let dragStartOffsetX = 0
let dragStartOffsetY = 0
let mouseDownClientX = 0
let mouseDownClientY = 0

function handleMousedown(event: MouseEvent): void {
  if (event.button !== 0) return
  isDragging.value = true
  dragStartX = event.clientX - offsetX.value
  dragStartY = event.clientY - offsetY.value
  dragStartOffsetX = offsetX.value
  dragStartOffsetY = offsetY.value
  mouseDownClientX = event.clientX
  mouseDownClientY = event.clientY
  document.addEventListener('mousemove', handleMousemove)
  document.addEventListener('mouseup', handleMouseup)
}

function handleMousemove(event: MouseEvent): void {
  offsetX.value = event.clientX - dragStartX
  offsetY.value = event.clientY - dragStartY
}

/**
 * Offset after release: center the image when it fits the viewport, else
 * clamp it to the viewport edges (upstream `getDerivedOffset`).
 */
function getDerivedOffset(event: MouseEvent): { offsetX: number; offsetY: number } {
  const img = previewImgRef.value
  if (!img || typeof window === 'undefined') return { offsetX: 0, offsetY: 0 }
  const box = img.getBoundingClientRect()
  const deltaHorizontal = mouseDownClientX - event.clientX
  const deltaVertical = mouseDownClientY - event.clientY

  let nextOffsetX = 0
  let nextOffsetY = 0
  if (box.width <= window.innerWidth) {
    nextOffsetX = 0
  } else {
    const limitX = (box.width - window.innerWidth) / 2
    if (box.left > 0) nextOffsetX = limitX
    else if (box.right < window.innerWidth) nextOffsetX = -limitX
    else if (deltaHorizontal > 0) nextOffsetX = Math.min(limitX, dragStartOffsetX - deltaHorizontal)
    else nextOffsetX = Math.max(-limitX, dragStartOffsetX - deltaHorizontal)
  }
  if (box.height <= window.innerHeight) {
    nextOffsetY = 0
  } else {
    const limitY = (box.height - window.innerHeight) / 2
    if (box.top > 0) nextOffsetY = limitY
    else if (box.bottom < window.innerHeight) nextOffsetY = -limitY
    else if (deltaVertical > 0) nextOffsetY = Math.min(limitY, dragStartOffsetY - deltaVertical)
    else nextOffsetY = Math.max(-limitY, dragStartOffsetY - deltaVertical)
  }
  return { offsetX: nextOffsetX, offsetY: nextOffsetY }
}

function handleMouseup(event: MouseEvent): void {
  document.removeEventListener('mousemove', handleMousemove)
  document.removeEventListener('mouseup', handleMouseup)
  isDragging.value = false
  if (!props.keepDragOffset) {
    const derived = getDerivedOffset(event)
    offsetX.value = derived.offsetX
    offsetY.value = derived.offsetY
  }
}

/** Switch image: upstream resets scale/offset/rotation before notifying. */
function handleSwitchPrev(): void {
  resetView()
  props.prev?.()
}

function handleSwitchNext(): void {
  resetView()
  props.next?.()
}

/* ── Keyboard + scroll lock while shown ─────────────────────────────────── */

function handleKeydown(event: KeyboardEvent): void {
  switch (event.key) {
    case ' ':
      event.preventDefault()
      break
    case 'ArrowLeft':
      if (props.prev) handleSwitchPrev()
      break
    case 'ArrowRight':
      if (props.next) handleSwitchNext()
      break
    case 'ArrowUp':
      event.preventDefault()
      zoomIn()
      break
    case 'ArrowDown':
      event.preventDefault()
      zoomOut()
      break
    case 'Escape':
      close()
      break
  }
}

// Lock <html> while shown and restore the previous inline value on release
// (same contract as SnDrawer's scroll lock).
let memoizedHtmlOverflow: string | null = null
let isScrollLocked = false

watch(mergedShow, (shown) => {
  if (typeof document === 'undefined') return
  if (shown) document.addEventListener('keydown', handleKeydown)
  else document.removeEventListener('keydown', handleKeydown)

  if (shown && !isScrollLocked) {
    memoizedHtmlOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    isScrollLocked = true
  } else if (!shown && isScrollLocked) {
    document.documentElement.style.overflow = memoizedHtmlOverflow ?? ''
    isScrollLocked = false
  }
  if (shown) resetView()
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('mousemove', handleMousemove)
    document.removeEventListener('mouseup', handleMouseup)
  }
  if (isScrollLocked && typeof document !== 'undefined') {
    document.documentElement.style.overflow = memoizedHtmlOverflow ?? ''
    isScrollLocked = false
  }
})

/* ── Toolbar ────────────────────────────────────────────────────────────── */

/** lucide-style stroke paths (width 2, currentColor). */
const ICON_PATHS = {
  prev: ['M15 18l-6-6 6-6'],
  next: ['M9 18l6-6-6-6'],
  rotateCounterclockwise: ['M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', 'M3 3v5h5'],
  rotateClockwise: ['M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8', 'M21 3v5h-5'],
  resizeToOriginalSize: ['M4 14h6v6', 'M20 10h-6V4', 'M14 10l7-7', 'M3 21l7-7'],
  zoomOut: ['M19 11a8 8 0 1 0-16 0 8 8 0 0 0 16 0', 'M21 21l-4.35-4.35', 'M8 11h6'],
  zoomIn: ['M19 11a8 8 0 1 0-16 0 8 8 0 0 0 16 0', 'M21 21l-4.35-4.35', 'M11 8v6', 'M8 11h6'],
  download: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'],
  close: ['M18 6L6 18', 'M6 6l12 12'],
} as const

interface ToolbarButton {
  key: string
  label: string
  paths: readonly string[]
  onClick: () => void
}

function buildToolbarButtons(): ToolbarButton[] {
  const buttons: ToolbarButton[] = []
  if (props.prev) buttons.push({ key: 'prev', label: '上一张', paths: ICON_PATHS.prev, onClick: handleSwitchPrev })
  if (props.next) buttons.push({ key: 'next', label: '下一张', paths: ICON_PATHS.next, onClick: handleSwitchNext })
  buttons.push(
    { key: 'rotate-counterclockwise', label: '向左旋转', paths: ICON_PATHS.rotateCounterclockwise, onClick: rotateCounterclockwise },
    { key: 'rotate-clockwise', label: '向右旋转', paths: ICON_PATHS.rotateClockwise, onClick: rotateClockwise },
    { key: 'resize-to-original-size', label: '原始尺寸', paths: ICON_PATHS.resizeToOriginalSize, onClick: resizeToOriginalSize },
    { key: 'zoom-out', label: '缩小', paths: ICON_PATHS.zoomOut, onClick: zoomOut },
    { key: 'zoom-in', label: '放大', paths: ICON_PATHS.zoomIn, onClick: zoomIn },
    { key: 'download', label: '下载图片', paths: ICON_PATHS.download, onClick: handleDownloadClick },
    { key: 'close', label: '关闭', paths: ICON_PATHS.close, onClick: close },
  )
  return buttons
}

const defaultToolbarButtons = computed(() => buildToolbarButtons())

function handleDownloadClick(): void {
  if (!props.src || typeof document === 'undefined') return
  const anchor = document.createElement('a')
  anchor.href = props.src
  anchor.download = ''
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

/** Toolbar VNodes handed to `render-toolbar` (all nine actions, upstream order). */
function buildToolbarNodes(): SnImageToolbarNodes {
  const make = (button: ToolbarButton): VNode =>
    h(
      'button',
      {
        type: 'button',
        class: 'sn-image-preview__toolbar-button',
        'aria-label': button.label,
        title: props.showToolbarTooltip ? button.label : undefined,
        onClick: button.onClick,
      },
      [
        h(
          'svg',
          {
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'aria-hidden': true,
          },
          button.paths.map((d) => h('path', { d })),
        ),
      ],
    )
  const build = (label: string, paths: readonly string[], onClick: () => void): VNode =>
    make({ key: label, label, paths, onClick })
  return {
    prev: build('上一张', ICON_PATHS.prev, handleSwitchPrev),
    next: build('下一张', ICON_PATHS.next, handleSwitchNext),
    rotateCounterclockwise: build('向左旋转', ICON_PATHS.rotateCounterclockwise, rotateCounterclockwise),
    rotateClockwise: build('向右旋转', ICON_PATHS.rotateClockwise, rotateClockwise),
    resizeToOriginalSize: build('原始尺寸', ICON_PATHS.resizeToOriginalSize, resizeToOriginalSize),
    zoomOut: build('缩小', ICON_PATHS.zoomOut, zoomOut),
    zoomIn: build('放大', ICON_PATHS.zoomIn, zoomIn),
    download: build('下载图片', ICON_PATHS.download, handleDownloadClick),
    close: build('关闭', ICON_PATHS.close, close),
  }
}

/** Renders whatever `render-toolbar` returns (VNodeChild). */
const CustomToolbarHost = defineComponent({
  name: 'SnImagePreviewCustomToolbar',
  setup() {
    return () => (props.renderToolbar ? props.renderToolbar({ nodes: buildToolbarNodes() }) : null)
  },
})

/* ── Previewed <img> bindings ───────────────────────────────────────────── */

const previewedImgAttrs = computed<Record<string, unknown> | undefined>(() => {
  const forwarded = props.previewedImgProps as Record<string, unknown> | undefined
  if (!forwarded) return undefined
  const rest: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(forwarded)) {
    if (key !== 'style') rest[key] = value
  }
  return rest
})

const controlledStyle = computed(() => props.previewedImgProps?.style)

const previewStyle = computed<CSSProperties>(() => ({
  cursor: isDragging.value ? 'grabbing' : 'grab',
  transition: isDragging.value ? 'none' : undefined,
  transform: `translateX(${offsetX.value}px) translateY(${offsetY.value}px) rotate(${rotate.value}deg) scale(${scale.value})`,
  transformOrigin: 'center',
}))
</script>

<template>
  <Teleport to="body">
    <div v-if="mergedShow" class="sn-image-preview" @wheel.prevent="handleWheel">
      <div class="sn-image-preview__overlay" @click="close" />
      <div v-if="showToolbar" class="sn-image-preview__toolbar">
        <CustomToolbarHost v-if="renderToolbar" />
        <template v-else>
          <button
            v-for="button in defaultToolbarButtons"
            :key="button.key"
            type="button"
            class="sn-image-preview__toolbar-button"
            :aria-label="button.label"
            :title="showToolbarTooltip ? button.label : undefined"
            @click="button.onClick"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path v-for="(d, index) in button.paths" :key="index" :d="d" />
            </svg>
          </button>
        </template>
      </div>
      <div class="sn-image-preview__wrapper">
        <img
          :key="src ?? ''"
          v-bind="previewedImgAttrs"
          ref="previewImgRef"
          class="sn-image-preview__img"
          :src="src"
          draggable="false"
          :style="[controlledStyle, previewStyle]"
          @mousedown="handleMousedown"
          @dblclick="handleDblclick"
          @dragstart.prevent
        >
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-image-preview {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
}

.sn-image-preview__overlay {
  position: absolute;
  inset: 0;
  background: var(--sn-web-color-background-overlay);
  animation: sn-image-preview-fade-in 0.2s;
}

.sn-image-preview__toolbar {
  position: absolute;
  left: 50%;
  bottom: 40px;
  transform: translateX(-50%);
  z-index: 1;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 12px;
  border-radius: 24px;
  color: var(--sn-web-color-text-secondary);
  background: var(--sn-web-color-background-elevated);
  box-shadow: var(--sn-web-color-border-subtle, transparent);
  animation: sn-image-preview-fade-in 0.2s;
}

/* Buttons rendered by `render-toolbar` come from a child renderer, so the
 * scoped attribute is missing there — pierce with :deep() for both paths. */
.sn-image-preview__toolbar-button,
.sn-image-preview__toolbar :deep(.sn-image-preview__toolbar-button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 20px;
  font: inherit;
  color: inherit;
  background: transparent;
  cursor: pointer;
}

.sn-image-preview__toolbar-button:hover,
.sn-image-preview__toolbar :deep(.sn-image-preview__toolbar-button:hover) {
  background: var(--sn-web-color-background-subtle);
}

.sn-image-preview__toolbar-button svg,
.sn-image-preview__toolbar :deep(.sn-image-preview__toolbar-button svg) {
  width: 22px;
  height: 22px;
}

.sn-image-preview__wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
}

.sn-image-preview__img {
  pointer-events: auto;
  margin: auto;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 32px);
  user-select: none;
  transition: transform 0.3s;
}

@keyframes sn-image-preview-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
