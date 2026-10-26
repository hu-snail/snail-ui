<script setup lang="ts">
/** Demo: sn-checkbox-group — 基础多选（数组 v-model）。 */
import { ref } from 'vue';
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue';
import SnCheckboxGroup from '@snui/uni-src/components/sn-checkbox/sn-checkbox-group.vue';

const picked = ref<Array<string | number | boolean>>(['apple']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCheckboxGroup v-model="picked">
      <SnCheckbox name="apple">苹果</SnCheckbox>
      <SnCheckbox name="banana">香蕉</SnCheckbox>
      <SnCheckbox name="cherry">樱桃</SnCheckbox>
    </SnCheckboxGroup>
    <text class="sn-demo__meta">已选：{{ picked.join('、') || '（空）' }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
