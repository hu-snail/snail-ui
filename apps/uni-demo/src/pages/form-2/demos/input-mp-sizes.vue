<script setup lang="ts">
/** Demo: sn-input — size 三档尺寸 (uni-end)。 */
import { reactive } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const form = reactive({ small: '', medium: '', large: '' });
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="form.small" size="small" placeholder="small（56rpx 高）" />
    <SnInput v-model="form.medium" size="medium" placeholder="medium（72rpx 高，默认）" />
    <SnInput v-model="form.large" size="large" placeholder="large（88rpx 高）" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
