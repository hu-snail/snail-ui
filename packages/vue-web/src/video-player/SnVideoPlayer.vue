<script setup lang="ts">
/**
 * SnVideoPlayer — web-end full video player (AUI-additive, web only).
 *
 * Reference library: **NONE**. naive-ui ships no video player, so per
 * AGENTS.md §112 this is a registered AUI-additive capability (§112.3a):
 * the feature set is benchmarked against mainstream video players
 * (B 站 / 西瓜播放器) — danmaku, picture-in-picture, mini floating window,
 * quality switching, download, playback-rate / loop settings, live mode —
 * while the API follows this repo's conventions (controlled/uncontrolled
 * pair, `update:*` events, `--sn-web-*` tokens).
 *
 * ## Streaming-format plugin boundary (no library dependency)
 *
 * The player ships **no** HLS/DASH/FLV code. `sourceBridge` is a plain
 * function the host provides; on every source change the player hands it
 * the `<video>` element + source and the bridge loads media with its own
 * library (typically `hls.js`, installed by the host app — see the docs
 * guide for a copy-paste bridge). Returning a falsy value declines and the
 * player falls back to native playback (Safari's built-in HLS). The bridge
 * reports qualities / liveness / errors back through the context object.
 *
 * ## Danmaku
 *
 * Rendered on ONE canvas by `DanmakuEngine` (see `use-danmaku.ts`): a
 * time-anchored scheduler drives equal-speed lanes, so seeking is exact and
 * hundreds of concurrent bullets cost a single rAF loop. `sendDanmu()` /
 * the input box produce ephemeral "self" danmus (highlighted, not replayed
 * after a seek back).
 *
 * ## Media behaviour notes
 *
 *   - Autoplay requires `muted` in every modern browser; a rejected
 *     `play()` surfaces the error panel rather than throwing.
 *   - `playsinline` (+ legacy `webkit-playsinline`) is always rendered —
 *     inline playback on iOS Safari must never hijack the screen.
 *   - Live mode is detected via `duration === Infinity` or reported by the
 *     bridge; the progress bar and time display hide, a LIVE badge shows.
 *   - Every media call is feature-guarded: PiP / fullscreen buttons are not
 *     rendered when the platform lacks them.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnVideoPlayer src="/clip.mp4" title="宣传片" />
 *   <SnVideoPlayer :qualities="ladder" v-model:quality="'1080p'" />
 *   <SnVideoPlayer :danmus="list" danmu-send />
 *   <SnVideoPlayer :source-bridge="hlsBridge" :src="liveUrl" />
 */

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';
import { useLocale } from '../locales/use-locale';
import SnIcon from '../icon/SnIcon.vue';
import {
  Download,
  Maximize,
  MessageSquare,
  Minimize,
  Minimize2,
  Pause,
  PictureInPicture2,
  Play,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX,
  X,
} from 'lucide-vue-next';
import type { IconComponent } from '../icon/sn-icon-registry';
import { DanmakuEngine } from './use-danmaku';
import { useMiniWindow } from './use-mini-window';
import { isEditableTarget, resolveVideoShortcut } from './video-shortcuts';
import type {
  SnBridgeQuality,
  SnBridgeSource,
  SnDanmuType,
  SnVideoDanmu,
  SnVideoQuality,
  SnVideoSourceBridge,
} from './video-player-types';
import { VIDEO_RATE_OPTIONS } from './video-player-types';

defineOptions({ name: 'SnVideoPlayer' });

const props = withDefaults(
  defineProps<{
    /** Media URL (plain mode). Ignored while a bridge owns loading. */
    src?: string;
    /** Poster shown before the first frame. */
    poster?: string;
    /** Accessible name for the video; also the mini-window header text. */
    title?: string;
    /** Progressive quality ladder (MP4/WebM). */
    qualities?: SnVideoQuality[];
    /** Initially selected ladder entry (`qualities[].value`). */
    defaultQuality?: string | number;
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    preload?: 'none' | 'metadata' | 'auto';
    /** 0–1, applied on mount. */
    volume?: number;
    /** Initial playback rate. */
    rate?: number;
    /** Force live mode; `undefined` sniffs `duration === Infinity` / bridge. */
    live?: boolean;
    /** Keyboard shortcuts (Space/K, ←→, ↑↓, M, F, P, D). */
    shortcuts?: boolean;
    /** Danmaku timeline. */
    danmus?: SnVideoDanmu[];
    /** Show the danmu layer. */
    danmuVisible?: boolean;
    /** Show the danmu input box. */
    danmuSend?: boolean;
    /** 0–1. */
    danmuOpacity?: number;
    /** Velocity multiplier. */
    danmuSpeed?: number;
    /** Base font size in px (scales with player width). */
    danmuFontSize?: number;
    /** Fraction of the height usable for danmu lanes (0–1). */
    danmuArea?: number;
    /** Mini floating window (controlled). `undefined` → uncontrolled. */
    mini?: boolean;
    /** Auto-dock into the mini window when scrolled out of view. */
    miniOnScrollOut?: boolean;
    /** Docked window width in px. */
    miniWidth?: number;
    /** Picture-in-picture toggle (button only renders when supported). */
    pip?: boolean;
    /** Download button (hidden for live / bridge-owned media). */
    download?: boolean;
    /** Settings menu (quality / rate / loop). */
    settings?: boolean;
    /**
     * Third-party streaming bridge (HLS / DASH / FLV) — installed by the
     * host app, never bundled with the library. See the docs guide.
     */
    sourceBridge?: SnVideoSourceBridge;
    /** Player width (number → px). */
    width?: string | number;
    /** Player aspect ratio. */
    aspectRatio?: string;
    /** Custom download handler; return a URL to open instead of the source. */
    onDownload?: (source: SnBridgeSource) => void | string | Promise<string>;
  }>(),
  {
    src: undefined as unknown as string,
    poster: undefined as unknown as string,
    title: undefined as unknown as string,
    qualities: () => [],
    defaultQuality: undefined as unknown as string | number,
    autoplay: false,
    muted: false,
    loop: false,
    preload: 'metadata',
    volume: 1,
    rate: 1,
    live: undefined as unknown as boolean,
    shortcuts: true,
    danmus: () => [],
    danmuVisible: true,
    danmuSend: true,
    danmuOpacity: 1,
    danmuSpeed: 1,
    danmuFontSize: 16,
    danmuArea: 0.75,
    mini: undefined as unknown as boolean,
    miniOnScrollOut: false,
    miniWidth: 320,
    pip: true,
    download: true,
    settings: true,
    sourceBridge: undefined as unknown as SnVideoSourceBridge,
    width: undefined as unknown as string | number,
    aspectRatio: '16 / 9',
    onDownload: undefined as unknown as (source: SnBridgeSource) => void | string | Promise<string>,
  },
);

