<script setup lang="ts">
/**
 * Demo: sn-notify (uni-end) — floating variant, closable, bottom anchor.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notify from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnNotify from '@snui/uni-src/components/sn-notify/sn-notify.vue';

const floatingOpen = ref(false);
const closableOpen = ref(false);
const bottomOpen = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="floatingOpen = true">Floating variant</SnButton>
    <SnButton block @tap="closableOpen = true">Closable</SnButton>
    <SnButton block @tap="bottomOpen = true">Bottom anchor</SnButton>

    <SnNotify
      v-model:visible="floatingOpen"
      type="success"
      variant="floating"
      message="Floating card with rounded corners and a shadow"
      custom-class="sn-demo-contained"
    />

    <SnNotify
      v-model:visible="closableOpen"
      type="warning"
      closable
      :duration="0"
      message="This one stays until you tap the close button"
      custom-class="sn-demo-contained"
    />

    <SnNotify
      v-model:visible="bottomOpen"
      type="danger"
      position="bottom"
      message="Slides in from the bottom edge"
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
.sn-notify.sn-demo-contained {
  position: absolute;
}
</style>
