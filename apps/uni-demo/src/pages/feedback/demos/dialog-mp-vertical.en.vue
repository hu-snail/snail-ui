<script setup lang="ts">
/**
 * Demo: sn-dialog (uni-end) — English shadow of dialog-mp-vertical.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnDialog from '@snui/uni-src/components/sn-dialog/sn-dialog.vue';

const open = ref(false);
const picked = ref('—');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="open = true">Vertical buttons</SnButton>
    <text class="sn-dialog-demo__meta">Result: {{ picked }}</text>

    <SnDialog
      v-model="open"
      type="confirm"
      title="Dialog title"
      msg="Describe the current state, information and the way out."
      action-layout="vertical"
      custom-class="sn-demo-contained"
      @confirm="picked = 'confirm'"
      @cancel="picked = 'cancel'"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-dialog-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-dialog.sn-demo-contained {
  position: absolute;
}
</style>
