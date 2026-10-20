<script setup lang="ts">
/**
 * SnVideoPreview — web-end video thumbnail with click-to-play and a
 * full-screen preview overlay (AUI-WEB-DD-011).
 *
 * Reference library: **NONE**. naive-ui has no video component (verified
 * against naive-ui `src/components.ts`), so per AGENTS.md §112 this is an
 * *explicit divergence* from the "mirror the reference 1:1" rule rather than
 * an accidental gap: the API is aligned with this repo's own `SnImage`
 * preview model instead — a media box that opens a full-screen overlay
 * (`SnVideoPreviewOverlay.vue`), with `previewDisabled` / `showToolbar` /
 * `showPreview()` mirroring SnImage.
 *
 * Semantics:
 *   - The box renders a `<video>` with `src` + `poster`. While it is not
 *     playing a centered play button sits on a scrim over the poster.
 *   - Clicking the play button starts inline playback (`video.play()`); with
 *     `controls` the native control bar then drives the rest. Any native
 *     `pause` / `ended` returns the box to the poster state. Without
 *     `controls`, clicking the video toggles play/pause.
 *   - A separate "expand" affordance — a toolbar button in the top-right of
 *     the box, revealed on hover / focus-within — opens the overlay; the same
 *     is available imperatively through the exposed `showPreview()` method.
 *
 * Documented divergences (not §112 violations):
 *   - `alt` mirrors SnImage's `alt` and is the `<video>` accessible name; it
 *     wins over `title` when both are set, `title` being the overlay header
 *     text first and an accessible-name fallback second.
 *   - The scrim is decorative (`pointer-events: none`) so the native control
 *     bar stays reachable underneath it; only the play button and the toolbar
 *     button are hit targets. SnImage instead makes the whole image clickable,
 *     because an image has no controls of its own.
 *   - Page scroll is locked while the overlay is open (same as SnImage).
 *   - Every media call is guarded: `HTMLMediaElement` methods are absent in
 *     some test environments (happy-dom) and may reject on autoplay policy.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnVideoPreview src="/clip.mp4" poster="/clip.jpg" title="宣传片" />
 *   <SnVideoPreview src="…" aspect-ratio="16 / 9" :show-toolbar="false" />
 */

import { computed, onBeforeUnmount, ref, useSlots } from 'vue'
import type { CSSProperties } from 'vue'
import { Maximize, Play } from 'lucide-vue-next'
import SnIcon from '../icon/SnIcon.vue'
import SnVideoPreviewOverlay from './SnVideoPreviewOverlay.vue'

defineOptions({ name: 'SnVideoPreview' })

const props = withDefaults(
  defineProps<{
    /** Video source. Required. */
    src: string
    /** Poster shown before playback starts. */
    poster?: string | undefined
    /** Dedicated (larger) overlay url; falls back to `src`. */
    previewSrc?: string | undefined
    /** Box width (number → px). */
    width?: string | number
    /** Box height (number → px). Explicit `undefined` keeps the ratio. */
    height?: string | number | undefined
    /** Box aspect ratio applied when no explicit `height` is given, e.g. `'16 / 9'`. */
    aspectRatio?: string | undefined
    /** How the video fits its box. */
    objectFit?: 'contain' | 'cover' | 'fill'
    /** Native controls, available once inline playback started. */
    controls?: boolean
    /** Start inline playback on mount. */
    autoplay?: boolean
    /** Loop inline playback. */
    loop?: boolean
    /** Mute inline playback. */
    muted?: boolean
    /** Preload strategy. */
    preload?: 'none' | 'metadata' | 'auto'
    /** Disable the overlay: no toolbar affordance, `showPreview()` is a no-op. */
    previewDisabled?: boolean
    /** Render the top-right overlay affordance. */
    showToolbar?: boolean
    /** Close the overlay when its mask is clicked. */
    closeOnMaskClick?: boolean
    /** Overlay header text, and the accessible name of the video. */
    title?: string | undefined
    /** Accessible description of the video; takes precedence over `title`. */
    alt?: string | undefined
  }>(),
  {
    poster: undefined,
    previewSrc: undefined,
    width: 320,
    height: undefined,
    aspectRatio: undefined,
    objectFit: 'cover',
    controls: true,
    autoplay: false,
    loop: false,
    muted: false,
    preload: 'metadata',
    previewDisabled: false,
    showToolbar: true,
    closeOnMaskClick: true,
    title: undefined,
    alt: undefined,
  },
)

const emit = defineEmits<{
  /** Inline playback started. */
  (e: 'play'): void
  /** Inline playback paused. */
  (e: 'pause'): void
  /** Inline playback reached the end. */
  (e: 'ended'): void
  /** The video element failed to load or decode. */
  (e: 'error', event: Event): void
  /** The overlay was opened. */
  (e: 'preview'): void
  /** The overlay was closed (ESC / mask / close button / `closePreview()`). */
  (e: 'close'): void
}>()

