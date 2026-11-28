<script setup lang="ts">
/** Demo: sn-input-number — 主题（theme）：default / primary / outline-split / outline（对齐 wot-ui v2 顺序）+ circle 圆形按钮胶囊（AUI 追加，buttonColor 支持主题色圆钮）。 */
import { ref } from 'vue';
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue';

const a = ref(1);
const b = ref(2);
const c = ref(3);
const d = ref(4);
const e = ref(5);
const f = ref(6);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnInputNumber v-model="a" theme="default" />
    <SnInputNumber v-model="b" theme="primary" />
    <SnInputNumber v-model="c" theme="outline-split" />
    <SnInputNumber v-model="d" theme="outline" />
    <SnInputNumber v-model="e" theme="circle" />
    <SnInputNumber
      v-model="f"
      theme="circle"
      button-color="var(--sn-mp-color-action-primary)"
    />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
}
</style>