const emit = defineEmits<{
  (e: 'play'): void;
  (e: 'pause'): void;
  (e: 'ended'): void;
  (e: 'timeupdate', currentTime: number): void;
  (e: 'seeked', currentTime: number): void;
  (e: 'waiting'): void;
  (e: 'canplay'): void;
  (e: 'error', detail: unknown): void;
  (e: 'ready'): void;
  (e: 'rate-change', rate: number): void;
  (e: 'volume-change', detail: { volume: number; muted: boolean }): void;
  (e: 'fullscreen-change', active: boolean): void;
  (e: 'pip-change', active: boolean): void;
  (e: 'update:mini', active: boolean): void;
  (e: 'mini-change', active: boolean): void;
  (e: 'quality-change', detail: { id: string | number; label?: string }): void;
  (e: 'danmu-send', danmu: SnVideoDanmu): void;
  (e: 'download', source: SnBridgeSource): void;
}>();

const slots = defineSlots<{
  /** Replaces the error panel content. */
  error?(): unknown;
}>();

/** Active locale (injected once at setup — inject() is setup-only). */
const locale = useLocale();

/* ────────────────────────── client lifecycle ────────────────────────── */

const isClient = ref(false);
onMounted(() => {
  isClient.value = true;
});

/* ────────────────────────── media state ────────────────────────── */

const rootRef = ref<HTMLElement | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);

const playing = ref(false);
const waiting = ref(false);
const ready = ref(false);
const duration = ref(0);
const currentTime = ref(0);
const bufferedRatio = ref(0);
const volumeRef = ref(clamp01(props.volume));
const mutedRef = ref(props.muted);
const rateRef = ref(props.rate > 0 ? props.rate : 1);
const loopRef = ref(props.loop);
const errorMsg = ref('');

function clamp01(v: number): number {
  if (typeof v !== 'number' || Number.isNaN(v)) return 1;
  return Math.min(1, Math.max(0, v));
}

function fmtTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number): string => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/* ────────────────────────── source + bridge ────────────────────────── */

const activeQualityId = ref<string | number | undefined>(props.defaultQuality ?? props.qualities[0]?.value);
const bridgeQualities = ref<SnBridgeQuality[]>([]);
const bridgeIsLive = ref<boolean | null>(null);
const sniffedLive = ref(false);
/** Bridge reported that it owns this source (skip native src assignment). */
const bridgeOwned = ref(false);

watch(
  () => props.qualities,
  (list) => {
    if (list.some((q) => q.value === activeQualityId.value)) return;
    activeQualityId.value = list[0]?.value;
  },
);

const activeQuality = computed<SnVideoQuality | undefined>(() =>
  props.qualities.find((q) => q.value === activeQualityId.value),
);

/** Quality menu entries: bridge-reported levels win over the prop ladder. */
const qualityMenu = computed<Array<{ id: string | number; label: string }>>(() => {
  if (bridgeQualities.value.length > 0) {
    return bridgeQualities.value.map((q) => ({ id: q.id, label: q.label }));
  }
  return props.qualities.map((q) => ({ id: q.value, label: q.label }));
});

const hasQualityMenu = computed(() => qualityMenu.value.length > 1);

/** The source object handed to the bridge / native element. Built with
 * explicit assignment — under `exactOptionalPropertyTypes` a spread of
 * optional fields would widen `type?: string` to `string | undefined`. */
const activeSource = computed<SnBridgeSource>(() => {
  const quality = activeQuality.value;
  if (quality) {
    const source: SnBridgeSource = { src: quality.src };
    if (quality.type !== undefined) source.type = quality.type;
    source.value = quality.value;
    source.label = quality.label;
    return source;
  }
  return { src: props.src ?? '' };
});

const isLive = computed(() => {
  if (props.live !== undefined) return props.live;
  if (bridgeIsLive.value !== null) return bridgeIsLive.value;
  return sniffedLive.value;
});

/** Time to restore after a ladder switch (undefined → no restore). */
let pendingRestoreTime: number | undefined;

function handleBridgeQualities(list: SnBridgeQuality[]): void {
  bridgeQualities.value = Array.isArray(list) ? list : [];
}

function handleBridgeLive(live: boolean): void {
  bridgeIsLive.value = live === true;
}

function handleBridgeError(err: unknown): void {
  errorMsg.value = locale.value.VideoPlayer.errorHint;
  emit('error', err);
}

let bridgeHandle: ReturnType<NonNullable<SnVideoSourceBridge>> | null = null;

function teardownBridge(): void {
  bridgeHandle?.destroy();
  bridgeHandle = null;
  bridgeOwned.value = false;
  bridgeQualities.value = [];
  bridgeIsLive.value = null;
}

function applySource(): void {
  const video = videoRef.value;
  if (!video) return;
  const source = activeSource.value;
  if (!source.src) return;

  const switchingLadder = activeQuality.value !== undefined;
  pendingRestoreTime = switchingLadder ? video.currentTime : undefined;

  teardownBridge();
  errorMsg.value = '';

  if (props.sourceBridge) {
    const handle = props.sourceBridge({
      video,
      source,
      setQualities: handleBridgeQualities,
      setIsLive: handleBridgeLive,
      reportError: handleBridgeError,
    });
    if (handle) {
      bridgeOwned.value = true;
      bridgeHandle = handle;
      return;
    }
  }

  // Native fallback (also the whole path without a bridge).
  if (video.getAttribute('src') !== source.src) {
    video.src = source.src;
    video.load();
  }
}

/** Set while a bridge-managed quality switch is in flight so the source
 * watcher does not tear down and re-create the bridge for it. */
let bridgeQualitySwitching = false;

watch(
  [activeSource, () => props.sourceBridge],
  () => {
    if (!isClient.value) return;
    if (bridgeQualitySwitching) {
      bridgeQualitySwitching = false;
      return;
    }
    void nextTick(applySource);
  },
  { immediate: false },
);

onMounted(() => {
  void nextTick(applySource);
  const video = videoRef.value;
  if (video) {
    video.volume = volumeRef.value;
    video.muted = mutedRef.value;
    video.playbackRate = rateRef.value;
    video.loop = loopRef.value;
  }
});

onBeforeUnmount(teardownBridge);

function selectQuality(id: string | number): void {
  const entry = qualityMenu.value.find((q) => q.id === id);
  if (!entry) return;
  if (bridgeHandle?.selectQuality) {
    // Bridge-owned media: forward the level switch; the bridge keeps the
    // element fed, so the source watcher must not re-run applySource.
    bridgeQualitySwitching = true;
    bridgeHandle.selectQuality(id);
    activeQualityId.value = id;
    emit('quality-change', { id, label: entry.label });
    return;
  }
  if (activeQualityId.value === id) return;
  activeQualityId.value = id;
  emit('quality-change', { id, label: entry.label });
}

/** Re-run applySource after a native failure (retry button). */
function retry(): void {
  errorMsg.value = '';
  waiting.value = true;
  if (bridgeOwned.value) {
    applySource();
    return;
  }
  const video = videoRef.value;
  if (!video) return;
  video.load();
  void video.play().catch(() => {
    /* autoplay policy — user can press play */
  });
}

/* ────────────────────────── media events ────────────────────────── */

/** Spec live signal: `Infinity`. NaN (metadata not loaded yet — happy-dom
 * fires `durationchange` on `load()`) must NOT read as live. */
