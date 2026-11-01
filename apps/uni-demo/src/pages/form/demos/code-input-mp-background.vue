<script setup lang="ts">
/** Demo: sn-code-input — background 属性给格子自定义背景色（token 或任意 CSS 色均可）。 */
import { ref } from 'vue';
import SnCodeInput from '@snui/uni-src/components/sn-code-input/sn-code-input.vue';

const token = ref('12');
const plain = ref('34');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCodeInput
      v-model="token"
      :length="4"
      background="var(--sn-mp-color-background-sunken)"
      info="token 背景：--sn-mp-color-background-sunken"
    />
    <SnCodeInput v-model="plain" :length="4" background="#FFF7E6" info="任意 CSS 色：#FFF7E6" />
    <text class="sn-demo__meta">background 落在 --sn-code-input-box-bg，暗色主题自动跟随</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
