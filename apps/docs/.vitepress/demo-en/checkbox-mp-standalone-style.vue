<script setup lang="ts">
/**
 * Demo: sn-checkbox — standalone usage and the remaining props.
 *
 * The existing three demos cover the group's v-model / name / type / direction /
 * min / max / disabled / readonly / indeterminate / toggleAll. This one fills
 * in: standalone `v-model` (outside a group), custom `trueValue` / `falseValue`,
 * `checkedColor` / `uncheckedColor`, `size="large"`, `placement="right"`,
 * `maxWidth` + `customLabelClass`, and `customClass` / `customStyle`.
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
    <SnCheckbox v-model="standalone">Standalone v-model (outside a group)</SnCheckbox>
    <text class="sn-demo__meta">Standalone: the tick writes back to its own modelValue ({{ standalone }})</text>

    <SnCheckbox v-model="subscribed" true-value="yes" false-value="no">
      custom trueValue / falseValue
    </SnCheckbox>
    <text class="sn-demo__meta">trueValue="yes" / falseValue="no": currently {{ subscribed }}</text>

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
      A long label used to verify the maxWidth truncation and the customLabelClass style hook
    </SnCheckbox>
    <text class="sn-demo__meta">maxWidth bounds the label; customLabelClass lands on the label text node</text>

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
/* custom-class / custom-label-class sit on inner nodes, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__check) {
  background-color: var(--sn-mp-color-background-soft);
}
.sn-demo :deep(.sn-demo__label) {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}
</style>
