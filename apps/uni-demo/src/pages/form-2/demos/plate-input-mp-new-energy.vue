<script setup lang="ts">
/** Demo: sn-plate-input — maxlength=8 的新能源车牌（8 格），disabled 冻结输入。 */
import { ref } from 'vue';
import SnPlateInput from '@snui/uni-src/components/sn-plate-input/sn-plate-input.vue';

const plate = ref('京AD12345');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPlateInput v-model="plate" :maxlength="8" title="新能源车牌" />
    <SnPlateInput model-value="京A12345" disabled title="禁用态" />
    <text class="sn-demo__meta">maxlength=8 为新能源车牌；disabled 时点击不再弹键盘</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
