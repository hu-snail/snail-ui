<script setup lang="ts">
/** Demo: sn-picker — wheel 风格模式：wheel 胶囊高亮带 + vibrateShort 滑动震动，弹层内滚轮换装。 */
import { ref } from 'vue';
import SnPicker from '@snui/uni-src/components/sn-picker/sn-picker.vue';

const slots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30'];
const picked = ref<Array<string | number>>(['09:00']);
const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true"><text>设置提醒时间</text></view>
    <text class="sn-demo__meta">已选：{{ picked.join(' / ') }}（wheel 胶囊带 + 滑动震动）</text>
    <SnPicker
      v-model="picked"
      v-model:visible="open"
      :columns="[slots]"
      title="提醒时间"
      wheel
      vibrate-short
      :visible-item-count="5"
    />
  </view>
</template>

<style scoped>
.sn-demo__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 72rpx;
  padding: 0 32rpx;
  border-radius: var(--sn-mp-button-radius);
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-size: 28rpx;
  flex-direction: row;
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
