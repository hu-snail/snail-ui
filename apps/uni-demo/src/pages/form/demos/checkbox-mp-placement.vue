<script setup lang="ts">
/**
 * Demo: sn-checkbox — 布局与标签（size / placement / maxWidth）。
 *
 * `size="large"`、`placement="right"` 把勾选框挪到标签右侧、`maxWidth` 截断
 * 超长标签 + `customLabelClass` 样式注入。
 */
import { ref } from 'vue';
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue';

const placed = ref<boolean>(true);
const long = ref<boolean>(true);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCheckbox v-model="placed" size="large" placement="right">
      size="large" + placement="right"
    </SnCheckbox>

    <SnCheckbox v-model="long" max-width="360rpx" custom-label-class="sn-demo__label">
      一段很长的标签文字用来验证 maxWidth 的截断与 customLabelClass 的样式注入
    </SnCheckbox>
    <text class="sn-demo__meta">maxWidth 限制标签宽度，customLabelClass 落在标签文本节点上</text>
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
/* custom-label-class 落在组件内部节点上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-demo__label) {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}
</style>
