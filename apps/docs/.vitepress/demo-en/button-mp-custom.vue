<script setup lang="ts">
/** Demo: sn-button — bgColor / color / loadingColor / loadingSize overrides. */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
</script>

<template>
  <view class="sn-button-demo">
    <SnButton bg-color="#8b5cf6" color="#ffffff">bgColor + color override</SnButton>
    <SnButton color="#06b6d4" variant="plain">color top border + custom text</SnButton>
    <SnButton loading loading-color="#8b5cf6" type="primary">loading-color changes the spinner color</SnButton>
    <SnButton loading loading-size="48" type="success">loading-size changes the rpx size</SnButton>
    <SnButton custom-class="my-mp-cta" type="primary">customClass</SnButton>
  </view>
</template>

<style scoped>
.sn-button-demo { display: flex; flex-wrap: wrap; gap: 16rpx; align-items: center; }
:deep(.my-mp-cta) { letter-spacing: 4rpx; }
</style>