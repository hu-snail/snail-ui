<script setup lang="ts">
/** Demo: sn-button — cell 'hover' | 'fill' | 'menu' (cell-list styling). */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
</script>

<template>
  <view class="sn-button-demo">
    <SnButton cell="hover">cell=hover (gray on press)</SnButton>
    <SnButton cell="fill">cell=fill (persistent gray)</SnButton>
    <SnButton cell="menu">cell=menu (transparent, no radius)</SnButton>
  </view>
</template>

<style scoped>
.sn-button-demo { display: flex; flex-direction: column; gap: 16rpx; max-width: 600rpx; }
</style>