<script setup lang="ts">
/**
 * Demo: sn-toast (uni-end) — icon-size / icon-color / loading-size / loading-color.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-toast from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnToast from '@snui/uni-src/components/sn-toast/sn-toast.vue';

const iconSized = ref(false);
const loadingSized = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="success" block @tap="iconSized = true"> icon-size / icon-color </SnButton>
    <SnButton block @tap="loadingSized = true"> loading-size / loading-color </SnButton>

    <SnToast
      v-model="iconSized"
      msg="放大并改色的状态图标"
      icon-name="success"
      :icon-size="72"
      icon-color="var(--sn-mp-color-feedback-success)"
      custom-class="sn-demo-contained"
    />

    <SnToast
      v-model="loadingSized"
      msg="放大并改色的加载图标"
      icon-name="loading"
      :loading-size="64"
      loading-color="var(--sn-mp-color-feedback-warning)"
      direction="vertical"
      :duration="2000"
      custom-class="sn-demo-contained"
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
