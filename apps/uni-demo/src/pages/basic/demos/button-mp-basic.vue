<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — basic types.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-button via easycom.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
</script>

<template>
  <view class="sn-demo">
    <view class="sn-demo__row">
      <SnButton>默认按钮</SnButton>
      <SnButton type="primary">主要按钮</SnButton>
      <SnButton type="success">成功按钮</SnButton>
      <SnButton type="info">信息按钮</SnButton>
      <SnButton type="warning">警告按钮</SnButton>
      <SnButton type="danger">危险按钮</SnButton>
    </view>
  </view>
</template>
