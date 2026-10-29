<script setup lang="ts">
/**
 * sn-avatar (uni-end) — image / text / icon avatar for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-avatar`
 *   (https://wot-ui.cn/component/avatar.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-avatar 1:1:
 *   src / text / icon / icon-prefix / css-icon / size / shape / bg-color /
 *   color / alt / mode / custom-class / custom-style.
 * The avatar-*group* props (`max-count` / `cascading` / `collapse-avatar` /
 * `vertical`) belong to the sibling group component and are intentionally NOT
 * declared here — a single avatar has no stacking semantics.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * ## Why `<image>` and not `<img>`
 *
 * uni-app compiles `<image>` to the native image view on every target
 * (miniprogram `<image>`, App `<image>`, H5 `<img>`); `<img>` does not exist on
 * miniprogram. `mode` is forwarded verbatim because uni-app owns that enum and
 * a consumer may need any of its values.
 *
 * ## Fallback chain
 *
 * `src` → `text` → `icon` → `alt` → default slot. An image error flips an
 * internal flag so the avatar degrades to the text / icon layer instead of
 * showing a broken image box — a silent behaviour change is worse than a
 * documented fallback (AGENTS.md §84 / §85).
 *
 * Per Spec-02 v1.1 §3 (end: mp), uni-side component CSS uses only
 * `--sn-mp-*` aliases (rpx units). The `end: mp` marker in ai-description.md
 * is consumed by `@snui/cli` and MCP tools for per-end filtering.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-avatar/sn-avatar.vue
 * → auto-registered as `<sn-avatar>` in any .vue that uses it.
 *
 * Usage:
 *   <sn-avatar src="/static/a.png" />
 *   <sn-avatar text="AU" size="large" />
 *   <sn-avatar icon="User" shape="square" bg-color="var(--sn-mp-color-action-primary)" />
 *   <sn-avatar :size="88" src="/static/b.png" alt="B" />
 *
 * ## Additive: presence status (AUI 追加，wd-avatar 没有此能力)
 *
 * `status` paints an online / offline presence dot on the bottom-right corner.
 * wd-avatar has no presence concept, so this is an AUI addition registered in
 * AGENTS.md §112.3a — the reference prop surface stays 1:1 (`status` is only
 * additive; nothing existing changed meaning). The dot is decorative in the
 * DOM but announced through the root `aria-label`, so a text avatar reads as
 * "AU online" instead of dropping the state silently.
 *
 * Not responsible for:
 *   - 头像叠层 / 折叠计数 — 用 sn-avatar-group
 *   - 角标 — 用 sn-badge
 *   - 上传 / 裁剪 — 用 sn-upload
 *
 * ## Inside sn-avatar-group
 *
 * The group owns the members' uniform `size` / `shape` (wd-avatar-group:
 * 「统一设置组内头像尺寸 / 形状」), so a provided group context wins over this
 * component's own props — see `avatar-group-context.ts`. The group also hands
 * down the stacking numbers (`--sn-avatar-group-overlap-*`, `-ring`) that the
 * stylesheet below applies to itself.
 */

