<script setup lang="ts">
/**
 * Demo: sn-segmented — wot-ui 写法 `value` 别名。
 *
 * `wd-segmented` 把选中值叫 `value`，本组件叫 `modelValue`。为了让从 wot-ui
 * 迁移过来的代码原样可用，两个 prop 都接受，且同时存在时 `value` 优先。
 *
 * 事件名保持本组件的 `update:modelValue`（wot-ui 侧写作 `@update:value`）；
 * 下面用 `:value` + `@update:model-value` 的组合，等价于 `v-model` 的展开写法。
 *
 * 另外演示 `vibrate-short`：切换时调用 `uni.vibrateShort`，H5 / 部分宿主
 * 没有振动马达时静默跳过，不影响点击。
 */
import { ref } from 'vue'
import SnSegmented from '@snui/uni-src/components/sn-segmented/sn-segmented.vue'

const size = ref('md')
const sizeOptions = [
  { value: 'sm', label: '小' },
  { value: 'md', label: '中' },
  { value: 'lg', label: '大' },
]

const layout = ref('grid')
const layoutOptions = ['grid', 'list']

function onSizeUpdate(next: string | number): void {
  size.value = String(next)
}

function onLayoutUpdate(next: string | number): void {
  layout.value = String(next)
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">`:value` 别名 + `@update:model-value`</text>
    <SnSegmented
      :value="size"
      :options="sizeOptions"
      vibrate-short
      @update:model-value="onSizeUpdate"
    />
    <text class="sn-demo__meta">当前尺寸：{{ size }}</text>

    <text class="sn-demo__label">`value` 优先于 `model-value`（同时传入时）</text>
    <SnSegmented
      :model-value="'list'"
      :value="layout"
      :options="layoutOptions"
      @update:model-value="onLayoutUpdate"
    />
    <text class="sn-demo__meta">当前布局：{{ layout }}</text>
  </view>
</template>

<style scoped>
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
