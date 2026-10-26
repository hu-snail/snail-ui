<script setup lang="ts">
/** Demo: sn-textarea — auto height / readonly / disabled / compact. */
import { ref } from 'vue';
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue';

const grow = ref('This textarea grows with its content.');
const readonlyValue = ref('Read-only content: selectable but not editable.');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">autoHeight</text>
    <SnTextarea v-model="grow" auto-height />

    <text class="sn-demo__title">readonly</text>
    <SnTextarea v-model="readonlyValue" readonly />

    <text class="sn-demo__title">disabled</text>
    <SnTextarea v-model="readonlyValue" disabled />

    <text class="sn-demo__title">compact (for inline form rows)</text>
    <SnTextarea v-model="grow" compact placeholder="Compact mode: no border, no background" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
