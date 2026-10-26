<script setup lang="ts">
/**
 * sn-empty (uni-end) — empty-state placeholder for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-empty`
 *   (https://wot-ui.cn/component/empty.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-empty 1:1
 * (same prop names, defaults, allowed value sets). Anything new added here
 * MUST also be added to the reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-empty/sn-empty.vue
 * → auto-registered as `<sn-empty>` in any .vue that uses it.
 *
 * Per AGENTS.md §32, this component handles rendering only. No schema
 * validation; no business logic; no data fetching.
 *
 * ## Icon resolution order (mirrors wd-empty `icon` / `icon-prefix` / `css-icon`)
 *
 *   1. `icon` looks like a URL / absolute path (`http…`, `/…`, `data:`)
 *      → rendered as `<image mode="aspectFit">`
 *   2. `cssIcon` is truthy (`true` or a class string) → `icon` (or
 *      `iconPrefix`) is applied as a CSS class on a `<text>` glyph node —
 *      the iconfont path, same convention as sn-input's `cssIcon`
 *   3. `icon` resolves through the sn-icon registry (populated by
 *      `registerSnIcons()`) → inline SVG via `<sn-icon>`
 *   4. nothing resolves → the built-in inline "empty box" glyph
 *
 * Per AGENTS.md §113, the built-in glyph is inline SVG paths, never an
 * emoji or an external image.
 *
 * Usage:
 *   <sn-empty tip="暂无数据" />
 *   <sn-empty icon="empty" icon-size="200" tip="没有搜索结果" />
 *   <sn-empty :css-icon="true" icon="icon-empty" tip="没有订单" />
 *
 * Not responsible for:
 *   - 加载中占位 — 用 sn-loading
 *   - 骨架屏 — 用 sn-skeleton
 *   - 错误页 / 404 页模板 — 用 templates 包
 */

import { computed, markRaw } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { resolveIconByName } from '../sn-icon/sn-icon-registry';

defineOptions({ name: 'SnEmpty' });

const props = withDefaults(
  defineProps<{
    /** Icon name, registry key, image URL, or CSS class (see header). */
    icon?: string;
    /** Iconfont class prefix, applied together with `icon`. */
    iconPrefix?: string;
    /** CSS-icon mode: treat `icon` / `iconPrefix` as class names. */
    cssIcon?: boolean | string;
    /** Icon / image size. A bare number is treated as rpx. */
    iconSize?: number | string;
    /** Tip text under the glyph. */
    tip?: string;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
  }>(),
  {
    icon: 'empty',
    iconPrefix: '',
    cssIcon: false,
    iconSize: '',
    tip: '',
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** Custom glyph area — replaces the icon / image resolution above. */
  image?(): unknown;
  /** Content below the tip (e.g. a retry button). */
  bottom?(): unknown;
}>();

/**
 * Built-in glyph: a box with a slash — the "nothing here" mark. Inline SVG
 * paths (AGENTS.md §113), drawn on a 24×24 grid like the rest of the set.
 */
const DEFAULT_GLYPH: IconData = markRaw({
  viewBox: '0 0 24 24',
  paths: ['M3 7.5 12 3l9 4.5v9L12 21 3 16.5Z', 'M3 7.5 12 12l9-4.5', 'M12 12v9', 'M4 20 20 4'],
});

/** Looks like an image source rather than an icon name. */
function isImageSource(value: string): boolean {
  return /^(https?:|data:|\/\/|\/|\.{1,2}\/)/.test(value);
}

const isImage = computed(() => Boolean(props.icon) && isImageSource(props.icon));

/** CSS-icon mode is on (`true` or a non-empty class string). */
const isCssIcon = computed(
  () => props.cssIcon === true || (typeof props.cssIcon === 'string' && props.cssIcon !== ''),
);

/** Registry icon data for `icon`, or `undefined`. */
const registryIcon = computed<IconData | null>(() => {
  if (isImage.value || isCssIcon.value) return null;
  const icon = props.icon ? resolveIconByName(props.icon) : undefined;
  return icon ? markRaw(icon) : null;
});

/** Render the built-in glyph when nothing else resolved. */
const showsDefaultGlyph = computed(
  () => !isImage.value && !isCssIcon.value && registryIcon.value === null,
);

/** CSS classes applied to the CSS-icon glyph node. */
const cssIconClass = computed(() => [props.iconPrefix, props.icon].filter(Boolean));

/** Resolved glyph size. A bare number is rpx; strings pass through. */
const glyphSize = computed(() => {
  if (props.iconSize === '' || props.iconSize === undefined) return undefined;
  return typeof props.iconSize === 'number' ? `${props.iconSize}rpx` : props.iconSize;
});

const glyphStyle = computed(() => {
  if (!glyphSize.value) return undefined;
  return `width: ${glyphSize.value}; height: ${glyphSize.value}; font-size: ${glyphSize.value}`;
});

const rootClass = computed(() => ['sn-empty', props.customClass]);
const rootStyle = computed(() => (props.customStyle ? props.customStyle : undefined));
</script>

<template>
  <view
    data-snui-component="empty"
    :class="rootClass"
    :style="rootStyle"
    role="status"
    :aria-label="tip || 'empty'"
  >
    <view class="sn-empty__image" :style="glyphStyle" aria-hidden="true">
      <slot name="image">
        <image v-if="isImage" class="sn-empty__img" :src="icon" mode="aspectFit" />
        <text v-else-if="isCssIcon" class="sn-empty__css-icon" :class="cssIconClass" />
        <SnIcon v-else-if="registryIcon" :icon="registryIcon" :size="glyphSize ?? 96" />
        <SnIcon v-else-if="showsDefaultGlyph" :icon="DEFAULT_GLYPH" :size="glyphSize ?? 96" />
      </slot>
    </view>

    <text v-if="tip" class="sn-empty__tip">{{ tip }}</text>

    <view v-if="$slots.bottom" class="sn-empty__bottom">
      <slot name="bottom" />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding-bottom: var(--sn-mp-spacing-12);
  /* Glyph color — a disabled-tier neutral, so it reads as "inactive" in both
   * themes without hardcoding a gray. */
  color: var(--sn-mp-color-text-disabled);
}

.sn-empty__image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 192rpx;
  height: 192rpx;
  font-size: 192rpx;
  line-height: 1;
}

.sn-empty__img {
  width: 100%;
  height: 100%;
}

.sn-empty__css-icon {
  display: block;
  width: 100%;
  height: 100%;
  font-size: inherit;
  line-height: 1;
}

.sn-empty__tip {
  margin-top: var(--sn-mp-spacing-5);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  text-align: center;
}

.sn-empty__bottom {
  margin-top: var(--sn-mp-spacing-5);
}

/* Doodle skin — hand-drawn double outline on the glyph box. */
.snui-skin-doodle .sn-empty__image {
  border: 4rpx dashed var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-xl);
}
</style>
