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
 * ## Control bar
 *
 * The overlay reuses `SnVideoControls.vue` — the exact same bar the inline box
 * renders — so the modal player looks identical to the inline one and there is
 * only one bar stylesheet in the package. The bar is presentational: this
 * component owns the media element and performs the guarded calls.
 *
 * `controls` = our custom bar, `nativeControls` = the UA's own `controls`
 * attribute (unstylable, inconsistent across browsers — escape hatch only).
 *
 * Documented divergences from SnImagePreview (not §112 violations):
 *   - No zoom/rotate/pan toolbar: a video has playback controls instead, so
 *     the overlay itself only offers "close".
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

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useLocale } from '../locales/use-locale';
import { X } from 'lucide-vue-next';
import SnIcon from '../icon/SnIcon.vue';
import SnVideoControls from './SnVideoControls.vue';

defineOptions({ name: 'SnVideoPreviewOverlay' });

/** Active locale (injected once at setup — inject() is setup-only). */
const locale = useLocale();

const props = withDefaults(
  defineProps<{
    /** Video url shown in the overlay. */
    src?: string | undefined;
    /** Poster shown before the overlay video starts. */
    poster?: string | undefined;
    /** Header text and accessible name of the dialog. */
    title?: string | undefined;
    /** Controlled visibility; `undefined` falls back to uncontrolled state. */
    show?: boolean | undefined;
    /** Initial visibility for uncontrolled usage. */
    defaultShow?: boolean;
    /** Close when the mask is clicked. */
    closeOnMaskClick?: boolean | undefined;
    /** Render OUR custom, beautified control bar (never the native one). */
    controls?: boolean | undefined;
    /** Render the browser's own `controls` attribute (unstylable, UA-drawn). */
    nativeControls?: boolean | undefined;
    /** Start playing as soon as the overlay mounts. */
    autoplay?: boolean | undefined;
    /** Loop the overlay video. */
    loop?: boolean | undefined;
    /** Mute the overlay video. */
    muted?: boolean | undefined;
    /** Preload strategy of the overlay video. */
    preload?: 'none' | 'metadata' | 'auto' | undefined;
  }>(),
  {
    src: undefined,
    poster: undefined,
    title: undefined,
    show: undefined,
    defaultShow: false,
    closeOnMaskClick: true,
    controls: true,
    nativeControls: false,
    autoplay: false,
    loop: false,
    muted: false,
    preload: 'metadata',
  },
);

const emit = defineEmits<{
  /** Visibility change (close via mask / Esc / close button). */
  (e: 'update:show', value: boolean): void;
  /** Overlay closed. */
  (e: 'close'): void;
}>();

/* ── Visibility (controlled / uncontrolled) ─────────────────────────────── */

const uncontrolledShow = ref(props.defaultShow);
const mergedShow = computed(() => (props.show !== undefined ? props.show : uncontrolledShow.value));

const videoRef = ref<HTMLVideoElement | null>(null);
const closeButtonRef = ref<HTMLButtonElement | null>(null);

const dialogLabel = computed(() => props.title || '视频预览');

function doUpdateShow(value: boolean): void {
  uncontrolledShow.value = value;
  emit('update:show', value);
}

function close(): void {
  if (!mergedShow.value) return;
  emit('close');
  doUpdateShow(false);
}

/* ── Playback state fed to the shared control bar ───────────────────────── */

const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const isMutedState = ref(props.muted);
const isFullscreen = ref(false);
/** Feature detection: absent in happy-dom and in some embedded WebViews. */
const canFullscreen = ref(false);

/** Autoplay is only allowed for muted media — same rule as the inline box. */
const isAutoplay = computed(() => props.autoplay);

watch(
  () => props.muted,
  (value) => {
    isMutedState.value = value;
  },
);

watch(isAutoplay, (value) => {
  if (value) isMutedState.value = true;
});

/* ── Media helpers (every call is guarded: happy-dom has no media engine) ── */

function pauseVideo(): void {
  const el = videoRef.value;
  if (el && typeof el.pause === 'function') el.pause();
  isPlaying.value = false;
}

function attemptPlay(): void {
  const el = videoRef.value;
  if (!el || typeof el.play !== 'function') return;
  isPlaying.value = true;
  const result: unknown = el.play();
  if (result && typeof (result as PromiseLike<unknown>).then === 'function') {
    void (result as Promise<unknown>).catch(() => {
      // Autoplay refused by policy — stay paused on the poster.
      isPlaying.value = false;
    });
  }
}

