<script setup lang="ts">
/**
 * Demo: sn-tooltip (uni-end) — 关闭按钮与偏移（show-close / offset）。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-tooltip from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTooltip from '@snui/uni-src/components/sn-tooltip/sn-tooltip.vue';

const withClose = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTooltip
      :model-value="withClose"
      content="带关闭按钮，点击 × 直接收起"
      :show-close="true"
      :offset="{ x: 0, y: 6 }"
      placement="top"
      trigger="manual"
      @update:model-value="withClose = $event"
    >
      <SnButton block @click="withClose = !withClose">带关闭按钮 + offset</SnButton>
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
