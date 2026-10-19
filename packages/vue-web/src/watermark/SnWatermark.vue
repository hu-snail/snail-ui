<script setup lang="ts">
/**
 * SnWatermark — web-end watermark overlay (AUI-WEB-DD-024).
 *
 * Reference library: naive-ui `n-watermark`
 *   (https://www.naiveui.com/zh-CN/light/components/watermark)
 * Per AGENTS.md §112, props + semantics mirror n-watermark 1:1:
 *   content (string | string[]) / image / cross / fullscreen / fontSize /
 *   lineHeight / width / height / rotate / x / y / zIndex / opacity /
 *   fontFamily / fontWeight / fontStyle / fontColor / background /
 *   grayscale / blend. Slot: default (wrapped content).
 *
 * Documented divergences (not §112 violations):
 *   - Canvas rendering: a single tile is painted offscreen with
 *     `canvas.getContext('2d')` + `toDataURL()` and repeated as the
 *     overlay's `background-image`. Without a canvas environment
 *     (SSR / happy-dom / tests) the component degrades to a repeated
 *     text `<span>` grid with the same geometry.
 *   - `image` watermark tiles are drawn via a plain `Image()` preload
 *     (no crossOrigin attribute plumbing) — cross-origin images taint
 *     nothing because the tile canvas only draws the image itself.
 *   - `grayscale` / `blend` map to CSS `filter` / `mix-blend-mode` on
 *     the overlay rather than per-pixel canvas operations.
 *   - No config-provider / RTL integration (web-end v3 has no provider
 *     yet).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnWatermark content="版权所有" :fullscreen="false">
 *     <div>页面内容</div>
 *   </SnWatermark>
 *   <SnWatermark :content="['AUI', '内部资料']" :rotate="-30" />
 */

import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type CSSProperties,
} from 'vue'

defineOptions({ name: 'SnWatermark' })

const props = withDefaults(
  defineProps<{
    /** Watermark text; array items render as separate lines. Mirrors n-watermark `content`. */
    content?: string | string[] | undefined
    /** Watermark image URL (drawn instead of text). Mirrors n-watermark `image`. */
    image?: string | undefined
    /** Stagger alternate tiles by half a tile. Mirrors n-watermark `cross`. Default false. */
    cross?: boolean
    /** Cover the whole viewport instead of the wrapper. Mirrors n-watermark `fullscreen`. Default false. */
    fullscreen?: boolean
    /** Text size in px. Mirrors n-watermark `fontSize`. Default 16. */
    fontSize?: number
    /** Text line height in px. Mirrors n-watermark `lineHeight`. Default 16. */
    lineHeight?: number
    /** Tile width in px. Mirrors n-watermark `width`. Default 128. */
    width?: number
    /** Tile height in px. Mirrors n-watermark `height`. Default 64. */
    height?: number
    /** Tile rotation in degrees. Mirrors n-watermark `rotate`. Default 0. */
    rotate?: number
    /** Tile x offset in px. Mirrors n-watermark `x`. Default 0. */
    x?: number
    /** Tile y offset in px. Mirrors n-watermark `y`. Default 0. */
    y?: number
    /** Overlay stacking order. Mirrors n-watermark `zIndex`. Default 10. */
    zIndex?: number
    /** Overlay opacity (0–1). Mirrors n-watermark `opacity`. Default 0.5. */
    opacity?: number
    /** Text font family. Mirrors n-watermark `fontFamily`. */
    fontFamily?: string | undefined
    /** Text font weight. Mirrors n-watermark `fontWeight`. */
    fontWeight?: number | string | undefined
    /** Text font style. Mirrors n-watermark `fontStyle`. */
    fontStyle?: 'normal' | 'italic' | 'oblique' | undefined
    /** Text color. Mirrors n-watermark `fontColor`. */
    fontColor?: string | undefined
    /** Tile background color. Mirrors n-watermark `background`. */
    background?: string | undefined
    /** CSS filter grayscale on the overlay. Mirrors n-watermark `grayscale`. Default 0. */
    grayscale?: number
    /** CSS mix-blend-mode on the overlay. Mirrors n-watermark `blend`. */
    blend?: CSSProperties['mixBlendMode'] | undefined
  }>(),
  {
    content: undefined,
    image: undefined,
    cross: false,
    fullscreen: false,
    fontSize: 16,
    lineHeight: 16,
    width: 128,
    height: 64,
    rotate: 0,
    x: 0,
    y: 0,
    zIndex: 10,
    opacity: 0.5,
    fontFamily: undefined,
    fontWeight: undefined,
    fontStyle: undefined,
    fontColor: undefined,
    background: undefined,
    grayscale: 0,
    blend: undefined,
  },
)

