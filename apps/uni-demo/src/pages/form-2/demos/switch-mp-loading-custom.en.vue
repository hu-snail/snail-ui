<script setup lang="ts">
/** Demo: sn-switch — loadingProps configures the spinner; customClass / customStyle land on the root node. */
import { ref } from 'vue';
import SnSwitch from '@snui/uni-src/components/sn-switch/sn-switch.vue';

const a = ref(true);
const b = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">loading + loadingProps (color / size)</text>
    <SnSwitch
      v-model="a"
      loading
      :loading-props="{ color: 'var(--sn-mp-color-feedback-warning)', size: 24 }"
    />

    <text class="sn-demo__title">customClass</text>
    <SnSwitch v-model="b" custom-class="sn-demo__switch" />

    <text class="sn-demo__title">customStyle</text>
    <SnSwitch v-model="b" custom-style="padding: 4rpx; border-radius: var(--sn-mp-radius-full);" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__switch {
  padding: 4rpx;
  border: 1rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
}
</style>
