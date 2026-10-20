<script setup lang="ts">
/**
 * SnVideoPreviewOverlay — internal full-screen preview overlay for
 * SnVideoPreview (AUI-WEB-DD-011). Not a public component: it is mounted by
 * SnVideoPreview, mirroring how the reference-free SnImage splits
 * SnImage / SnImagePreview.
 *
 * Reference library: NONE. naive-ui has no video component (verified against
 * naive-ui `src/components.ts`), so per AGENTS.md §112 this is an explicit
 * divergence from the reference-parity rule: the overlay model follows this
 * repo's own `SnImagePreview` instead — fixed full-screen dark mask, a
 * centered larger video, a header with the optional title, a close button,
 * ESC-to-close and click-mask-to-close.
 *
 * Documented divergences from SnImagePreview (not §112 violations):
 *   - No zoom/rotate/pan toolbar: a video already ships its own native
 *     controls, so the overlay only offers "close".
 *   - Page scroll is locked while shown, like SnImagePreview.
 *   - The mask uses `--sn-web-*` tokens (overlay/toolbar surfaces) rather
 *     than hardcoded rgba literals.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage (internal):
 *   <SnVideoPreviewOverlay :src="url" :title="t" :show="show"
 *     @update:show="show = $event" />
 */

import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import SnIcon from '../icon/SnIcon.vue'

defineOptions({ name: 'SnVideoPreviewOverlay' })

const props = withDefaults(
  defineProps<{
    /** Video url shown in the overlay. */
    src?: string | undefined
    /** Poster shown before the overlay video starts. */
    poster?: string | undefined
    /** Header text and accessible name of the dialog. */
    title?: string | undefined
    /** Controlled visibility; `undefined` falls back to uncontrolled state. */
    show?: boolean | undefined
    /** Initial visibility for uncontrolled usage. */
    defaultShow?: boolean
    /** Close when the mask is clicked. */
    /** Close when the mask is clicked. */
    closeOnMaskClick?: boolean | undefined
    /** Native controls on the overlay video. */
    controls?: boolean | undefined
    /** Start playing as soon as the overlay mounts. */
    autoplay?: boolean | undefined
    /** Loop the overlay video. */
    loop?: boolean | undefined
    /** Mute the overlay video. */
    muted?: boolean | undefined
    /** Preload strategy of the overlay video. */
    preload?: 'none' | 'metadata' | 'auto' | undefined
  }>(),
  {
    src: undefined,
    poster: undefined,
    title: undefined,
    show: undefined,
    defaultShow: false,
    closeOnMaskClick: true,
    controls: true,
    autoplay: false,
    loop: false,
    muted: false,
    preload: 'metadata',
  },
)

const emit = defineEmits<{
  /** Visibility change (close via mask / Esc / close button). */
  (e: 'update:show', value: boolean): void
  /** Overlay closed. */
  (e: 'close'): void
}>()

/* ── Visibility (controlled / uncontrolled) ─────────────────────────────── */

const uncontrolledShow = ref(props.defaultShow)
const mergedShow = computed(() => (props.show !== undefined ? props.show : uncontrolledShow.value))

const videoRef = ref<HTMLVideoElement | null>(null)
const closeButtonRef = ref<HTMLButtonElement | null>(null)

const dialogLabel = computed(() => props.title || '视频预览')

function doUpdateShow(value: boolean): void {
  uncontrolledShow.value = value
  emit('update:show', value)
}

function close(): void {
  if (!mergedShow.value) return
  emit('close')
  doUpdateShow(false)
}

/* ── Media helpers (every call is guarded: happy-dom has no media engine) ── */

function pauseVideo(): void {
  const el = videoRef.value
  if (el && typeof el.pause === 'function') el.pause()
}

/** Drop the media resource so no decoder/buffer outlives the overlay (§41). */
function resetVideoSource(): void {
  const el = videoRef.value
  if (!el) return
  pauseVideo()
  el.removeAttribute('src')
  if (typeof el.load === 'function') el.load()
}

