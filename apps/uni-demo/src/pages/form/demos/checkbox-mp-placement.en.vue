<script setup lang="ts">
/**
 * Demo: sn-checkbox — layout and label (size / placement / maxWidth).
 *
 * `size="large"`, `placement="right"` moves the box to the right of the label,
 * `maxWidth` truncates a long label + `customLabelClass` style hook.
 */
import { ref } from 'vue';
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue';

const placed = ref<boolean>(true);
const long = ref<boolean>(true);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCheckbox v-model="placed" size="large" placement="right">
      size="large" + placement="right"
    </SnCheckbox>

    <SnCheckbox v-model="long" max-width="360rpx" custom-label-class="sn-demo__label">
      A long label used to verify the maxWidth truncation and the customLabelClass style hook
    </SnCheckbox>
    <text class="sn-demo__meta"
      >maxWidth bounds the label; customLabelClass lands on the label text node</text
    >
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
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-label-class sits on an inner node, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__label) {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}
</style>
