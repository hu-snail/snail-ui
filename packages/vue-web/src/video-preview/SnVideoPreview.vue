<script setup lang="ts">
/**
 * SnVideoPreview — web-end video thumbnail with a custom player bar, a
 * decorative "background video" mode and a full-screen preview overlay
 * (AUI-WEB-DD-011).
 *
 * Reference library: **NONE**. naive-ui has no video component (verified
 * against naive-ui `src/components.ts`), so per AGENTS.md §112 this is an
 * *explicit divergence* from the "mirror the reference 1:1" rule rather than
 * an accidental gap: the API is aligned with this repo's own `SnImage`
 * preview model instead — a media box that opens a full-screen overlay
 * (`SnVideoPreviewOverlay.vue`), with `previewDisabled` / `showToolbar` /
 * `showPreview()` mirroring SnImage.
 *
 * ## Why the native controls are never used by default (product feedback)
 *
 * `<video controls>` is unstylable UA chrome: it differs per browser / OS,
 * ignores every `--sn-web-*` token and cannot be hidden in decorative
 * contexts. So the visible player UI is always the custom, token-styled
 * `SnVideoControls.vue` bar. `nativeControls` exists as an explicit escape
 * hatch; `background` exists for banner / section-background video where no
 * player UI may be visible at all.
 *
 * Semantics:
 *   - The box renders a `<video>` with `src` + `poster`. While it is not
 *     playing a centered play button sits on a scrim over the poster.
 *   - Clicking the play button starts inline playback (`video.play()`). With
 *     `controls` the custom bar (play/pause, mute, timeline, time,
 *     fullscreen) drives the rest. Any `pause` / `ended` returns the box to
 *     the poster state. Without `controls`, clicking the video toggles
 *     play/pause.
 *   - A separate "expand" affordance — a toolbar button in the top-right of
 *     the box, revealed on hover / focus-within — opens the overlay; the same
 *     is available imperatively through the exposed `showPreview()` method.
 *   - `background` turns the box into a decorative banner: controls off,
 *     `muted` + `autoplay` + `loop` forced on, `objectFit: 'cover'`, the box
 *     fills its (positioned) parent and the video is `aria-hidden` +
 *     `pointer-events: none`.
 *
 * ## Compatibility notes (documented in the docs pages too)
 *   - Autoplay is only allowed for muted media by every modern browser, so
 *     `autoplay` without `muted` (or `background`) is best-effort: the
 *     `muted` *attribute* is not forced, but a rejected `play()` promise
 *     silently falls back to the poster state.
 *   - iOS Safari requires `playsinline` (and legacy `webkit-playsinline`) or a
 *     playing video hijacks the screen into the native fullscreen player —
 *     both attributes are always rendered, there is no prop for them.
 *   - `nativeControls` renders the UA bar, which cannot be styled or made
 *     consistent across browsers / OSes. Use it only when the OS player
 *     (subtitle picker, PiP, volume) matters more than visual consistency.
 *   - The fullscreen affordance is feature-detected: without
 *     `requestFullscreen` / `document.exitFullscreen` the button is not
 *     rendered at all (see `canFullscreen`).
 *
 * Documented divergences (not §112 violations):
 *   - `alt` mirrors SnImage's `alt` and is the `<video>` accessible name; it
 *     wins over `title` when both are set, `title` being the overlay header
 *     text first and an accessible-name fallback second.
 *   - The scrim is decorative (`pointer-events: none`) so the custom control
 *     bar stays clickable underneath it; only the play button and the toolbar
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
 *   <section style="position: relative">
 *     <SnVideoPreview src="/banner.mp4" background />
 *   </section>
 */

import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue';
import { useLocale } from '../locales/use-locale';
import type { CSSProperties } from 'vue';
import { Maximize, Play } from 'lucide-vue-next';
import SnIcon from '../icon/SnIcon.vue';
import SnVideoControls from './SnVideoControls.vue';
import SnVideoPreviewOverlay from './SnVideoPreviewOverlay.vue';

defineOptions({ name: 'SnVideoPreview' });

/** Active locale (injected once at setup — inject() is setup-only). */
const locale = useLocale();

