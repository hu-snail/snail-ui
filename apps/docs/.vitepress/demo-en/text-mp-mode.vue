<script setup lang="ts">
/** Demo: sn-text (uni-end) — mode transforms: phone / name / price / date. */
import SnText from '@snui/uni-src/components/sn-text/sn-text.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo-line">
      <text class="sn-demo-label">Phone</text>
      <SnText text="13800138000" mode="phone" />
    </view>
    <view class="sn-demo-line">
      <text class="sn-demo-label">Masked phone</text>
      <SnText text="13800138000" mode="phone" format />
    </view>
    <view class="sn-demo-line">
      <text class="sn-demo-label">Masked name</text>
      <SnText text="Ada Lovelace" mode="name" format />
    </view>
    <view class="sn-demo-line">
      <text class="sn-demo-label">Price</text>
      <SnText text="1288.5" mode="price" prefix="$" suffix="/ea" />
    </view>
    <view class="sn-demo-line">
      <text class="sn-demo-label">Date</text>
      <SnText text="2024-03-05T10:00:00" mode="date" />
    </view>
    <view class="sn-demo-line">
      <text class="sn-demo-label">Dialable</text>
      <SnText text="13800138000" mode="phone" call type="primary" decoration="underline" />
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
}
.sn-demo-line {
  display: flex;
  align-items: center;
  gap: 12px;
}
.sn-demo-label {
  width: 96px;
  flex: 0 0 auto;
  color: var(--sn-mp-color-text-secondary);
  font-size: 12px;
}
</style>
