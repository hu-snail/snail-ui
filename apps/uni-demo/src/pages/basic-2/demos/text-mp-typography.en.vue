<script setup lang="ts">
/** Demo: sn-text (uni-end) — typography overrides (`size` / `lineHeight` / `color`). */
import SnText from '@snui/uni-src/components/sn-text/sn-text.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnText text="Size 18px" size="18px" />
    <SnText text="Line height 28px" size="14px" line-height="28px" />
    <SnText text="Custom colour" color="var(--sn-mp-color-purple)" />
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