import { computed, inject, markRaw, ref, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { resolveIconByName } from '../sn-icon/sn-icon-registry';
import { SN_AVATAR_GROUP } from './avatar-group-context';

defineOptions({ name: 'SnAvatar' });

/** Named size presets → rpx diameter (750 design canvas, 1px = 2rpx). */
const SIZE_PRESETS: Readonly<Record<'large' | 'medium' | 'normal' | 'small', string>> = {
  large: '112rpx',
  medium: '96rpx',
  normal: '72rpx',
  small: '48rpx',
};

/**
 * Numeric sizes are px (the upstream contract); strings pass through so `rpx`
 * and `%` stay usable.
 */
function resolveSize(size: string | number): string {
  if (typeof size === 'number') return `${size}px`;
  const preset = SIZE_PRESETS[size as keyof typeof SIZE_PRESETS];
  return preset ?? size;
}

// Reference: wot-ui wd-avatar Attributes
//   (https://wot-ui.cn/component/avatar.html)
// All prop names match wd-avatar 1:1.
const props = withDefaults(
  defineProps<{
    /** 图片地址。加载失败时按 `alt` → 文字 → 图标 顺序回退。 */
    src?: string;
    /** 文本内容（无图片 / 图片失败时显示）。 */
    text?: string;
    /** 图标名称（经 `registerSnIcons()` 注册的 sn-icon 名称）。 */
    icon?: string;
    /** 图标类名前缀，`cssIcon` 打开时用于拼出字体图标 class。 */
    iconPrefix?: string;
    /** CSS（字体）图标：`true` 用 `iconPrefix`，字符串则直接作为 class 前缀。 */
    cssIcon?: boolean | string;
    /** 头像尺寸：large / medium / normal / small，或自定义数值 / 单位字符串。 */
    size?: string | number;
    /** 头像形状：round / square。 */
    shape?: 'round' | 'square';
    /** 背景颜色（内联覆盖默认底色）。 */
    bgColor?: string;
    /** 文字颜色（内联覆盖默认文字色）。 */
    color?: string;
    /** 图片加载失败时的占位文本。 */
    alt?: string;
    /** 图片填充模式，同 uni-app image 组件的 mode。 */
    mode?: string;
    /**
     * 在线状态（AUI 追加，wd-avatar 无此能力，见文件头注释）：
     * `online` 绿点 / `offline` 灰点；不传则不渲染状态点。
     */
    status?: 'online' | 'offline' | '';
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义 inline style。 */
    customStyle?: string;
  }>(),
  {
    src: '',
    text: '',
    icon: '',
    iconPrefix: '',
    cssIcon: false,
    size: 'normal',
    shape: 'round',
    bgColor: '',
    color: '',
    alt: '',
    mode: 'aspectFill',
    status: '',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** 点击头像时触发。 */
  (e: 'click', event: Event): void;
  /** 图片加载失败时触发。 */
  (e: 'error', event: Event): void;
}>();

defineSlots<{
  /** 自定义头像内容（优先于 src / text / icon）。 */
  default?(): unknown;
}>();

/** Set once the `<image>` load fails; forces the text / icon fallback. */
const imageFailed = ref(false);

// A new src is a fresh chance for the image to load — otherwise a recycled
// avatar instance would keep showing the fallback for its whole lifetime.
watch(
  () => props.src,
  () => {
    imageFailed.value = false;
  },
);

const showImage = computed<boolean>(() => Boolean(props.src) && !imageFailed.value);

/** Registry-resolved icon data for the `icon` prop (null when unknown). */
const iconData = computed<IconData | null>(() => {
  if (!props.icon) return null;
  const resolved = resolveIconByName(props.icon);
  return resolved ? markRaw(resolved) : null;
});

/** Font-icon class list (same contract as sn-tag / sn-button). */
const cssIconClass = computed<string>(() => {
  if (!props.icon || !props.cssIcon) return '';
  const prefix = typeof props.cssIcon === 'string' ? props.cssIcon : props.iconPrefix;
  return prefix ? `${prefix}-${props.icon}` : props.icon;
});

/** Fallback label: `alt` wins over `text` when the image failed. */
const fallbackText = computed<string>(() => {
  if (props.src && imageFailed.value && props.alt) return props.alt;
  return props.text;
});

/**
 * Group context: inside `sn-avatar-group` the group's `size` / `shape` win —
 * the reference contract is "统一设置组内头像尺寸 / 形状" (uniformly set the
 * group's avatars). `inject` is template-independent, so this survives the MP
 * compiler, unlike re-rendering the slot's vnodes with extra props.
 */
const group = inject(SN_AVATAR_GROUP, null);

/** Effective diameter source: group → own prop → `normal` default. */
const sizeSource = computed<string | number>(() => group?.value.size ?? props.size);

/** Effective outline: group → own prop. */
const shapeSource = computed<'round' | 'square'>(() => group?.value.shape ?? props.shape);

/** True when `size` is one of the four named presets (drives the size class). */
const isPresetSize = computed<boolean>(
  () => typeof sizeSource.value === 'string' && sizeSource.value in SIZE_PRESETS,
);

/** Presence state drives both the dot class and the spoken label. */
const hasStatus = computed<boolean>(() => props.status !== '');

/**
 * Accessible name: the visible label first, then the presence state, so an
 * avatar announced as an image still carries "online" / "offline"
 * (AGENTS.md §52 — the dot itself is `aria-hidden`).
 */
const ariaLabel = computed<string | undefined>(() => {
  const label = fallbackText.value || props.alt;
  if (!hasStatus.value) return label || undefined;
  return [label, props.status].filter(Boolean).join(' ');
});

const rootClass = computed(() => [
  'sn-avatar',
  `sn-avatar--${shapeSource.value}`,
  isPresetSize.value ? `sn-avatar--size-${sizeSource.value}` : '',
  hasStatus.value ? `sn-avatar--status-${props.status}` : '',
  props.customClass,
]);

const rootStyle = computed(() => {
  const parts: string[] = [
    `width: ${resolveSize(sizeSource.value)}`,
    `height: ${resolveSize(sizeSource.value)}`,
  ];
  if (props.bgColor) parts.push(`background-color: ${props.bgColor}`);
  if (props.color) parts.push(`color: ${props.color}`);
  if (props.customStyle) parts.push(props.customStyle);
  return parts.join('; ');
});

function onTap(event: Event): void {
  emit('click', event);
}

function onImageError(event: Event): void {
  imageFailed.value = true;
  emit('error', event);
}
</script>

<template>
  <view
    data-snui-component="avatar"
    :class="rootClass"
    :style="rootStyle"
    role="img"
    :aria-label="ariaLabel"
    @tap="onTap"
  >
    <slot>
      <image
        v-if="showImage"
        class="sn-avatar__image"
        :src="src"
        :mode="mode"
        @error="onImageError"
      />
      <text v-else-if="fallbackText" class="sn-avatar__text">{{ fallbackText }}</text>
      <SnIcon
        v-else-if="iconData"
        class="sn-avatar__icon"
        :icon="iconData"
        :size="sizeSource === 'small' ? 24 : 32"
      />
      <text
        v-else-if="cssIconClass"
        :class="['sn-avatar__icon', cssIconClass]"
        aria-hidden="true"
      />
    </slot>

    <!-- Presence dot (additive): decorative, the state rides on aria-label. -->
    <view v-if="hasStatus" class="sn-avatar__status" aria-hidden="true" />
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-avatar {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex: 0 0 auto;
  /* No `overflow: hidden` here on purpose: the root hosts the absolutely
     positioned presence dot on the corner, and clipping the root would shave
     the dot off. The round shape is instead carried by the image itself
     (`border-radius: inherit` below), which clips the photo to the circle. */
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-semibold);
  line-height: 1;
  vertical-align: middle;
  /* Group stacking contract (sn-avatar-group hands these down; see that file
     for why the child styles itself instead of the group reaching in with a
     `:deep()` rule — App cannot express one, AGENTS.md §116.2). A standalone
     avatar inherits the neutral defaults below and keeps its own geometry. */
  margin-left: var(--sn-avatar-group-overlap-left, 0);
  margin-top: var(--sn-avatar-group-overlap-top, 0);
  box-shadow: var(--sn-avatar-group-ring, 0 0 0 0 transparent);
}

.sn-avatar--square {
  border-radius: var(--sn-mp-radius-md);
}

/* Named size presets. The inline width / height carry the same value; the
   classes exist so the label font-size can scale with the diameter (a 48rpx
   avatar cannot hold a 32rpx label). */
.sn-avatar--size-small {
  font-size: var(--sn-mp-font-size-xs);
}

.sn-avatar--size-normal {
  font-size: var(--sn-mp-font-size-md);
}

.sn-avatar--size-medium {
  font-size: var(--sn-mp-font-size-lg);
}

.sn-avatar--size-large {
  font-size: var(--sn-mp-font-size-xl);
}

/* ── Presence dot (additive) ───────────────────────────────────────────── */

/* Anchored on the bottom-right corner like the reference badge layout. The
   root no longer clips (the image carries its own radius), so the dot is
   never shaved by the avatar's border; the surface-coloured ring keeps it
   legible on top of a photo. */
.sn-avatar__status {
  position: absolute;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  width: 20rpx;
  height: 20rpx;
  border: 4rpx solid var(--sn-mp-color-background-surface);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-text-tertiary);
}

