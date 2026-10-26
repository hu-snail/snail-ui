<script setup lang="ts">
/** Demo: sn-password-input — `mask=false` shows the characters; `errorInfo` overrides `info` and turns the borders danger-colored; `gutter` sets the gap. */
import { ref } from 'vue';
import SnPasswordInput from '@snui/uni-src/components/sn-password-input/sn-password-input.vue';

const plain = ref('1234');
const wrong = ref('12');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPasswordInput v-model="plain" :length="4" :mask="false" :gutter="8" />
    <SnPasswordInput v-model="wrong" :length="6" error-info="Incorrect password" />
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
