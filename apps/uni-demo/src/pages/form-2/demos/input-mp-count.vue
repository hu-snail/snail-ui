<script setup lang="ts">
/** Demo: sn-input — 字数计数（showCount）：maxlength + 计数角标。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const counter = ref('hel');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="counter" :maxlength="10" show-count placeholder="maxlength + 计数" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
