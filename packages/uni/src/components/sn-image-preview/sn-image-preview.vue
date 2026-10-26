<script setup lang="ts">
/**
 * sn-image-preview (uni-end) — full-screen image viewer layer.
 *
 * Reference library: wot-ui `wd-image-preview`
 *   (https://wot-ui.cn/component/image-preview.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-image-preview 1:1
 * except for the documented omissions. Anything new added here MUST also be
 * added to the reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-image-preview/sn-image-preview.vue
 * → auto-registered as `<sn-image-preview>` in any .vue that uses it.
 *
 * ## Composition, not a new engine
 *
 * The layer is `sn-popup` (scrim, stacking, scroll lock, enter / leave
 * animation) wrapping `sn-swiper` (native `<swiper>`, so paging and looping
 * come from the platform). This component adds the counter, the close button
 * and the tap / long-press contract — nothing else.
 *
 * ## Opening it
 *
 * wd-image-preview exposes `open` / `close` / `setActive` instead of a
 * `v-model`, and the spec's prop list has no `modelValue` — so this component
 * keeps that imperative surface exactly:
 *
 *   const preview = ref()
 *   preview.value.open({ images: [...], startPosition: 0 })
 *   preview.value.setActive(2)
 *   preview.value.close()
 *
 * `selector` is honoured in "hit-zone" form: `open()` asks
 * `uni.createSelectorQuery` for the boxes of every element matching the
 * selector and lays transparent tap zones over them, so tapping a thumbnail on
 * the page opens the viewer at that index. The query is guarded — on hosts
 * without it (unit tests, SSR) no zone is created and `open()` still works.
 *
 * ## Dispose (AGENTS.md §41)
 *
 * No timer, no listener of its own: the popup owns its animation timer and the
 * swiper owns the platform's autoplay. `onBeforeUnmount` drops the cached hit
 * zones.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 *
 * Usage:
 *   <sn-image-preview ref="preview" :images="list" show-index />
 *   <sn-image-preview selector=".sn-demo__thumb" :images="list" />
 *
 * Not responsible for:
 *   - 单图展示（加载 / 失败态）— 用 sn-img
 *   - 视频预览 — 用 sn-video-preview
 */

import { computed, getCurrentInstance, markRaw, onBeforeUnmount, ref } from 'vue'
import SnIcon from '../sn-icon/sn-icon.vue'
import type { IconData } from '../sn-icon/sn-icon.vue'
import { resolveIconByName } from '../sn-icon/sn-icon-registry'
import { X as XIcon } from '../sn-icon/sn-icon-set'
import SnPopup from '../sn-popup/sn-popup.vue'
import SnSwiper from '../sn-swiper/sn-swiper.vue'

defineOptions({ name: 'SnImagePreview' })

/** Close-button anchor. Mirrors `wd-image-preview` `close-icon-position`. */
type ImagePreviewClosePosition = 'top-left' | 'top-right'

/** Options accepted by `open()` (mirrors the wd options object). */
export interface SnImagePreviewOptions {
  /** Image URLs; overrides the `images` prop for this session. */
  images?: string[]
  /** Index shown first; overrides `startPosition`. */
  startPosition?: number
}

/** One hit zone derived from `selector` mode (viewport coordinates). */
interface PreviewHitZone {
  left: number
  top: number
  width: number
  height: number
}

const props = withDefaults(
  defineProps<{
    /** CSS selector whose matched elements open the viewer (see header). */
    selector?: string
    /** Image URL list. */
    images?: string[]
    /** Index shown when opened. */
    startPosition?: number
    /** Show the `current / total` counter. */
    showIndex?: boolean
    /** Loop from the last image to the first. */
    loop?: boolean
    /** Render the close button. */
    closeable?: boolean
    /** Close glyph: a sn-icon registry name; unknown names fall back to the built-in X. */
    closeIcon?: string
    /** Close-button anchor. */
    closeIconPosition?: ImagePreviewClosePosition
    /** Tapping the image or the scrim closes the viewer. */
    closeOnClick?: boolean
    /** Long-press shows the miniprogram QR menu on the image. */
    showMenuByLongpress?: boolean
    /** Stacking level of the layer. */
    zIndex?: number
    /** Custom class for the root node. */
    customClass?: string
    /** Custom inline style for the root node. */
    customStyle?: string
  }>(),
  {
    selector: '',
    images: () => [],
    startPosition: 0,
    showIndex: true,
    loop: true,
    closeable: true,
    closeIcon: 'close',
    closeIconPosition: 'top-right',
    closeOnClick: true,
    showMenuByLongpress: true,
    zIndex: 1000,
    customClass: '',
    customStyle: '',
  },
)