/* ── Keyboard + scroll lock while shown ─────────────────────────────────── */

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') close()
}

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

  if (shown) {
    // Move focus into the dialog so Esc / Tab work without a prior click.
    void nextTick(() => closeButtonRef.value?.focus())
  } else {
    pauseVideo()
  }
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', handleKeydown)
    if (isScrollLocked) {
      document.documentElement.style.overflow = memoizedHtmlOverflow ?? ''
      isScrollLocked = false
    }
  }
  resetVideoSource()
})

function handleMaskClick(): void {
  if (props.closeOnMaskClick) close()
}

</script>

<template>
  <Teleport to="body">
    <div
      v-if="mergedShow"
      data-snui-component="video-preview-overlay"
      class="sn-video-preview-overlay"
      role="dialog"
      aria-modal="true"
      :aria-label="dialogLabel"
    >
      <div class="sn-video-preview-overlay__mask" @click="handleMaskClick" />
      <div class="sn-video-preview-overlay__panel">
        <div class="sn-video-preview-overlay__header">
          <span v-if="title" class="sn-video-preview-overlay__title">{{ title }}</span>
          <button
            ref="closeButtonRef"
            type="button"
            class="sn-video-preview-overlay__close"
            aria-label="关闭"
            @click="close"
          >
            <SnIcon :icon="X" />
          </button>
        </div>
        <video
          ref="videoRef"
          class="sn-video-preview-overlay__video"
          :src="src"
          :poster="poster"
          :controls="controls"
          :autoplay="autoplay"
          :loop="loop"
          :muted="muted"
          :preload="preload"
          :aria-label="dialogLabel"
          playsinline
        />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-video-preview-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--sn-web-video-preview-overlay-z-index, 2000);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sn-video-preview-overlay__mask {
  position: absolute;
  inset: 0;
  background: var(--sn-web-video-preview-overlay-mask, var(--sn-web-color-background-overlay, #000000d1));
  animation: sn-video-preview-overlay-fade-in 0.2s;
}

.sn-video-preview-overlay__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-spacing-8, 8px);
  max-width: calc(100vw - var(--sn-web-video-preview-overlay-gutter, 48px));
  max-height: calc(100vh - var(--sn-web-video-preview-overlay-gutter, 48px));
  animation: sn-video-preview-overlay-fade-in 0.2s;
}

.sn-video-preview-overlay__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sn-web-spacing-8, 8px);
  min-height: var(--sn-web-video-preview-overlay-header-height, 32px);
  color: var(--sn-web-video-preview-overlay-title-color, var(--sn-web-color-text-on-primary, #ffffff));
  font-size: var(--sn-web-font-size-md, 14px);
}

.sn-video-preview-overlay__title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sn-video-preview-overlay__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: var(--sn-web-video-preview-overlay-close-size, 32px);
  height: var(--sn-web-video-preview-overlay-close-size, 32px);
  padding: 0;
  border: none;
  border-radius: var(--sn-web-radius-full, 999px);
  color: inherit;
  background: transparent;
  cursor: pointer;
}

.sn-video-preview-overlay__close:hover {
  background: var(--sn-web-video-preview-overlay-close-bg-hover, var(--sn-web-color-background-elevated, #ffffff1f));
}

.sn-video-preview-overlay__close:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring, #1677ff73);
  outline-offset: 2px;
}

.sn-video-preview-overlay__video {
  object-fit: contain;
  display: block;
  max-width: calc(100vw - var(--sn-web-video-preview-overlay-gutter, 48px));
  max-height: calc(
    100vh - var(--sn-web-video-preview-overlay-header-height, 32px) - var(--sn-web-video-preview-overlay-gutter, 48px)
  );
  border-radius: var(--sn-web-radius-md, 6px);
  background: var(--sn-web-color-background-surface, #000000);
}

@keyframes sn-video-preview-overlay-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>