<script setup lang="ts">
/** Demo: sn-checkbox — 组状态与半选（disabled / readonly / indeterminate）。 */
import { ref } from 'vue';
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue';
import SnCheckboxGroup from '@snui/uni-src/components/sn-checkbox/sn-checkbox-group.vue';

const readOnly = ref<Array<string | number | boolean>>(['a']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">disabled / readonly</text>
    <SnCheckboxGroup v-model="readOnly" disabled>
      <SnCheckbox name="a">整组禁用</SnCheckbox>
    </SnCheckboxGroup>
    <SnCheckboxGroup v-model="readOnly" readonly>
      <SnCheckbox name="a">整组只读</SnCheckbox>
    </SnCheckboxGroup>

    <text class="sn-demo__title">indeterminate（半选）</text>
    <SnCheckbox :model-value="false" indeterminate>半选状态</SnCheckbox>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