function sniffLive(video: HTMLVideoElement): void {
  sniffedLive.value = video.duration === Infinity;
  duration.value = Number.isFinite(video.duration) ? video.duration : 0;
}

function onLoadedMetadata(): void {
  const video = videoRef.value;
  if (!video) return;
  ready.value = true;
  sniffLive(video);
  if (pendingRestoreTime !== undefined && Number.isFinite(video.duration)) {
    video.currentTime = Math.min(pendingRestoreTime, video.duration - 0.1);
    pendingRestoreTime = undefined;
  }
  emit('ready');
}

function onDurationChange(): void {
  const video = videoRef.value;
  if (video) sniffLive(video);
}

function onTimeUpdate(): void {
  const video = videoRef.value;
  if (!video) return;
  currentTime.value = video.currentTime;
  if (video.buffered.length > 0 && Number.isFinite(video.duration) && video.duration > 0) {
    bufferedRatio.value = video.buffered.end(video.buffered.length - 1) / video.duration;
  }
  emit('timeupdate', video.currentTime);
}

function onPlay(): void {
  playing.value = true;
  errorMsg.value = '';
  emit('play');
}

function onPause(): void {
  playing.value = false;
  showControls();
  emit('pause');
}

function onEnded(): void {
  playing.value = false;
  emit('ended');
}

function onWaiting(): void {
  waiting.value = true;
  emit('waiting');
}

function onBufferingDone(): void {
  waiting.value = false;
  emit('canplay');
}

function onVideoError(): void {
  if (!videoRef.value?.getAttribute('src') && !bridgeOwned.value) return;
  waiting.value = false;
  errorMsg.value = locale.value.VideoPlayer.errorHint;
  emit('error', videoRef.value?.error);
}

function onVolumeChange(): void {
  const video = videoRef.value;
  if (!video) return;
  volumeRef.value = video.volume;
  mutedRef.value = video.muted;
  emit('volume-change', { volume: video.volume, muted: video.muted });
}

function onRateChange(): void {
  const video = videoRef.value;
  if (!video) return;
  rateRef.value = video.playbackRate;
  emit('rate-change', video.playbackRate);
}

function onSeeked(): void {
  const video = videoRef.value;
  currentTime.value = video?.currentTime ?? 0;
  danmakuEngine.value?.seekTo(currentTime.value);
  emit('seeked', currentTime.value);
}

function registerPipEvents(video: HTMLVideoElement): void {
  const enter = (): void => {
    pipActive.value = true;
    emit('pip-change', true);
  };
  const leave = (): void => {
    pipActive.value = false;
    emit('pip-change', false);
  };
  video.addEventListener('enterpictureinpicture', enter);
  video.addEventListener('leavepictureinpicture', leave);
  pipCleanup = (): void => {
    video.removeEventListener('enterpictureinpicture', enter);
    video.removeEventListener('leavepictureinpicture', leave);
  };
}

let pipCleanup: (() => void) | null = null;
onBeforeUnmount(() => {
  pipCleanup?.();
});

watch(
  videoRef,
  (video) => {
    if (video && isClient.value) registerPipEvents(video);
  },
  { immediate: true, flush: 'post' },
);

/* ────────────────────────── transport API ────────────────────────── */

async function play(): Promise<void> {
  const video = videoRef.value;
  if (!video) return;
  try {
    await video.play();
  } catch (err) {
    // Autoplay policy or interrupted load — surface through the error panel.
    errorMsg.value = locale.value.VideoPlayer.errorHint;
    emit('error', err);
  }
}

function pause(): void {
  videoRef.value?.pause();
}

function toggle(): void {
  if (playing.value) pause();
  else void play();
}

function seek(t: number): void {
  const video = videoRef.value;
  if (!video || !Number.isFinite(t)) return;
  const max = isLive.value || !Number.isFinite(video.duration) ? video.currentTime : video.duration;
  video.currentTime = Math.min(Math.max(0, t), max || 0);
}

function setVolume(v: number): void {
  const video = videoRef.value;
  if (!video) return;
  video.volume = clamp01(v);
  if (video.volume > 0 && video.muted) video.muted = false;
}

function setMuted(muted: boolean): void {
  const video = videoRef.value;
  if (video) video.muted = muted;
}

function toggleMute(): void {
  const video = videoRef.value;
  if (video) video.muted = !video.muted;
}

function setRate(rate: number): void {
  const video = videoRef.value;
  if (!video) return;
  video.playbackRate = rate;
  rateRef.value = rate;
}

function toggleLoop(): void {
  loopRef.value = !loopRef.value;
  const video = videoRef.value;
  if (video) video.loop = loopRef.value;
}

/* ────────────────────────── fullscreen ────────────────────────── */

const fullscreenActive = ref(false);
const webFullscreen = ref(false);

interface FullscreenApi {
  request: (el: Element) => void;
  exit: () => void;
  element: () => Element | null;
}

type WebkitFullscreenElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };

function fullscreenApi(): FullscreenApi {
  const doc = document as Document & {
    webkitFullscreenElement?: Element | null;
    webkitExitFullscreen?: () => Promise<void> | void;
  };
  const proto = HTMLElement.prototype as WebkitFullscreenElement;
  return {
    request: (target: Element): void => {
      const req = target.requestFullscreen ?? proto.webkitRequestFullscreen?.bind(target);
      // Some platforms (sandboxed iframes, older Safari) reject — swallow.
      Promise.resolve(req?.()).catch(() => {});
    },
    exit: (): void => {
      Promise.resolve(document.exitFullscreen?.() ?? doc.webkitExitFullscreen?.()).catch(() => {});
    },
    element: () => document.fullscreenElement ?? doc.webkitFullscreenElement ?? null,
  };
}

const canFullscreen = computed(() => {
  if (!isClient.value || typeof document === 'undefined') return false;
  if (document.fullscreenEnabled === true) return true;
  const proto = HTMLElement.prototype as WebkitFullscreenElement;
  return typeof proto.webkitRequestFullscreen === 'function';
});

function syncFullscreenFlag(): void {
  fullscreenActive.value = fullscreenApi().element() === rootRef.value;
  emit('fullscreen-change', fullscreenActive.value);
}

function toggleFullscreen(): void {
  if (fullscreenApi().element()) {
    fullscreenApi().exit();
    return;
  }
  if (webFullscreen.value) webFullscreen.value = false;
  const root = rootRef.value;
  if (root) fullscreenApi().request(root);
}

function toggleWebFullscreen(): void {
  if (fullscreenApi().element()) fullscreenApi().exit();
  webFullscreen.value = !webFullscreen.value;
}

onMounted(() => {
  document.addEventListener('fullscreenchange', syncFullscreenFlag);
  document.addEventListener('webkitfullscreenchange', syncFullscreenFlag);
});
onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', syncFullscreenFlag);
  document.removeEventListener('webkitfullscreenchange', syncFullscreenFlag);
});

/* ────────────────────────── picture-in-picture ────────────────────────── */

const pipActive = ref(false);

