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
      <SnButton>Default</SnButton>
      <SnButton type="primary">Primary button</SnButton>
      <SnButton type="success">Success button</SnButton>
      <SnButton type="info">Info button</SnButton>
      <SnButton type="warning">Warning button</SnButton>
      <SnButton type="danger">Danger button</SnButton>
    </view>
  </view>
</template>

