<script setup lang="ts">
/**
 * Demo: sn-notice-bar (uni-end) — English shadow of notice-bar-mp-closable.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnNoticeBar from '@snui/uni-src/components/sn-notice-bar/sn-notice-bar.vue';

const closableKey = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnNoticeBar
      :key="closableKey"
      type="info"
      text="closable: tap the × on the right to dismiss this notice"
      closable
      @close="closableKey += 1"
    />
    <SnButton size="small" @tap="closableKey += 1">Restore the dismissed notice</SnButton>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
