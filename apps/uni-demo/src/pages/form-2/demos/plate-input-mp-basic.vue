<script setup lang="ts">
/** Demo: sn-plate-input — 点击格子弹起无蒙层车牌键盘（sn-keyboard mode='car'）：省份→字母/数字自动切换、长按删除连删，再点一次字段或点完成收起。 */
import { ref } from 'vue';
import SnPlateInput from '@snui/uni-src/components/sn-plate-input/sn-plate-input.vue';

const plate = ref('');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPlateInput v-model="plate" title="请输入车牌号" />
    <text class="sn-demo__meta">当前值：{{ plate || '（空）' }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
