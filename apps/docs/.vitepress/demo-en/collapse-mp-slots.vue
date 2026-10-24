<script setup lang="ts">
/**
 * Demo: sn-collapse — the `more` slot, `custom-more-slot-class`, item-level `border`
 * and `before-expend`.
 *
 * - in viewmore mode the `more` slot replaces the bottom expand / collapse area; its
 *   scope is `{ expanded }` (`use-more-slot` is a contract slot only — the template
 *   always honours the `more` slot in viewmore mode)
 * - `custom-more-slot-class` appends a class to that area
 * - `before-expend` runs before expanding (receives `name`); returning `false` vetoes it
 * - item `border=false` drops the bottom rule; `custom-body-class` /
 *   `custom-body-style` target the content container
 * - the `title` slot scope is `{ expanded, disabled, isFirst }`
 */
import { ref } from 'vue'
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue'
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue'

const viewmore = ref(false)
const open = ref(['a'])
const attempts = ref(0)

/** Block the first two expand attempts. */
function beforeExpend(): boolean {
  attempts.value += 1
  return attempts.value > 2
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">viewmore + more slot + custom-more-slot-class</text>
    <SnCollapse v-model="viewmore" viewmore :line-num="2" custom-more-slot-class="sn-demo__more">
      <SnCollapseItem name="intro" title="About the framework" :border="false">
        This block verifies the line-num clamp: two lines show before expanding, and only the
        custom button below opens the rest. AUI treats the schema as the single source of truth
        and separates Protocol, Runtime and Renderer.
      </SnCollapseItem>
      <template #more="{ expanded }">
        <view class="sn-demo__more-inner">
          <text class="sn-demo__more-text">{{ expanded ? 'Collapse all' : 'Expand all' }}</text>
        </view>
      </template>
    </SnCollapse>

    <text class="sn-demo__label">before-expend guard + title slot</text>
    <SnCollapse v-model="open">
      <SnCollapseItem
        name="a"
        title="Shipping"
        :before-expend="beforeExpend"
        custom-body-class="sn-demo__body"
      >
        <template #title="{ expanded }">
          <text class="sn-demo__title">{{ expanded ? '▼' : '▶' }} Shipping (title slot)</text>
        </template>
        SF Express, delivery in 2 days.
      </SnCollapseItem>
      <SnCollapseItem name="b" title="Payment">WeChat Pay and Alipay are supported.</SnCollapseItem>
    </SnCollapse>

    <text class="sn-demo__meta">before-expend blocked {{ Math.min(attempts, 2) }} times; open: {{ open.join(', ') || 'none' }}</text>
  </view>
</template>

<style scoped>
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__more-inner {
  display: flex;
  align-items: center;
  justify-content: center;
}
.sn-demo__more-text {
  font-size: 24rpx;
  color: var(--sn-mp-color-action-primary);
}
.sn-demo__title {
  font-size: 26rpx;
  color: var(--sn-mp-color-text-primary);
}
/* custom-more-slot-class lands on the collapse footer area, so it needs :deep. */
.sn-demo :deep(.sn-demo__more) {
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
}
/* custom-body-class lands on the item's content container. */
.sn-demo :deep(.sn-demo__body) {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
</style>
