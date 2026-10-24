<script setup lang="ts">
/** Demo: sn-textarea — word limit / clear / error state. */
import { ref } from 'vue'
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue'

const limited = ref('A multi-line note from snail-aui')
const clearable = ref('Tap the × on the right to clear this text')
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">showWordLimit + maxlength</text>
    <SnTextarea v-model="limited" :maxlength="60" show-word-limit />

    <text class="sn-demo__title">clearable</text>
    <SnTextarea v-model="clearable" clearable />

    <text class="sn-demo__title">error</text>
    <SnTextarea v-model="clearable" error placeholder="Form drives error when the value is invalid" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
