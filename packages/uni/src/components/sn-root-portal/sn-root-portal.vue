<script setup lang="ts">
/**
 * sn-root-portal (uni-end) — render content at the page root.
 *
 * Reference library: wot-ui `wd-root-portal`
 *   (https://wot-ui.cn/component/root-portal.html)
 * Per AGENTS.md §112, this component mirrors wd-root-portal's surface: no
 * props, one `default` slot.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-root-portal/sn-root-portal.vue
 * → auto-registered as `<sn-root-portal>` in any .vue that uses it.
 *
 * ## What "root portal" means on the uni end
 *
 * The web end can use Vue's `<Teleport to="body">`. Mini programs have no
 * `body`, and native App has no document tree — so the same *intent* (escape a
 * `position: relative` / `overflow: hidden` ancestor) has to be expressed
 * differently per target. There is no single API that does it everywhere, and
 * inventing one would silently change rendering on some targets.
 *
 * What this component therefore guarantees:
 *
 *   1. The content is wrapped in a **fixed, full-viewport layer**, which is
 *      what callers actually need from a portal (an overlay that is not
 *      clipped by its parent).
 *   2. The layer is `pointer-events: none` so it never blocks the page; the
 *      content itself re-enables events. A portal that swallowed every tap
 *      would be a worse failure than being clipped.
 *   3. Visibility is a plain boolean prop-free contract: mount the component
 *      to show the content, unmount to hide it.
 *
 * ## Deliberately not implemented
 *
 * Reparenting the DOM node (true teleport). On WeChat / Alipay MP the render
 * tree is fixed at compile time; `root-portal` in the upstream library relies
 * on platform-specific hooks this library does not ship. Callers who need a
 * real overlay should use `sn-popup` / `sn-overlay`, which are the supported
 * path. This is documented in the component's doc pages rather than pretended.
 *
 * Per AGENTS.md §32 this component handles rendering only.
 *
 * Not responsible for:
 *   - 弹层显隐与动画 — 用 `sn-popup`
 *   - 遮罩与滚动锁定 — 用 `sn-overlay`
 */

import { computed } from 'vue'

defineOptions({ name: 'SnRootPortal' })

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-root-portal` has no props ───────────────────────────── */

    /**
     * Extra class on the fixed layer.
     *
     * Additive AUI hook, not part of wd-root-portal's surface: without a
     * teleport target the layer is the only thing a caller can style, so it
     * needs an escape hatch. Documented as additive.
     */
    customClass?: string
    /** Extra inline style on the fixed layer. Additive, same reason. */
    customStyle?: string
  }>(),
  {
    customClass: '',
    customStyle: '',
  },
)

defineSlots<{
  /** 需要传送到页面根层的内容。 */
  default?(): unknown
}>()

const rootStyle = computed(() => props.customStyle || undefined)
</script>

<template>
  <view
    :class="['sn-root-portal', customClass]"
    :style="rootStyle"
    data-snui-component="root-portal"
  >
    <slot />
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */
.sn-root-portal {
  /*
   * The layer. `position: fixed` with zero insets is what makes the content
   * escape a clipped / transformed ancestor — the one behaviour a portal has
   * to provide.
   *
   * `pointer-events: none` keeps the invisible full-viewport box from
   * swallowing taps; `> :deep(*)` re-enables them on the actual content so a
   * button inside the portal stays tappable.
   *
   * z-index comes from the theme's overlay slot so a portal never lands above
   * a dialog by accident.
   */
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  pointer-events: none;
  display: block;
}

.sn-root-portal > :deep(*) {
  pointer-events: auto;
}
</style>