const slots = useSlots()

defineSlots<{
  /** Replaces the poster area while there is no poster and/or the video has not started. */
  placeholder?(): unknown
  /** Replaces the centered play glyph. */
  'play-icon'?(): unknown
  /** Replaces the top-right overlay affordance; receives the open trigger. */
  toolbar?(props: { showPreview: () => void }): unknown
}>()

/* ── Layout ─────────────────────────────────────────────────────────────── */

function toCssSize(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value
}

const rootStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = { width: toCssSize(props.width) }
  if (props.height !== undefined) style.height = toCssSize(props.height)
  else if (props.aspectRatio) style.aspectRatio = props.aspectRatio
  return style
})

const videoStyle = computed<CSSProperties>(() => ({ objectFit: props.objectFit }))

/* ── State ──────────────────────────────────────────────────────────────── */
const videoRef = ref<HTMLVideoElement | null>(null)
const previewButtonRef = ref<HTMLButtonElement | null>(null)
const isPlaying = ref(false)
const loaded = ref(false)
const previewShow = ref(false)

const mergedPreviewSrc = computed(() => props.previewSrc || props.src)
const mediaLabel = computed(() => props.alt || props.title)

const isPlaceholderVisible = computed(
  () => slots.placeholder !== undefined && !isPlaying.value && (!props.poster || !loaded.value),
)

/* ── Media helpers (guarded: no media engine in happy-dom, play() may reject) ── */

/** `HTMLMediaElement.play()` may be missing (test env) or reject (autoplay policy). */
function attemptPlay(): void {
  const el = videoRef.value
  if (!el || typeof el.play !== 'function') return
  isPlaying.value = true
  const result: unknown = el.play()
  if (result && typeof (result as PromiseLike<unknown>).then === 'function') {
    void (result as Promise<unknown>).catch(() => {
      // Playback refused — fall back to the poster state.
      isPlaying.value = false
    })
  }
}

/** Pause inline playback; also exposed for manual control. */
function pause(): void {
  const el = videoRef.value
  if (!el) return
  if (typeof el.pause === 'function') el.pause()
  isPlaying.value = false
}

/** Alias exposed for manual control (mirrors the reference-free media model). */
function play(): void {
  attemptPlay()
}

function handlePlayButtonClick(): void {
  attemptPlay()
}

/** Without native controls the video body is the only play/pause affordance. */
function handleVideoClick(): void {
  if (props.controls) return
  if (isPlaying.value) pause()
  else attemptPlay()
}

function handleVideoPlay(): void {
  isPlaying.value = true
  loaded.value = true
  emit('play')
}

function handleVideoPause(): void {
  isPlaying.value = false
  emit('pause')
}

function handleVideoEnded(): void {
  isPlaying.value = false
  emit('ended')
}

function handleVideoError(event: Event): void {
  loaded.value = true
  emit('error', event)
}

function handleLoadedData(): void {
  loaded.value = true
}

/* ── Overlay ────────────────────────────────────────────────────────────── */

/** Return focus to the affordance that opened the overlay. */
function focusPreviewTrigger(): void {
  const el = previewButtonRef.value
  if (el && typeof el.focus === 'function') el.focus()
}

/** Open the overlay (also exposed for manual control, as in SnImage). */
function showPreview(): void {
  if (props.previewDisabled) return
  previewShow.value = true
  emit('preview')
}

/** Close the overlay (also exposed for manual control). */
function closePreview(): void {
  if (!previewShow.value) return
  previewShow.value = false
  emit('close')
  focusPreviewTrigger()
}

/** Overlay closed from inside (ESC / mask / close button). */
function handleOverlayClose(): void {
  previewShow.value = false
  emit('close')
  focusPreviewTrigger()
}

function handleOverlayUpdateShow(value: boolean): void {
  previewShow.value = value
}

/* ── Dispose (§41) ──────────────────────────────────────────────────────── */

onBeforeUnmount(() => {
  // The overlay owns the document keydown listener and removes it itself.
  const el = videoRef.value
  if (!el) return
  if (typeof el.pause === 'function') el.pause()
  el.removeAttribute('src')
  if (typeof el.load === 'function') el.load()
})

defineExpose({
  /** Start inline playback. */
  play,
  /** Pause inline playback. */
  pause,
  /** Open the full-screen preview overlay. */
  showPreview,
  /** Close the full-screen preview overlay. */
  closePreview,
})
</script>

