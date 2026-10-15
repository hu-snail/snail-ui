<script setup lang="ts">
/**
 * SnLoading — loading indicator with an optional dimming wrapper
 * (AUI-WEB-FB-006).
 *
 * Reference library: naive-ui `n-spin`
 *   (https://www.naiveui.com/zh-CN/light/components/spin)
 * Per AGENTS.md §112, props + semantics mirror n-spin 1:1.
 *
 * 1:1 parity (this version): show / size / delay / rotate / strokeWidth /
 *   stroke / scale / radius / description / contentClass / contentStyle /
 *   spinning (deprecated alias) / slot default / slot description / slot icon.
 *
 * Behaviour mirrors n-spin:
 *   - Bare usage renders just the spinner. Passing a `default` slot turns it
 *     into a wrapper: the content renders normally and the spinner is centred
 *     over it, fading in via a Transition.
 *   - `delay` defers the spinner's appearance by N ms. Hiding is immediate —
 *     a pending delay is cancelled, so a fast request never flashes.
 *   - `show` is the visibility switch; `spinning` is the deprecated upstream
 *     name and wins when both are supplied.
 *   - The wrapped content gets reduced opacity + `pointer-events: none` while
 *     active, so it cannot be interacted with mid-request.
 *
 * Divergence from n-spin (documented):
 *   - The spinner graphic lives in the internal `SnLoadingSpinner.vue` so the
 *     bare and wrapped paths share one definition. It keeps upstream's
 *     SMIL-based arc, so the visual result matches, but drives it with
 *     `currentColor` — which lets `stroke` work without upstream's extra
 *     inline-style hop.
 *   - `size` accepts `'tiny' | 'small' | 'medium' | 'large' | 'huge' | number`.
 *     Upstream's numeric path goes through `pxfy()`; here a bare number is
 *     treated as px.
 *   - Upstream emits `--n-*` theme vars per size tier. This library uses the
 *     `--sn-web-spin-*` token block instead.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnLoading />
 *   <SnLoading size="large" description="加载中" />
 *   <SnLoading :show="loading"><p>内容</p></SnLoading>
 */

import { computed, onBeforeUnmount, ref, watch } from 'vue'
import SnLoadingSpinner from './SnLoadingSpinner.vue'

defineOptions({ name: 'SnLoading' })

/** Upstream `STROKE_WIDTH` map — the arc thins as the spinner grows. */
const STROKE_WIDTH_BY_SIZE: Record<'tiny' | 'small' | 'medium' | 'large' | 'huge', number> = {
  tiny: 20,
  small: 20,
  medium: 18,
  large: 16,
  huge: 16,
}

const DEFAULT_STROKE_WIDTH = 28
const DEFAULT_SCALE = 1
const DEFAULT_RADIUS = 100

const props = withDefaults(
  defineProps<{
    /** Size tier, or a number treated as px. Mirrors n-spin `size`. */
    size?: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | number
    /** Whether the spinner is visible. Mirrors n-spin `show`. */
    show?: boolean
    /** Defer the spinner by N ms; hiding is always immediate. Mirrors `delay`. */
    delay?: number
    /** Rotate a custom `icon` slot. Ignored for the built-in spinner, which
     *  is animated by SMIL. Mirrors n-spin `rotate`. */
    rotate?: boolean
    /** Text under the spinner. Mirrors n-spin `description`. */
    description?: string
    /** Class applied to the wrapped content. Mirrors `contentClass`. */
    contentClass?: string
    /** Style applied to the wrapped content. Mirrors `contentStyle`. */
    contentStyle?: string | Record<string, string | number>
    /** Custom arc colour. Mirrors n-spin `stroke`. */
    stroke?: string
    /** Arc thickness in SVG units. Mirrors n-spin `strokeWidth`. */
    strokeWidth?: number
    /** Overall scale factor. Mirrors n-spin `scale`. */
    scale?: number
    /** SVG arc radius in design units. Mirrors n-spin `radius`. */
    radius?: number
    /**
     * Deprecated upstream alias for `show`; wins when both are set.
     * Mirrors n-spin `spinning`.
     */
    spinning?: boolean
  }>(),
  {
    size: 'medium',
    show: true,
    delay: undefined as any,
    rotate: true,
    description: undefined as any,
    contentClass: undefined as any,
    contentStyle: undefined as any,
    stroke: undefined as any,
    strokeWidth: undefined as any,
    scale: undefined as any,
    radius: undefined as any,
    spinning: undefined as any,
  },
)

defineSlots<{
  /** Wrapped content. When present the spinner overlays it. */
  default?(): unknown
  /** Rich description under the spinner (overrides `description`). */
  description?(): unknown
  /** Custom spinner graphic, replacing the built-in SVG arc. */
  icon?(): unknown
}>()

if (props.spinning !== undefined) {
  console.warn('[SnLoading] `spinning` is deprecated, please use `show` instead.')
}

/** `spinning` wins over `show` when supplied — upstream `useCompitable` order. */
const resolvedShow = computed(() =>
  props.spinning !== undefined ? props.spinning : props.show,
)

