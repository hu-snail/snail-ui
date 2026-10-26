<script setup lang="ts">
/**
 * Demo: sn-picker-view — immediateChange / customClass / customStyle。
 *
 * `immediate-change` 让拖动过程中就持续 commit（不等松手），配合 `change`
 * 事件可以实时联动；`custom-class` / `custom-style` 落在根节点上改滚轮外框。
 */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';

const seconds = ['10 秒', '30 秒', '1 分钟', '5 分钟'];
const value = ref<Array<string | number>>(['30 秒']);
const trailing = ref<Array<string | number>>(['北京']);
const changes = ref(0);

function onChange(): void {
  changes.value += 1;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPickerView v-model="value" :columns="[seconds]" immediate-change @change="onChange" />
    <text class="sn-demo__meta"
      >immediateChange：拖动中持续触发 change（已触发 {{ changes }} 次）</text
    >

    <SnPickerView
      v-model="trailing"
      :columns="[['北京', '上海', '广州']]"
      custom-class="sn-demo__picker"
      custom-style="padding: 8rpx 0; background-color: var(--sn-mp-color-background-soft);"
    />
    <text class="sn-demo__meta">customClass / customStyle 改根节点外框与底色</text>
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
/* custom-class 落在 sn-picker-view 根节点上，需要 :deep 穿透组件边界。 */
.sn-demo :deep(.sn-demo__picker) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
}
</style>