.sn-avatar--status-online .sn-avatar__status {
  background-color: var(--sn-mp-color-feedback-success);
}

.sn-avatar--status-offline .sn-avatar__status {
  background-color: var(--sn-mp-color-text-tertiary);
}

/* The dot scales with the preset — a 20rpx dot covers half of a 48rpx head. */
.sn-avatar--size-small .sn-avatar__status {
  width: 16rpx;
  height: 16rpx;
  border-width: 3rpx;
}

.sn-avatar--size-medium .sn-avatar__status {
  width: 24rpx;
  height: 24rpx;
}

.sn-avatar--size-large .sn-avatar__status {
  width: 28rpx;
  height: 28rpx;
}
.sn-avatar__image {
  display: block;
  width: 100%;
  height: 100%;
  /* The photo clips itself to the shape (the root cannot clip — it hosts the
     presence dot on the corner, see the root rule above). */
  border-radius: inherit;
}

.sn-avatar__text {
  padding: 0 4rpx;
  color: inherit;
  font-size: inherit;
  line-height: inherit;
  text-align: center;
  /* Long names must not break the circle. */
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sn-avatar__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  font-size: inherit;
}

/* ── Doodle skin ───────────────────────────────────────────────────────── */

.snui-skin-doodle .sn-avatar {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-md);
  font-weight: var(--sn-mp-font-weight-bold);
}
</style>
