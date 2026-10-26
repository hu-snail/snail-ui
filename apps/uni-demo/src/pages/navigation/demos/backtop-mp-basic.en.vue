<script setup lang="ts">
/** Demo: sn-backtop — appears once the scroll distance passes the threshold. */
import { ref } from 'vue';
import SnBacktop from '@snui/uni-src/components/sn-backtop/sn-backtop.vue';

const scrollTop = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__meta">Scroll distance: {{ scrollTop }} px (threshold 300)</text>
    <view class="sn-demo__actions">
      <text class="sn-demo__button" @tap="scrollTop = 0">Scroll to top</text>
      <text class="sn-demo__button" @tap="scrollTop = 600">Scroll to 600px</text>
    </view>
    <SnBacktop :scroll-top="scrollTop" text="Top" />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__actions {
  display: flex;
  gap: 8px;
}
.sn-demo__button {
  padding: 6px 12px;
  border: 1px solid var(--sn-mp-color-border-default);
  border-radius: 8rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
</style>
