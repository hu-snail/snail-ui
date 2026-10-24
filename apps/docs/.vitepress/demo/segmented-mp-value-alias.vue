<script setup lang="ts">
/**
 * Demo: sn-segmented (uni-end) — wot-ui `value` 写法 + `customClass` / `customStyle`。
 *
 * ## `value` 别名
 *
 * wot-ui 的 `wd-segmented` 把选中值叫 `value`，本组件叫 `modelValue`。组件同时
 * 接受两者，且同时传入时 `value` 优先，方便从 wd-segmented 直接迁移。
 *
 * ## 事件名：`update:modelValue` 与 `update:value` 都发
 *
 * wot-ui 的 `wd-segmented` 把模型叫 `value`，事件叫 `update:value`。本组件
 * 的自身 API 是 `modelValue` / `update:modelValue`，同时**也**发 `update:value`，
 * 所以两种写法都能父子同步。下面第一组用 wot-ui 风格，第二组用本组件风格，
 * 两组都能正常更新父组件的 ref。
 *
 * 迁移时两种写法任选；新代码建议用 `v-model`。
 * 迁移时把 `@update:value` 改成 `@update:model-value`（或直接用 `v-model`）即可。
 *
 * ## customClass / customStyle
 * 两个 prop 都落在根节点：`customClass` 追加类名，`customStyle` 作为根节点
 * inline style（会覆盖组件自己的背景 / 圆角）。
 */
import { ref } from 'vue'
import SnSegmented from '@snui/uni-src/components/sn-segmented/sn-segmented.vue'

const options = [
  { value: 'day', label: '日' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
]

/** 第一组：wot-ui 风格的 `@update:value`（本组件不发这个事件）。 */
const staleValue = ref('day')
/** 第二组：正确配对 `@update:model-value`。 */
const syncedValue = ref('week')

/** customStyle 会覆盖组件默认底色 / 圆角。 */
const styledValue = ref('month')

function onSyncedUpdate(next: string | number): void {
  syncedValue.value = String(next)
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">
      wot-ui 写法 `:value` + `@update:value`：标签会切换，但父值不动（组件不发 update:value）
    </text>
    <SnSegmented :value="staleValue" :options="options" @update:value="staleValue = String($event)" />
    <text class="sn-demo__meta">父组件里的值：{{ staleValue }}（没有跟着变）</text>

    <text class="sn-demo__meta">
      正确配对 `:value` + `@update:model-value`：父子同步
    </text>
    <SnSegmented :value="syncedValue" :options="options" @update:model-value="onSyncedUpdate" />
    <text class="sn-demo__meta">父组件里的值：{{ syncedValue }}</text>

    <text class="sn-demo__meta">customClass：根节点追加类名（虚线外框）</text>
    <SnSegmented
      v-model="styledValue"
      :options="options"
      custom-class="sn-segmented-demo--framed"
    />

    <text class="sn-demo__meta">
      customStyle：根节点 inline style（覆盖默认底色与圆角）
    </text>
    <SnSegmented
      v-model="styledValue"
      :options="options"
      custom-style="background-color: var(--sn-mp-color-action-primary-soft); border-radius: var(--sn-mp-radius-lg);"
    />

    <text class="sn-demo__meta">两者叠加：customClass 加外框，customStyle 改底色</text>
    <SnSegmented
      v-model="styledValue"
      :options="options"
      custom-class="sn-segmented-demo--framed"
      custom-style="background-color: var(--sn-mp-color-background-subtle);"
    />
    <text class="sn-demo__meta">当前值：{{ styledValue }}</text>
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
/* customClass 落在 sn-segmented 根节点上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-segmented-demo--framed) {
  border: 2rpx dashed var(--sn-mp-color-border-default);
}
</style>
