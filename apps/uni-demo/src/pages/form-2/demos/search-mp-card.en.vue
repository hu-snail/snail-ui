<script setup lang="ts">
/** Demo: sn-search — floating search card: variant="card" + camera shortcut + search button. */
import { ref } from 'vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';

const withCamera = ref('');
const noCamera = ref('UI component library');
const lastAction = ref('—');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">variant="card" + showCamera (camera shortcut)</text>
    <SnSearch
      v-model="withCamera"
      variant="card"
      show-camera
      placeholder="UI design portfolio"
      @search="lastAction = `Search: ${$event}`"
      @camera="lastAction = 'Camera'"
    />
    <text class="sn-demo__meta">Last action: {{ lastAction }}</text>

    <text class="sn-demo__title">variant="card" (no camera, divider + button only)</text>
    <SnSearch
      v-model="noCamera"
      variant="card"
      placeholder="UI component library"
      @search="lastAction = `Search: ${$event}`"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
