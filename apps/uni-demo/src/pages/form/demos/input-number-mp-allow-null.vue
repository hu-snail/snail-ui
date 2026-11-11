<script setup lang="ts">
/** Demo: sn-input-number — 可空输入（allowNull）：输入框可留空，placeholder 兜底。 */
import { ref } from 'vue';
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue';

const nullable = ref<string | number>('');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">allowNull + placeholder（输入框可留空）</text>
    <SnInputNumber v-model="nullable" :min="0" :max="99" allow-null placeholder="可留空" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
