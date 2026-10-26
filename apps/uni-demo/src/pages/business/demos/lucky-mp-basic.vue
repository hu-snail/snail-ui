<script setup lang="ts">
/**
 * Demo: sn-lucky (uni-end) — 基础用法：内置按钮 play() 起转，宿主延迟
 * stop(随机索引) 落定。
 */
import { onBeforeUnmount, ref } from 'vue';
import SnLucky from '@snui/uni-src/components/sn-lucky/sn-lucky.vue';
import type { SnLuckyPrize } from '@snui/uni-src/components/sn-lucky/sn-lucky.vue';

const prizes: SnLuckyPrize[] = [
  { name: '一等奖' },
  { name: '优惠券' },
  { name: '积分' },
  { name: '谢谢参与' },
  { name: '红包' },
  { name: '实物奖' },
  { name: '再来一次' },
  { name: '免单券' },
];

const luckyRef = ref<InstanceType<typeof SnLucky> | null>(null);
const result = ref('点击中间按钮开始抽奖');
let settleTimer: ReturnType<typeof setTimeout> | null = null;

function onStart(): void {
  result.value = '旋转中…（宿主异步决定结果）';
  settleTimer = setTimeout(() => {
    luckyRef.value?.stop(Math.floor(Math.random() * prizes.length));
  }, 1200);
}

function onEnd(index: number): void {
  result.value = `end(${index}) → ${prizes[index]?.name ?? ''}`;
}

onBeforeUnmount(() => {
  if (settleTimer !== null) clearTimeout(settleTimer);
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnLucky ref="luckyRef" :prizes="prizes" :speed="60" @start="onStart" @end="onEnd" />
    <text class="sn-demo__meta">{{ result }}</text>
    <text class="sn-demo__meta">start 后宿主请求结果，拿到后 stop(index) 减速落定</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
