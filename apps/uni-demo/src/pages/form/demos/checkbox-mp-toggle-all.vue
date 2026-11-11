<script setup lang="ts">
/** Demo: sn-checkbox — 全选 / 全不选（toggleAll，通过 expose 调用）。 */
import { ref } from 'vue';
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue';
import SnCheckboxGroup from '@snui/uni-src/components/sn-checkbox/sn-checkbox-group.vue';

const groupRef = ref<InstanceType<typeof SnCheckboxGroup> | null>(null);
const all = ref<Array<string | number | boolean>>([]);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">toggleAll（通过 expose 调用）</text>
    <SnCheckboxGroup ref="groupRef" v-model="all">
      <SnCheckbox name="a">选项 A</SnCheckbox>
      <SnCheckbox name="b">选项 B</SnCheckbox>
    </SnCheckboxGroup>
    <view class="sn-demo__actions">
      <text class="sn-demo__action" @tap="groupRef?.toggleAll(true)">全选</text>
      <text class="sn-demo__action" @tap="groupRef?.toggleAll(false)">全不选</text>
    </view>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__actions {
  display: flex;
  gap: 24rpx;
}
.sn-demo__action {
  font-size: 26rpx;
  color: var(--sn-mp-color-action-primary);
}
</style>
