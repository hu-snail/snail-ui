<script setup lang="ts">
/** Demo: sn-search — disabled: the field is locked and cannot be typed in or cleared. */
import { ref } from 'vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';

const query = ref('snail');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">disabled</text>
    <SnSearch v-model="query" disabled placeholder="Disabled state" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
