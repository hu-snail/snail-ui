<script setup lang="ts">
/**
 * Demo: sn-lucky (uni-end) — 状态与事件：start / end 事件日志 + 手动
 * play()/stop(index) 控制；旋转中重复 play、未旋转时 stop 均被忽略。
 */
import { ref } from 'vue';
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
const isPlaying = ref(false);
const log = ref<string[]>([]);
let seq = 0;

function pushLog(line: string): void {
  seq += 1;
  log.value.unshift(`#${seq} ${line}`);
  if (log.value.length > 5) log.value.pop();
}

function play(): void {
  luckyRef.value?.play();
}

function stopAt(index: number): void {
  luckyRef.value?.stop(index);
}

function onStart(): void {
  isPlaying.value = true;
  pushLog('start：开始循环高亮');
}

function onEnd(index: number): void {
  isPlaying.value = false;
  pushLog(`end(${index})：落定 ${prizes[index]?.name ?? ''}`);
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnLucky ref="luckyRef" :prizes="prizes" :speed="60" @start="onStart" @end="onEnd" />

    <view class="lucky-controls">
      <view class="lucky-controls__btn" hover-class="lucky-controls__btn--down" @tap="play">
        <text class="lucky-controls__btn-text">play()</text>
      </view>
      <view class="lucky-controls__btn" hover-class="lucky-controls__btn--down" @tap="stopAt(0)">
        <text class="lucky-controls__btn-text">stop(0)</text>
      </view>
      <view
        class="lucky-controls__btn"
        hover-class="lucky-controls__btn--down"
        @tap="stopAt(Math.floor(Math.random() * prizes.length))"
      >
        <text class="lucky-controls__btn-text">stop(随机)</text>
      </view>
    </view>
    <text class="sn-demo__meta">
      状态：{{ isPlaying ? '旋转中' : '待机' }} —— stop 会再绕一圈逐步减速，未播放时调用无效
    </text>

    <view class="lucky-log">
      <text v-for="(line, index) in log" :key="index" class="lucky-log__line">{{ line }}</text>
      <text v-if="log.length === 0" class="lucky-log__line">暂无事件</text>
    </view>
  </view>
</template>

<style scoped>
.lucky-controls {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-3);
}

.lucky-controls__btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 14rpx 36rpx;
  border-radius: 32rpx;
  background-color: var(--sn-mp-color-action-primary);
}

.lucky-controls__btn--down {
  opacity: 0.85;
}

.lucky-controls__btn-text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-sm);
}

.lucky-log {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-subtle);
}

.lucky-log__line {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}

.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
