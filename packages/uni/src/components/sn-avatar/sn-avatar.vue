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
 * Not responsible for:
 *   - 头像叠层 / 折叠计数 — 用 sn-avatar-group
 *   - 角标 — 用 sn-badge
 *   - 上传 / 裁剪 — 用 sn-upload
 */

import { computed, markRaw, ref, watch } from 'vue'
import SnIcon from '../sn-icon/sn-icon.vue'
import type { IconData } from '../sn-icon/sn-icon.vue'
import { resolveIconByName } from '../sn-icon/sn-icon-registry'

defineOptions({ name: 'SnAvatar' })

/** Named size presets → rpx diameter (750 design canvas, 1px = 2rpx). */
const SIZE_PRESETS: Readonly<Record<'large' | 'medium' | 'normal' | 'small', string>> = {
  large: '112rpx',
  medium: '96rpx',
  normal: '72rpx',
  small: '48rpx',
}

/**
 * Numeric sizes are px (the upstream contract); strings pass through so `rpx`
 * and `%` stay usable.
 */
function resolveSize(size: string | number): string {
  if (typeof size === 'number') return `${size}px`
  const preset = SIZE_PRESETS[size as keyof typeof SIZE_PRESETS]
  return preset ?? size
}

// Reference: wot-ui wd-avatar Attributes
//   (https://wot-ui.cn/component/avatar.html)
// All prop names match wd-avatar 1:1.
const props = withDefaults(
  defineProps<{
    /** 图片地址。加载失败时按 `alt` → 文字 → 图标 顺序回退。 */
    src?: string
    /** 文本内容（无图片 / 图片失败时显示）。 */
    text?: string
    /** 图标名称（经 `registerSnIcons()` 注册的 sn-icon 名称）。 */
    icon?: string
    /** 图标类名前缀，`cssIcon` 打开时用于拼出字体图标 class。 */
    iconPrefix?: string
    /** CSS（字体）图标：`true` 用 `iconPrefix`，字符串则直接作为 class 前缀。 */
    cssIcon?: boolean | string
    /** 头像尺寸：large / medium / normal / small，或自定义数值 / 单位字符串。 */
    size?: string | number
    /** 头像形状：round / square。 */
    shape?: 'round' | 'square'
    /** 背景颜色（内联覆盖默认底色）。 */
    bgColor?: string
    /** 文字颜色（内联覆盖默认文字色）。 */
    color?: string
    /** 图片加载失败时的占位文本。 */
    alt?: string
    /** 图片填充模式，同 uni-app image 组件的 mode。 */
    mode?: string
    /** 根节点自定义类名。 */
    customClass?: string
    /** 根节点自定义 inline style。 */
    customStyle?: string
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
    customClass: '',
    customStyle: '',
  },
)

const emit = defineEmits<{
  /** 点击头像时触发。 */
  (e: 'click', event: Event): void
  /** 图片加载失败时触发。 */
  (e: 'error', event: Event): void
}>()

defineSlots<{
  /** 自定义头像内容（优先于 src / text / icon）。 */
  default?(): unknown
}>()

/** Set once the `<image>` load fails; forces the text / icon fallback. */
const imageFailed = ref(false)

// A new src is a fresh chance for the image to load — otherwise a recycled
// avatar instance would keep showing the fallback for its whole lifetime.
watch(
  () => props.src,
  () => {
    imageFailed.value = false
  },
)

const showImage = computed<boolean>(() => Boolean(props.src) && !imageFailed.value)

/** Registry-resolved icon data for the `icon` prop (null when unknown). */
const iconData = computed<IconData | null>(() => {
  if (!props.icon) return null
  const resolved = resolveIconByName(props.icon)
  return resolved ? markRaw(resolved) : null
})

/** Font-icon class list (same contract as sn-tag / sn-button). */
const cssIconClass = computed<string>(() => {
  if (!props.icon || !props.cssIcon) return ''
  const prefix = typeof props.cssIcon === 'string' ? props.cssIcon : props.iconPrefix
  return prefix ? `${prefix}-${props.icon}` : props.icon
})

/** Fallback label: `alt` wins over `text` when the image failed. */
const fallbackText = computed<string>(() => {
  if (props.src && imageFailed.value && props.alt) return props.alt
  return props.text
})

/** True when `size` is one of the four named presets (drives the size class). */
const isPresetSize = computed<boolean>(
  () => typeof props.size === 'string' && props.size in SIZE_PRESETS,
)

const rootClass = computed(() => [
  'sn-avatar',
  `sn-avatar--${props.shape}`,
  isPresetSize.value ? `sn-avatar--size-${props.size}` : '',
  props.customClass,
])

const rootStyle = computed(() => {
  const parts: string[] = [`width: ${resolveSize(props.size)}`, `height: ${resolveSize(props.size)}`]
  if (props.bgColor) parts.push(`background-color: ${props.bgColor}`)
  if (props.color) parts.push(`color: ${props.color}`)
  if (props.customStyle) parts.push(props.customStyle)
  return parts.join('; ')
})

function onTap(event: Event): void {
  emit('click', event)
}

function onImageError(event: Event): void {
  imageFailed.value = true
  emit('error', event)
}
</script>

<template>
  <view
    data-snui-component="avatar"
    :class="rootClass"
    :style="rootStyle"
    role="img"
    :aria-label="fallbackText || alt || undefined"
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
        :size="props.size === 'small' ? 24 : 32"
      />
      <text v-else-if="cssIconClass" :class="['sn-avatar__icon', cssIconClass]" aria-hidden="true" />
    </slot>
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
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-semibold);
  line-height: 1;
  vertical-align: middle;
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

.sn-avatar__image {
  display: block;
  width: 100%;
  height: 100%;
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
