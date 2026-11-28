<script setup lang="ts">
/** Demo: sn-switch — 加载态：loading 在旋钮内显示 spinner，loadingProps 配置 spinner。 */
import { ref } from 'vue';
import SnSwitch from '@snui/uni-src/components/sn-switch/sn-switch.vue';

const a = ref(true);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">loading + loadingProps（color / size）</text>
    <SnSwitch
      v-model="a"
      loading
      :loading-props="{ color: 'var(--sn-mp-color-feedback-warning)', size: 24 }"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