const props = withDefaults(
  defineProps<{
    /** Video source. Required. */
    src: string;
    /** Poster shown before playback starts. Ignored while `background`. */
    poster?: string | undefined;
    /** Dedicated (larger) overlay url; falls back to `src`. */
    previewSrc?: string | undefined;
    /** Box width (number → px). Ignored while `background` (fills the parent). */
    width?: string | number;
    /** Box height (number → px). Explicit `undefined` keeps the ratio. */
    height?: string | number | undefined;
    /** Box aspect ratio applied when no explicit `height` is given, e.g. `'16 / 9'`. */
    aspectRatio?: string | undefined;
    /** How the video fits its box. Forced to `'cover'` while `background`. */
    objectFit?: 'contain' | 'cover' | 'fill';
    /** Render OUR custom, beautified control bar (never the native one). */
    controls?: boolean;
    /** Render the browser's own `controls` attribute (unstylable, UA-drawn). */
    nativeControls?: boolean;
    /**
     * Decorative banner / section-background mode: no controls at all, forced
     * `muted` + `autoplay` + `loop` + `cover`, fills the positioned parent and
     * the video is `aria-hidden` + `pointer-events: none`.
     */
    background?: boolean;
    /** Start inline playback on mount (browsers require `muted` for this). */
    autoplay?: boolean;
    /** Loop inline playback. */
    loop?: boolean;
    /** Mute inline playback. */
    muted?: boolean;
    /** Preload strategy. */
    preload?: 'none' | 'metadata' | 'auto';
    /** Disable the overlay: no toolbar affordance, `showPreview()` is a no-op. */
    previewDisabled?: boolean;
    /** Render the top-right overlay affordance. */
    showToolbar?: boolean;
    /** Close the overlay when its mask is clicked. */
    closeOnMaskClick?: boolean;
    /** Overlay header text, and the accessible name of the video. */
    title?: string | undefined;
    /** Accessible description of the video; takes precedence over `title`. */
    alt?: string | undefined;
  }>(),
  {
    poster: undefined,
    previewSrc: undefined,
    width: 320,
    height: undefined,
    aspectRatio: undefined,
    objectFit: 'cover',
    controls: true,
    nativeControls: false,
    background: false,
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
);

const emit = defineEmits<{
  /** Inline playback started. */
  (e: 'play'): void;
  /** Inline playback paused. */
  (e: 'pause'): void;
  /** Inline playback reached the end. */
  (e: 'ended'): void;
  /** The video element failed to load or decode. */
  (e: 'error', event: Event): void;
  /** The overlay was opened. */
  (e: 'preview'): void;
  /** The overlay was closed (ESC / mask / close button / `closePreview()`). */
  (e: 'close'): void;
}>();

const slots = useSlots();

defineSlots<{
  /** Replaces the poster area while there is no poster and/or the video has not started. */
  placeholder?(): unknown;
  /** Replaces the centered play glyph. */
  'play-icon'?(): unknown;
  /** Replaces the top-right overlay affordance; receives the open trigger. */
  toolbar?(props: { showPreview: () => void }): unknown;
}>();

/* ── Effective media flags (background mode overrides the props) ─────────── */

/** A decorative banner never shows player chrome — from either source. */
const hasControls = computed(() => !props.background && props.controls);
const hasNativeControls = computed(() => !props.background && props.nativeControls);
const isAutoplay = computed(() => props.background || props.autoplay);
const isLoop = computed(() => props.background || props.loop);
/** Forced on for `background` and for `autoplay`: browsers only autoplay muted. */
const isMuted = computed(() => props.background || props.muted || props.autoplay);
const effectiveObjectFit = computed(() => (props.background ? 'cover' : props.objectFit));

/** `aria-hidden` drops the video for AT; a scrim would only cover a banner. */
const isPosterVisible = computed(() => !props.background && props.poster !== undefined);
const isPreviewAvailable = computed(() => !props.background && !props.previewDisabled);

/* ── Layout ─────────────────────────────────────────────────────────────── */

function toCssSize(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * Zero-inset longhands for the decorative background layer. The `inset`
 * shorthand is avoided on purpose: the CSSOM is not required to support
 * shorthands (happy-dom's drops it), so the four longhands are the portable
 * way to write `inset: 0` from JS.
 */
const ROOT_INSET_STYLE: CSSProperties = { top: '0', right: '0', bottom: '0', left: '0' };

const rootStyle = computed<CSSProperties>(() => {
  // `background` drops into a positioned hero section: it fills that parent and
  // paints behind the hero's own content without any wrapper markup.
  if (props.background) {
    return { position: 'absolute', ...ROOT_INSET_STYLE, zIndex: 0 };
  }
  const style: CSSProperties = { width: toCssSize(props.width) };
  if (props.height !== undefined) style.height = toCssSize(props.height);
  else if (props.aspectRatio) style.aspectRatio = props.aspectRatio;
  return style;
});

const videoStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = { objectFit: effectiveObjectFit.value };
  if (props.background) style.pointerEvents = 'none';
  return style;
});

/* ── State ──────────────────────────────────────────────────────────────── */

const videoRef = ref<HTMLVideoElement | null>(null);
const previewButtonRef = ref<HTMLButtonElement | null>(null);
const isPlaying = ref(false);
const loaded = ref(false);
const previewShow = ref(false);

/* Custom control bar state (fed by the media element's own events). */
const currentTime = ref(0);
const duration = ref(0);
const isMutedState = ref(props.muted);
const isFullscreen = ref(false);
/** Feature detection: absent in happy-dom and in some embedded WebViews. */
const canFullscreen = ref(false);

const mergedPreviewSrc = computed(() => props.previewSrc || props.src);
const mediaLabel = computed(() => props.alt || props.title);

const isPlaceholderVisible = computed(
  () =>
    slots.placeholder !== undefined &&
    !props.background &&
    !isPlaying.value &&
    (!props.poster || !loaded.value),
);

/** Mirror `props.muted` into local state so the bar reflects prop updates. */
watch(
  () => props.muted,
  (value) => {
    if (!isMuted.value) isMutedState.value = value;
  },
);

watch(isMuted, (value) => {
  if (value) isMutedState.value = true;
});

/* ── Media helpers (guarded: no media engine in happy-dom, play() may reject) ── */

/** `HTMLMediaElement.play()` may be missing (test env) or reject (autoplay policy). */
function attemptPlay(): void {
  const el = videoRef.value;
  if (!el || typeof el.play !== 'function') return;
  isPlaying.value = true;
  const result: unknown = el.play();
  if (result && typeof (result as PromiseLike<unknown>).then === 'function') {
    void (result as Promise<unknown>).catch(() => {
      // Playback refused — fall back to the poster state.
      isPlaying.value = false;
    });
  }
}

/** Pause inline playback; also exposed for manual control. */
function pause(): void {
  const el = videoRef.value;
  if (!el) return;
  if (typeof el.pause === 'function') el.pause();
  isPlaying.value = false;
}

/** Start inline playback; also exposed for manual control. */
function play(): void {
  attemptPlay();
}

function togglePlay(): void {
  if (isPlaying.value) pause();
  else attemptPlay();
}

/**
 * Write `muted` on the *element* too: the property is what playback policy
 * checks, and a reset/buffering reload would otherwise resurrect the attribute
 * default (no audio at all in `background` mode).
 */
function syncMuted(): void {
  const el = videoRef.value;
  if (!el) return;
  if (el.muted !== isMuted.value) el.muted = isMuted.value;
  isMutedState.value = el.muted;
}

/**
 * Read `muted` back from the element: the UA can change it on its own (it
 * force-mutes some autoplay attempts and fires `volumechange`), so the bar
 * must mirror the element rather than the prop.
 */
function syncMutedStateFromElement(): void {
  const el = videoRef.value;
  if (el) isMutedState.value = el.muted;
}

/**
 * Space the native control bar would have taken: the custom bar is its own
 * click target, so the video body only toggles playback when there is no
 * player chrome at all.
 */
function handleVideoClick(): void {
  if (hasControls.value || hasNativeControls.value) return;
  togglePlay();
}

function handlePlayButtonClick(): void {
  attemptPlay();
}

function handleVideoPlay(): void {
  isPlaying.value = true;
  loaded.value = true;
  // Mirror what the element actually does (it fires `play` on autoplay too).
  syncMutedStateFromElement();
  emit('play');
}

function handleVideoPause(): void {
  isPlaying.value = false;
  emit('pause');
}

function handleVideoEnded(): void {
  isPlaying.value = false;
  emit('ended');
}

function handleVideoError(event: Event): void {
  loaded.value = true;
  emit('error', event);
}

function handleLoadedData(): void {
  loaded.value = true;
}

/* ── Custom bar bridge (bar → media element) ────────────────────────────── */

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

function handleTimeUpdate(): void {
  const el = videoRef.value;
  if (el) currentTime.value = el.currentTime;
}

function handleLoadedMetadata(): void {
  const el = videoRef.value;
  if (el) duration.value = el.duration;
}

function handleDurationChange(): void {
  const el = videoRef.value;
  if (el && Number.isFinite(el.duration)) duration.value = el.duration;
}

function handleVolumeChange(): void {
  syncMutedStateFromElement();
}

const mediaListeners: Record<(typeof MEDIA_EVENTS)[number], () => void> = {
  timeupdate: handleTimeUpdate,
  loadedmetadata: handleLoadedMetadata,
  durationchange: handleDurationChange,
  volumechange: handleVolumeChange,
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
      // Rejected (permissions / gesture) — stay inline, no UI state change.
    });
  }
}

