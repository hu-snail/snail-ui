<script setup lang="ts">
/**
 * Demo: sn-popover — English shadow of popover-mp-custom-style.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';

const styledOpen = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPopover
      v-model="styledOpen"
      mode="normal"
      content="A bubble with outlined arrow and body"
      placement="bottom-start"
      :offset="{ x: 0, y: 4 }"
      custom-arrow="sn-demo__arrow"
      custom-pop="sn-demo__pop"
      custom-class="sn-demo-contained"
      custom-style="display: block;"
    >
      <SnButton block>custom-arrow / custom-pop / offset</SnButton>
    </SnPopover>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
/* Docs-preview only — keep the absolutely-positioned bubble inside the demo. */
.sn-demo :deep(.sn-popover.sn-demo-contained) {
  position: relative;
  display: block;
}
/* custom-pop / custom-arrow land on the bubble and arrow nodes. */
.sn-demo :deep(.sn-demo__pop) {
  border-color: var(--sn-mp-color-action-primary);
}
.sn-demo :deep(.sn-demo__arrow) {
  border-color: var(--sn-mp-color-action-primary);
}
</style>
