<script setup lang="ts">
/**
 * Demo: sn-barcode (uni-end) — EAN-13：自动补校验位 / 显式 13 位 / 错误输入。
 */
import { ref } from 'vue';
import SnBarcode from '@snui/uni-src/components/sn-barcode/sn-barcode.vue';
import type { SnBarcodeEncodeError } from '@snui/uni-src/components/sn-barcode/sn-barcode-types';

const message = ref('');

function onError(error: SnBarcodeEncodeError): void {
  message.value = error.message;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnBarcode text="690123456789" />
    <text class="sn-demo__meta">12 位输入，自动补算校验位</text>

    <view class="sn-demo__card">
      <SnBarcode
        text="5901234123457"
        show-text
        :module-width="2"
        line-color="var(--sn-mp-color-action-primary)"
      />
    </view>
    <text class="sn-demo__meta">13 位 + 自定义条色</text>

    <SnBarcode :text="message === '' ? '1234' : '1234'" @error="onError" />
    <text class="sn-demo__meta">非法输入走 error 事件：{{ message || '—' }}</text>
  </view>
</template>

<style scoped>
.sn-demo__card {
  padding: 24rpx;
  border-radius: 16rpx;
  background-color: var(--sn-mp-color-background-surface);
}
</style>
