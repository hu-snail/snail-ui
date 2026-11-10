<script setup lang="ts">
/**
 * Demo: sn-segmented — 事件名差异（update:value）。
 *
 * wot-ui 的 `wd-segmented` 把模型叫 `value`，事件叫 `update:value`。本组件
 * 的自身 API 是 `modelValue` / `update:modelValue`，同时**也**发 `update:value`
 * （相同载荷），所以两种写法都能父子同步。第一组用 wot-ui 风格，第二组用
 * 本组件风格，两组都能正常更新父组件的 ref。
 *
 * 迁移时两种写法任选；新代码建议用 `v-model`。
 */
import { ref } from 'vue';
import SnSegmented from '@snui/uni-src/components/sn-segmented/sn-segmented.vue';

const options = [
  { value: 'day', label: '日' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
];

/** 第一组：wot-ui 风格的 `@update:value`（本组件兼容发送该事件）。 */
const wotValue = ref('day');
/** 第二组：本组件自身风格的 `@update:model-value`。 */
const syncedValue = ref('week');

function onWotUpdate(next: string | number): void {
  wotValue.value = String(next);
}

function onSyncedUpdate(next: string | number): void {
  syncedValue.value = String(next);
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta"> wot-ui 风格 `:value` + `@update:value`：父子同步 </text>
    <SnSegmented :value="wotValue" :options="options" @update:value="onWotUpdate" />
    <text class="sn-demo__meta">父组件里的值：{{ wotValue }}</text>

    <text class="sn-demo__meta"> 本组件风格 `:value` + `@update:model-value`：父子同步 </text>
    <SnSegmented :value="syncedValue" :options="options" @update:model-value="onSyncedUpdate" />
    <text class="sn-demo__meta">父组件里的值：{{ syncedValue }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
