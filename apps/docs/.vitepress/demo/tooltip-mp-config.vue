<script setup lang="ts">
/**
 * Demo: sn-tooltip (uni-end) — arrow / close button / disabled / offset.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-tooltip from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnTooltip from '@snui/uni-src/components/sn-tooltip/sn-tooltip.vue'

const noArrow = ref(false)
const withClose = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTooltip
      :model-value="noArrow"
      content="没有箭头的气泡"
      :visible-arrow="false"
      placement="top"
      @update:model-value="noArrow = $event"
    >
      <SnButton block>无箭头</SnButton>
    </SnTooltip>

    <SnTooltip
      :model-value="withClose"
      content="带关闭按钮，点击 × 直接收起"
      :show-close="true"
      :offset="{ x: 0, y: 6 }"
      placement="top"
      @update:model-value="withClose = $event"
    >
      <SnButton block>带关闭按钮 + offset</SnButton>
    </SnTooltip>

    <SnTooltip content="禁用状态点不动" disabled placement="top">
      <SnButton block disabled>禁用</SnButton>
    </SnTooltip>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-top: 40rpx;
}
</style>
