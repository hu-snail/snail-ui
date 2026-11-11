<script setup lang="ts">
/** Demo: sn-switch — 形状：shape="square" 方形轨道。 */
import { ref } from 'vue';
import SnSwitch from '@snui/uni-src/components/sn-switch/sn-switch.vue';

const square = ref(true);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">shape="square"</text>
    <SnSwitch v-model="square" shape="square" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
