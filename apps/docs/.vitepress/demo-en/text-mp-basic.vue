<script setup lang="ts">
/** Demo: sn-text (uni-end) — types, bold and decorations. */
import SnText from '@snui/uni-src/components/sn-text/sn-text.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnText text="Default text" />
    <SnText text="Primary text" type="primary" />
    <SnText text="Success text" type="success" />
    <SnText text="Warning text" type="warning" />
    <SnText text="Error text" type="error" />
    <SnText text="Bold text" bold />
    <SnText text="Underline" decoration="underline" />
    <SnText text="Line through" decoration="line-through" />
    <SnText text="Overline" decoration="overline" />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}
</style>
