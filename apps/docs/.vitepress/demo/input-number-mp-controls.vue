<script setup lang="ts">
/** Demo: sn-input-number — 按钮与输入框的独立开关：disableInput / disableMinus / disablePlus / withoutInput / inputWidth。 */
import { ref } from 'vue'
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue'

const noInput = ref(5)
const noMinus = ref(5)
const noPlus = ref(5)
const buttonsOnly = ref(5)
const wide = ref(5)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">disableInput（只锁输入框，按钮仍可用）</text>
    <SnInputNumber v-model="noInput" :min="0" :max="20" disable-input />

    <text class="sn-demo__title">disableMinus（只锁减号）</text>
    <SnInputNumber v-model="noMinus" :min="0" :max="20" disable-minus />

    <text class="sn-demo__title">disablePlus（只锁加号）</text>
    <SnInputNumber v-model="noPlus" :min="0" :max="20" disable-plus />

    <text class="sn-demo__title">withoutInput（只留加减按钮）</text>
    <SnInputNumber v-model="buttonsOnly" :min="0" :max="20" without-input />

    <text class="sn-demo__title">inputWidth（数字按 rpx 设计值）</text>
    <SnInputNumber v-model="wide" :min="0" :max="20" :input-width="120" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
