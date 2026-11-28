<script setup lang="ts">
/**
 * Demo: sn-tooltip (uni-end) — English shadow of tooltip-mp-theme.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTooltip from '@snui/uni-src/components/sn-tooltip/sn-tooltip.vue';

const darkOpen = ref(false);
const lightOpen = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTooltip
      :model-value="darkOpen"
      content="Dark translucent plate (default theme=dark)"
      placement="top"
      @update:model-value="darkOpen = $event"
    >
      <SnButton block>Dark (theme=dark, default)</SnButton>
    </SnTooltip>
    <SnTooltip
      :model-value="lightOpen"
      content="Light surface plate (theme=light)"
      theme="light"
      placement="bottom"
      @update:model-value="lightOpen = $event"
    >
      <SnButton block>Light (theme=light)</SnButton>
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
