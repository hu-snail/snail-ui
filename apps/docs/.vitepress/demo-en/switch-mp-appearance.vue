<script setup lang="ts">
/** Demo: sn-switch — rail text / shape / size / custom colors. */
import { ref } from 'vue'
import SnSwitch from '@snui/uni-src/components/sn-switch/sn-switch.vue'

const withText = ref(true)
const square = ref(true)
const sized = ref(true)
const colored = ref(true)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">activeText / inactiveText</text>
    <SnSwitch v-model="withText" active-text="ON" inactive-text="OFF" />

    <text class="sn-demo__title">shape="square"</text>
    <SnSwitch v-model="square" shape="square" />

    <text class="sn-demo__title">size (a number is treated as rpx)</text>
    <SnSwitch v-model="sized" :size="140" />

    <text class="sn-demo__title">activeColor / inactiveColor</text>
    <SnSwitch
      v-model="colored"
      active-color="rgb(16, 185, 129)"
      inactive-color="rgb(161, 161, 170)"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
