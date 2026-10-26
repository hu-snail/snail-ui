<script setup lang="ts">
/**
 * SnVideoControls — internal, beautified control bar for SnVideoPreview /
 * SnVideoPreviewOverlay (AUI-WEB-DD-011). Not a public component: it is only
 * mounted by those two, the same way `SnVideoPreviewOverlay.vue` is internal.
 *
 * ## Why a custom bar exists (product feedback + §112 divergence)
 *
 * The browser's native `<video controls>` can NOT be styled: its chrome is
 * drawn by the UA, differs per browser / OS / locale, ignores
 * `--sn-web-*` tokens and floats on top of the video in whatever contrast that
 * browser chose. It is also unusable in decorative contexts (banner /
 * background video) where no player UI may be visible at all. So the visible
 * player UI is this bar; the native bar stays available as an explicit escape
 * hatch via `SnVideoPreview.nativeControls`.
 *
 * ## Contract
 *
 * The bar is *presentational*: it owns no media state and never touches the
 * `<video>` element. Each affordance emits an intent, and the media owner
 * (`SnVideoPreview.vue` / `SnVideoPreviewOverlay.vue`) performs the guarded
 * media call and feeds the state back down as props. That keeps the bar free
 * of listeners/timers (§41), testable without a media engine (happy-dom has
 * neither `HTMLMediaElement.play` nor `requestFullscreen`) and identical in
 * the inline box and in the overlay — no duplicated bar CSS.
 *
 * Documented behaviours:
 *   - The play/pause glyph mirrors `isPlaying`; the label is the *action*
 *     (`播放` / `暂停`) so screen readers announce what the click will do.
 *   - The timeline is a real `<input type="range">`: keyboard accessible for
 *     free (arrows / Home / End), `aria-valuetext` announces `0:12 / 3:40`.
 *   - While the user drags, the thumb follows the pointer through local
 *     `scrubValue`; the element's own `timeupdate` (~4 Hz) would otherwise
 *     snap the thumb back on every tick. `change` releases the override.
 *   - The fullscreen button is only rendered when `canFullscreen` is true.
 *     happy-dom and older WebViews ship no Fullscreen API at all, so the bar
 *     must degrade to a 3-button layout instead of offering a dead button.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004 this is an end: web component and uses
 * `--sn-web-*` token aliases only (px units).
 */

import { computed, ref } from 'vue'
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-vue-next'
import { useLocale } from '../locales/use-locale'
import SnIcon from '../icon/SnIcon.vue'

defineOptions({ name: 'SnVideoControls' })

const props = withDefaults(
  defineProps<{
    /** Mirrors the media element's playing state. */
    isPlaying?: boolean | undefined
    /** Current playback position in seconds. */
    currentTime?: number | undefined
    /** Total duration in seconds; `0` / non-finite means "unknown yet". */
    duration?: number | undefined
    /** Whether the media element is currently muted. */
    isMuted?: boolean | undefined
    /** Whether a fullscreen element owned by the parent is active. */
    isFullscreen?: boolean | undefined
    /** Whether the Fullscreen API is available; false hides the button. */
    canFullscreen?: boolean | undefined
  }>(),
  {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isMuted: false,
    isFullscreen: false,
    canFullscreen: false,
  },
)

const emit = defineEmits<{
  /** Toggle play / pause. */
  (e: 'toggle-play'): void
  /** Toggle mute / unmute. */
  (e: 'toggle-mute'): void
  /** The user picked a new position (seconds). */
  (e: 'seek', time: number): void
  /** Toggle fullscreen. Only emitted while `canFullscreen`. */
  (e: 'toggle-fullscreen'): void
}>()

/* ── Time display ───────────────────────────────────────────────────────── */

/** `mm:ss` (minutes keep counting past 59 for long media). */
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '00:00'
  const total = Math.floor(seconds)
  const minutes = Math.floor(total / 60)
  const rest = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

const currentText = computed(() => formatTime(props.currentTime))
const totalText = computed(() => formatTime(props.duration))

/** Active locale (injected once at setup — inject() is setup-only). */
const locale = useLocale()
/** Locale namespace for control labels / aria (naive-ui i18n). */
const controlsLocale = computed(() => locale.value.VideoControls)

const playLabel = computed(() => (props.isPlaying ? controlsLocale.value.pause : controlsLocale.value.play))
const muteLabel = computed(() => (props.isMuted ? controlsLocale.value.unmute : controlsLocale.value.mute))
const fullscreenLabel = computed(() => (props.isFullscreen ? controlsLocale.value.exitFullscreen : controlsLocale.value.fullscreen))

/* ── Timeline ───────────────────────────────────────────────────────────── */

/** Local override while scrubbing; `null` means "follow `currentTime`". */
const scrubValue = ref<number | null>(null)

const maxTime = computed(() =>
  Number.isFinite(props.duration) && props.duration > 0 ? props.duration : 0,
)

const timelineValue = computed(() => {
  const raw = scrubValue.value ?? props.currentTime
  const max = maxTime.value
  if (!Number.isFinite(raw) || raw <= 0) return 0
  return max > 0 ? Math.min(raw, max) : raw
})

const timelineValueText = computed(() => `${currentText.value} / ${totalText.value}`)

/** Narrow an event target to a finite number coming from the range input. */
function readRangeValue(target: EventTarget | null): number | null {
  if (!(target instanceof HTMLInputElement)) return null
  const value = Number(target.value)
  return Number.isFinite(value) ? value : null
}

