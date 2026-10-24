<script setup lang="ts">
/** Demo: sn-checkbox — min/max, disabled/readonly, indeterminate, toggleAll. */
import { ref } from 'vue'
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue'
import SnCheckboxGroup from '@snui/uni-src/components/sn-checkbox/sn-checkbox-group.vue'

const limited = ref<Array<string | number | boolean>>(['a'])
const readOnly = ref<Array<string | number | boolean>>(['a'])
const groupRef = ref<InstanceType<typeof SnCheckboxGroup> | null>(null)
const all = ref<Array<string | number | boolean>>([])
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

    <text class="sn-demo__title">disabled / readonly</text>
    <SnCheckboxGroup v-model="readOnly" disabled>
      <SnCheckbox name="a">Whole group disabled</SnCheckbox>
    </SnCheckboxGroup>
    <SnCheckboxGroup v-model="readOnly" readonly>
      <SnCheckbox name="a">Whole group read-only</SnCheckbox>
    </SnCheckboxGroup>

    <text class="sn-demo__title">indeterminate (half-checked)</text>
    <SnCheckbox :model-value="false" indeterminate>Half-checked state</SnCheckbox>

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
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
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
