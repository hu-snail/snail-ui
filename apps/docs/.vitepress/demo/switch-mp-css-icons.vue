<script setup lang="ts">
/** Demo: sn-switch — CSS 类图标模式：activeActionCssIcon / inactiveActionCssIcon / activeCssIcon / inactiveCssIcon + classPrefix。 */
import { ref } from 'vue'
import SnSwitch from '@snui/uni-src/components/sn-switch/sn-switch.vue'

const knobCss = ref(true)
const railCss = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">activeActionCssIcon / inactiveActionCssIcon（旋钮图标改成 CSS 类）</text>
    <SnSwitch
      v-model="knobCss"
      class-prefix="sn-demo-icon"
      active-action-icon="sn-demo-icon--on"
      inactive-action-icon="sn-demo-icon--off"
      active-action-css-icon
      inactive-action-css-icon
    />

    <text class="sn-demo__title">activeCssIcon / inactiveCssIcon（轨道图标改成 CSS 类）</text>
    <SnSwitch
      v-model="railCss"
      active-icon="sn-demo-dot--on"
      inactive-icon="sn-demo-dot--off"
      active-css-icon
      inactive-css-icon
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo-icon--on,
.sn-demo-icon--off {
  display: inline-flex;
  width: 20rpx;
  height: 20rpx;
  border-radius: var(--sn-mp-radius-full);
}

.sn-demo-icon--on {
  background-color: var(--sn-mp-color-feedback-success);
}

.sn-demo-icon--off {
  background-color: var(--sn-mp-color-text-disabled);
}

.sn-demo-dot--on,
.sn-demo-dot--off {
  display: inline-flex;
  width: 24rpx;
  height: 24rpx;
  border-radius: var(--sn-mp-radius-full);
}

.sn-demo-dot--on {
  background-color: var(--sn-mp-color-action-primary);
}

.sn-demo-dot--off {
  background-color: var(--sn-mp-color-control-unchecked);
}
</style>