const canPip = computed(
  () =>
    isClient.value &&
    props.pip &&
    typeof document !== 'undefined' &&
    document.pictureInPictureEnabled === true &&
    !videoRef.value?.disablePictureInPicture,
);

async function togglePip(): Promise<void> {
  const video = videoRef.value;
  if (!video || !canPip.value) return;
  try {
    if (document.pictureInPictureElement === video) await document.exitPictureInPicture();
    else await video.requestPictureInPicture();
  } catch {
    /* PiP rejected (e.g. no video track) — button is inert this round */
  }
}

/* ────────────────────────── mini window ────────────────────────── */

const miniState = useMiniWindow({
  rootRef,
  auto: () => props.miniOnScrollOut === true,
  canEnter: () => playing.value,
});
const uncontrolledMini = ref(false);

const mergedMini = computed(() => props.mini ?? uncontrolledMini.value);

watch(
  miniState.isMini,
  (active) => {
    uncontrolledMini.value = active;
    emit('update:mini', active);
    emit('mini-change', active);
  },
);

function toggleMini(): void {
  if (mergedMini.value) miniState.exitMini();
  else miniState.enterMini();
}

/* ────────────────────────── danmaku ────────────────────────── */

const danmakuCanvasRef = ref<HTMLCanvasElement | null>(null);
const danmakuEngine = ref<DanmakuEngine | null>(null);
const danmuVisibleRef = ref(props.danmuVisible);
const danmuInput = ref('');
const danmuInputEl = ref<HTMLInputElement | null>(null);

watch(
  [danmakuCanvasRef, isClient],
  ([canvas, client]) => {
    if (!client) return;
    if (canvas && !danmakuEngine.value) {
      danmakuEngine.value = new DanmakuEngine(canvas, {
        getTime: () => videoRef.value?.currentTime ?? 0,
        isPaused: () => !playing.value,
      });
      danmakuEngine.value.setItems(props.danmus);
      if (danmuVisibleRef.value) danmakuEngine.value.start();
    }
  },
  { immediate: true, flush: 'post' },
);

watch(
  () => props.danmus,
  (items) => {
    danmakuEngine.value?.setItems(items);
  },
);

watch(
  () => [props.danmuSpeed, props.danmuOpacity, props.danmuFontSize, props.danmuArea] as const,
  ([speed, opacity, fontSize, area]) => {
    danmakuEngine.value?.setOptions({
      speed,
      opacity,
      fontSize,
      area,
    });
  },
  { immediate: true },
);

watch(
  () => props.danmuVisible,
  (visible) => {
    danmuVisibleRef.value = visible;
  },
);

watch(
  [danmuVisibleRef, isClient],
  ([visible, client]) => {
    if (!client) return;
    if (visible) danmakuEngine.value?.start();
    else danmakuEngine.value?.stop();
  },
);

// Keep the canvas backing store in sync with the player box.
let canvasResizeObserver: ResizeObserver | null = null;
onMounted(() => {
  const root = rootRef.value;
  if (!root || typeof ResizeObserver === 'undefined') return;
  canvasResizeObserver = new ResizeObserver(() => {
    const canvas = danmakuCanvasRef.value;
    const engine = danmakuEngine.value;
    if (!canvas || !engine) return;
    engine.resize(canvas.clientWidth, canvas.clientHeight, window.devicePixelRatio || 1);
  });
  canvasResizeObserver.observe(root);
});
onBeforeUnmount(() => {
  canvasResizeObserver?.disconnect();
  canvasResizeObserver = null;
  danmakuEngine.value?.destroy();
  danmakuEngine.value = null;
});

function toggleDanmu(): void {
  danmuVisibleRef.value = !danmuVisibleRef.value;
}

function sendDanmu(text: string, opts: { color?: string; type?: SnVideoDanmu['type'] } = {}): void {
  const engine = danmakuEngine.value;
  if (!engine) return;
  // Rebuild the payload: under `exactOptionalPropertyTypes` forwarding the
  // optional fields directly would pass explicit `undefined`s.
  const payload: { color?: string; type?: SnDanmuType } = {};
  if (opts.color !== undefined) payload.color = opts.color;
  if (opts.type !== undefined) payload.type = opts.type;
  engine.send(text, payload);
}

function submitDanmu(): void {
  const text = danmuInput.value.trim();
  if (!text) return;
  sendDanmu(text);
  emit('danmu-send', { text, time: currentTime.value, self: true });
  danmuInput.value = '';
  danmuInputEl.value?.focus();
}

/* ────────────────────────── download ────────────────────────── */

const showDownload = computed(
  () => props.download && !isLive.value && (!bridgeOwned.value || props.onDownload !== undefined),
);

async function handleDownload(): Promise<void> {
  emit('download', activeSource.value);
  if (props.onDownload) {
    const result = await props.onDownload(activeSource.value);
    if (typeof result === 'string' && result) openDownloadUrl(result);
    return;
  }
  openDownloadUrl(activeSource.value.src);
}

function openDownloadUrl(url: string): void {
  if (typeof document === 'undefined' || !url) return;
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = props.title ?? filenameFromUrl(url);
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function filenameFromUrl(url: string): string {
  try {
    const path = new URL(url, location.href).pathname;
    return decodeURIComponent(path.split('/').pop() ?? 'video') || 'video';
  } catch {
    return 'video';
  }
}

/* ────────────────────────── settings menu ────────────────────────── */

const settingsOpen = ref(false);

function toggleSettings(): void {
  settingsOpen.value = !settingsOpen.value;
}

function onDocumentPointerDown(e: PointerEvent): void {
  if (!settingsOpen.value) return;
  const target = e.target as Node | null;
  if (rootRef.value?.contains(target)) return;
  settingsOpen.value = false;
}

watch(settingsOpen, (open) => {
  if (typeof document === 'undefined') return;
  if (open) document.addEventListener('pointerdown', onDocumentPointerDown, true);
  else document.removeEventListener('pointerdown', onDocumentPointerDown, true);
});
onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('pointerdown', onDocumentPointerDown, true);
  }
});

/* ────────────────────────── controls visibility ────────────────────────── */

const controlsVisible = ref(true);
let idleTimer: ReturnType<typeof setTimeout> | null = null;
const IDLE_HIDE_MS = 2600;

function showControls(): void {
  controlsVisible.value = true;
  if (idleTimer !== null) clearTimeout(idleTimer);
  idleTimer = null;
  if (!playing.value) return;
  idleTimer = setTimeout(() => {
    if (playing.value && !settingsOpen.value && !progressDragging.value && !mergedMini.value) {
      controlsVisible.value = false;
    }
  }, IDLE_HIDE_MS);
}

watch([playing, settingsOpen, mergedMini], () => showControls());
onBeforeUnmount(() => {
  if (idleTimer !== null) clearTimeout(idleTimer);
});

/* ────────────────────────── progress bar ────────────────────────── */

const progressTrackRef = ref<HTMLElement | null>(null);
const progressDragging = ref(false);
const hoverTime = ref<number | null>(null);
const hoverX = ref(0);

