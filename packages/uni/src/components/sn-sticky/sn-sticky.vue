<script setup lang="ts">
/**
 * sn-sticky (uni-end) — pin content to the top of its scroll container.
 *
 * Reference library: wot-ui `wd-sticky`
 *   (https://wot-ui.cn/component/sticky.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-sticky 1:1
 * (`z-index` / `offset-top` / `custom-class` / `custom-style`).
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-sticky/sn-sticky.vue
 * → auto-registered as `<sn-sticky>` in any .vue that uses it.
 *
 * ## Why this is CSS-only
 *
 * wd-sticky observes the scroll position and toggles a class. On uni the same
 * effect is expressible with `position: sticky`, which every target supports
 * inside a `scroll-view` (and on the page itself). That removes the scroll
 * listener, the bounding-box measurement and the dispose obligation entirely
 * (§41): there is no subscription to leak.
 *
 * `offsetTop` maps to the `top` inset, which is exactly the "吸顶距离" the
 * prop promises.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 滚动容器的创建 — 由宿主页面 / scroll-view 提供
 *   - 层级冲突 — 用 `z-index` prop 调整
 */

import { computed } from 'vue';

defineOptions({ name: 'SnSticky' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-sticky` 1:1 surface ─────────────────────────────────── */

    /** 层级。 */
    zIndex?: number;
    /** 吸顶距离（px）。 */
    offsetTop?: number;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    zIndex: 1,
    offsetTop: 0,
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** 需要吸顶的内容。 */
  default?(): unknown;
}>();

const rootClass = computed(() => ['sn-sticky', props.customClass]);

const rootStyle = computed(() => {
  const parts = [`top: ${props.offsetTop}px`, `z-index: ${props.zIndex}`];
  if (props.customStyle) parts.push(props.customStyle);
  return parts.join('; ');
});
</script>

<template>
  <view data-snui-component="sticky" :class="rootClass" :style="rootStyle">
    <slot />
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-sticky {
  position: sticky;
  box-sizing: border-box;
  width: 100%;
  background-color: var(--sn-mp-color-background-surface);
}
</style>
