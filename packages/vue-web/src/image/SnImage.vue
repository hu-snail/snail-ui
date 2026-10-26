<script lang="ts">
/** Per-instance member id for group registration (upstream uses a module uuid). */
let imageUid = 0
</script>

<script setup lang="ts">
/**
 * SnImage — web-end image with click-to-preview (AUI-WEB-DD-010).
 *
 * Reference library: naive-ui `n-image`
 *   (https://www.naiveui.com/zh-CN/light/components/image)
 * Per AGENTS.md §112, props + semantics mirror n-image 1:1:
 *   src / alt / width / height / object-fit / fallback-src / preview-src /
 *   img-props / previewed-img-props / lazy / intersection-observer-options /
 *   preview-disabled / show-toolbar / show-toolbar-tooltip / keep-drag-offset /
 *   render-toolbar / on-load / on-error, slots error + placeholder, method
 *   showPreview().
 *
 * Inside a `SnImageGroup` the component registers its preview url through
 * provide/inject and the group owns the single shared overlay (with prev /
 * next); standalone instances render their own preview overlay. `lazy`
 * works natively (loading="lazy") or via IntersectionObserver when
 * `intersection-observer-options` is set.
 *
 * Documented divergences (not §112 violations):
 *   - `show-toolbar-tooltip` renders native `title` attributes (see
 *     SnImagePreview).
 *   - Events are emitted Vue-style (`@load` / `@error`) while upstream takes
 *     `on-load` / `on-error` function props — identical wiring in templates.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnImage width="100" src="…" />
 *   <SnImage width="100" src="…" fallback-src="…" lazy />
 *   <SnImageGroup><SnImage src="…" /><SnImage src="…" /></SnImageGroup>
 */

import { computed, inject, onBeforeUnmount, onMounted, ref, useSlots, watchEffect } from 'vue'
import type { ImgHTMLAttributes, StyleValue } from 'vue'
import SnImagePreview from './SnImagePreview.vue'
import type { SnImageToolbarNodes } from './SnImagePreview.vue'
import { SN_IMAGE_GROUP_INJECTION_KEY } from './SnImageGroup.vue'

defineOptions({ name: 'SnImage' })

const props = withDefaults(
  defineProps<{
    /** Image description exposed as alt/aria-label. Mirrors `alt`. */
    alt?: string | undefined
    /** Thumbnail width (number → px). Mirrors `width`. */
    width?: string | number | undefined
    /** Thumbnail height (number → px). Mirrors `height`. */
    height?: string | number | undefined
    /** Extra attributes forwarded to the inner <img>. Mirrors `img-props`. */
    imgProps?: ImgHTMLAttributes | undefined
    /** Load on viewport entry. Mirrors `lazy`. */
    lazy?: boolean
    /** IntersectionObserver config for lazy loading. Mirrors `intersection-observer-options`. */
    intersectionObserverOptions?: {
      root?: Element | Document | string | null
      rootMargin?: string
      threshold?: number | number[]
    } | undefined
    /** Thumbnail fit inside its box. Mirrors `object-fit`. */
    objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
    /** Dedicated (larger) preview url; falls back to `src`. Mirrors `preview-src`. */
    previewSrc?: string | undefined
    /** Shown when the thumbnail fails to load. Mirrors `fallback-src`. */
    fallbackSrc?: string | undefined
    /** Image source. Mirrors `src`. */
    src?: string | undefined
    /** Disable click-to-preview. Mirrors `preview-disabled`. */
    previewDisabled?: boolean
    /** Attributes/style for the previewed <img>. Mirrors `previewed-img-props`. */
    previewedImgProps?: ImgHTMLAttributes | undefined
    /** Custom toolbar renderer forwarded to the preview. Mirrors `render-toolbar`. */
    renderToolbar?: ((props: { nodes: SnImageToolbarNodes }) => unknown) | undefined
    /** Toolbar visibility in the preview. Mirrors `show-toolbar`. */
    showToolbar?: boolean | undefined
    /** Native title hints on toolbar buttons. Mirrors `show-toolbar-tooltip`. */
    showToolbarTooltip?: boolean | undefined
    /** Keep the dragged offset after release. Mirrors `keep-drag-offset`. */
    keepDragOffset?: boolean | undefined
  }>(),
  {
    alt: undefined,
    width: undefined,
    height: undefined,
    imgProps: undefined,
    lazy: false,
    intersectionObserverOptions: undefined,
    objectFit: 'fill',
    previewSrc: undefined,
    fallbackSrc: undefined,
    src: undefined,
    previewDisabled: false,
    previewedImgProps: undefined,
    renderToolbar: undefined,
    showToolbar: true,
    showToolbarTooltip: false,
    keepDragOffset: false,
  },
)

