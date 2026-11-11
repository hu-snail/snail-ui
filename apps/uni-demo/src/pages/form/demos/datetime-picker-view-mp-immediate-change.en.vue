<script setup lang="ts">
/** Demo: sn-datetime-picker-view — immediate change (immediateChange): emits change on every roll. */
import { ref } from 'vue';
import SnDatetimePickerView from '@snui/uni-src/components/sn-datetime-picker-view/sn-datetime-picker-view.vue';

const instant = ref<string | number>(new Date(2024, 5, 15).getTime());
const changes = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnDatetimePickerView v-model="instant" type="date" immediate-change @change="changes += 1" />
    <text class="sn-demo__meta"
      >immediateChange (emits change on every roll; fired {{ changes }} times)</text
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
