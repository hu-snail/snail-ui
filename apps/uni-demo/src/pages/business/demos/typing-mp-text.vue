<script setup lang="ts">
/**
 * Demo: sn-typing (uni-end) — 文案开关：text。
 */
import SnTyping from '@snui/uni-src/components/sn-typing/sn-typing.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="typing-row">
      <SnTyping />
      <SnTyping text="思考中" />
      <SnTyping text="" />
    </view>
    <text class="sn-demo__meta">默认「对方正在输入…」；text="" 只显示圆点</text>
  </view>
</template>

<style scoped>
.typing-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sn-mp-spacing-3);
}

.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