onMounted(() => {
  const el = videoRef.value;
  if (el) {
    canFullscreen.value = supportsFullscreen(el);
    // Autoplay+muted fallback: the attribute alone is not enough everywhere.
    if (isAutoplay.value) syncMuted();
  }
  if (canFullscreen.value && typeof document !== 'undefined') {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
  }
  attachVideoListeners();
});

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }
  detachVideoListeners();
  // The overlay owns its own listeners and removes them on its own unmount.
  const el = videoRef.value;
  if (!el) return;
  if (typeof el.pause === 'function') el.pause();
  el.removeAttribute('src');
  if (typeof el.load === 'function') el.load();
});

/* ── Overlay ────────────────────────────────────────────────────────────── */

/** Return focus to the affordance that opened the overlay. */
function focusPreviewTrigger(): void {
  const el = previewButtonRef.value;
  if (el && typeof el.focus === 'function') el.focus();
}

/** Open the overlay (also exposed for manual control, as in SnImage). */
function showPreview(): void {
  if (props.previewDisabled || props.background) return;
  previewShow.value = true;
  emit('preview');
}

/** Close the overlay (also exposed for manual control). */
function closePreview(): void {
  if (!previewShow.value) return;
  previewShow.value = false;
  emit('close');
  focusPreviewTrigger();
}