function togglePlay(): void {
  if (isPlaying.value) pauseVideo();
  else attemptPlay();
}

function syncMutedStateFromElement(): void {
  const el = videoRef.value;
  if (el) isMutedState.value = el.muted;
}

/** Drop the media resource so no decoder/buffer outlives the overlay (§41). */
function resetVideoSource(): void {
  const el = videoRef.value;
  if (!el) return;
  pauseVideo();
  el.removeAttribute('src');
  if (typeof el.load === 'function') el.load();
}

/* ── Bar bridge (bar → media element) ───────────────────────────────────── */

function handleBarTogglePlay(): void {
  togglePlay();
}

function handleBarToggleMute(): void {
  const el = videoRef.value;
  const next = !isMutedState.value;
  if (el) el.muted = next;
  isMutedState.value = el ? el.muted : next;
}

function handleBarSeek(time: number): void {
  const el = videoRef.value;
  if (!el) return;
  el.currentTime = time;
  currentTime.value = time;
}

/* ── Element listeners (§41: every one is removed on unmount) ───────────── */

const MEDIA_EVENTS = ['timeupdate', 'loadedmetadata', 'durationchange', 'volumechange'] as const;
const mediaListeners: Record<(typeof MEDIA_EVENTS)[number], () => void> = {
  timeupdate: () => {
    const el = videoRef.value;
    if (el) currentTime.value = el.currentTime;
  },
  loadedmetadata: () => {
    const el = videoRef.value;
    if (el) duration.value = el.duration;
  },
  durationchange: () => {
    const el = videoRef.value;
    if (el && Number.isFinite(el.duration)) duration.value = el.duration;
  },
  volumechange: () => {
    syncMutedStateFromElement();
  },
};

let listenedVideo: HTMLVideoElement | null = null;

function attachVideoListeners(): void {
  const el = videoRef.value;
  if (!el) return;
  for (const name of MEDIA_EVENTS) el.addEventListener(name, mediaListeners[name]);
  listenedVideo = el;
}

function detachVideoListeners(): void {
  const el = listenedVideo;
  if (!el) return;
  for (const name of MEDIA_EVENTS) el.removeEventListener(name, mediaListeners[name]);
  listenedVideo = null;
}

function handleVideoClick(): void {
  // The custom bar owns play/pause; the native bar owns the rest. Only a
  // chrome-less player reacts to a click on the video body.
  if (props.controls || props.nativeControls) return;
  togglePlay();
}

/* ── Fullscreen (feature-detected; owns its own document listener) ──────── */

/**
 * Feature detection for the Fullscreen API. `fullscreenElement` is probed too:
 * some environments expose a `document.exitFullscreen` function without ever
 * implementing fullscreen (happy-dom does exactly that), and offering a dead
 * button is worse than offering none.
 */
function supportsFullscreen(el: HTMLVideoElement): boolean {
  const request: unknown = (el as unknown as { requestFullscreen?: unknown }).requestFullscreen;
  const exit: unknown = (document as unknown as { exitFullscreen?: unknown }).exitFullscreen;
  return (
    typeof request === 'function' &&
    typeof exit === 'function' &&
    Object.prototype.hasOwnProperty.call(document, 'fullscreenElement')
  );
}

function isVideoFullscreen(el: HTMLVideoElement | null): boolean {
  if (!el) return false;
  return document.fullscreenElement === el;
}

function handleFullscreenChange(): void {
  isFullscreen.value = isVideoFullscreen(videoRef.value);
}

function toggleFullscreen(): void {
  const el = videoRef.value;
  if (!el || !canFullscreen.value) return;
  const doc = document as unknown as { exitFullscreen: () => Promise<void> | void };
  if (isVideoFullscreen(el)) {
    void doc.exitFullscreen();
    return;
  }
  const request = (el as unknown as { requestFullscreen: () => Promise<void> | void })
    .requestFullscreen;
  const result: unknown = request.call(el);
  if (result && typeof (result as PromiseLike<unknown>).then === 'function') {
    void (result as Promise<unknown>).catch(() => {
      // Rejected (permissions / gesture) — stay in the dialog.
    });
  }
}

/* ── Keyboard + scroll lock while shown ─────────────────────────────────── */

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') close();
}

let memoizedHtmlOverflow: string | null = null;
let isScrollLocked = false;

