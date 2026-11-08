<script setup lang="ts">
/**
 * Demo: sn-dialer (uni-end) — 基础用法：点击 GO → 宿主决定索引 → run(index)
 * → done 反馈。
 */
import { ref } from 'vue';
import SnDialer from '@snui/uni-src/components/sn-dialer/sn-dialer.vue';
import type { SnDialerPrize } from '@snui/uni-src/components/sn-dialer/sn-dialer.vue';

const prizeList: SnDialerPrize[] = [
  { id: 'p1', name: '一等奖' },
  { id: 'p2', name: '优惠券' },
  { id: 'p3', name: '积分' },
  { id: 'thanks', name: '谢谢参与' },
  { id: 'p5', name: '实物奖' },
  { id: 'p6', name: '再来一次' },
];

const dialerRef = ref<InstanceType<typeof SnDialer> | null>(null);
const result = ref('点击 GO 开始抽奖');

function onClick(): void {
  // 宿主决定中奖索引（真实业务里这里是请求后端的结果）。
  const index = Math.floor(Math.random() * prizeList.length);
  dialerRef.value?.run(index);
}

function onDone(index: number): void {
  result.value = `done(${index}) → ${prizeList[index]?.name ?? ''}`;
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="dialer-stage">
      <SnDialer ref="dialerRef" :prize-list="prizeList" @click="onClick" @done="onDone" />
    </view>
    <text class="sn-demo__meta">{{ result }}</text>
    <text class="sn-demo__meta">中奖索引由宿主决定：click 时请求结果，再调用 run(index)</text>
  </view>
</template>

<style scoped>
.dialer-stage {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