/** Overlay closed from inside (ESC / mask / close button). */
function handleOverlayClose(): void {
  previewShow.value = false;
  emit('close');
  focusPreviewTrigger();
}

function handleOverlayUpdateShow(value: boolean): void {
  previewShow.value = value;
}

defineExpose({
  /** Start inline playback. */
  play,
  /** Pause inline playback. */
  pause,
  /** Open the full-screen preview overlay. */
  showPreview,
  /** Close the full-screen preview overlay. */
  closePreview,
});
</script>

<template>
  <div
    data-snui-component="video-preview"
    class="sn-video-preview"
    :class="{
      'sn-video-preview--playing': isPlaying,
      'sn-video-preview--background': background,
    }"
    :style="rootStyle"
  >
    <video
      ref="videoRef"
      class="sn-video-preview__video"
      :class="hasNativeControls ? 'sn-video-preview__video--native' : ''"
      :src="src"
      :poster="isPosterVisible ? poster : undefined"
      :controls="hasNativeControls"
      :autoplay="isAutoplay"
      :loop="isLoop"
      :muted="isMuted"
      :preload="preload"
      :aria-label="background ? undefined : mediaLabel || undefined"
      :aria-hidden="background ? 'true' : undefined"
      playsinline
      webkit-playsinline
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

    <div v-if="!isPlaying && !background" class="sn-video-preview__mask">
      <button
        type="button"
        class="sn-video-preview__play"
        :aria-label="locale.VideoControls.playVideo"
        @click.stop="handlePlayButtonClick"
      >
        <slot name="play-icon">
          <SnIcon :icon="Play" :size="28" />
        </slot>
      </button>
    </div>

    <div v-if="showToolbar && isPreviewAvailable" class="sn-video-preview__toolbar">
      <slot name="toolbar" :show-preview="showPreview">
        <button
          ref="previewButtonRef"
          type="button"
          class="sn-video-preview__toolbar-button"
          :aria-label="locale.VideoControls.zoomIn"
          @click.stop="showPreview"
        >
          <SnIcon :icon="Maximize" />
        </button>
      </slot>
    </div>

    <!-- Shared bar with the overlay: one implementation, one stylesheet. -->
    <div v-if="hasControls" class="sn-video-preview__controls">
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

    <SnVideoPreviewOverlay
      v-if="isPreviewAvailable"
      :show="previewShow"
      :src="mergedPreviewSrc"
      :poster="poster"
      :title="title"
      :close-on-mask-click="closeOnMaskClick"
      :controls="controls"
      :native-controls="nativeControls"
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

/* Banner / section-background mode: the box IS the parent's background layer,
 * so it must not be sized by `width`/`height` and must not clip its corners. */
.sn-video-preview--background {
  display: block;
  border-radius: 0;
  background: transparent;
}

.sn-video-preview__video {
  display: block;
  width: 100%;
  height: 100%;
  background: inherit;
}

/* The UA bar reserves its own vertical space; leave the box alone for it. */
.sn-video-preview__video--native {
  object-fit: contain;
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
  background: var(
    --sn-web-video-preview-placeholder-bg,
    var(--sn-web-color-background-subtle, #f5f5f5)
  );
  font-size: var(--sn-web-font-size-sm, 13px);
  line-height: var(--sn-web-font-line-height-normal, 1.6);
}

/* Decorative scrim: the custom control bar stays clickable underneath. */
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

/* The custom bar sits at the bottom edge of the box, like a native one would —
 * but it is ours: tokenised, themeable and identical in every browser. */
.sn-video-preview__controls {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(--sn-web-video-preview-controls-z-index, 1);
  line-height: 1;
}
</style>