const progressRatio = computed(() => {
  if (isLive.value || duration.value <= 0) return 0;
  return Math.min(1, currentTime.value / duration.value);
});

const hoverRatio = computed(() =>
  hoverTime.value !== null && duration.value > 0 ? Math.min(1, hoverTime.value / duration.value) : 0,
);

function ratioFromEvent(event: PointerEvent): number {
  const track = progressTrackRef.value;
  if (!track) return 0;
  const rect = track.getBoundingClientRect();
  if (rect.width <= 0) return 0;
  return Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
}

function onTrackPointerDown(event: PointerEvent): void {
  if (isLive.value || duration.value <= 0) return;
  progressDragging.value = true;
  showControls();
  seek(ratioFromEvent(event) * duration.value);
  window.addEventListener('pointermove', onTrackPointerMove);
  window.addEventListener('pointerup', onTrackPointerUp);
}

function onTrackPointerMove(event: PointerEvent): void {
  if (!progressDragging.value) return;
  seek(ratioFromEvent(event) * duration.value);
}

function onTrackPointerUp(): void {
  progressDragging.value = false;
  window.removeEventListener('pointermove', onTrackPointerMove);
  window.removeEventListener('pointerup', onTrackPointerUp);
}

function onTrackPointerHover(event: PointerEvent): void {
  if (isLive.value || duration.value <= 0) return;
  const ratio = ratioFromEvent(event);
  hoverX.value = ratio * 100;
  hoverTime.value = ratio * duration.value;
}

function onTrackPointerLeave(): void {
  hoverTime.value = null;
}

function onTrackKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    event.stopPropagation();
    seek(currentTime.value - 5);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    event.stopPropagation();
    seek(currentTime.value + 5);
  }
}

onBeforeUnmount(onTrackPointerUp);

/* ────────────────────────── keyboard shortcuts ────────────────────────── */

function onRootKeydown(event: KeyboardEvent): void {
  if (props.shortcuts === false) return;
  if (isEditableTarget(event.target)) return;
  const action = resolveVideoShortcut(event, { pipAvailable: canPip.value });
  if (action === null) return;
  showControls();
  switch (action) {
    case 'toggle':
      toggle();
      break;
    case 'seek-forward':
      seek(currentTime.value + 5);
      break;
    case 'seek-back':
      seek(currentTime.value - 5);
      break;
    case 'volume-up':
      setVolume(volumeRef.value + 0.1);
      break;
    case 'volume-down':
      setVolume(volumeRef.value - 0.1);
      break;
    case 'toggle-mute':
      toggleMute();
      break;
    case 'toggle-fullscreen':
      toggleFullscreen();
      break;
    case 'toggle-pip':
      void togglePip();
      break;
    case 'toggle-danmu':
      toggleDanmu();
      break;
  }
  // Space / arrows would otherwise scroll the page.
  event.preventDefault();
}

/* ────────────────────────── exposed API ────────────────────────── */

defineExpose({
  play,
  pause,
  toggle,
  seek,
  setVolume,
  setMuted,
  setRate,
  toggleMute,
  toggleFullscreen,
  toggleWebFullscreen,
  togglePip,
  toggleMini,
  toggleDanmu,
  sendDanmu,
  retry,
  videoEl: videoRef,
  rootEl: rootRef,
});

/* ────────────────────────── view helpers ────────────────────────── */

const rootStyle = computed<CSSProperties>(() => {
  // Mini / web-fullscreen sizes come from their CSS classes — an inline
  // width would outrank them, so it is only bound in the normal flow.
  if (mergedMini.value || webFullscreen.value) {
    return {
      '--sn-video-player-mini-x': `${miniState.offset.value.x}px`,
      '--sn-video-player-mini-y': `${miniState.offset.value.y}px`,
    } as CSSProperties;
  }
  return {
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    '--sn-video-player-mini-x': `${miniState.offset.value.x}px`,
    '--sn-video-player-mini-y': `${miniState.offset.value.y}px`,
  } as CSSProperties;
});

const rootClass = computed(() => [
  'sn-video-player',
  mergedMini.value && 'sn-video-player--mini',
  fullscreenActive.value && 'sn-video-player--fullscreen',
  webFullscreen.value && 'sn-video-player--web-fullscreen',
  isLive.value && 'sn-video-player--live',
  playing.value && !controlsVisible.value && 'sn-video-player--idle',
]);

const resolvedPoster = computed(() => props.poster ?? undefined);
</script>

