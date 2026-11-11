<script setup lang="ts">
/** Demo: sn-checkbox — 数量限制（min / max）。 */
import { ref } from 'vue';
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue';
import SnCheckboxGroup from '@snui/uni-src/components/sn-checkbox/sn-checkbox-group.vue';

const limited = ref<Array<string | number | boolean>>(['a']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">min=1 / max=2</text>
    <SnCheckboxGroup v-model="limited" :min="1" :max="2">
      <SnCheckbox name="a">选项 A</SnCheckbox>
      <SnCheckbox name="b">选项 B</SnCheckbox>
      <SnCheckbox name="c">选项 C</SnCheckbox>
    </SnCheckboxGroup>
    <text class="sn-demo__meta">已选 {{ limited.length }} 项（最多 2 项）</text>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
