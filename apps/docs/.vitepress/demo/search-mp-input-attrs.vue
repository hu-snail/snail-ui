<script setup lang="ts">
/**
 * Demo: sn-search — maxlength / focus / focusWhenClear / customInputClass。
 *
 * `maxlength` 限制可输入字符数（`-1` 不限制）；`focus` 在挂载时聚焦输入框；
 * `focus-when-clear` 为清空后重新聚焦保留的开关；`custom-input-class` 把类名
 * 追加到内部原生输入节点上（不是根节点）。
 */
import { ref } from 'vue'
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue'

const limited = ref('')
const focused = ref('')
const cleared = ref('snail')
const inputClass = ref('snail')
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSearch v-model="limited" :maxlength="8" placeholder="最多 8 个字符" />
    <text class="sn-demo__meta">maxlength=8：超出部分被输入框拒绝（{{ limited.length }}/8）</text>

    <SnSearch v-model="focused" focus placeholder="挂载即聚焦" />
    <text class="sn-demo__meta">focus：挂载时聚焦内部输入框</text>

    <SnSearch v-model="cleared" focus-when-clear placeholder="清空后重新聚焦" />
    <text class="sn-demo__meta">focusWhenClear：清空按钮后重新聚焦（与 @clear 联动）</text>

    <SnSearch
      v-model="inputClass"
      custom-input-class="sn-demo__input"
      placeholder="customInputClass"
    />
    <text class="sn-demo__meta">customInputClass 落在内部输入节点上，字距被拉开</text>
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
</style>
