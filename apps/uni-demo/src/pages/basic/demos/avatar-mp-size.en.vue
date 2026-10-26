<script setup lang="ts">
/** Demo: sn-avatar (uni-end) — size presets and round / square shapes. */
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo-row">
      <SnAvatar text="S" size="small" />
      <SnAvatar text="N" size="normal" />
      <SnAvatar text="M" size="medium" />
      <SnAvatar text="L" size="large" />
    </view>
    <view class="sn-demo-row">
      <SnAvatar text="Round" size="large" shape="round" />
      <SnAvatar text="Square" size="large" shape="square" />
      <SnAvatar text="56" :size="56" shape="square" />
      <SnAvatar text="20%" size="20%" />
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
}
.sn-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
</style>
