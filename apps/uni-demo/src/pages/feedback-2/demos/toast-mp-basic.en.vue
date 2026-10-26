<script setup lang="ts">
/**
 * Demo: sn-toast (uni-end) — component-form toast.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-toast from its SFC source.
 * NOTE: only the component form ships this round — `useToast()` is not implemented.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnToast from '@snui/uni-src/components/sn-toast/sn-toast.vue';

const plainOpen = ref(false);
const successOpen = ref(false);
const verticalOpen = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="plainOpen = true">Plain text (middle)</SnButton>
    <SnButton type="success" block @tap="successOpen = true">Success icon (top)</SnButton>
    <SnButton block @tap="verticalOpen = true">Vertical layout (bottom)</SnButton>

    <SnToast
      v-model="plainOpen"
      msg="Copied to clipboard"
      :duration="1500"
      custom-class="sn-demo-contained"
    />

    <SnToast
      v-model="successOpen"
      msg="Saved"
      icon-name="success"
      position="top"
      custom-class="sn-demo-contained"
    />

    <SnToast
      v-model="verticalOpen"
      msg="Submitting, please wait"
      icon-name="loading"
      direction="vertical"
      position="bottom"
      :duration="0"
      custom-class="sn-demo-contained"
      @click="verticalOpen = false"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-toast.sn-demo-contained {
  position: absolute;
}
</style>
