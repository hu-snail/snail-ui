<script setup lang="ts">
/** Demo: sn-password-input — mask=false shows plain characters; errorInfo overrides info and paints the borders danger; the default 16rpx gap is tunable via gutter. */
import { ref } from 'vue';
import SnPasswordInput from '@snui/uni-src/components/sn-password-input/sn-password-input.vue';

const plain = ref('1234');
const wrong = ref('12');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPasswordInput v-model="plain" :length="4" :mask="false" :gutter="8" />
    <SnPasswordInput v-model="wrong" :length="6" error-info="密码不正确" />
    <text class="sn-demo__meta"
      >Default gutter=8 (16rpx gap); pass gutter=0 for the flush layout</text
    >
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
