<script setup lang="ts">
/**
 * Demo: sn-checkbox — standalone usage and custom values.
 *
 * Standalone `v-model` (outside a group) and custom `trueValue` / `falseValue`.
 */
import { ref } from 'vue';
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue';

const standalone = ref<boolean>(true);
const subscribed = ref<string>('yes');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCheckbox v-model="standalone">Standalone v-model (outside a group)</SnCheckbox>
    <text class="sn-demo__meta"
      >Standalone: the tick writes back to its own modelValue ({{ standalone }})</text
    >

    <SnCheckbox v-model="subscribed" true-value="yes" false-value="no">
      custom trueValue / falseValue
    </SnCheckbox>
    <text class="sn-demo__meta">trueValue="yes" / falseValue="no": currently {{ subscribed }}</text>
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
</style>