<template>
  <div
    data-snui-component="video-preview"
    class="sn-video-preview"
    :class="isPlaying ? 'sn-video-preview--playing' : ''"
    :style="rootStyle"
  >
    <video
      ref="videoRef"
      class="sn-video-preview__video"
      :src="src"
      :poster="poster"
      :controls="controls"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      :preload="preload"
      :aria-label="mediaLabel || undefined"
      playsinline
      :style="videoStyle"
      @click="handleVideoClick"
      @loadeddata="handleLoadedData"
      @play="handleVideoPlay"
      @pause="handleVideoPause"
      @ended="handleVideoEnded"
      @error="handleVideoError"
    />

    <div v-if="isPlaceholderVisible" class="sn-video-preview__placeholder">
      <slot name="placeholder" />
    </div>

    <div v-if="!isPlaying" class="sn-video-preview__mask">
      <button
        type="button"
        class="sn-video-preview__play"
        aria-label="播放视频"
        @click.stop="handlePlayButtonClick"
      >
        <slot name="play-icon">
          <SnIcon :icon="Play" :size="28" />
        </slot>
      </button>
    </div>

    <div v-if="showToolbar && !previewDisabled" class="sn-video-preview__toolbar">
      <slot name="toolbar" :show-preview="showPreview">
        <button
          ref="previewButtonRef"
          type="button"
          class="sn-video-preview__toolbar-button"
          aria-label="放大预览"
          @click.stop="showPreview"
        >
          <SnIcon :icon="Maximize" />
        </button>
      </slot>
    </div>

    <SnVideoPreviewOverlay
      v-if="!previewDisabled"
      :show="previewShow"
      :src="mergedPreviewSrc"
      :poster="poster"
      :title="title"
      :close-on-mask-click="closeOnMaskClick"
      :controls="controls"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      :preload="preload"
      @update:show="handleOverlayUpdateShow"
      @close="handleOverlayClose"
    />
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-video-preview {
  position: relative;
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
  line-height: 0;
  border-radius: var(--sn-web-video-preview-radius, var(--sn-web-radius-md, 6px));
  background: var(--sn-web-video-preview-bg, var(--sn-web-color-background-surface, #000000));
}

.sn-video-preview__video {
  display: block;
  width: 100%;
  height: 100%;
  background: inherit;
}

.sn-video-preview__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  pointer-events: none;
  color: var(--sn-web-video-preview-placeholder-color, var(--sn-web-color-text-tertiary, #8a8a8a));
  background: var(--sn-web-video-preview-placeholder-bg, var(--sn-web-color-background-subtle, #f5f5f5));
  font-size: var(--sn-web-font-size-sm, 13px);
  line-height: var(--sn-web-font-line-height-normal, 1.6);
}

/* Decorative scrim: the native control bar stays clickable underneath. */
.sn-video-preview__mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  background: var(--sn-web-video-preview-mask-bg, #00000052);
}

.sn-video-preview__play {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--sn-web-video-preview-play-size, 56px);
  height: var(--sn-web-video-preview-play-size, 56px);
  padding: 0;
  border: none;
  border-radius: var(--sn-web-radius-full, 999px);
  color: var(--sn-web-video-preview-play-color, var(--sn-web-color-text-on-primary, #ffffff));
  background: var(--sn-web-video-preview-play-bg, #00000073);
  cursor: pointer;
  transition: background-color 0.18s ease-out;
}

.sn-video-preview__play:hover {
  background: var(--sn-web-video-preview-play-bg-hover, #0000009e);
}

.sn-video-preview__play:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring, #1677ff73);
  outline-offset: 2px;
}

.sn-video-preview__toolbar {
  position: absolute;
  top: var(--sn-web-spacing-8, 8px);
  right: var(--sn-web-spacing-8, 8px);
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-4, 4px);
  opacity: 0;
  line-height: 1;
  transition: opacity 0.18s ease-out;
}

.sn-video-preview:hover .sn-video-preview__toolbar,
.sn-video-preview:focus-within .sn-video-preview__toolbar {
  opacity: 1;
}

.sn-video-preview__toolbar-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--sn-web-video-preview-toolbar-button-size, 32px);
  height: var(--sn-web-video-preview-toolbar-button-size, 32px);
  padding: 0;
  border: none;
  border-radius: var(--sn-web-radius-full, 999px);
  color: var(--sn-web-video-preview-toolbar-color, var(--sn-web-color-text-on-primary, #ffffff));
  background: var(--sn-web-video-preview-toolbar-bg, #00000073);
  cursor: pointer;
  transition: background-color 0.18s ease-out;
}

.sn-video-preview__toolbar-button:hover {
  background: var(--sn-web-video-preview-toolbar-bg-hover, #0000009e);
}

.sn-video-preview__toolbar-button:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring, #1677ff73);
  outline-offset: 2px;
}
</style>