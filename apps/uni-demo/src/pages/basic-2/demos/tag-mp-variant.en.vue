<script setup lang="ts">
/** Demo: sn-tag (uni-end) — variants (light / dark / plain / dashed / text). */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

const variants = ['light', 'dark', 'plain', 'dashed', 'text'] as const;
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view v-for="variant in variants" :key="variant" class="sn-demo-row">
      <SnTag type="primary" :variant="variant">{{ variant }}</SnTag>
      <SnTag type="success" :variant="variant">{{ variant }}</SnTag>
      <SnTag type="danger" :variant="variant">{{ variant }}</SnTag>
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
