<script setup lang="ts">
/** Demo: sn-plate-input — `maxlength=8` for new-energy plates; `disabled` freezes the field. */
import { ref } from 'vue';
import SnPlateInput from '@snui/uni-src/components/sn-plate-input/sn-plate-input.vue';

const plate = ref('京AD12345');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPlateInput v-model="plate" :maxlength="8" title="New-energy plate" />
    <SnPlateInput model-value="京A12345" disabled title="Disabled" />
    <text class="sn-demo__meta">maxlength=8 fits new-energy plates; disabled ignores taps</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
