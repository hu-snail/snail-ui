<script setup lang="ts">
/** Demo: sn-button — cell 'hover' | 'fill' | 'menu' (Cell 列表化样式). */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
</script>

<template>
  <view class="sn-button-demo">
    <SnButton cell="hover">cell=hover (按下灰底)</SnButton>
    <SnButton cell="fill">cell=fill (常驻灰底)</SnButton>
    <SnButton cell="menu">cell=menu (透明无圆角)</SnButton>
  </view>
</template>

<style scoped>
.sn-button-demo { display: flex; flex-direction: column; gap: 16rpx; max-width: 600rpx; }
</style>