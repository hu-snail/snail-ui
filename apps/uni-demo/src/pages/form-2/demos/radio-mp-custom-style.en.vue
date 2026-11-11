<script setup lang="ts">
/** Demo: sn-radio — custom class names & styles: customLabelClass lands on the label node, customClass / customStyle on the root. */
import { ref } from 'vue';
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue';
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue';

const labeled = ref<string | number | boolean | undefined>('a');
const styled = ref<string | number | boolean | undefined>('b');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">customLabelClass</text>
    <SnRadioGroup v-model="labeled">
      <SnRadio value="a" custom-label-class="sn-demo__label"
        >Label styled through customLabelClass</SnRadio
      >
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
/* custom-class / custom-label-class sit on inner nodes, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__radio) {
  background-color: var(--sn-mp-color-background-soft);
}
.sn-demo :deep(.sn-demo__label) {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}
</style>
