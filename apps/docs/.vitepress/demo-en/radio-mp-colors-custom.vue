<script setup lang="ts">
/**
 * Demo: sn-radio — remaining props (customLabelClass / customClass / customStyle / checkedColor).
 *
 * The existing three demos cover value / type / direction / placement /
 * disabled / readonly / allowUncheck. This one fills in `checkedColor` /
 * `uncheckedColor`, `customLabelClass`, `customClass` / `customStyle`, plus a
 * per-option override of the group-level color.
 */
import { ref } from 'vue'
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue'
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue'

const colored = ref<string | number | boolean | undefined>('a')
const labeled = ref<string | number | boolean | undefined>('a')
const styled = ref<string | number | boolean | undefined>('b')
const overridden = ref<string | number | boolean | undefined>('a')
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

    <text class="sn-demo__title">customLabelClass</text>
    <SnRadioGroup v-model="labeled">
      <SnRadio value="a" custom-label-class="sn-demo__label">Label styled through customLabelClass</SnRadio>
      <SnRadio value="b">Plain label</SnRadio>
    </SnRadioGroup>

    <text class="sn-demo__title">customClass / customStyle</text>
    <SnRadioGroup v-model="styled">
      <SnRadio
        value="a"
        custom-class="sn-demo__radio"
        custom-style="padding: 8rpx 16rpx; border-radius: var(--sn-mp-radius-md);"
      >
        customClass + customStyle
      </SnRadio>
      <SnRadio value="b">Plain option</SnRadio>
    </SnRadioGroup>

    <text class="sn-demo__title">Per-option override of the group checkedColor</text>
    <SnRadioGroup v-model="overridden">
      <SnRadio value="a">Inherits the group color</SnRadio>
      <SnRadio value="b" checked-color="var(--sn-mp-color-feedback-danger)">Overridden to the danger color</SnRadio>
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
/* custom-class / custom-label-class sit on inner nodes, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__radio) {
  background-color: var(--sn-mp-color-background-soft);
}
.sn-demo :deep(.sn-demo__label) {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}
</style>