<template>
  <div
    ref="rootRef"
    :class="rootClass"
    :style="rootStyle"
    :data-snui-component="'SnVideoPlayer'"
    tabindex="0"
    @keydown="onRootKeydown"
    @pointermove="showControls"
    @pointerdown="showControls"
    @mouseleave="playing && (controlsVisible = false)"
  >
    <div class="sn-video-player__stage" :style="{ aspectRatio: mergedMini ? '16 / 9' : aspectRatio }">
      <!-- eslint-disable-next-line vue/html-self-closing -->
      <video
        ref="videoRef"
        class="sn-video-player__video"
        :poster="resolvedPoster"
        :autoplay="autoplay || undefined"
        :muted="mutedRef || undefined"
        :loop="loopRef || undefined"
        :preload="preload"
        playsinline
        webkit-playsinline
        :aria-label="title"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
        @timeupdate="onTimeUpdate"
        @durationchange="onDurationChange"
        @loadedmetadata="onLoadedMetadata"
        @waiting="onWaiting"
        @playing="onBufferingDone"
        @canplay="onBufferingDone"
        @seeked="onSeeked"
        @volumechange="onVolumeChange"
        @ratechange="onRateChange"
        @error="onVideoError"
        @click="toggle"
        @dblclick="toggleFullscreen"
      />

      <!-- Danmaku canvas: pointer-events none, sits between video and controls. -->
      <canvas
        v-show="isClient && danmuVisibleRef"
        ref="danmakuCanvasRef"
        class="sn-video-player__danmaku"
        aria-hidden="true"
      />

      <!-- Center play button (hidden while playing / buffering / errored). -->
      <button
        v-if="!playing && !waiting && !errorMsg"
        type="button"
        class="sn-video-player__big-play"
        :aria-label="locale.VideoPlayer.play"
        @click.stop="toggle"
      >
        <SnIcon :icon="Play as IconComponent" :size="26" />
      </button>

      <!-- Loading spinner -->
      <div v-if="waiting && !errorMsg" class="sn-video-player__spinner" role="status">
        <span class="sn-video-player__spinner-ring" />
      </div>

      <!-- Error panel -->
      <div v-if="errorMsg" class="sn-video-player__error" role="alert">
        <slot name="error">
          <SnIcon :icon="RotateCcw as IconComponent" :size="22" />
          <p class="sn-video-player__error-text">{{ errorMsg }}</p>
          <button type="button" class="sn-video-player__error-retry" @click.stop="retry">
            {{ locale.VideoPlayer.retry }}
          </button>
        </slot>
      </div>

      <!-- Live badge -->
      <div v-if="isLive && !errorMsg" class="sn-video-player__live-badge">
        <span class="sn-video-player__live-dot" aria-hidden="true" />
        {{ locale.VideoPlayer.live }}
      </div>

      <!-- Control bar -->
      <div
        v-show="controlsVisible || !playing"
        class="sn-video-player__controls"
        @pointerdown.stop
        @click.stop
      >
        <!-- Danmaku input (B 站 style: inline in the bar) -->
        <input
          v-if="danmuSend && !isLive && !mergedMini"
          ref="danmuInputEl"
          v-model="danmuInput"
          class="sn-video-player__danmu-input"
          type="text"
          :placeholder="locale.VideoPlayer.danmuInput"
          :aria-label="locale.VideoPlayer.danmuInput"
          maxlength="100"
          @keydown.enter.prevent="submitDanmu"
          @keydown.stop
        />

        <button
          type="button"
          class="sn-video-player__button"
          :aria-label="playing ? locale.VideoPlayer.pause : locale.VideoPlayer.play"
          @click="toggle"
        >
          <SnIcon :icon="(playing ? Pause : Play) as IconComponent" :size="18" />
        </button>

        <div class="sn-video-player__volume">
          <button
            type="button"
            class="sn-video-player__button"
            :aria-label="mutedRef ? locale.VideoPlayer.unmute : locale.VideoPlayer.mute"
            @click="toggleMute"
          >
            <SnIcon :icon="(mutedRef || volumeRef === 0 ? VolumeX : Volume2) as IconComponent" :size="18" />
          </button>
          <input
            v-model.number="volumeRef"
            class="sn-video-player__volume-range"
            type="range"
            min="0"
            max="1"
            step="0.05"
            :aria-label="locale.VideoPlayer.volume"
            @input="setVolume(volumeRef)"
          />
        </div>

        <span v-if="!isLive" class="sn-video-player__time">
          {{ fmtTime(currentTime) }} <span class="sn-video-player__time-sep">/</span>
          {{ fmtTime(duration) }}
        </span>
        <span v-else class="sn-video-player__time sn-video-player__time--live">
          {{ locale.VideoPlayer.live }}
        </span>

        <!-- Progress bar (VOD only) -->
        <div
          v-if="!isLive"
          ref="progressTrackRef"
          class="sn-video-player__progress"
          role="slider"
          :aria-label="locale.VideoPlayer.timeline"
          :aria-valuemin="0"
          :aria-valuemax="Math.round(duration)"
          :aria-valuenow="Math.round(currentTime)"
          :aria-valuetext="`${fmtTime(currentTime)} / ${fmtTime(duration)}`"
          tabindex="0"
          @pointerdown="onTrackPointerDown"
          @pointermove="onTrackPointerHover"
          @pointerleave="onTrackPointerLeave"
          @keydown="onTrackKeydown"
        >
          <div class="sn-video-player__progress-buffered" :style="{ width: `${bufferedRatio * 100}%` }" />
          <div class="sn-video-player__progress-played" :style="{ width: `${progressRatio * 100}%` }" />
          <div
            v-if="hoverTime !== null"
            class="sn-video-player__progress-hover"
            :style="{ left: `${hoverRatio * 100}%` }"
          />
          <div class="sn-video-player__progress-thumb" :style="{ left: `${progressRatio * 100}%` }" />
          <div
            v-if="hoverTime !== null"
            class="sn-video-player__progress-tooltip"
            :style="{ left: `${hoverX}%` }"
          >
            {{ fmtTime(hoverTime) }}
          </div>
        </div>
        <div v-else class="sn-video-player__progress sn-video-player__progress--spacer" />

        <div class="sn-video-player__spacer" />

        <!-- Danmaku toggle -->
        <button
          v-if="!isLive"
          type="button"
          class="sn-video-player__button"
          :class="danmuVisibleRef && 'sn-video-player__button--active'"
          :aria-label="danmuVisibleRef ? locale.VideoPlayer.danmuOn : locale.VideoPlayer.danmuOff"
          :aria-pressed="danmuVisibleRef"
          @click="toggleDanmu"
        >
          <SnIcon :icon="MessageSquare as IconComponent" :size="17" />
        </button>

        <!-- Settings -->
        <div v-if="settings" class="sn-video-player__settings">
          <button
            type="button"
            class="sn-video-player__button"
            :aria-label="locale.VideoPlayer.settings"
            :aria-expanded="settingsOpen"
            @click="toggleSettings"
          >
            <SnIcon :icon="Settings as IconComponent" :size="17" />
          </button>
          <div v-if="settingsOpen" class="sn-video-player__settings-panel" role="menu">
            <div v-if="hasQualityMenu" class="sn-video-player__settings-section">
              <p class="sn-video-player__settings-title">{{ locale.VideoPlayer.quality }}</p>
              <button
                v-for="q in qualityMenu"
                :key="String(q.id)"
                type="button"
                role="menuitemradio"
                :aria-checked="q.id === activeQualityId"
                class="sn-video-player__settings-item"
                :class="q.id === activeQualityId && 'sn-video-player__settings-item--active'"
                @click="selectQuality(q.id); settingsOpen = false"
              >
                {{ q.label }}
              </button>
            </div>
            <div class="sn-video-player__settings-section">
              <p class="sn-video-player__settings-title">{{ locale.VideoPlayer.rate }}</p>
              <button
                v-for="r in VIDEO_RATE_OPTIONS"
                :key="r"
                type="button"
                role="menuitemradio"
                :aria-checked="r === rateRef"
                class="sn-video-player__settings-item"
                :class="r === rateRef && 'sn-video-player__settings-item--active'"
                @click="setRate(r); settingsOpen = false"
              >
                {{ r }}x
              </button>
            </div>
            <div class="sn-video-player__settings-section sn-video-player__settings-section--row">
              <span>{{ locale.VideoPlayer.loop }}</span>
              <button
                type="button"
                role="switch"
                :aria-checked="loopRef"
                class="sn-video-player__switch"
                :class="loopRef && 'sn-video-player__switch--on'"
                @click="toggleLoop"
              >
                <span class="sn-video-player__switch-knob" />
              </button>
            </div>
          </div>
        </div>

        <!-- Download -->
        <button
          v-if="showDownload"
          type="button"
          class="sn-video-player__button"
          :aria-label="locale.VideoPlayer.download"
          @click="handleDownload"
        >
          <SnIcon :icon="Download as IconComponent" :size="17" />
        </button>

        <!-- PiP -->
        <button
          v-if="canPip"
          type="button"
          class="sn-video-player__button"
          :class="pipActive && 'sn-video-player__button--active'"
          :aria-label="locale.VideoPlayer.pip"
          :aria-pressed="pipActive"
          @click="togglePip"
        >
          <SnIcon :icon="PictureInPicture2 as IconComponent" :size="17" />
        </button>

        <!-- Mini window -->
        <button
          type="button"
          class="sn-video-player__button"
          :class="mergedMini && 'sn-video-player__button--active'"
          :aria-label="locale.VideoPlayer.mini"
          :aria-pressed="mergedMini"
          @click="toggleMini"
        >
          <SnIcon :icon="Minimize2 as IconComponent" :size="17" />
        </button>

        <!-- Web fullscreen (page fullscreen, B 站 style) -->
        <button
          v-if="canFullscreen"
          type="button"
          class="sn-video-player__button"
          :aria-label="locale.VideoPlayer.fullscreen"
          @click="toggleWebFullscreen"
        >
          <SnIcon :icon="Minimize as IconComponent" :size="17" />
        </button>

        <!-- Fullscreen -->
        <button
          v-if="canFullscreen"
          type="button"
          class="sn-video-player__button"
          :aria-label="fullscreenActive ? locale.VideoPlayer.exitFullscreen : locale.VideoPlayer.fullscreen"
          @click="toggleFullscreen"
        >
          <SnIcon :icon="Maximize as IconComponent" :size="17" />
        </button>
      </div>
    </div>

    <!-- Mini window chrome: drag grip + restore -->
    <div
      v-if="mergedMini"
      class="sn-video-player__mini-grip"
      role="button"
      :aria-label="locale.VideoPlayer.mini"
      tabindex="0"
      @pointerdown.stop.prevent="miniState.onGripPointerDown"
      @dblclick="toggleMini"
    >
      <span class="sn-video-player__mini-title">{{ title ?? '' }}</span>
      <button
        type="button"
        class="sn-video-player__mini-close"
        :aria-label="locale.VideoPlayer.pause"
        @pointerdown.stop
        @click.stop="
          pause();
          miniState.exitMini();
        "
      >
        <SnIcon :icon="X as IconComponent" :size="13" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-video-player {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  border-radius: var(--sn-web-video-player-radius, var(--sn-web-radius-lg, 8px));
  background: var(--sn-web-video-player-bg, #000000);
  outline: none;
  font-size: var(--sn-web-font-size-sm, 13px);
}

.sn-video-player:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring, #1677ff73);
  outline-offset: 2px;
}

