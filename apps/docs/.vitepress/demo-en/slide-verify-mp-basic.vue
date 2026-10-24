<script setup lang="ts">
/** Demo: sn-slide-verify — Drag-to-confirm: reaching the right edge (within `tolerance`) fires `success`; a short drag fires `fail` and snaps back. */
import { ref } from 'vue'
import SnSlideVerify from '@snui/uni-src/components/sn-slide-verify/sn-slide-verify.vue'

const status = ref('Pending')
const onSuccess = () => { status.value = 'Passed' }
const onFail = () => { status.value = 'Failed' }
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSlideVerify @success="onSuccess" @fail="onFail" />
    <text class="sn-demo__meta">Status: {{ status }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