const active = ref(false)
let delayTimer: ReturnType<typeof setTimeout> | undefined

function clearDelayTimer(): void {
  if (delayTimer !== undefined) {
    clearTimeout(delayTimer)
    delayTimer = undefined
  }
}

watch(
  resolvedShow,
  (visible) => {
    clearDelayTimer()
    const delay = props.delay
    if (visible && delay) {
      // Hiding must be immediate: a pending delay is cancelled above, so a
      // request that resolves inside the delay window never flashes.
      delayTimer = setTimeout(() => {
        active.value = true
        delayTimer = undefined
      }, delay)
      return
    }
    active.value = visible
  },
  { immediate: true },
)

onBeforeUnmount(clearDelayTimer)

const strokeWidth = computed(() => {
  if (props.strokeWidth !== undefined) return props.strokeWidth
  return typeof props.size === 'number'
    ? STROKE_WIDTH_BY_SIZE.medium
    : STROKE_WIDTH_BY_SIZE[props.size]
})

const sizeValue = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : `var(--sn-web-spin-size-${props.size})`,
)

const spinnerStyle = computed(() => ({
  width: sizeValue.value,
  height: sizeValue.value,
  fontSize: sizeValue.value,
  color: props.stroke ?? 'var(--sn-web-spin-color)',
}))

const containerStyle = computed(() => ({ '--sn-loading-size': sizeValue.value }))
</script>

<template>
  <!-- Bare spinner (no default slot) -->
  <div
    v-if="!$slots.default"
    data-snui-component="SnLoading"
    class="sn-loading"
    :style="containerStyle"
    role="img"
    aria-label="loading"
  >
    <div class="sn-loading__body">
      <div
        class="sn-loading__spinner"
        :class="{ 'sn-loading__spinner--rotate': rotate && $slots.icon }"
        :style="spinnerStyle"
      >
        <slot v-if="$slots.icon" name="icon" />
        <SnLoadingSpinner
          v-else
          :radius="radius ?? DEFAULT_RADIUS"
          :scale="scale ?? DEFAULT_SCALE"
          :stroke-width="strokeWidth"
        />
      </div>
      <div v-if="description || $slots.description" class="sn-loading__description">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>

  <!-- Wrapper mode: content stays mounted, spinner overlays it -->
  <div v-else data-snui-component="SnLoading" class="sn-loading sn-loading--wrapped" :style="containerStyle">
    <div
      class="sn-loading__content"
      :class="[contentClass, { 'sn-loading__content--spinning': active }]"
      :style="contentStyle"
    >
      <slot />
    </div>

    <Transition name="sn-loading-fade">
      <div v-if="active" class="sn-loading__overlay" role="img" aria-label="loading">
        <div class="sn-loading__body">
          <div
            class="sn-loading__spinner"
            :class="{ 'sn-loading__spinner--rotate': rotate && $slots.icon }"
            :style="spinnerStyle"
          >
            <slot v-if="$slots.icon" name="icon" />
            <SnLoadingSpinner
          v-else
          :radius="radius ?? DEFAULT_RADIUS"
          :scale="scale ?? DEFAULT_SCALE"
          :stroke-width="strokeWidth"
        />
          </div>
          <div v-if="description || $slots.description" class="sn-loading__description">
            <slot name="description">{{ description }}</slot>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-loading {
  --sn-loading-size: var(--sn-web-spin-size-medium);
}

/* Wrapper mode — content is the positioning context for the overlay. */
.sn-loading--wrapped {
  position: relative;
  display: block;
}

.sn-loading__body {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.sn-loading__spinner {
  display: inline-flex;
  height: var(--sn-loading-size);
  width: var(--sn-loading-size);
  font-size: var(--sn-loading-size);
  line-height: 1;
  color: var(--sn-web-spin-color);
}

/* Custom icon slot: rotate the whole graphic. The built-in SVG is driven by
 * SMIL instead, so it must not also get a CSS rotation. */
.sn-loading__spinner--rotate {
  animation: sn-loading-rotate 2s linear infinite;
}

.sn-loading__description {
  display: inline-block;
  margin-top: var(--sn-web-spin-description-gap);
  font-size: var(--sn-web-spin-font-size);
  color: var(--sn-web-spin-text-color);
}

.sn-loading__content {
  opacity: 1;
  pointer-events: all;
  transition: opacity 0.3s ease;
}

.sn-loading__content--spinning {
  opacity: var(--sn-web-spin-opacity-spinning);
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}

.sn-loading__overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

@keyframes sn-loading-rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.sn-loading-fade-enter-active,
.sn-loading-fade-leave-active {
  transition: opacity 0.3s ease;
}

.sn-loading-fade-enter-from,
.sn-loading-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .sn-loading__spinner--rotate {
    animation: none;
  }

  .sn-loading__content,
  .sn-loading-fade-enter-active,
  .sn-loading-fade-leave-active {
    transition: none;
  }
}
</style>
