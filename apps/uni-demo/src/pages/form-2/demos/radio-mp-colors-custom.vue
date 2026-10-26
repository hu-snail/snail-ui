<script setup lang="ts">
/**
 * Demo: sn-radio — 剩余 props（customLabelClass / customClass / customStyle / checkedColor）。
 *
 * 现有 3 个 demo 覆盖了 value / type / direction / placement / disabled /
 * readonly / allowUncheck。这里补齐：`checkedColor` / `uncheckedColor`、
 * `customLabelClass`、`customClass` / `customStyle`，以及单选项级覆盖组级样式的用法。
 */
import { ref } from 'vue';
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue';
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue';

const colored = ref<string | number | boolean | undefined>('a');
const labeled = ref<string | number | boolean | undefined>('a');
const styled = ref<string | number | boolean | undefined>('b');
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
      <SnRadio value="a">选项 A</SnRadio>
      <SnRadio value="b">选项 B</SnRadio>
    </SnRadioGroup>

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

    <text class="sn-demo__title">单项覆盖组级 checkedColor</text>
    <SnRadioGroup v-model="overridden">
      <SnRadio value="a">继承组级颜色</SnRadio>
      <SnRadio value="b" checked-color="var(--sn-mp-color-feedback-danger)"
        >单项覆盖为危险色</SnRadio
      >
    </SnRadioGroup>
    <text class="sn-demo__meta">当前：{{ overridden ?? '（未选）' }}</text>
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
/* custom-class / custom-label-class 都落在组件内部节点上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-demo__radio) {
  background-color: var(--sn-mp-color-background-soft);
}
.sn-demo :deep(.sn-demo__label) {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}
</style>
