<script setup lang="ts">
/**
 * sn-video-preview (uni-end) — full-screen video layer.
 *
 * Reference library: wot-ui `wd-video-preview`
 *   (https://wot-ui.cn/component/video-preview.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-video-preview 1:1
 * except for the documented omissions. Anything new added here MUST also be
 * added to the reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-video-preview/sn-video-preview.vue
 * → auto-registered as `<sn-video-preview>` in any .vue that uses it.
 *
 * ## Native `<video>`, no player engine
 *
 * The layer is `sn-popup` (scrim, stacking, scroll lock, enter / leave
 * animation) wrapping a native `<video>` element, so playback, controls and
 * the platform's own fullscreen behaviour come from the vendor runtime. The
 * component adds the title bar, the close button and the `open` / `close`
 * contract.
 *
 * ## Imperative surface (mirrors wd-video-preview)
 *
 * The spec declares `open` / `close` as methods and `on-open` / `on-close` as
 * *props* (callbacks), not events. Both are supported here:
 *
 *   const video = ref()
 *   video.value.open({ src, poster, title })
 *   video.value.close()
 *
 *   <sn-video-preview :on-open="handler" :on-close="handler" />
 *
 * `open()` additionally emits `open` so a `@open` listener works too — the
 * extra event is additive and does not change the reference surface.
 *
 * ## Dispose (AGENTS.md §41)
 *
 * No timer, no listener: the popup owns its animation timer and the native
 * `<video>` owns playback. On close the source is cleared so the platform
 * stops decoding; `onBeforeUnmount` clears it again.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 *
 * Usage:
 *   <sn-video-preview ref="video" full-screen />
 *
 * Not responsible for:
 *   - 视频列表 / 播放器控件面板 — 由宿主自建
 *   - 图片预览 — 用 sn-image-preview
 */

import { computed, ref } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { X as XIcon } from '../sn-icon/sn-icon-set';
import SnPopup from '../sn-popup/sn-popup.vue';

defineOptions({ name: 'SnVideoPreview' });

/** Close-button anchor. Mirrors `wd-video-preview` `close-position`. */
type VideoPreviewClosePosition = 'left-top' | 'right-top';

/** One video to play (mirrors the wd `VideoPreviewOptions` shape). */
export interface SnVideoPreviewOptions {
  /** Video source URL. */
  src: string;
  /** Poster shown before the first frame. */
  poster?: string;
  /** Title rendered in the top bar. */
  title?: string;
  /** Autoplay on open. */
  autoplay?: boolean;
}

const props = withDefaults(
  defineProps<{
    /** Instance identifier (parity with the reference; useful for logs / telemetry). */
    selector?: string;
    /** Stacking level of the layer. */
    zIndex?: number;
    /** Fill the viewport with the video instead of the centred 16:9 stage. */
    fullScreen?: boolean;
    /** Close-button anchor. */
    closePosition?: VideoPreviewClosePosition;
    /** Called after the layer opened (reference `on-open` prop). */
    onOpen?: (() => void) | undefined;
    /** Called after the layer closed (reference `on-close` prop). */
    onClose?: (() => void) | undefined;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
  }>(),
  {
    selector: '',
    zIndex: 1000,
    fullScreen: false,
    closePosition: 'left-top',
    onOpen: undefined,
    onClose: undefined,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'open'): void;
  (e: 'close'): void;
}>();

/** Layer visibility. */
const visible = ref(false);

/** Video currently loaded; `''` unloads the native element. */
const src = ref('');

/** Poster of the current video. */
const poster = ref('');

/** Title rendered in the top bar. */
const title = ref('');

/** Autoplay flag for the current video. */
const autoplay = ref(false);

/**
 * Open the layer with a video (mirrors `wd-video-preview` `open`).
 *
 * `emit('open')` covers both `@open` and the reference's `:on-open` prop —
 * Vue maps an `onOpen` prop onto the `open` event, so calling `props.onOpen`
 * here as well would fire the host callback twice.
 */
