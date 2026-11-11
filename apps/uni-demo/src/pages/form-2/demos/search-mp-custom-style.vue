<script setup lang="ts">
/**
 * Demo: sn-search — 输入节点与根节点样式。
 *
 * `custom-input-class` 把类名追加到内部原生输入节点上（不是根节点）；
 * `custom-class` / `custom-style` 落在根包装节点上，用来改外框。
 */
import { ref } from 'vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';

const inputClass = ref('snail');
const wrapper = ref('snail');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSearch
      v-model="inputClass"
      custom-input-class="sn-demo__input"
      placeholder="customInputClass"
    />
    <text class="sn-demo__meta">customInputClass 落在内部输入节点上，字距被拉开</text>

    <SnSearch
      v-model="wrapper"
      custom-class="sn-demo__search"
      custom-style="border-radius: var(--sn-mp-radius-full); background-color: var(--sn-mp-color-background-soft);"
      placeholder="customClass + customStyle"
    />
    <text class="sn-demo__meta">customClass / customStyle 改根包装的外框与底色</text>
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
/* custom-input-class 挂在内部 <input> 上，需要 :deep 穿透组件边界。 */
.sn-demo :deep(.sn-demo__input) {
  letter-spacing: 2rpx;
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}
/* custom-class 落在 sn-search 根节点上，需要 :deep 穿透组件边界。 */
.sn-demo :deep(.sn-demo__search) {
  border: 2rpx solid var(--sn-mp-color-border-default);
}
</style>
