<script setup lang="ts">
/**
 * Demo: sn-tooltip (uni-end) — English shadow of tooltip-mp-arrow.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTooltip from '@snui/uni-src/components/sn-tooltip/sn-tooltip.vue';

const noArrow = ref(false);
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
      <SnButton block>No arrow (visible-arrow=false)</SnButton>
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
