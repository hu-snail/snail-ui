<script setup lang="ts">
/** Demo: sn-textarea — basic usage (v-model + placeholder). */
import { ref } from 'vue'
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue'

const value = ref('')
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnTextarea v-model="value" placeholder="Please enter your message..." />
    <text class="sn-demo__meta">v-model = {{ value }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
