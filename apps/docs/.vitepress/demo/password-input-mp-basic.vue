<script setup lang="ts">
/** Demo: sn-password-input — sn-password-input 方框密码框：length 控制格子数，mask 控制是否显示圆点，focused 与键盘显隐联动。 */
import { ref } from 'vue'
import SnPasswordInput from '@snui/uni-src/components/sn-password-input/sn-password-input.vue'

const pin = ref('123')
const focused = ref(true)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPasswordInput v-model="pin" :length="6" :focused="focused" info="请输入 6 位密码" />
    <view class="sn-demo__button" @tap="focused = !focused">切换聚焦</view>
    <text class="sn-demo__meta">当前值：{{ pin || '（空）' }}</text>
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
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
