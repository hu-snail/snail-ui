<script setup lang="ts">
/** Demo: sn-signature — `enableHistory` renders the undo / redo buttons; `penColor` overrides the stroke color; `disabled` locks the pad. */
import { ref } from 'vue';
import SnSignature from '@snui/uni-src/components/sn-signature/sn-signature.vue';

// No extra state — the pad owns its own history stack.
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSignature enable-history :line-width="4" pen-color="var(--sn-mp-color-action-primary)" />
    <SnSignature disabled />
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
