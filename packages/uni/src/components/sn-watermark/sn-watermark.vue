<script setup lang="ts">
/**
 * sn-watermark (uni-end) — repeating text / image watermark layer.
 *
 * Reference library: wot-ui `wd-watermark`
 *   (https://wot-ui.cn/component/watermark.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-watermark 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-watermark/sn-watermark.vue
 * → auto-registered as `<sn-watermark>` in any .vue that uses it.
 *
 * ## Why a tiled `<view>` grid instead of `<canvas>`
 *
 * wd-watermark paints a canvas tile and repeats it as a background image. A
 * cross-end component cannot do that reliably: `uni.createCanvasContext` needs a
 * canvas id + a `draw()` round-trip, the tile must then be exported with
 * `canvasToTempFilePath` (async, per-vendor quirks), and mini-program WXSS has
 * no `background-image: url(data:…)` path for the result. This implementation
 * therefore renders the tile content as real nodes in a rotated grid, which
 * works on every uni target with no async API and no platform capability:
 *
 *   - tile content: `content` text and/or `image` (as `<image>`)
 *   - tile size: `width` / `height`
 *   - spacing: `gutter-x` / `gutter-y`
 *   - repeat count: enough tiles to cover a 2000×2000rpx canvas
 *   - `layout: staggered` offsets every other row by half a tile
 *
 * Documented consequences (also on the docs page):
 *   - `font-style` / `font-weight` / `font-family` only affect the rendered
 *     `<text>`; they are honoured, but the exact glyph metrics differ from the
 *     canvas reference.
 *   - The watermark cannot be exported as an image, so it is not a
 *     tamper-proof overlay — it is a visual marking, same intent as the
 *     reference but without the canvas hardening.
 *
 * ## Dispose (AGENTS.md §41)
 *
 * No timer, no listener, no async draw. Nothing to dispose.
 *
 * Per AGENTS.md §32, this component handles rendering only.
 *
 * Not responsible for:
 *   - 图片 / 媒体展示 — 用 sn-img
 *   - 遮罩层 — 用 sn-overlay
 */

import { computed, useSlots } from 'vue';

defineOptions({ name: 'SnWatermark' });

/** Repeat layout. Mirrors `wd-watermark` `layout`. */
type WatermarkLayout = 'grid' | 'staggered';

/** Font style. Mirrors `wd-watermark` `font-style`. */
type WatermarkFontStyle = 'normal' | 'italic' | 'oblique';

/** Coverage canvas of the tiled grid, in rpx (a 750-wide design, ×2.67 height). */
const CANVAS_RPX = 2000;

const props = withDefaults(
  defineProps<{
    /** Watermark text. */
    content?: string;
    /** Watermark image source (network or base64). */
    image?: string;
    /** Image height in px (per the wd reference). */
    imageHeight?: number;
    /** Image width in px. */
    imageWidth?: number;
    /** Horizontal gutter between tiles, in px. */
    gutterX?: number;
    /** Vertical gutter between tiles, in px. */
    gutterY?: number;
    /** Tile width in px. */
    width?: number;
    /** Tile height in px. */
    height?: number;
    /** Cover the whole viewport instead of the parent box. */
    fullScreen?: boolean;
    /** Text color override (any CSS color value). */
    color?: string;
    /** Text size in px. */
    size?: number;
    /** Font style. */
    fontStyle?: WatermarkFontStyle;
    /** Font weight. */
    fontWeight?: string | number;
    /** Font family. */
    fontFamily?: string;
    /** Rotation angle in degrees. */
    rotate?: number;
    /** Stacking level. */
    zIndex?: number;
    /** Opacity, 0–1. */
    opacity?: number | undefined;
    /** Repeat layout. */
    layout?: WatermarkLayout;
    /** Custom inline style for the root node. */
    customStyle?: string;
    /** Custom class for the root node. */
    customClass?: string;
  }>(),
  {
    content: '',
    image: '',
    imageHeight: 100,
    imageWidth: 100,
    gutterX: 0,
    gutterY: 0,
    width: 100,
    height: 100,
    fullScreen: true,
    color: '',
    size: 14,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontFamily: 'PingFang SC',
    rotate: -25,
    zIndex: 1100,
    opacity: undefined,
    layout: 'grid',
    customStyle: '',
    customClass: '',
  },
);

