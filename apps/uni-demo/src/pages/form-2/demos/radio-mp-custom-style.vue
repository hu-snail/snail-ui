<script setup lang="ts">
/** Demo: sn-radio — 自定义类名与样式：customLabelClass 落在标签节点，customClass / customStyle 落在根节点。 */
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
      <SnRadio value="a" custom-label-class="sn-demo__label">标签样式来自 customLabelClass</SnRadio>
      <SnRadio value="b">普通标签</SnRadio>
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
      <SnRadio value="b">普通选项</SnRadio>
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
/* custom-class / custom-label-class 都落在组件内部节点上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-demo__radio) {
  background-color: var(--sn-mp-color-background-soft);
}
.sn-demo :deep(.sn-demo__label) {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}
</style>
