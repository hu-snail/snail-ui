<script setup lang="ts">
/** Demo: sn-signature — enableHistory 显示撤回 / 恢复按钮；penColor 覆盖笔色；disabled 锁掉画板。 */
import { ref } from 'vue';
import SnSignature from '@snui/uni-src/components/sn-signature/sn-signature.vue';

// 无额外状态 —— 画板自带历史栈。
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
