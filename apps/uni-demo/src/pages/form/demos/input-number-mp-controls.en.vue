<script setup lang="ts">
/** Demo: sn-input-number — independently disabling the field and each button: disableInput / disableMinus / disablePlus / withoutInput / inputWidth. */
import { ref } from 'vue';
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue';

const noInput = ref(5);
const noMinus = ref(5);
const noPlus = ref(5);
const buttonsOnly = ref(5);
const wide = ref(5);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">disableInput (locks the field only; buttons still work)</text>
    <SnInputNumber v-model="noInput" :min="0" :max="20" disable-input />

    <text class="sn-demo__title">disableMinus (minus button only)</text>
    <SnInputNumber v-model="noMinus" :min="0" :max="20" disable-minus />

    <text class="sn-demo__title">disablePlus (plus button only)</text>
    <SnInputNumber v-model="noPlus" :min="0" :max="20" disable-plus />

    <text class="sn-demo__title">withoutInput (buttons only)</text>
    <SnInputNumber v-model="buttonsOnly" :min="0" :max="20" without-input />

    <text class="sn-demo__title">inputWidth (a number is an rpx design value)</text>
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
