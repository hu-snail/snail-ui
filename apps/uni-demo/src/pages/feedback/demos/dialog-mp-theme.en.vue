<script setup lang="ts">
/**
 * Demo: sn-dialog (uni-end) — English shadow of dialog-mp-theme.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnDialog from '@snui/uni-src/components/sn-dialog/sn-dialog.vue';

const textThemeOpen = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton block @tap="textThemeOpen = true">Text buttons (theme=&quot;text&quot;)</SnButton>

    <SnDialog
      v-model="textThemeOpen"
      type="confirm"
      theme="text"
      title="Sign out"
      msg="You will need to sign in again to keep using the app."
      confirm-button-text="Sign out"
      cancel-button-text="Cancel"
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
/* Docs-preview only — see dialog-mp-basic for the rationale. */
.sn-dialog.sn-demo-contained {
  position: absolute;
}
</style>
