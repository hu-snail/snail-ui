<script setup lang="ts">
/** Demo: sn-switch — 图标文案：activeActionIcon / inactiveActionIcon（knob）与 activeIcon / inactiveIcon（轨道）。 */
import { ref } from 'vue'
import SnSwitch from '@snui/uni-src/components/sn-switch/sn-switch.vue'
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry'
import { Check, Eye, Heart, X } from '@snui/uni-src/components/sn-icon/sn-icon-set'

registerSnIcons({ Check, Eye, Heart, X })

const knobIcons = ref(true)
const railIcons = ref(true)
const mixed = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">activeActionIcon / inactiveActionIcon（旋钮图标）</text>
    <SnSwitch v-model="knobIcons" active-action-icon="Check" inactive-action-icon="X" />

    <text class="sn-demo__title">activeIcon / inactiveIcon（轨道图标，替换轨道文案）</text>
    <SnSwitch v-model="railIcons" active-icon="Heart" inactive-icon="Eye" />

    <text class="sn-demo__title">轨道图标与文案混用</text>
    <SnSwitch v-model="mixed" active-icon="Check" inactive-text="关" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
