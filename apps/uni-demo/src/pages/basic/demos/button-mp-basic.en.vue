<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — basic types.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-button via easycom.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
</script>

<template>
  <view class="sn-demo">
    <SnButton>Default</SnButton>
    <SnButton type="primary">Primary</SnButton>
    <SnButton type="success">Success</SnButton>
    <SnButton type="warning">Warning</SnButton>
    <SnButton type="danger">Danger</SnButton>
  </view>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
</style>