const emit = defineEmits<{
  /** Thumbnail loaded. Mirrors `on-load`. */
  (e: 'load', event: Event): void
  /** Thumbnail failed (after fallback attempt). Mirrors `on-error`. */
  (e: 'error', event: Event): void
}>()

const slots = useSlots()

defineSlots<{
  /** Replaces the <img> while it is in the error state. */
  error?(): unknown
  /** Rendered below/instead of the unloaded image. */
  placeholder?(): unknown
}>()

const group = inject(SN_IMAGE_GROUP_INJECTION_KEY, null)
const imageId = ++imageUid

const imageRef = ref<HTMLImageElement | null>(null)
const showError = ref(false)
const loaded = ref(false)
const shouldStartLoading = ref(!props.lazy)
const previewShow = ref(false)

const mergedPreviewSrc = computed(() => props.previewSrc || props.src)

// A new src resets the error state (upstream watchEffect).
watchEffect(() => {
  void (props.src || props.imgProps?.src)
  showError.value = false
})

// Group registration lifecycle: re-registers when the preview url changes.
watchEffect((onInvalidate) => {
  if (!group) return
  const unregister = group.registerImage(imageId, mergedPreviewSrc.value || '')
  onInvalidate(() => unregister())
})

/* ── Lazy loading ───────────────────────────────────────────────────────── */

let disconnectObserver: (() => void) | null = null

onMounted(() => {
  if (!props.lazy || !props.intersectionObserverOptions) return
  if (typeof IntersectionObserver === 'undefined') return
  const options = props.intersectionObserverOptions
  const rootOption = options.root
  let resolvedRoot: Element | Document | null | undefined
  if (typeof rootOption === 'string') {
    resolvedRoot = typeof document !== 'undefined' ? document.querySelector(rootOption) : null
  } else {
    resolvedRoot = rootOption
  }
  const init: IntersectionObserverInit = {}
  if (resolvedRoot !== undefined) init.root = resolvedRoot
  if (options.rootMargin !== undefined) init.rootMargin = options.rootMargin
  if (options.threshold !== undefined) init.threshold = options.threshold
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          shouldStartLoading.value = true
          observer.disconnect()
        }
      }
    },
    init,
  )
  if (imageRef.value) observer.observe(imageRef.value)
  disconnectObserver = () => observer.disconnect()
})

onBeforeUnmount(() => {
  disconnectObserver?.()
  disconnectObserver = null
})

/* ── <img> bindings ─────────────────────────────────────────────────────── */

/** img-props pass-through minus the keys this component owns. */
const PASSTHROUGH_BLOCKED = new Set(['src', 'alt', 'width', 'height', 'style', 'onClick', 'onError', 'onLoad'])

const imgAttrs = computed<Record<string, unknown>>(() => {
  const forwarded = props.imgProps as Record<string, unknown> | undefined
  const rest: Record<string, unknown> = {}
  if (forwarded) {
    for (const [key, value] of Object.entries(forwarded)) {
      if (!PASSTHROUGH_BLOCKED.has(key)) rest[key] = value
    }
  }
  return rest
})

