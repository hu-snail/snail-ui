<script setup lang="ts">
/** Demo: sn-text (uni-end) — multi-line clamp. */
import SnText from '@snui/uni-src/components/sn-text/sn-text.vue';

const longText =
  'Supporting copy inside a mobile list often runs wider than one screen. Setting lines truncates the overflow with an ellipsis so every card keeps the same height.';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnText :text="longText" :lines="1" />
    <SnText :text="longText" :lines="2" />
    <SnText :text="longText" :lines="3" />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
  max-width: 100%;
}
</style>
