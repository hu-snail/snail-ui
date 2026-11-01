<script setup lang="ts">
/**
 * Demo: sn-code-input — customClass / customStyle.
 *
 * `custom-class` lands on the root node (beside `sn-code-input`),
 * `custom-style` is the root inline style. The component's own `gutter` /
 * `background` write the `--sn-code-input-*` variables first;
 * `custom-style` is appended after and can override everything else.
 */
import { ref } from 'vue';
import SnCodeInput from '@snui/uni-src/components/sn-code-input/sn-code-input.vue';

const pin = ref('123');
const framed = ref('4567');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCodeInput
      v-model="pin"
      :length="6"
      custom-class="sn-demo__pin"
      custom-style="padding: 16rpx; border-radius: var(--sn-mp-radius-md); background-color: var(--sn-mp-color-background-soft);"
    />
    <text class="sn-demo__meta"
      >customClass + customStyle: an extra border and soft surface on the root</text
    >

    <SnCodeInput v-model="framed" :length="4" :gutter="12" custom-class="sn-demo__pin" />
    <text class="sn-demo__meta"
      >customClass only: coexists with the component's own gutter variable</text
    >

    <SnCodeInput v-model="framed" :length="4" custom-class="sn-demo__pin sn-demo__pin--tall" />
    <text class="sn-demo__meta"
      >custom-class re-points the geometry hooks: taller cells, larger radius</text
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
/* custom-class lands on the sn-code-input root; :deep crosses the
 * component boundary. */
.sn-demo :deep(.sn-demo__pin) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
/* Geometry hooks can be re-pointed from any host ancestor: taller cells plus
 * a large radius. */
.sn-demo :deep(.sn-demo__pin--tall) {
  --sn-code-input-box-bg: var(--sn-mp-color-background-sunken);
  --sn-code-input-radius: var(--sn-mp-radius-xl);
}
</style>