defineSlots<{
  /** Custom tile content (replaces `content` / `image`). */
  default?(): unknown;
}>();

const slots = useSlots();

/** Nothing to mark when `content`, `image` and the default slot are all empty. */
const hasTileContent = computed(
  () => props.content !== '' || props.image !== '' || slots.default !== undefined,
);

/** Tiles per row / per column, from the tile size + gutter. */
const cols = computed(() => Math.max(1, Math.ceil(CANVAS_RPX / (props.width + props.gutterX))));
const rows = computed(() => Math.max(1, Math.ceil(CANVAS_RPX / (props.height + props.gutterY))));

/** Flat tile list, one entry per grid cell. */
const tiles = computed(() => {
  const list: Array<{ row: number; col: number; offset: boolean }> = [];
  for (let row = 0; row < rows.value; row++) {
    for (let col = 0; col < cols.value; col++) {
      list.push({ row, col, offset: props.layout === 'staggered' && row % 2 === 1 });
    }
  }
  return list;
});

const rootStyle = computed(() => {
  const parts = [`z-index: ${props.zIndex}`];
  if (props.opacity !== undefined) parts.push(`opacity: ${props.opacity}`);
  if (props.customStyle) parts.push(props.customStyle);
  return parts.join('; ');
});

/** The rotated layer: covers more than the viewport so corners stay filled. */
const layerStyle = computed(() => `transform: rotate(${props.rotate}deg)`);

const tileStyle = computed(() => {
  const parts = [
    `width: ${props.width}px`,
    `height: ${props.height}px`,
    `margin-right: ${props.gutterX}px`,
    `margin-bottom: ${props.gutterY}px`,
  ];
  return parts.join('; ');
});

const textStyle = computed(() => {
  const parts = [
    `font-size: ${props.size}px`,
    `font-style: ${props.fontStyle}`,
    `font-weight: ${props.fontWeight}`,
    `font-family: ${props.fontFamily}`,
  ];
  if (props.color) parts.push(`color: ${props.color}`);
  return parts.join('; ');
});

const imageStyle = computed(() => `width: ${props.imageWidth}px; height: ${props.imageHeight}px`);

const rootClass = computed(() => [
  'sn-watermark',
  {
    'sn-watermark--full-screen': props.fullScreen,
    'sn-watermark--staggered': props.layout === 'staggered',
  },
  props.customClass,
]);
</script>

<template>
  <view
    v-if="hasTileContent"
    data-snui-component="watermark"
    :class="rootClass"
    :style="rootStyle"
    aria-hidden="true"
  >
    <view class="sn-watermark__layer" :style="layerStyle">
      <view class="sn-watermark__grid">
        <view
          v-for="(tile, index) in tiles"
          :key="index"
          class="sn-watermark__tile"
          :class="{ 'sn-watermark__tile--offset': tile.offset }"
          :style="tileStyle"
        >
          <slot>
            <image
              v-if="image"
              class="sn-watermark__image"
              :src="image"
              mode="aspectFit"
              :style="imageStyle"
            />
            <text v-else class="sn-watermark__text" :style="textStyle">{{ content }}</text>
          </slot>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-watermark {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
  /* Watermark ink: the disabled-tier neutral reads as a faint mark in both
   * themes without a hardcoded gray. `color` overrides it inline. */
  color: var(--sn-mp-color-text-disabled);
}

.sn-watermark--full-screen {
  position: fixed;
}

.sn-watermark__layer {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  transform-origin: center center;
}

.sn-watermark__grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 100%;
  height: 100%;
}

.sn-watermark__tile {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  box-sizing: border-box;
}

.sn-watermark__tile--offset {
  margin-left: 50%;
}

.sn-watermark__text {
  color: inherit;
  line-height: var(--sn-mp-font-line-height-tight);
  text-align: center;
  white-space: nowrap;
}

.sn-watermark__image {
  display: block;
}
</style>
