<script setup lang="ts">
/** Demo: sn-tag (uni-end) — round 胶囊 / mark 标记形态。 */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnTag type="primary">直角</SnTag>
      <SnTag type="primary" round>胶囊</SnTag>
      <SnTag type="primary" mark>标记</SnTag>
      <SnTag type="primary" round mark>胶囊 + 标记</SnTag>
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
