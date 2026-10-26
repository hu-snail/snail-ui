<script setup lang="ts">
/**
 * Demo: sn-dialog (uni-end) — status icon, theme="text" and vertical actions.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-dialog from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnDialog from '@snui/uni-src/components/sn-dialog/sn-dialog.vue';

const successOpen = ref(false);
const warningOpen = ref(false);
const textThemeOpen = ref(false);
const verticalOpen = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="success" block @tap="successOpen = true">Success icon</SnButton>
    <SnButton type="warning" block @tap="warningOpen = true">Warning icon + custom color</SnButton>
    <SnButton block @tap="textThemeOpen = true">Text buttons (theme=&quot;text&quot;)</SnButton>
    <SnButton block @tap="verticalOpen = true"
      >Stacked buttons (action-layout=&quot;vertical&quot;)</SnButton
    >

    <SnDialog
      v-model="successOpen"
      type="alert"
      icon="success"
      title="Submitted"
      msg="We received your request and will process it within one business day."
      custom-class="sn-demo-contained"
    />

    <SnDialog
      v-model="warningOpen"
      type="alert"
      icon="warning"
      icon-color="var(--sn-mp-color-feedback-warning)"
      title="Not enough credit"
      msg="Your available credit is too low to complete this payment."
      custom-class="sn-demo-contained"
    />

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

    <SnDialog
      v-model="verticalOpen"
      type="confirm"
      action-layout="vertical"
      title="Save draft"
      msg="You can save this as a draft and continue editing later."
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
