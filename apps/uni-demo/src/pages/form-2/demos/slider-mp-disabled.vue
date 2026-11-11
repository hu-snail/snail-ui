<script setup lang="ts">
/** Demo: sn-slider — 禁用：disabled 拦掉拖动。 */
import { ref } from 'vue';
import SnSlider from '@snui/uni-src/components/sn-slider/sn-slider.vue';

const locked = ref(50);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSlider v-model="locked" disabled />
    <text class="sn-demo__meta">disabled：拖动无效，值停在 {{ locked }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
