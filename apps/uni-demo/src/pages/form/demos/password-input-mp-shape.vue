<script setup lang="ts">
/** Demo: sn-password-input — shape='box' 方框（默认）与 shape='underline' 下划线两种格子形状。 */
import { ref } from 'vue';
import SnPasswordInput from '@snui/uni-src/components/sn-password-input/sn-password-input.vue';

const box = ref('12');
const line = ref('34');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPasswordInput v-model="box" :length="4" shape="box" info="方框（默认）" />
    <SnPasswordInput v-model="line" :length="4" shape="underline" info="下划线" />
    <text class="sn-demo__meta">shape='box' | 'underline'，聚焦 / 错误态边色自动跟随</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
