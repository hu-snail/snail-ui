<script setup lang="ts">
/** Demo: sn-text (uni-end) — multi-line clamp + size / lineHeight / colour overrides. */
import SnText from '@snui/uni-src/components/sn-text/sn-text.vue';

const longText =
  'Supporting copy inside a mobile list often runs wider than one screen. Setting lines truncates the overflow with an ellipsis so every card keeps the same height.';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnText :text="longText" :lines="1" />
    <SnText :text="longText" :lines="2" />
    <SnText :text="longText" :lines="3" />
    <SnText text="Size 18px" size="18px" />
    <SnText text="Line height 28px" size="14px" line-height="28px" />
    <SnText text="Custom colour" color="var(--sn-mp-color-purple)" />
    <SnText text="Affixes" prefix="[" suffix="]" type="primary" />
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
