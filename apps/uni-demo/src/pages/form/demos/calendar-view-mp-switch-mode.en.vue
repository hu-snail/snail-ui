<script setup lang="ts">
/** Demo: sn-calendar-view — month / year switch (switchMode): `switchMode="month"` switches to one month with prev / next controls. */
import { ref } from 'vue';
import SnCalendarView from '@snui/uni-src/components/sn-calendar-view/sn-calendar-view.vue';

const min = new Date(2024, 5, 1).getTime();
const max = new Date(2024, 7, 31).getTime();
const single = ref<number | number[] | null>(null);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCalendarView
      v-model="single"
      :min-date="min"
      :max-date="max"
      switch-mode="month"
      :panel-height="220"
    />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
</style>
