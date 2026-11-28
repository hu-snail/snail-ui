<script setup lang="ts">
/** Demo: sn-input — status 校验状态：default / error / warning。 */
import { reactive } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const form = reactive({ def: '默认状态', error: '校验失败', warning: '需要注意' });
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="form.def" status="default" placeholder="default" />
    <SnInput v-model="form.error" status="error" placeholder="error" />
    <SnInput v-model="form.warning" status="warning" placeholder="warning" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
