<script setup lang="ts">
/**
 * Demo: sn-toast (uni-end) — English shadow of toast-mp-cover.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnToast from '@snui/uni-src/components/sn-toast/sn-toast.vue';

const covered = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="warning" block @tap="covered = true">
      cover (transparent full-screen scrim blocks taps)
    </SnButton>

    <text class="sn-demo__meta">
      The page cannot be tapped while the toast shows; taps come back when the duration ends.
    </text>

    <SnToast
      v-model="covered"
      msg="cover: a transparent scrim blocks page taps"
      icon-name="warning"
      cover
      :duration="2500"
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
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-toast.sn-demo-contained {
  position: absolute;
}
</style>