defineSlots<{
  /** Content the watermark covers. Mirrors n-watermark `default`. */
  default?(): unknown
}>()

/* ─────────── Tile content ─────────── */

/** Text lines: string → single line, array → one line per item. */
const textLines = computed<string[]>(() => {
  if (props.content === undefined || props.content === '') return []
  return Array.isArray(props.content) ? props.content : [props.content]
})


/* ─────────── Canvas tile ────────────────────────────────────────────────
 * happy-dom (and SSR hosts) either lack canvas or return null from
 * getContext — every drawing call is guarded and the component degrades
 * to the repeated-text fallback grid. */

const tileCanvasRef = ref<HTMLCanvasElement | null>(null)
const tileUrl = ref<string | null>(null)
const loadedImageRef = ref<HTMLImageElement | null>(null)
let imageLoadGeneration = 0

/** Colors that survive as canvas paint values (CSS var() strings cannot). */
function resolvePaintColor(value: string | undefined, fallback: string): string {
  return value ?? fallback
}

function drawTile(): void {
  const canvas = tileCanvasRef.value
  if (!canvas) return
  const dpr =
    typeof window !== 'undefined' && window.devicePixelRatio > 0
      ? window.devicePixelRatio
      : 1
  canvas.width = Math.max(1, Math.floor(props.width * dpr))
  canvas.height = Math.max(1, Math.floor(props.height * dpr))
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const paintWidth = props.width * dpr
  const paintHeight = props.height * dpr
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Tile background — transparent unless explicitly set.
  const bgColor = props.background
  if (bgColor) {
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, paintWidth, paintHeight)
  }

  // Rotate around the tile centre; mirror the CSS fallback grid.
  const centerX = paintWidth / 2
  const centerY = paintHeight / 2
  ctx.save()
  ctx.translate(centerX + props.x * dpr, centerY + props.y * dpr)
  ctx.rotate((props.rotate * Math.PI) / 180)

  if (props.image) {
    const img = loadedImageRef.value
    if (img) {
      const aspectRatio =
        img.naturalWidth && img.naturalHeight
          ? img.naturalWidth / img.naturalHeight
          : 1
      const drawWidth = aspectRatio >= 1 ? paintWidth : paintWidth * aspectRatio
      const drawHeight = aspectRatio <= 1 ? paintHeight : paintHeight / aspectRatio
      if (props.grayscale > 0) ctx.filter = `grayscale(${props.grayscale})`
      ctx.drawImage(img, (paintWidth - drawWidth) / 2, (paintHeight - drawHeight) / 2, drawWidth, drawHeight)
      ctx.filter = 'none'
    }
  }
  else {
    const lines = textLines.value
    ctx.fillStyle = resolvePaintColor(props.fontColor, 'rgba(51, 54, 57, 0.12)')
    ctx.font = [
      props.fontStyle ?? 'normal',
      props.fontWeight != null ? String(props.fontWeight) : 'normal',
      `${props.fontSize * dpr}px`,
      props.fontFamily ?? 'sans-serif',
    ].join(' ')
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // Coordinates are relative to the translated tile centre.
    const startY = (-(lines.length - 1) * props.lineHeight * dpr) / 2
    lines.forEach((line, index) => {
      ctx.fillText(line, 0, startY + index * props.lineHeight * dpr)
    })
  }
  ctx.restore()

  try {
    tileUrl.value = canvas.toDataURL('image/png')
  }
  catch {
    // Tainted canvas or headless hosts without toDataURL — degrade to the
    // text grid instead of failing the render.
    tileUrl.value = null
  }
}

/* ─────────── Image preload ─────────── */

function loadImage(): void {
  imageLoadGeneration++
  loadedImageRef.value = null
  if (!props.image || typeof Image === 'undefined') {
    drawTile()
    return
  }
  const generation = imageLoadGeneration
  const img = new Image()
  img.onload = () => {
    if (generation !== imageLoadGeneration) return
    loadedImageRef.value = img
    drawTile()
  }
  img.onerror = () => {
    if (generation !== imageLoadGeneration) return
    drawTile()
  }
  img.src = props.image
}

watch(
  () => [props.image],
  () => {
    loadImage()
  },
  { immediate: false },
)

