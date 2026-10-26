<script setup lang="ts">
/**
 * sn-gap (uni-end) — vertical spacer between content blocks.
 *
 * Reference library: wot-ui `wd-gap`
 *   (https://wot-ui.cn/component/gap.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-gap 1:1:
 *   height / bg-color / safe-area-bottom / custom-class / custom-style.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * ## Why `safeAreaBottom` is a real prop here
 *
 * The mobile ends have a home indicator / gesture bar over the last ~34px of
 * the screen. A spacer placed at the bottom of a scrolling page has to add
 * that inset or the last row of content sits under the bar. `env(safe-area-inset-bottom)`
 * is the only cross-end way to read it, and uni-app maps it on every target
 * that supports it — a value of `0px` on targets that do not, so the spacer
 * degrades to its plain height.
 *
 * ## Height semantics
 *
 * A numeric `height` is px (the upstream contract, default `14`); a string is
 * forwarded verbatim so `20rpx` keeps the design-canvas rhythm.
 *
 * Per Spec-02 v1.1 §3 (end: mp), uni-side component CSS uses only
 * `--sn-mp-*` aliases (rpx units). The `end: mp` marker in ai-description.md
 * is consumed by `@snui/cli` and MCP tools for per-end filtering.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-gap/sn-gap.vue
 * → auto-registered as `<sn-gap>` in any .vue that uses it.
 *
 * Usage:
 *   <sn-gap />
 *   <sn-gap :height="24" />
 *   <sn-gap height="40rpx" bg-color="var(--sn-mp-color-background-subtle)" />
 *   <sn-gap safe-area-bottom />
 *
 * Not responsible for:
 *   - 分割线 — 用 sn-divider
 *   - 布局间距体系 — 用 flex / grid 容器样式
 */

import { computed } from 'vue'

defineOptions({ name: 'SnGap' })

// Reference: wot-ui wd-gap Attributes
//   (https://wot-ui.cn/component/gap.html)
// All prop names match wd-gap 1:1.
const props = withDefaults(
  defineProps<{
    /** 间隔槽高度：数字按 px，字符串原样转发（如 `20rpx`）。 */
    height?: string | number
    /** 背景颜色（内联覆盖，默认透明）。 */
    bgColor?: string
    /** 是否开启底部安全区适配（叠加 `env(safe-area-inset-bottom)`）。 */
    safeAreaBottom?: boolean
    /** 根节点自定义类名。 */
    customClass?: string
    /** 根节点自定义 inline style。 */
    customStyle?: string
  }>(),
  {
    height: 14,
    bgColor: 'transparent',
    safeAreaBottom: false,
    customClass: '',
    customStyle: '',
  },
)

/** Numeric heights are px (upstream contract); strings pass through. */
const resolvedHeight = computed<string>(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height,
)

const rootClass = computed(() => [
  'sn-gap',
  props.safeAreaBottom ? 'sn-gap--safe-area' : '',
  props.customClass,
])

const rootStyle = computed(() => {
  const parts: string[] = [`height: ${resolvedHeight.value}`]
  if (props.bgColor && props.bgColor !== 'transparent') {
    parts.push(`background-color: ${props.bgColor}`)
  }
  if (props.customStyle) parts.push(props.customStyle)
  return parts.join('; ')
})
</script>

<template>
  <view
    data-snui-component="gap"
    :class="rootClass"
    :style="rootStyle"
    role="presentation"
    aria-hidden="true"
  />
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-gap {
  display: block;
  flex: 0 0 auto;
  width: 100%;
  background-color: transparent;
}

/*
 * Bottom safe-area padding.
 *
 * `padding-bottom` rather than a taller box: the spacer's own height stays the
 * caller's number, and the inset is additive on top of it. `env()` falls back
 * to `0px` on targets without a safe area (H5 in a normal browser tab, most
 * miniprogram simulators), so the plain height is the floor everywhere.
 */
.sn-gap--safe-area {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  box-sizing: content-box;
}
</style>