const emit = defineEmits<{
  (e: 'open'): void
  (e: 'close'): void
  (e: 'change', payload: { index: number }): void
  (e: 'long-press', payload: { image: string }): void
}>()

const instance = getCurrentInstance()

/** Layer visibility — owned here; the popup is driven one-way. */
const visible = ref(false)

/** Images for the current session (`open(options)` may override the prop). */
const sessionImages = ref<string[]>([...props.images])

/** Current index inside the swiper. */
const current = ref(0)

/** `selector` hit zones, resolved on open. */
const hitZones = ref<PreviewHitZone[]>([])

/* ── Guarded uni access ─────────────────────────────────────────────────── */

/** Query chain as returned by `uni.createSelectorQuery()` (subset used here). */
interface SelectorQueryLike {
  in?: (component: unknown) => SelectorQueryLike
  selectAll?: (selector: string) => {
    boundingClientRect?: (
      callback: (rects: Array<Partial<PreviewHitZone>> | null) => void,
    ) => { exec?: () => void }
  }
}

interface UniHost {
  createSelectorQuery?: () => SelectorQueryLike
}

function getUni(): UniHost | null {
  const host = globalThis as { uni?: UniHost }
  return host.uni ?? null
}

/**
 * Resolve the boxes of every element matching `selector` into hit zones.
 *
 * No-op when `selector` is empty or the host has no layout query — the viewer
 * is still fully usable through `open()` / `setActive()`.
 */
function measureHitZones(): void {
  hitZones.value = []
  if (props.selector === '') return
  const createSelectorQuery = getUni()?.createSelectorQuery
  if (typeof createSelectorQuery !== 'function') return
  try {
    const query = createSelectorQuery()
    if (query === null || query === undefined) return
    const scoped = typeof query.in === 'function' ? query.in(instance) : query
    const selection = scoped.selectAll?.(props.selector)
    if (selection?.boundingClientRect === undefined) return
    selection.boundingClientRect((rects) => {
      if (!Array.isArray(rects)) return
      hitZones.value = rects.map((rect) => ({
        left: rect.left ?? 0,
        top: rect.top ?? 0,
        width: rect.width ?? 0,
        height: rect.height ?? 0,
      }))
    }).exec?.()
  } catch {
    // A selector that matches nothing throws on some renderers — stay empty.
    hitZones.value = []
  }
}

/* ── Public API ─────────────────────────────────────────────────────────── */

function clampIndex(index: number): number {
  const count = sessionImages.value.length
  if (count === 0) return 0
  if (!Number.isFinite(index)) return 0
  return Math.min(count - 1, Math.max(0, Math.round(index)))
}

/** Open the layer (mirrors `wd-image-preview` `open`). */
function open(options: SnImagePreviewOptions = {}): void {
  sessionImages.value = [...(options.images ?? props.images)]
  current.value = clampIndex(options.startPosition ?? props.startPosition)
  visible.value = true
  measureHitZones()
  emit('open')
}

/** Close the layer (mirrors `wd-image-preview` `close`). */
function close(): void {
  if (!visible.value) return
  visible.value = false
  emit('close')
}

/** Jump to an index (mirrors `wd-image-preview` `setActive`). */
function setActive(index: number): void {
  const next = clampIndex(index)
  if (next === current.value) return
  current.value = next
  emit('change', { index: next })
}

defineExpose({ open, close, setActive })

onBeforeUnmount(() => {
  // §41: the cached layout boxes are the only state this component owns.
  hitZones.value = []
  sessionImages.value = []
})

/* ── Presentation ──────────────────────────────────────────────────────── */

const total = computed(() => sessionImages.value.length)

/** `n / total` counter, empty while the list is empty. */
const counterText = computed(() =>
  total.value === 0 ? '' : `${current.value + 1} / ${total.value}`,
)

/** Close glyph resolved through the sn-icon registry, falling back to X. */
const closeGlyph = computed<IconData>(() => {
  const resolved = props.closeIcon ? resolveIconByName(props.closeIcon) : undefined
  return resolved ? markRaw(resolved) : XIcon
})

const closeButtonClass = computed(() => [
  'sn-image-preview__close',
  `sn-image-preview__close--${props.closeIconPosition}`,
])

const rootClass = computed(() => ['sn-image-preview', props.customClass])

const rootStyle = computed(() => (props.customStyle ? props.customStyle : undefined))

/**
 * Non-undefined views of the props forwarded into child components. A bare prop
 * identifier in the template types as `T | undefined` under
 * `exactOptionalPropertyTypes`, so each forwarded prop goes through a computed.
 */