watch(
  () => [
    props.content,
    props.fontSize,
    props.lineHeight,
    props.width,
    props.height,
    props.rotate,
    props.fontColor,
    props.fontFamily,
    props.fontWeight,
    props.fontStyle,
    props.background,
    props.grayscale,
  ],
  () => {
    drawTile()
  },
  { immediate: false },
)

onMounted(() => {
  // The immediate watchers run during setup when refs are still null —
  // the first paint must happen after mount.
  if (props.image) loadImage()
  else drawTile()
})

onBeforeUnmount(() => {
  // Invalidate in-flight image loads so late callbacks cannot write state.
  imageLoadGeneration++
})

/* ─────────── Overlay ─────────── */

const overlayStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    zIndex: props.zIndex,
    opacity: props.opacity,
    backgroundRepeat: 'repeat',
    pointerEvents: 'none',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  }
  if (props.blend) style.mixBlendMode = props.blend
  if (props.grayscale > 0) style.filter = `grayscale(${props.grayscale})`
  if (tileUrl.value) {
    style.backgroundImage = `url(${tileUrl.value})`
  }
  else {
    // Fallback grid: tint the tiles so the text layer reads as a watermark.
    style.backgroundColor = props.background ?? 'transparent'
  }
  return style
})

/** Alternate tiles shift by half a tile in both axes when `cross` is set. */
interface FallbackTile {
  key: string
  row: number
  col: number
  style: CSSProperties
}

const fallbackTiles = computed<FallbackTile[]>(() => {
  if (tileUrl.value) return []
  const tiles: FallbackTile[] = []
  // Cover a generous fixed area — the fallback is a degraded mode, so it
  // does not need to react to the wrapper's measured size.
  const cols = 8
  const rows = 16
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const stagger = props.cross && (row + col) % 2 === 1
      tiles.push({
        key: `${row}-${col}`,
        row,
        col,
        style: {
          position: 'absolute',
          width: `${props.width}px`,
          height: `${props.height}px`,
          left: `${col * props.width + (stagger ? props.width / 2 : 0)}px`,
          top: `${row * props.height + (stagger ? props.height / 2 : 0)}px`,
        },
      })
    }
  }
  return tiles
})

const fallbackTextStyle = computed<CSSProperties>(() => ({
  fontSize: `${props.fontSize}px`,
  lineHeight: `${props.lineHeight}px`,
  fontFamily: props.fontFamily,
  fontWeight: props.fontWeight != null ? String(props.fontWeight) : undefined,
  fontStyle: props.fontStyle,
  color: props.fontColor ?? 'rgba(51, 54, 57, 0.12)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  transform: `rotate(${props.rotate}deg)`,
}))
</script>

<template>
  <div
    data-snui-component="watermark"
    class="sn-watermark"
    :class="{ 'sn-watermark--fullscreen': fullscreen }"
  >
    <slot />

    <!--
      Offscreen paint surface. The rendered data URL becomes the overlay's
      background-image; the canvas element itself is never displayed.
    -->
    <canvas ref="tileCanvasRef" class="sn-watermark__canvas" aria-hidden="true" />

    <div
      v-if="!fullscreen"
      class="sn-watermark__overlay"
      :style="overlayStyle"
      aria-hidden="true"
    >
      <!-- Degraded mode (no canvas): repeated text tiles. -->
      <template v-if="!tileUrl">
        <span
          v-for="tile in fallbackTiles"
          :key="tile.key"
          class="sn-watermark__fallback-tile"
          :style="tile.style"
        >
          <span class="sn-watermark__fallback-text" :style="fallbackTextStyle">
            <span v-for="(line, index) in textLines" :key="index" class="sn-watermark__fallback-line">{{ line }}</span>
          </span>
        </span>
      </template>
    </div>

    <Teleport to="body">
      <div
        v-if="fullscreen"
        class="sn-watermark__overlay sn-watermark__overlay--fixed"
        :style="overlayStyle"
        aria-hidden="true"
      />
    </Teleport>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-watermark {
  position: relative;
}

.sn-watermark__canvas {
  display: none;
}

.sn-watermark__overlay {
  position: absolute;
  overflow: hidden;
}

.sn-watermark__overlay--fixed {
  position: fixed;
}

.sn-watermark__fallback-tile {
  pointer-events: none;
}

.sn-watermark__fallback-text {
  pointer-events: none;
  white-space: nowrap;
  user-select: none;
}
</style>
