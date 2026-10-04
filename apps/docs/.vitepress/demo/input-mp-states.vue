<script setup lang="ts">
/** Demo: sn-input — disabled / readonly / required (uni-end). */
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'
</script>

<template>
  <view class="sn-demo">
    <SnInput model-value="Disabled field" disabled />
    <SnInput model-value="Read-only field" readonly />
    <SnInput model-value="Required field" required placeholder="Required" />
  </view>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 16rpx; max-width: 480rpx; }
</style>