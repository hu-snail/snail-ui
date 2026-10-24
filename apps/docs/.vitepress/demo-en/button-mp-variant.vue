<script setup lang="ts">
/** Demo: sn-button — variant 'base' | 'plain' | 'dashed' | 'soft' | 'subtle' | 'text'. */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
</script>

<template>
  <view class="sn-button-demo">
    <SnButton type="primary" variant="base">base</SnButton>
    <SnButton type="primary" variant="plain">plain</SnButton>
    <SnButton type="primary" variant="dashed">dashed</SnButton>
    <SnButton type="primary" variant="soft">soft</SnButton>
    <SnButton variant="subtle">subtle</SnButton>
    <SnButton variant="text">text</SnButton>
  </view>
</template>

<style scoped>
.sn-button-demo { display: flex; flex-wrap: wrap; gap: 16rpx; align-items: center; }
</style>