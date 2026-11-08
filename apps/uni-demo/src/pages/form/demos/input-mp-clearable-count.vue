<script setup lang="ts">
/** Demo: sn-input — clearable 清空 + showCount 计数 (uni-end)。 */
import { reactive } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const form = reactive({
  clearable: '点右侧 × 清空我',
  counter: 'hel',
});
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="form.clearable" clearable placeholder="clearable" />
    <SnInput v-model="form.counter" :maxlength="10" show-count placeholder="maxlength + 计数" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
