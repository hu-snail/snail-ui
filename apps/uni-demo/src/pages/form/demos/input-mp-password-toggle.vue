<script setup lang="ts">
/** Demo: sn-input — showPassword 密码显隐切换。 */
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import { ref } from 'vue';

const secret = ref('initial-secret-123');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="secret" type="password" show-password placeholder="密码" />
    <text class="sn-input-demo__caption">点击右侧眼睛图标切换密码显示 / 隐藏</text>
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-input-demo__caption {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