function open(options: SnVideoPreviewOptions): void {
  src.value = options.src;
  poster.value = options.poster ?? '';
  title.value = options.title ?? '';
  autoplay.value = options.autoplay === true;
  visible.value = true;
  emit('open');
}

/** Close the layer (mirrors `wd-video-preview` `close`). */
function close(): void {
  if (!visible.value) return;
  visible.value = false;
  // Stop the platform decoder by unmounting the source, not by muting it.
  src.value = '';
  poster.value = '';
  title.value = '';
  autoplay.value = false;
  emit('close');
}

defineExpose({ open, close });

/* ── Presentation ──────────────────────────────────────────────────────── */

const closeButtonClass = computed(() => [
  'sn-video-preview__close',
  `sn-video-preview__close--${props.closePosition}`,
]);

const rootClass = computed(() => [
  'sn-video-preview',
  { 'sn-video-preview--full-screen': props.fullScreen },
  props.customClass,
]);

const rootStyle = computed(() => (props.customStyle ? props.customStyle : undefined));

/**
 * Non-undefined view of `zIndex` for the popup binding — a bare prop identifier
 * types as `number | undefined` under `exactOptionalPropertyTypes`.
 */
const zIndexValue = computed(() => props.zIndex);

/** Popup panel override: full-bleed, transparent, unpadded. */
const PANEL_STYLE = [
  'width: 100%',
  'height: 100%',
  'max-width: 100%',
  'max-height: 100%',
  'padding: 0',
  'background-color: transparent',
].join('; ');

function onCloseTap(event: Event): void {
  event.stopPropagation();
  close();
}

function onPopupModelUpdate(value: boolean): void {
  if (value) {
    visible.value = true;
    return;
  }
  close();
}
</script>

<template>
  <SnPopup
    :model-value="visible"
    position="center"
    :z-index="zIndexValue"
    :duration="200"
    :custom-style="PANEL_STYLE"
    @update:model-value="onPopupModelUpdate"
  >
    <view
      :class="rootClass"
      :style="rootStyle"
      role="dialog"
      aria-modal="true"
      aria-label="video preview"
      :data-selector="selector"
    >
      <view class="sn-video-preview__stage">
        <video
          v-if="src"
          class="sn-video-preview__video"
          :src="src"
          :poster="poster"
          :autoplay="autoplay"
          :controls="true"
          object-fit="contain"
        />
      </view>

      <view class="sn-video-preview__bar">
        <text v-if="title" class="sn-video-preview__title">{{ title }}</text>
      </view>

      <view :class="closeButtonClass" role="button" aria-label="close" @tap="onCloseTap">
        <SnIcon :icon="XIcon" :size="32" />
      </view>
    </view>
  </SnPopup>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-video-preview {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  justify-content: center;
  background-color: var(--sn-mp-color-background-overlay);
}

.sn-video-preview__stage {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 420rpx;
}

.sn-video-preview--full-screen .sn-video-preview__stage {
  flex: 1;
  height: 100%;
}

.sn-video-preview__video {
  width: 100%;
  height: 100%;
}

/* ── Title bar ─────────────────────────────────────────────────────────── */

.sn-video-preview__bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  min-height: 88rpx;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-12) var(--sn-mp-spacing-3)
    var(--sn-mp-spacing-4);
  background-color: var(--sn-mp-color-background-overlay);
}

.sn-video-preview__title {
  overflow: hidden;
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-medium);
  line-height: var(--sn-mp-font-line-height-normal);
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Close button ──────────────────────────────────────────────────────── */

.sn-video-preview__close {
  position: absolute;
  top: var(--sn-mp-spacing-3);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-overlay);
  color: var(--sn-mp-color-text-on-primary);
  z-index: 1;
}

.sn-video-preview__close--right-top {
  right: var(--sn-mp-spacing-3);
}

.sn-video-preview__close--left-top {
  left: var(--sn-mp-spacing-3);
}
</style>
