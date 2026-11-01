<script setup lang="ts">
/** Demo: sn-password-input — sn-password-input 方框密码框：length 控制格子数，mask 控制是否显示圆点，focused 与键盘显隐联动。 */
import { ref } from 'vue';
import SnPasswordInput from '@snui/uni-src/components/sn-password-input/sn-password-input.vue';

const pin = ref('123');
const focused = ref(true);
const mask = ref(true);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPasswordInput
      v-model="pin"
      :length="6"
      :mask="mask"
      :focused="focused"
      info="请输入 6 位密码"
    />
    <view class="sn-demo__row">
      <view class="sn-demo__button" @tap="focused = !focused">{{ focused ? '失焦' : '聚焦' }}</view>
      <view class="sn-demo__button sn-demo__button--ghost" @tap="mask = !mask">{{
        mask ? '明文' : '圆点'
      }}</view>
    </view>
    <text class="sn-demo__meta">当前值：{{ pin || '（空）' }}</text>
  </view>
</template>

<style scoped>
.sn-demo__row {
  display: flex;
  gap: 16rpx;
}

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
}

.sn-demo__button--ghost {
  background-color: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
