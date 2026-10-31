<script setup lang="ts">
/** Demo: sn-input — disabled / readonly / required (uni-end). */
</script>

<template>
  <view class="sn-input-demo">
    <SnInput model-value="Disabled field" disabled />
    <SnInput model-value="Read-only field" readonly />
    <SnInput placeholder="Required field" required />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
