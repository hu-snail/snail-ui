<script setup lang="ts">
/**
 * Demo: sn-tooltip (uni-end) — 深色 / 浅色主题（theme）。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-tooltip from its SFC source.
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
      content="深色底盘（默认 theme=dark）"
      placement="top"
      @update:model-value="darkOpen = $event"
    >
      <SnButton block>深色（theme=dark，默认）</SnButton>
    </SnTooltip>
    <SnTooltip
      :model-value="lightOpen"
      content="浅色底盘（theme=light）"
      theme="light"
      placement="bottom"
      @update:model-value="lightOpen = $event"
    >
      <SnButton block>浅色（theme=light）</SnButton>
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
