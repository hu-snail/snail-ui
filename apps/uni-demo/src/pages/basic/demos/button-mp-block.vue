<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — 块级按钮（`block`）。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-button via easycom.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
</script>

<template>
  <view class="sn-demo">
    <SnButton block type="primary">主要按钮</SnButton>
    <SnButton block type="success">成功按钮</SnButton>
    <SnButton block type="danger">危险按钮</SnButton>
  </view>
</template>
