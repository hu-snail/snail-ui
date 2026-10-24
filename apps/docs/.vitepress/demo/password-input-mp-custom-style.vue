<script setup lang="ts">
/**
 * Demo: sn-password-input — customClass / customStyle。
 *
 * `custom-class` 追加在根节点上（与 `sn-password-input` 并列），`custom-style`
 * 是根节点的内联样式。注意组件自己的 `gutter` 会写 `--sn-password-input-gap`
 * 变量，`custom-style` 追加在其后，因此可以继续覆盖其它属性。
 */
import { ref } from 'vue'
import SnPasswordInput from '@snui/uni-src/components/sn-password-input/sn-password-input.vue'

const pin = ref('123')
const framed = ref('4567')
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPasswordInput
      v-model="pin"
      :length="6"
      custom-class="sn-demo__pin"
      custom-style="padding: 16rpx; border-radius: var(--sn-mp-radius-md); background-color: var(--sn-mp-color-background-soft);"
    />
    <text class="sn-demo__meta">customClass + customStyle：根节点多了边框与浅底</text>

    <SnPasswordInput
      v-model="framed"
      :length="4"
      :gutter="12"
      custom-class="sn-demo__pin"
    />
    <text class="sn-demo__meta">只给 customClass：与组件自身的 gutter 变量并存</text>
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
/* custom-class 落在 sn-password-input 根节点上，需要 :deep 穿透组件边界。 */
.sn-demo :deep(.sn-demo__pin) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
</style>