watch(mergedShow, (shown) => {
  if (typeof document === 'undefined') return;
  if (shown) document.addEventListener('keydown', handleKeydown);
  else document.removeEventListener('keydown', handleKeydown);

  if (shown && !isScrollLocked) {
    memoizedHtmlOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    isScrollLocked = true;
  } else if (!shown && isScrollLocked) {
    document.documentElement.style.overflow = memoizedHtmlOverflow ?? '';
    isScrollLocked = false;
  }

  if (shown) {
    // Move focus into the dialog so Esc / Tab work without a prior click.
    void nextTick(() => closeButtonRef.value?.focus());
  } else {
    pauseVideo();
  }
});

onMounted(() => {
  const el = videoRef.value;
  if (!el) return;
  canFullscreen.value = supportsFullscreen(el);
  // Autoplay+muted fallback: the attribute alone is not enough everywhere.
  if (isAutoplay.value && el.muted !== isMutedState.value) el.muted = isMutedState.value;
  if (canFullscreen.value && typeof document !== 'undefined') {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
  }
  attachVideoListeners();
});

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    if (isScrollLocked) {
      document.documentElement.style.overflow = memoizedHtmlOverflow ?? '';
      isScrollLocked = false;
    }
  }
  detachVideoListeners();
  resetVideoSource();
});

function handleMaskClick(): void {
  if (props.closeOnMaskClick) close();
}

function handleVideoPlay(): void {
  isPlaying.value = true;
  syncMutedStateFromElement();
}

function handleVideoPause(): void {
  isPlaying.value = false;
}

function handleVideoEnded(): void {
  isPlaying.value = false;
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
      <!-- Mouse-only dismissal affordance; keyboard users close via the
           labelled close button, matching the drawer mask. -->
      <div class="sn-video-preview-overlay__mask" aria-hidden="true" @click="handleMaskClick" />
      <div class="sn-video-preview-overlay__panel">
        <div class="sn-video-preview-overlay__header">
          <span v-if="title" class="sn-video-preview-overlay__title">{{ title }}</span>
          <button
            ref="closeButtonRef"
            type="button"
            class="sn-video-preview-overlay__close"
            :aria-label="locale.Common.close"
            @click="close"
          >
            <SnIcon :icon="X" />
          </button>
        </div>
        <div class="sn-video-preview-overlay__stage">
          <video
            ref="videoRef"
            class="sn-video-preview-overlay__video"
            :src="src"
            :poster="poster"
            :controls="nativeControls"
            :autoplay="isAutoplay"
            :loop="loop"
            :muted="isMutedState"
            :preload="preload"
            :aria-label="dialogLabel"
            playsinline
            webkit-playsinline
            @click="handleVideoClick"
            @play="handleVideoPlay"
            @pause="handleVideoPause"
            @ended="handleVideoEnded"
          />
          <!-- Same bar as the inline box: one implementation, one stylesheet. -->
          <div v-if="controls" class="sn-video-preview-overlay__controls">
            <SnVideoControls
              :is-playing="isPlaying"
              :current-time="currentTime"
              :duration="duration"
              :is-muted="isMutedState"
              :is-fullscreen="isFullscreen"
              :can-fullscreen="canFullscreen"
              @toggle-play="handleBarTogglePlay"
              @toggle-mute="handleBarToggleMute"
              @seek="handleBarSeek"
              @toggle-fullscreen="toggleFullscreen"
            />
          </div>
        </div>
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
  background: var(
    --sn-web-video-preview-overlay-mask,
    var(--sn-web-color-background-overlay, #000000d1)
  );
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
  color: var(
    --sn-web-video-preview-overlay-title-color,
    var(--sn-web-color-text-on-primary, #ffffff)
  );
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
  background: var(
    --sn-web-video-preview-overlay-close-bg-hover,
    var(--sn-web-color-background-elevated, #ffffff1f)
  );
}

.sn-video-preview-overlay__close:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring, #1677ff73);
  outline-offset: 2px;
}

/* Positioning context for the shared control bar. */
.sn-video-preview-overlay__stage {
  position: relative;
  display: flex;
  overflow: hidden;
  border-radius: var(--sn-web-radius-md, 6px);
  background: var(--sn-web-color-background-surface, #000000);
}

.sn-video-preview-overlay__video {
  object-fit: contain;
  display: block;
  max-width: calc(100vw - var(--sn-web-video-preview-overlay-gutter, 48px));
  max-height: calc(
    100vh - var(--sn-web-video-preview-overlay-header-height, 32px) -
      var(--sn-web-video-preview-overlay-gutter, 48px)
  );
  background: var(--sn-web-color-background-surface, #000000);
}

.sn-video-preview-overlay__controls {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(--sn-web-video-preview-controls-z-index, 1);
  line-height: 1;
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