function handleTimelineInput(event: Event): void {
  const value = readRangeValue(event.target)
  if (value === null) return
  scrubValue.value = value
  emit('seek', value)
}

/** Drag / keyboard interaction finished — hand the thumb back to `currentTime`. */
function handleTimelineChange(): void {
  scrubValue.value = null
}

function handleTogglePlay(): void {
  emit('toggle-play')
}

function handleToggleMute(): void {
  emit('toggle-mute')
}

function handleToggleFullscreen(): void {
  if (!props.canFullscreen) return
  emit('toggle-fullscreen')
}
</script>

<template>
  <div data-snui-component="video-controls" class="sn-video-controls" role="toolbar" :aria-label="controlsLocale.toolbar">
    <button
      type="button"
      class="sn-video-controls__button sn-video-controls__play"
      :aria-label="playLabel"
      @click="handleTogglePlay"
    >
      <SnIcon :icon="isPlaying ? Pause : Play" :size="16" />
    </button>

    <button
      type="button"
      class="sn-video-controls__button sn-video-controls__mute"
      :aria-label="muteLabel"
      @click="handleToggleMute"
    >
      <SnIcon :icon="isMuted ? VolumeX : Volume2" :size="16" />
    </button>

    <span class="sn-video-controls__time" aria-hidden="true">{{ currentText }}</span>

    <input
      :aria-label="controlsLocale.timeline"
      class="sn-video-controls__timeline"
      type="range"
      min="0"
      :max="maxTime"
      step="0.1"
      :value="timelineValue"
      :aria-valuetext="timelineValueText"
      @input="handleTimelineInput"
      @change="handleTimelineChange"
    />

    <span class="sn-video-controls__time" aria-hidden="true">{{ totalText }}</span>

    <button
      v-if="canFullscreen"
      type="button"
      class="sn-video-controls__button sn-video-controls__fullscreen"
      :aria-label="fullscreenLabel"
      @click="handleToggleFullscreen"
    >
      <SnIcon :icon="isFullscreen ? Minimize : Maximize" :size="16" />
    </button>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-video-controls {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-8, 8px);
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-web-video-controls-padding-y, 6px)
    var(--sn-web-video-controls-padding-x, 8px);
  color: var(--sn-web-video-controls-color, var(--sn-web-color-text-on-primary, #ffffff));
  /* 8-digit hex: `rgba()` is rejected by token-check even inside a fallback. */
  background: var(--sn-web-video-controls-bg, #000000a6);
  font-size: var(--sn-web-font-size-sm, 13px);
  line-height: var(--sn-web-font-line-height-normal, 1.6);
}

.sn-video-controls__button {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: var(--sn-web-video-controls-button-size, 28px);
  height: var(--sn-web-video-controls-button-size, 28px);
  padding: 0;
  border: none;
  border-radius: var(--sn-web-radius-full, 999px);
  color: inherit;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.18s ease-out;
}

.sn-video-controls__button:hover {
  background: var(--sn-web-video-controls-button-bg-hover, #ffffff29);
}

.sn-video-controls__button:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring, #1677ff73);
  outline-offset: 2px;
}

.sn-video-controls__time {
  flex: none;
  min-width: var(--sn-web-video-controls-time-width, 40px);
  text-align: center;
  font-variant-numeric: tabular-nums;
  opacity: var(--sn-web-video-controls-time-opacity, 0.86);
}

.sn-video-controls__timeline {
  -webkit-appearance: none;
  appearance: none;
  flex: 1 1 auto;
  min-width: 0;
  height: var(--sn-web-video-controls-timeline-height, 4px);
  margin: 0;
  border: none;
  border-radius: var(--sn-web-radius-full, 999px);
  background: var(--sn-web-video-controls-timeline-bg, #ffffff45);
  cursor: pointer;
}

.sn-video-controls__timeline::-webkit-slider-runnable-track {
  height: var(--sn-web-video-controls-timeline-height, 4px);
  border-radius: var(--sn-web-radius-full, 999px);
  background: var(--sn-web-video-controls-timeline-bg, #ffffff45);
}

.sn-video-controls__timeline::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: var(--sn-web-video-controls-thumb-size, 12px);
  height: var(--sn-web-video-controls-thumb-size, 12px);
  margin-top: calc(var(--sn-web-video-controls-thumb-size, 12px) / -2 + 2px);
  border: none;
  border-radius: var(--sn-web-radius-full, 999px);
  background: var(--sn-web-video-controls-thumb-bg, var(--sn-web-color-action-primary, #1677ff));
}

.sn-video-controls__timeline::-moz-range-track {
  height: var(--sn-web-video-controls-timeline-height, 4px);
  border-radius: var(--sn-web-radius-full, 999px);
  background: var(--sn-web-video-controls-timeline-bg, #ffffff45);
}

.sn-video-controls__timeline::-moz-range-thumb {
  width: var(--sn-web-video-controls-thumb-size, 12px);
  height: var(--sn-web-video-controls-thumb-size, 12px);
  border: none;
  border-radius: var(--sn-web-radius-full, 999px);
  background: var(--sn-web-video-controls-thumb-bg, var(--sn-web-color-action-primary, #1677ff));
}

.sn-video-controls__timeline:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring, #1677ff73);
  outline-offset: 2px;
}
</style>