<script setup lang="ts">
/**
 * Demo: sn-checkbox — 独立用法与剩余 props。
 *
 * 现有 3 个 demo 覆盖了 group 的 v-model / name / type / direction / min / max /
 * disabled / readonly / indeterminate / toggleAll。这里补齐：
 * 独立 `v-model`（不经 group）、`trueValue` / `falseValue` 自定义取值、
 * `checkedColor` / `uncheckedColor`、`size="large"`、`placement="right"`、
 * `maxWidth` + `customLabelClass`、`customClass` / `customStyle`。
 */
import { ref } from 'vue'
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue'

const standalone = ref<boolean>(true)
const subscribed = ref<string>('yes')
const colored = ref<boolean>(true)
const placed = ref<boolean>(true)
const long = ref<boolean>(true)
const styled = ref<boolean>(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCheckbox v-model="standalone">独立 v-model（不放在 group 里）</SnCheckbox>
    <text class="sn-demo__meta">独立模式：勾选状态写回自身 modelValue（{{ standalone }}）</text>

    <SnCheckbox v-model="subscribed" true-value="yes" false-value="no">
      trueValue / falseValue 自定义取值
    </SnCheckbox>
    <text class="sn-demo__meta">trueValue="yes" / falseValue="no"：当前 {{ subscribed }}</text>

    <SnCheckbox
      v-model="colored"
      checked-color="var(--sn-mp-color-feedback-success)"
      unchecked-color="var(--sn-mp-color-border-default)"
    >
      checkedColor / uncheckedColor
    </SnCheckbox>

    <SnCheckbox v-model="placed" size="large" placement="right">
      size="large" + placement="right"
    </SnCheckbox>

    <SnCheckbox
      v-model="long"
      max-width="360rpx"
      custom-label-class="sn-demo__label"
    >
      一段很长的标签文字用来验证 maxWidth 的截断与 customLabelClass 的样式注入
    </SnCheckbox>
    <text class="sn-demo__meta">maxWidth 限制标签宽度，customLabelClass 落在标签文本节点上</text>

    <SnCheckbox
      v-model="styled"
      custom-class="sn-demo__check"
      custom-style="padding: 8rpx 16rpx; border-radius: var(--sn-mp-radius-md);"
    >
      customClass + customStyle
    </SnCheckbox>
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
/* custom-class / custom-label-class 都落在组件内部节点上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-demo__check) {
  background-color: var(--sn-mp-color-background-soft);
}
.sn-demo :deep(.sn-demo__label) {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}
</style>
