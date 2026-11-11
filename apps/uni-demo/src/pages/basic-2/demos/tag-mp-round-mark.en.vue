<script setup lang="ts">
/** Demo: sn-tag (uni-end) — the round pill and mark shapes. */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnTag type="primary">Square</SnTag>
      <SnTag type="primary" round>Pill</SnTag>
      <SnTag type="primary" mark>Mark</SnTag>
      <SnTag type="primary" round mark>Pill + mark</SnTag>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-5);
  align-items: flex-start;
}

.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-4) var(--sn-mp-spacing-5);
  align-items: center;
}
</style>