const zIndexValue = computed(() => props.zIndex)
const loopValue = computed(() => props.loop)
const showMenuValue = computed(() => props.showMenuByLongpress)
/** Popup panel override: full-bleed, transparent, unpadded. */
const PANEL_STYLE = [
  'width: 100%',
  'height: 100%',
  'max-width: 100%',
  'max-height: 100%',
  'padding: 0',
  'background-color: transparent',
].join('; ')

function onSwiperChange(payload: { current: number }): void {
  if (payload.current === current.value) return
  current.value = payload.current
  emit('change', { index: payload.current })
}

function onCloseTap(event: Event): void {
  event.stopPropagation()
  close()
}

function onStageTap(): void {
  if (props.closeOnClick) close()
}

function onLongPress(): void {
  const image = sessionImages.value[current.value] ?? ''
  if (image === '') return
  emit('long-press', { image })
}

/** Tapping a hit zone opens the viewer at that zone's index. */
function onHitZoneTap(index: number): void {
  open({ startPosition: index })
}

/** Keep the popup and this component's visibility in one direction. */
function onPopupModelUpdate(value: boolean): void {
  if (value) open()
  else close()
}

function onPopupModalTap(): void {
  if (props.closeOnClick) close()
}
</script>

<template>
  <view v-if="hitZones.length > 0 && !visible" class="sn-image-preview__zones" aria-hidden="true">
    <view
      v-for="(zone, index) in hitZones"
      :key="index"
      class="sn-image-preview__zone"
      :style="`left: ${zone.left}px; top: ${zone.top}px; width: ${zone.width}px; height: ${zone.height}px`"
      @tap="onHitZoneTap(index)"
    />
  </view>

  <SnPopup
    :model-value="visible"
    position="center"
    :z-index="zIndexValue"
    :duration="200"
    :custom-style="PANEL_STYLE"
    @update:model-value="onPopupModelUpdate"
    @click-modal="onPopupModalTap"
  >
    <view
      :class="rootClass"
      :style="rootStyle"
      role="dialog"
      aria-modal="true"
      aria-label="image preview"
    >
      <view class="sn-image-preview__stage" @tap="onStageTap" @longpress="onLongPress">
        <SnSwiper
          v-if="total > 0"
          class="sn-image-preview__swiper"
          :list="sessionImages"
          :current="current"
          :loop="loopValue"
          :autoplay="false"
          height="100%"
          :indicator="false"
          image-mode="aspectFit"
          :show-menu-by-longpress="showMenuValue"
          @change="onSwiperChange"
        />
        <slot v-else />
      </view>

      <view v-if="showIndex && counterText" class="sn-image-preview__index" aria-live="polite">
        <slot name="indicator" :current="current" :total="total">
          <text class="sn-image-preview__index-text">{{ counterText }}</text>
        </slot>
      </view>

      <view
        v-if="closeable"
        :class="closeButtonClass"
        role="button"
        aria-label="close"
        @tap="onCloseTap"
      >
        <SnIcon :icon="closeGlyph" :size="32" />
      </view>

      <view v-if="$slots.default" class="sn-image-preview__footer">
        <slot :current="current" />
      </view>
    </view>
  </SnPopup>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-image-preview {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.sn-image-preview__stage {
  position: relative;
  flex: 1;
  width: 100%;
  min-height: 0;
}

.sn-image-preview__swiper {
  height: 100%;
  border-radius: 0;
  background-color: transparent;
}

/* ── Counter ───────────────────────────────────────────────────────────── */

.sn-image-preview__index {
  position: absolute;
  top: var(--sn-mp-spacing-8);
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sn-image-preview__index-text {
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-4);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-overlay);
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-medium);
  line-height: var(--sn-mp-font-line-height-normal);
}

/* ── Close button ──────────────────────────────────────────────────────── */

.sn-image-preview__close {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-overlay);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-image-preview__close--top-right {
  top: var(--sn-mp-spacing-4);
  right: var(--sn-mp-spacing-4);
}

.sn-image-preview__close--top-left {
  top: var(--sn-mp-spacing-4);
  left: var(--sn-mp-spacing-4);
}

/* ── Footer slot ───────────────────────────────────────────────────────── */

.sn-image-preview__footer {
  padding: var(--sn-mp-spacing-5) var(--sn-mp-spacing-4);
}

/* ── Selector hit zones ────────────────────────────────────────────────── */

.sn-image-preview__zones {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  /* Transparent passthrough layer — taps on unmatched areas reach the page. */
  pointer-events: none;
}

.sn-image-preview__zone {
  position: absolute;
  pointer-events: auto;
  background-color: transparent;
}
</style>
