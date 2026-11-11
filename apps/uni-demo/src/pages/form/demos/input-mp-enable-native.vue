<script setup lang="ts">
/** Demo: sn-input — 原生输入（enableNative）：enableNative=false 时支付宝小程序用模拟输入框。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const alipay = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="alipay" :enable-native="false" placeholder="键盘弹起时页面不上移" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
