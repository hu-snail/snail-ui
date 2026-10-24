<script setup lang="ts">
/**
 * sn-img (uni-end) — image with loading / error / preview states.
 *
 * Reference library: wot-ui `wd-img`
 *   (https://wot-ui.cn/component/img.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-img 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-img/sn-img.vue
 * → auto-registered as `<sn-img>` in any .vue that uses it.
 *
 * ## Preview
 *
 * `enablePreview` calls `uni.previewImage` — the cross-end preview API every
 * uni target ships. It is looked up through a guarded `globalThis` access so
 * the component still renders (and tests still pass) where `uni` is absent;
 * when it is missing the tap falls back to emitting `click` only.
 *
 * ## Dispose (AGENTS.md §41)
 *
 * No timer, no listener: the image element's own `load` / `error` events drive
 * the states.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 轮播图 — 用 sn-swiper
 *   - 头像（圆形 + 回退文案）— 用 sn-avatar
 */

import { computed, ref, watch } from 'vue'

defineOptions({ name: 'SnImg' })

/**
 * Crop mode. Mirrors uni-app's `<image mode>` set, which is what the wd
 * reference documents for `mode`.
 */
type ImageMode =
  | 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix'
  | 'top' | 'bottom' | 'center' | 'left' | 'right'
  | 'top left' | 'top right' | 'bottom left' | 'bottom right'

const props = withDefaults(
  defineProps<{
    /** Image source. */
    src?: string
    /** Image opened by `enablePreview` (defaults to `src`). */
    previewSrc?: string
    /** Width — a bare number is treated as rpx. */
    width?: string | number
    /** Height — a bare number is treated as rpx. */
    height?: string | number
    /** Crop mode. */
    mode?: ImageMode
    /** Render as a circle. */
    round?: boolean
    /** Corner radius — a bare number is treated as rpx. */
    radius?: string | number
    /** Lazy-load the image (uni `<image lazy-load>`). */
    lazyLoad?: boolean
    /** Tap opens `uni.previewImage`. */
    enablePreview?: boolean
    /** Long-press shows the miniprogram QR menu (WeChat only). */
    showMenuByLongpress?: boolean
    /** Show the built-in loading indicator until the image loads. */
    showLoading?: boolean
    /** Show the built-in error state when the image fails. */
    showError?: boolean
    /** Custom class for the root node. */
    customClass?: string
    /** Custom inline style for the root node. */
    customStyle?: string
    /** Custom class for the inner `<image>`. */
    customImage?: string
  }>(),
  {
    src: '',
    previewSrc: '',
    width: '',
    height: '',
    mode: 'scaleToFill',
    round: false,
    radius: '',
    lazyLoad: false,
    enablePreview: false,
    showMenuByLongpress: false,
    showLoading: true,
    showError: true,
    customClass: '',
    customStyle: '',
    customImage: '',
  },
)

defineSlots<{
  /** Custom loading state. */
  loading?(): unknown
  /** Custom error state. */
  error?(): unknown
}>()

const emit = defineEmits<{
  (e: 'click', event: Event): void
  (e: 'load', event: Event): void
  (e: 'error', event: Event): void
}>()

/** Image load state. */
const status = ref<'idle' | 'loading' | 'loaded' | 'error'>('loading')

watch(() => props.src, () => {
  status.value = 'loading'
})

/** Resolve a numeric-or-string length prop (bare number = rpx). */
function toLength(value: string | number): string | undefined {
  if (value === '' || value === undefined) return undefined
  return typeof value === 'number' ? `${value}rpx` : value
}

const rootStyle = computed(() => {
  const parts: string[] = []
  const width = toLength(props.width)
  const height = toLength(props.height)
  const radius = toLength(props.radius)
  if (width) parts.push(`width: ${width}`)
  if (height) parts.push(`height: ${height}`)
  if (radius) parts.push(`border-radius: ${radius}`)
  if (props.customStyle) parts.push(props.customStyle)
  return parts.length > 0 ? parts.join('; ') : undefined
})

const imageClass = computed(() => [
  'sn-img__image',
  { 'sn-img__image--hidden': status.value === 'error' },
  props.customImage,
])

const rootClass = computed(() => [
  'sn-img',
  {
    'sn-img--round': props.round,
    'sn-img--loaded': status.value === 'loaded',
    'sn-img--error': status.value === 'error',
  },
  props.customClass,
])

/** Preview API, resolved lazily through the global uni namespace. */
function openPreview(): void {
  const preview = props.previewSrc !== '' ? props.previewSrc : props.src
  if (!preview) return
  const host = globalThis as { uni?: { previewImage?: (options: { urls: string[]; current: string }) => void } }
  const previewImage = host.uni?.previewImage
  if (typeof previewImage !== 'function') return
  previewImage({ urls: [preview], current: preview })
}

function onTap(event: Event): void {
  emit('click', event)
  if (props.enablePreview) openPreview()
}

function onLoad(event: Event): void {
  status.value = 'loaded'
  emit('load', event)
}

function onError(event: Event): void {
  status.value = 'error'
  emit('error', event)
}
</script>

<template>
  <view
    data-snui-component="img"
    :class="rootClass"
    :style="rootStyle"
    @tap="onTap"
  >
    <image
      v-if="src"
      :class="imageClass"
      :src="src"
      :mode="mode"
      :lazy-load="lazyLoad"
      :show-menu-by-longpress="showMenuByLongpress"
      @load="onLoad"
      @error="onError"
    />

    <view v-if="status === 'loading' && showLoading" class="sn-img__loading">
      <slot name="loading">
        <view class="sn-img__spinner" aria-hidden="true" />
      </slot>
    </view>

    <view v-if="status === 'error' && showError" class="sn-img__error">
      <slot name="error">
        <text class="sn-img__error-text">加载失败</text>
      </slot>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-img {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
  /* Placeholder plate while the image loads, dark-mode aware. */
  background-color: var(--sn-mp-color-background-subtle);
}

.sn-img--round {
  border-radius: var(--sn-mp-radius-full);
}

.sn-img__image {
  display: block;
  width: 100%;
  height: 100%;
}

.sn-img__image--hidden {
  opacity: 0;
}

.sn-img__loading,
.sn-img__error {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sn-img__spinner {
  box-sizing: border-box;
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid var(--sn-mp-color-border-default);
  border-top-color: var(--sn-mp-color-action-primary);
  border-radius: 50%;
  animation: sn-img-spin 0.8s linear infinite;
}

@keyframes sn-img-spin {
  to { transform: rotate(360deg); }
}

.sn-img__error-text {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
