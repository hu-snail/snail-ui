<script setup lang="ts">
/** Demo: sn-switch — icon glyphs: activeActionIcon / inactiveActionIcon (knob) and activeIcon / inactiveIcon (rail). */
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
    <text class="sn-demo__title">activeActionIcon / inactiveActionIcon (knob glyph)</text>
    <SnSwitch v-model="knobIcons" active-action-icon="Check" inactive-action-icon="X" />

    <text class="sn-demo__title">activeIcon / inactiveIcon (rail glyph, replaces the rail label)</text>
    <SnSwitch v-model="railIcons" active-icon="Heart" inactive-icon="Eye" />

    <text class="sn-demo__title">Rail glyph mixed with a text label</text>
    <SnSwitch v-model="mixed" active-icon="Check" inactive-text="Off" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
