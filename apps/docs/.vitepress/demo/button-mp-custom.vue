<script setup lang="ts">
/** Demo: sn-button — bgColor / color / loadingColor / loadingSize overrides. */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
</script>

<template>
  <view class="sn-button-demo">
    <SnButton bg-color="#8b5cf6" color="#ffffff">bgColor + color 覆盖</SnButton>
    <SnButton color="#06b6d4" variant="plain">color 上边框 + 自定义文字</SnButton>
    <SnButton loading loading-color="#8b5cf6" type="primary">loading-color 改 spinner 色</SnButton>
    <SnButton loading loading-size="48" type="success">loading-size 改 rpx 尺寸</SnButton>
    <SnButton custom-class="my-mp-cta" type="primary">customClass</SnButton>
  </view>
</template>

<style scoped>
.sn-button-demo { display: flex; flex-wrap: wrap; gap: 16rpx; align-items: center; }
:deep(.my-mp-cta) { letter-spacing: 4rpx; }
</style>