<script setup lang="ts">
/** Demo: sn-text (uni-end) — 排版覆盖（size / lineHeight / color）。 */
import SnText from '@snui/uni-src/components/sn-text/sn-text.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnText text="字号 18px" size="18px" />
    <SnText text="行高 28px" size="14px" line-height="28px" />
    <SnText text="自定义颜色" color="var(--sn-mp-color-purple)" />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
  max-width: 100%;
}
</style>
