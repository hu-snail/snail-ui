<script setup lang="ts">
/** Demo: sn-datetime-picker-view — 即时 change（immediateChange）：每次滚动立即 emit change。 */
import { ref } from 'vue';
import SnDatetimePickerView from '@snui/uni-src/components/sn-datetime-picker-view/sn-datetime-picker-view.vue';

const instant = ref<string | number>(new Date(2024, 5, 15).getTime());
const changes = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnDatetimePickerView v-model="instant" type="date" immediate-change @change="changes += 1" />
    <text class="sn-demo__meta"
      >immediateChange（每次滚动立即 emit change，已触发 {{ changes }} 次）</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
