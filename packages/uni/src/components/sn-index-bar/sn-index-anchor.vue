<script setup lang="ts">
/**
 * sn-index-anchor (uni-end) — one lettered section inside a `sn-index-bar`.
 *
 * Reference library: wot-ui `wd-index-anchor`
 *   (https://wot-ui.cn/component/index-bar.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-index-anchor 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * Lives next to `sn-index-bar.vue` so the provide/inject contract types
 * (`sn-index-bar-types.ts`) stay beside both halves of the pair.
 *
 * ## Scrolling contract
 *
 * The anchor registers its DOM id with the bar. On uni the cheapest reliable
 * way to move a `scroll-view` is its `scroll-into-view` prop, which needs a
 * node id — so each anchor renders an id derived from its registration uid and
 * the bar jumps to it. No selector queries, no measured offsets.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 索引侧边栏 — 由 sn-index-bar 渲染
 *   - 分组数据 — 由使用方提供
 */

import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { nextUid } from '../../utils/uid'
import { SN_INDEX_BAR_KEY, type SnIndexBarValue } from './sn-index-bar-types'

defineOptions({ name: 'SnIndexAnchor' })

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-index-anchor` 1:1 surface ───────────────────────────── */

    /** 索引字符。 */
    index?: SnIndexBarValue
    /** 根节点自定义类名。 */
    customClass?: string
    /** 根节点自定义样式。 */
    customStyle?: string
  }>(),
  {
    index: '',
    customClass: '',
    customStyle: '',
  },
)

defineSlots<{
  /** 自定义内容（该索引下的条目列表）。 */
  default?(): unknown
}>()

const bar = inject(SN_INDEX_BAR_KEY, null)

const uid = nextUid()

/** DOM id handed to `scroll-view scroll-into-view`. */
const anchorId = `sn-index-anchor-${uid}`

const isActive = computed(() => bar?.activeIndex() === props.index)

onMounted(() => {
  bar?.registerAnchor({
    uid,
    getIndex: () => props.index,
    getId: () => anchorId,
  })
})

onBeforeUnmount(() => bar?.unregisterAnchor(uid))

const rootClass = computed(() => [
  'sn-index-anchor',
  {
    'sn-index-anchor--active': isActive.value,
  },
  props.customClass,
])
</script>

<template>
  <view
    :id="anchorId"
    data-snui-component="index-anchor"
    :class="rootClass"
    :style="customStyle || undefined"
  >
    <view class="sn-index-anchor__header">
      <text class="sn-index-anchor__index">{{ index }}</text>
    </view>
    <view class="sn-index-anchor__body">
      <slot />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-index-anchor {
  width: 100%;
}

.sn-index-anchor__header {
  display: flex;
  align-items: center;
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-3);
  background-color: var(--sn-mp-color-background-soft);
}

.sn-index-anchor__index {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-medium);
}

.sn-index-anchor--active .sn-index-anchor__header {
  background-color: var(--sn-mp-color-action-primary-soft);
}

.sn-index-anchor--active .sn-index-anchor__index {
  color: var(--sn-mp-color-action-primary);
}

.sn-index-anchor__body {
  width: 100%;
  background-color: var(--sn-mp-color-background-surface);
}

/* Doodle skin — heavier index rule. */
.snui-skin-doodle .sn-index-anchor__header {
  border-bottom: 2rpx solid var(--sn-mp-color-text-primary);
}
</style>
