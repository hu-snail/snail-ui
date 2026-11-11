<script setup lang="ts">
/** Demo: sn-switch — 轨道文案：activeText / inactiveText 显示在轨道两侧。 */
import { ref } from 'vue';
import SnSwitch from '@snui/uni-src/components/sn-switch/sn-switch.vue';

const withText = ref(true);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">activeText / inactiveText</text>
    <SnSwitch v-model="withText" active-text="开" inactive-text="关" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
