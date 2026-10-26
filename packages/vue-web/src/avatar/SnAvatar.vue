<script setup lang="ts">
/**
 * SnAvatar — web-end avatar (AUI-WEB-DS-001).
 *
 * Reference library: naive-ui `n-avatar`
 *   (https://www.naiveui.com/zh-CN/light/components/avatar)
 * Per AGENTS.md §112, props + semantics mirror n-avatar 1:1:
 *   size (number | 'small' | 'medium' | 'large') / src / color / objectFit /
 *   round / circle / onError.
 *
 * Documented divergences (not §112 violations):
 *   - `fallbackText` (text thumbnail) replaces `fallbackSrc`: when there is
 *     no image — missing `src` or a load error — the first available of
 *     default slot → `fallbackText` → `icon` → builtin person SVG renders.
 *   - `icon` resolves a SnIcon registry name; the `icon` slot replaces it.
 *   - `lazy` / `imgProps` / fallback-src network options are not implemented.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnAvatar src="/a.png" />
 *   <SnAvatar fallback-text="张" size="large" circle />
 *   <SnAvatar icon="User" />
 */

import { computed, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import SnIcon from '../icon/SnIcon.vue'

defineOptions({ name: 'SnAvatar' })

const props = withDefaults(
  defineProps<{
    /** Pixel size, or a named scale. Mirrors n-avatar `size`. */
    size?: number | 'small' | 'medium' | 'large'
    /** Image URL. */
    src?: string | undefined
    /** Background color (any CSS color value). Mirrors n-avatar `color`. */
    color?: string | undefined
    /** Image fit inside the box. Mirrors n-avatar `objectFit`. */
    objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
    /** Pill-shaped corners. Mirrors n-avatar `round`. */
    round?: boolean
    /** Circular. Mirrors n-avatar `circle`. */
    circle?: boolean
    /** Text thumbnail shown when there is no image. */
    fallbackText?: string | undefined
    /** SnIcon registry name for the placeholder glyph. */
    icon?: string | undefined
  }>(),
  {
    size: 'medium',
    src: undefined,
    color: undefined,
    objectFit: 'cover',
    round: false,
    circle: false,
    fallbackText: undefined,
    icon: undefined,
  },
)

const emit = defineEmits<{
  /** Image failed to load — also switches to the fallback content.
   * Mirrors n-avatar `onError`. */
  (e: 'error', event: Event): void
}>()

defineSlots<{
  /** Custom avatar content — shown when there is no image. */
  default?(): unknown
  /** Placeholder glyph — replaces `icon` / the builtin person SVG. */
  icon?(): unknown
}>()

const hasLoadError = ref(false)

// A new src must clear the previous failure, or a retried URL stays hidden.
watch(
  () => props.src,
  () => {
    hasLoadError.value = false
  },
)

function handleImageError(event: Event): void {
  hasLoadError.value = true
  emit('error', event)
}

const hasImage = computed(
  () => props.src !== undefined && props.src !== '' && !hasLoadError.value,
)

const rootStyle = computed<CSSProperties | undefined>(() => {
  if (props.color === undefined && typeof props.size !== 'number') return undefined
  const style: CSSProperties = {}
  if (props.color !== undefined) style.background = props.color
  if (typeof props.size === 'number') {
    style.width = `${props.size}px`
    style.height = `${props.size}px`
  }
  return style
})
</script>

<template>
  <div
    data-snui-component="avatar"
    class="sn-avatar"
    :class="[
      typeof size === 'number' ? '' : `sn-avatar--${size}`,
      circle ? 'sn-avatar--circle' : '',
      round ? 'sn-avatar--round' : '',
    ]"
    :style="rootStyle"
  >
    <img
      v-if="hasImage"
      class="sn-avatar__img"
      :src="src"
      :style="{ objectFit }"
      @error="handleImageError"
    />
    <template v-else>
      <slot>
        <span v-if="fallbackText" class="sn-avatar__text">{{ fallbackText }}</span>
        <span v-else class="sn-avatar__icon" aria-hidden="true">
          <slot name="icon">
            <SnIcon v-if="icon" :name="icon" />
            <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            </svg>
          </slot>
        </span>
      </slot>
    </template>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 3px;
  font-size: 14px;
  color: var(--sn-web-color-text-primary);
  background: var(--sn-web-color-background-subtle);
  white-space: nowrap;
  vertical-align: middle;
}

/* Named scale (reference heights: 28 / 34 / 40 px). */
.sn-avatar--small {
  width: 28px;
  height: 28px;
}

.sn-avatar--medium {
  width: 34px;
  height: 34px;
}

.sn-avatar--large {
  width: 40px;
  height: 40px;
}

/* `circle` wins over `round` when both are set — declared after it. */
.sn-avatar--round {
  border-radius: 9999px;
}

.sn-avatar--circle {
  border-radius: 50%;
}

.sn-avatar__img {
  display: block;
  width: 100%;
  height: 100%;
}

/* The glyph box is half the avatar; SnIcon's 1em wrapper must grow to it. */
.sn-avatar__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 50%;
}

.sn-avatar__icon > svg,
.sn-avatar__icon :deep(.sn-icon),
.sn-avatar__icon :deep(.sn-icon svg) {
  width: 100%;
  height: 100%;
}
</style>
