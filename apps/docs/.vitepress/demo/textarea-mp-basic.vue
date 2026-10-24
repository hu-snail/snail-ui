<script setup lang="ts">
/** Demo: sn-textarea — 基础用法（v-model + placeholder）。 */
import { ref } from 'vue'
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue'

const value = ref('')
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnTextarea v-model="value" placeholder="请输入内容..." />
    <text class="sn-demo__meta">v-model = {{ value }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
