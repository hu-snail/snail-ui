<script setup lang="ts">
/** Demo: sn-checkbox — count limits (min / max). */
import { ref } from 'vue';
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue';
import SnCheckboxGroup from '@snui/uni-src/components/sn-checkbox/sn-checkbox-group.vue';

const limited = ref<Array<string | number | boolean>>(['a']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">min=1 / max=2</text>
    <SnCheckboxGroup v-model="limited" :min="1" :max="2">
      <SnCheckbox name="a">Option A</SnCheckbox>
      <SnCheckbox name="b">Option B</SnCheckbox>
      <SnCheckbox name="c">Option C</SnCheckbox>
    </SnCheckboxGroup>
    <text class="sn-demo__meta">{{ limited.length }} selected (max 2)</text>
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
