<script setup lang="ts">
/** Demo: sn-input — border / bg variants (radius has its own scenario). */
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
</script>

<template>
  <view class="sn-input-demo">
    <text class="sn-input-demo__caption">Border</text>
    <SnInput placeholder='border="all" (default)' />
    <SnInput placeholder='border="bottom" (inline form rows)' border="bottom" />
    <SnInput placeholder='border="none"' border="none" />
    <SnInput placeholder="bordered=false (legacy alias → none)" :bordered="false" />

    <text class="sn-input-demo__caption">Background</text>
    <SnInput placeholder='bg="surface" (default)' bg="surface" />
    <SnInput placeholder='bg="transparent"' bg="transparent" border="none" />
    <SnInput placeholder='bg="soft"' bg="soft" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-input-demo__caption {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
