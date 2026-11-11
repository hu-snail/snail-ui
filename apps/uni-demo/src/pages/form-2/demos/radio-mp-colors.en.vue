<script setup lang="ts">
/**
 * Demo: sn-radio — checked colors: `checkedColor` / `uncheckedColor` flow down
 * from the group, and a per-option `checkedColor` overrides the group value.
 */
import { ref } from 'vue';
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue';
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue';

const colored = ref<string | number | boolean | undefined>('a');
const overridden = ref<string | number | boolean | undefined>('a');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">checkedColor / uncheckedColor</text>
    <SnRadioGroup
      v-model="colored"
      checked-color="var(--sn-mp-color-feedback-success)"
      unchecked-color="var(--sn-mp-color-border-default)"
    >
      <SnRadio value="a">Option A</SnRadio>
      <SnRadio value="b">Option B</SnRadio>
    </SnRadioGroup>

    <text class="sn-demo__title">Per-option override of the group checkedColor</text>
    <SnRadioGroup v-model="overridden">
      <SnRadio value="a">Inherits the group color</SnRadio>
      <SnRadio value="b" checked-color="var(--sn-mp-color-feedback-danger)"
        >Overridden to the danger color</SnRadio
      >
    </SnRadioGroup>
    <text class="sn-demo__meta">Current: {{ overridden ?? '(none)' }}</text>
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
.sn-demo__title {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
