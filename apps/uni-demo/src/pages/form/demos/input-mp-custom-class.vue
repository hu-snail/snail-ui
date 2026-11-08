<script setup lang="ts">
/** Demo: sn-input — customClass / customStyle / customInputClass 三个挂载点。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const value = ref('根节点类名 + 内联样式 + 内层 input 类名');
</script>

<template>
  <view class="sn-input-demo">
    <text class="sn-input-demo__caption">customClass + customStyle（挂根节点）</text>
    <SnInput
      v-model="value"
      custom-class="sn-input-demo__field"
      custom-style="background-color: var(--sn-mp-color-background-soft);"
    />

    <text class="sn-input-demo__caption">customInputClass（挂内层原生 input）</text>
    <SnInput v-model="value" custom-input-class="sn-input-demo__native" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-input-demo__caption {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-input-demo__field {
  border-radius: var(--sn-mp-radius-lg);
}
.sn-input-demo__native {
  letter-spacing: 1rpx;
}
</style>
