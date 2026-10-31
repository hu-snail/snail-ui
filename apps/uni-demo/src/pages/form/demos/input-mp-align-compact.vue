<script setup lang="ts">
/** Demo: sn-input — alignRight 对齐 / compact 紧凑 / inputmode 软键盘提示。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const amount = ref('12500.00');
const phone = ref('');
const search = ref('');
const inline = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <text class="sn-input-demo__caption">alignRight（金额等数字字段右对齐）</text>
    <SnInput v-model="amount" align-right type="digit" placeholder="金额" />

    <text class="sn-input-demo__caption">inputmode（唤起对应软键盘）</text>
    <SnInput v-model="phone" inputmode="tel" placeholder="手机号（tel 键盘）" />
    <SnInput v-model="search" inputmode="search" placeholder="搜索（search 键盘）" />

    <text class="sn-input-demo__caption">compact + border="bottom"（嵌进 Cell / FormItem 的行内形态）</text>
    <SnInput v-model="inline" compact border="bottom" placeholder="行内搜索" />
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
