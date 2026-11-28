<script setup lang="ts">
/** Demo: sn-input — disabled / readonly / required 控件状态。 */
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
</script>

<template>
  <view class="sn-input-demo">
    <SnInput model-value="禁用字段（不可编辑）" disabled />
    <SnInput model-value="只读字段（可见不可改）" readonly />
    <SnInput placeholder="必填字段（required）" required />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
