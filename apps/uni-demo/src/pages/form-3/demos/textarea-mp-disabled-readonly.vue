<script setup lang="ts">
/** Demo: sn-textarea — 只读与禁用：readonly 可选中不可编辑；disabled 整体锁掉。 */
import { ref } from 'vue';
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue';

const readonlyValue = ref('只读内容，可以选中但不能编辑。');
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
