<script setup lang="ts">
/** Demo: sn-checkbox — select all / clear all (toggleAll, via expose). */
import { ref } from 'vue';
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue';
import SnCheckboxGroup from '@snui/uni-src/components/sn-checkbox/sn-checkbox-group.vue';

const groupRef = ref<InstanceType<typeof SnCheckboxGroup> | null>(null);
const all = ref<Array<string | number | boolean>>([]);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">toggleAll (via expose)</text>
    <SnCheckboxGroup ref="groupRef" v-model="all">
      <SnCheckbox name="a">Option A</SnCheckbox>
      <SnCheckbox name="b">Option B</SnCheckbox>
    </SnCheckboxGroup>
    <view class="sn-demo__actions">
      <text class="sn-demo__action" @tap="groupRef?.toggleAll(true)">Select all</text>
      <text class="sn-demo__action" @tap="groupRef?.toggleAll(false)">Clear all</text>
    </view>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__actions {
  display: flex;
  gap: 24rpx;
}
.sn-demo__action {
  font-size: 26rpx;
  color: var(--sn-mp-color-action-primary);
}
</style>