const mergedSrc = computed(() => {
  if (showError.value) return props.fallbackSrc
  if (props.lazy && props.intersectionObserverOptions && !shouldStartLoading.value) return undefined
  return props.src || props.imgProps?.src
})

const mergedAlt = computed(() => props.alt || props.imgProps?.alt)

const mergedWidth = computed(() => props.width ?? props.imgProps?.width)
const mergedHeight = computed(() => props.height ?? props.imgProps?.height)

const loadingAttr = computed<'lazy' | 'eager'>(() =>
  props.lazy && !props.intersectionObserverOptions ? 'lazy' : 'eager',
)

const imgStyle = computed<StyleValue>(() => {
  const parts: StyleValue[] = []
  const forwardedStyle = props.imgProps?.style
  if (typeof forwardedStyle === 'string' && forwardedStyle) parts.push(forwardedStyle)
  else if (forwardedStyle && typeof forwardedStyle === 'object') parts.push(forwardedStyle)
  parts.push({ objectFit: props.objectFit })
  // Upstream hides the thumbnail while a placeholder slot is mounted and
  // the image has not loaded yet.
  const placeholderShown = slots.placeholder && !loaded.value && !showError.value
  if (placeholderShown) parts.push({ width: '0', height: '0', visibility: 'hidden' })
  return parts
})

/* ── Handlers ───────────────────────────────────────────────────────────── */

/** Open the preview (also exposed for manual control). */
function showPreview(): void {
  if (props.previewDisabled || showError.value) return
  if (group) {
    group.open(imageId)
    return
  }
  previewShow.value = true
}

function handleImgClick(event: MouseEvent): void {
  showPreview()
  props.imgProps?.onClick?.(event as PointerEvent)
}

function handleImgError(event: Event): void {
  showError.value = true
  loaded.value = true
  emit('error', event)
  props.imgProps?.onError?.(event)
}

function handleImgLoad(event: Event): void {
  loaded.value = true
  emit('load', event)
  props.imgProps?.onLoad?.(event)
}

defineExpose({
  /** Manually open the preview. Mirrors the reference `showPreview` method. */
  showPreview,
  /** Alias kept for parity with the reference `click` method. */
  click: showPreview,
})
</script>

<template>
  <div
    data-snui-component="image"
    class="sn-image"
    :class="previewDisabled || showError ? 'sn-image--preview-disabled' : ''"
    role="none"
  >
    <slot v-if="showError && slots.error" name="error" />
    <img
      v-else
      v-bind="imgAttrs"
      ref="imageRef"
      :width="mergedWidth"
      :height="mergedHeight"
      :src="mergedSrc"
      :alt="mergedAlt"
      :aria-label="mergedAlt"
      :loading="loadingAttr"
      :data-error="showError || undefined"
      :data-preview-src="previewSrc || src"
      :style="imgStyle"
      @click="handleImgClick"
      @error="handleImgError"
      @load="handleImgLoad"
    >
    <slot v-if="!loaded && !showError" name="placeholder" />
    <SnImagePreview
      v-if="!group"
      :src="mergedPreviewSrc"
      :show="previewShow"
      :show-toolbar="showToolbar"
      :show-toolbar-tooltip="showToolbarTooltip"
      :keep-drag-offset="keepDragOffset"
      :previewed-img-props="previewedImgProps"
      :render-toolbar="renderToolbar"
      @update:show="previewShow = $event"
    />
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-image {
  display: inline-flex;
  max-height: 100%;
  max-width: 100%;
}

.sn-image:not(.sn-image--preview-disabled) {
  cursor: pointer;
}

.sn-image img {
  /* Keep declared width/height exact with the 1px emphasized edge. */
  box-sizing: border-box;
  border: 1px solid color-mix(in srgb, var(--sn-web-color-text-primary) 12%, var(--sn-web-color-background-surface));
  border-radius: inherit;
}
</style>
