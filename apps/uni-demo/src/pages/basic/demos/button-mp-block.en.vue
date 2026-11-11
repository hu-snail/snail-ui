<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — block button (`block`).
 * Per AUI-DOCS-016: imports the real @snui/uni sn-button via easycom.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
</script>

<template>
  <view class="sn-demo">
    <SnButton block type="primary">Block button</SnButton>
  </view>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
