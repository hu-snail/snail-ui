<script setup lang="ts">
/** Demo: sn-tag (uni-end) — sizes, round and marker shapes. */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo-row">
      <SnTag size="small" type="primary">Small</SnTag>
      <SnTag size="medium" type="primary">Medium</SnTag>
      <SnTag size="large" type="primary">Large</SnTag>
      <SnTag size="extra-large" type="primary">Extra large</SnTag>
    </view>
    <view class="sn-demo-row">
      <SnTag type="primary">Default corners</SnTag>
      <SnTag type="primary" round>Round</SnTag>
      <SnTag type="primary" mark>Mark</SnTag>
      <SnTag type="primary" round mark>Round mark</SnTag>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.sn-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
</style>
