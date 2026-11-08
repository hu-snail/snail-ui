<script setup lang="ts">
/** Demo: sn-input — clearable + showCount (uni-end). */
import { reactive } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const form = reactive({
  clearable: 'Click × to clear me',
  counter: 'hel',
});
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="form.clearable" clearable placeholder="clearable" />
    <SnInput v-model="form.counter" :maxlength="10" show-count placeholder="maxlength + count" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