.sn-video-player__stage {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: inherit;
}

.sn-video-player__video {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--sn-web-video-player-bg, #000000);
  cursor: pointer;
}

.sn-video-player__danmaku {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* ── center states ── */

.sn-video-player__big-play {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--sn-web-video-player-big-play-size, 64px);
  height: var(--sn-web-video-player-big-play-size, 64px);
  border: none;
  border-radius: var(--sn-web-radius-full, 999px);
  color: var(--sn-web-video-player-color, #ffffff);
  background: var(--sn-web-video-player-scrim, #00000073);
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.sn-video-player__big-play:hover {
  background: var(--sn-web-video-player-scrim-strong, #000000a6);
  transform: translate(-50%, -50%) scale(1.06);
}

.sn-video-player__spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.sn-video-player__spinner-ring {
  display: block;
  width: 40px;
  height: 40px;
  border: 3px solid var(--sn-web-video-player-color-dim, #ffffff59);
  border-top-color: var(--sn-web-video-player-color, #ffffff);
  border-radius: var(--sn-web-radius-full, 999px);
  animation: sn-video-player-spin 0.9s linear infinite;
}

@keyframes sn-video-player-spin {
  to {
    transform: rotate(360deg);
  }
}

.sn-video-player__error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sn-web-spacing-2, 8px);
  color: var(--sn-web-video-player-color, #ffffff);
  background: var(--sn-web-video-player-scrim-strong, #000000a6);
  text-align: center;
}

.sn-video-player__error-text {
  margin: 0;
  padding: 0 var(--sn-web-spacing-4, 16px);
}

.sn-video-player__error-retry {
  padding: var(--sn-web-spacing-1, 4px) var(--sn-web-spacing-4, 16px);
  border: 1px solid var(--sn-web-video-player-color-dim, #ffffff59);
  border-radius: var(--sn-web-radius-full, 999px);
  color: inherit;
  background: transparent;
  cursor: pointer;
}

.sn-video-player__error-retry:hover {
  background: var(--sn-web-video-player-scrim, #00000073);
}

.sn-video-player__live-badge {
  position: absolute;
  top: var(--sn-web-spacing-2, 8px);
  left: var(--sn-web-spacing-2, 8px);
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px var(--sn-web-spacing-2, 8px);
  border-radius: var(--sn-web-radius-full, 999px);
  font-size: var(--sn-web-font-size-xs, 12px);
  color: var(--sn-web-video-player-color, #ffffff);
  background: var(--sn-web-video-player-scrim, #00000073);
}

.sn-video-player__live-dot {
  width: 7px;
  height: 7px;
  border-radius: var(--sn-web-radius-full, 999px);
  background: var(--sn-web-color-feedback-danger, #ff4d4f);
  animation: sn-video-player-pulse 1.6s ease-in-out infinite;
}

@keyframes sn-video-player-pulse {
  50% {
    opacity: 0.35;
  }
}

/* ── control bar ── */

.sn-video-player__controls {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-1, 4px);
  width: 100%;
  box-sizing: border-box;
  padding: var(--sn-web-video-player-controls-pad-y, 8px) var(--sn-web-video-player-controls-pad-x, 12px);
  color: var(--sn-web-video-player-color, #ffffff);
  background: var(--sn-web-video-player-controls-bg, #000000a6);
  backdrop-filter: blur(6px);
  transition: opacity 0.25s ease;
}

.sn-video-player--idle .sn-video-player__controls {
  opacity: 0;
  pointer-events: none;
}

.sn-video-player--idle .sn-video-player__stage {
  cursor: none;
}

.sn-video-player__button {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: var(--sn-web-video-player-button-size, 30px);
  height: var(--sn-web-video-player-button-size, 30px);
  padding: 0;
  border: none;
  border-radius: var(--sn-web-radius-full, 999px);
  color: inherit;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.18s ease;
}

.sn-video-player__button:hover,
.sn-video-player__button--active {
  background: var(--sn-web-video-player-button-hover, #ffffff29);
}

.sn-video-player__button:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring, #1677ff73);
}

.sn-video-player__spacer {
  flex: 1;
}

.sn-video-player__time {
  flex-shrink: 0;
  padding: 0 var(--sn-web-spacing-2, 8px);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  opacity: 0.9;
}

.sn-video-player__time-sep {
  opacity: 0.55;
}

.sn-video-player__time--live {
  color: var(--sn-web-color-feedback-danger, #ff4d4f);
  font-weight: 600;
}

/* ── volume ── */

.sn-video-player__volume {
  display: flex;
  align-items: center;
}

.sn-video-player__volume-range {
  width: 0;
  opacity: 0;
  accent-color: var(--sn-web-color-action-primary, #1677ff);
  transition:
    width 0.2s ease,
    opacity 0.2s ease;
}

.sn-video-player__volume:hover .sn-video-player__volume-range,
.sn-video-player__volume-range:focus-visible {
  width: 72px;
  opacity: 1;
  margin-right: var(--sn-web-spacing-1, 4px);
}

/* ── progress ── */

.sn-video-player__progress {
  position: relative;
  flex: 1;
  height: 14px;
  margin: 0 var(--sn-web-spacing-2, 8px);
  cursor: pointer;
  touch-action: none;
}

.sn-video-player__progress::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: var(--sn-web-video-player-track-height, 4px);
  border-radius: var(--sn-web-radius-full, 999px);
  background: var(--sn-web-video-player-track, #ffffff45);
  transform: translateY(-50%);
}

.sn-video-player__progress-buffered,
.sn-video-player__progress-played,
.sn-video-player__progress-hover {
  position: absolute;
  top: 50%;
  left: 0;
  height: var(--sn-web-video-player-track-height, 4px);
  border-radius: var(--sn-web-radius-full, 999px);
  transform: translateY(-50%);
  pointer-events: none;
}

.sn-video-player__progress-buffered {
  background: var(--sn-web-video-player-buffered, #ffffff59);
}

.sn-video-player__progress-played {
  background: var(--sn-web-color-action-primary, #1677ff);
}

.sn-video-player__progress-hover {
  background: var(--sn-web-video-player-hover-track, #ffffff8c);
}

.sn-video-player__progress-thumb {
  position: absolute;
  top: 50%;
  width: var(--sn-web-video-player-thumb-size, 12px);
  height: var(--sn-web-video-player-thumb-size, 12px);
  border-radius: var(--sn-web-radius-full, 999px);
  background: var(--sn-web-color-action-primary, #1677ff);
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.15s ease;
  pointer-events: none;
}

.sn-video-player__progress:hover .sn-video-player__progress-thumb,
.sn-video-player__progress:focus-visible .sn-video-player__progress-thumb {
  transform: translate(-50%, -50%) scale(1);
}

.sn-video-player__progress-tooltip {
  position: absolute;
  bottom: calc(100% + var(--sn-web-spacing-2, 8px));
  padding: 2px var(--sn-web-spacing-2, 8px);
  border-radius: var(--sn-web-radius-sm, 4px);
  color: var(--sn-web-video-player-color, #ffffff);
  background: var(--sn-web-video-player-scrim-strong, #000000a6);
  font-variant-numeric: tabular-nums;
  transform: translateX(-50%);
  pointer-events: none;
  white-space: nowrap;
}

.sn-video-player__progress--spacer {
  visibility: hidden;
}

/* ── danmu input ── */

.sn-video-player__danmu-input {
  flex: 0 1 220px;
  min-width: 90px;
  height: 28px;
  box-sizing: border-box;
  margin-right: var(--sn-web-spacing-2, 8px);
  padding: 0 var(--sn-web-spacing-2, 8px);
  border: 1px solid var(--sn-web-video-player-color-dim, #ffffff59);
  border-radius: var(--sn-web-radius-full, 999px);
  color: var(--sn-web-video-player-color, #ffffff);
  background: var(--sn-web-video-player-input-bg, #ffffff1a);
  outline: none;
}

.sn-video-player__danmu-input::placeholder {
  color: var(--sn-web-video-player-color-dim, #ffffffa6);
}

.sn-video-player__danmu-input:focus {
  border-color: var(--sn-web-color-action-primary, #1677ff);
}

/* ── settings menu ── */

.sn-video-player__settings {
  position: relative;
  display: flex;
}

.sn-video-player__settings-panel {
  position: absolute;
  bottom: calc(100% + var(--sn-web-spacing-2, 8px));
  right: 0;
  display: flex;
  gap: var(--sn-web-spacing-4, 16px);
  min-width: 200px;
  box-sizing: border-box;
  padding: var(--sn-web-spacing-3, 12px);
  border-radius: var(--sn-web-radius-md, 6px);
  color: var(--sn-web-color-text-primary, #333333);
  background: var(--sn-web-color-background-elevated, #ffffff);
  box-shadow: var(--sn-web-shadow-lg, 0 6px 16px #00000014);
  z-index: 3;
}

.sn-video-player__settings-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sn-video-player__settings-section--row {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: var(--sn-web-spacing-4, 16px);
}

.sn-video-player__settings-title {
  margin: 0 0 var(--sn-web-spacing-1, 4px);
  color: var(--sn-web-color-text-tertiary, #999999);
  font-size: var(--sn-web-font-size-xs, 12px);
}

.sn-video-player__settings-item {
  padding: var(--sn-web-spacing-1, 4px) var(--sn-web-spacing-2, 8px);
  border: none;
  border-radius: var(--sn-web-radius-sm, 4px);
  color: inherit;
  background: transparent;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
}

.sn-video-player__settings-item:hover {
  background: var(--sn-web-color-background-subtle, #f5f5f5);
}

.sn-video-player__settings-item--active {
  color: var(--sn-web-color-action-primary, #1677ff);
  font-weight: 600;
}

.sn-video-player__switch {
  position: relative;
  width: 34px;
  height: 18px;
  border: none;
  border-radius: 999px;
  background: var(--sn-web-color-background-overlay, #d9d9d9);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.sn-video-player__switch--on {
  background: var(--sn-web-color-action-primary, #1677ff);
}

.sn-video-player__switch-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: var(--sn-web-radius-full, 999px);
  background: var(--sn-web-color-background-surface, #ffffff);
  transition: left 0.2s ease;
}

.sn-video-player__switch--on .sn-video-player__switch-knob {
  left: 18px;
}

/* ── mini window ── */

.sn-video-player--mini {
  position: fixed;
  right: var(--sn-web-spacing-4, 16px);
  bottom: var(--sn-web-spacing-4, 16px);
  width: var(--sn-web-video-player-mini-width, 320px);
  z-index: var(--sn-web-video-player-mini-z, 1050);
  box-shadow: var(--sn-web-shadow-lg, 0 6px 16px #00000026);
  transform: translate(var(--sn-video-player-mini-x, 0), var(--sn-video-player-mini-y, 0));
  transition: box-shadow 0.2s ease;
}

.sn-video-player__mini-grip {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding: var(--sn-web-spacing-1, 4px) var(--sn-web-spacing-2, 8px);
  color: var(--sn-web-video-player-color, #ffffff);
  background: var(--sn-web-video-player-scrim, #00000073);
  cursor: grab;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 2;
}

.sn-video-player--mini:hover .sn-video-player__mini-grip,
.sn-video-player__mini-grip:focus-visible {
  opacity: 1;
}

.sn-video-player__mini-grip:active {
  cursor: grabbing;
}

.sn-video-player__mini-title {
  overflow: hidden;
  font-size: var(--sn-web-font-size-xs, 12px);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sn-video-player__mini-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: var(--sn-web-radius-full, 999px);
  color: inherit;
  background: var(--sn-web-video-player-button-hover, #ffffff29);
  cursor: pointer;
}

/* ── fullscreen / web fullscreen ── */

.sn-video-player--fullscreen {
  border-radius: 0;
}

.sn-video-player--fullscreen .sn-video-player__stage,
.sn-video-player--fullscreen .sn-video-player__video {
  border-radius: 0;
}

.sn-video-player--web-fullscreen {
  position: fixed;
  inset: 0;
  z-index: var(--sn-web-video-player-mini-z, 1050);
  border-radius: 0;
}

.sn-video-player--web-fullscreen .sn-video-player__stage {
  height: 100%;
  aspect-ratio: auto;
}
</style>
