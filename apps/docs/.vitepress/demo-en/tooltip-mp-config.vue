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
      content="A bubble without an arrow"
      :visible-arrow="false"
      placement="top"
      @update:model-value="noArrow = $event"
    >
      <SnButton block>No arrow</SnButton>
    </SnTooltip>

    <SnTooltip
      :model-value="withClose"
      content="With a close button — tap × to dismiss"
      :show-close="true"
      :offset="{ x: 0, y: 6 }"
      placement="top"
      @update:model-value="withClose = $event"
    >
      <SnButton block>Close button + offset</SnButton>
    </SnTooltip>

    <SnTooltip content="A disabled tooltip cannot be opened" disabled placement="top">
      <SnButton block disabled>Disabled</SnButton>
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
