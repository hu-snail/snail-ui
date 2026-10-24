<script setup lang="ts">
/** Demo: sn-password-input — mask=false 显示明文；errorInfo 覆盖 info 并把边框切成危险色；gutter 控制格子间距。 */
import { ref } from 'vue'
import SnPasswordInput from '@snui/uni-src/components/sn-password-input/sn-password-input.vue'

const plain = ref('1234')
const wrong = ref('12')
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPasswordInput v-model="plain" :length="4" :mask="false" :gutter="8" />
    <SnPasswordInput v-model="wrong" :length="6" error-info="密码不正确" />
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
