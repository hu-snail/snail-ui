<script setup lang="ts">
/** Demo: sn-textarea — readonly & disabled: `readonly` is selectable but not editable; `disabled` locks the whole field. */
import { ref } from 'vue';
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue';

const readonlyValue = ref('Read-only content: selectable but not editable.');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">readonly</text>
    <SnTextarea v-model="readonlyValue" readonly />

    <text class="sn-demo__title">disabled</text>
    <SnTextarea v-model="readonlyValue" disabled />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
