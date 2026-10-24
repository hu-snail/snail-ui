<script setup lang="ts">
/** Demo: sn-input-number — default / outline / outline-split / primary 四种主题；round 圆角；disabled 拦掉全部交互；longPress 按住连续加减。 */
import { ref } from 'vue'
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue'

const a = ref(1)
const b = ref(2)
const c = ref(3)
const d = ref(4)
const e = ref(0)
const f = ref(5)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnInputNumber v-model="a" theme="default" />
    <SnInputNumber v-model="b" theme="outline" />
    <SnInputNumber v-model="c" theme="outline-split" />
    <SnInputNumber v-model="d" theme="primary" round />
    <SnInputNumber v-model="e" :min="0" :max="100" long-press />
    <SnInputNumber v-model="f" :min="0" :max="10" disabled />
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
