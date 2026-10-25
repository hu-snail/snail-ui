<script setup lang="ts">
/**
 * Demo: sn-dialer (uni-end) — 大转盘：点击指针 → run(随机索引) → done 提示。
 * 演示环境无 uni.*，结果用本地文案展示（宿主内可用 toast / modal）。
 */
import { ref } from 'vue'
import SnDialer from '@snui/uni-src/components/sn-dialer/sn-dialer.vue'
import type { SnDialerPrize } from '@snui/uni-src/components/sn-dialer/sn-dialer.vue'

const prizeList: SnDialerPrize[] = [
  { id: 'p1', name: '一等奖' },
  { id: 'p2', name: '优惠券' },
  { id: 'p3', name: '积分' },
  { id: 'thanks', name: '谢谢参与' },
  { id: 'p5', name: '实物奖' },
  { id: 'p6', name: '再来一次' },
]
const dialerRef = ref<InstanceType<typeof SnDialer> | null>(null)
const result = ref('点击 GO 开始抽奖')

function onClick(): void {
  const index = Math.floor(Math.random() * prizeList.length)
  dialerRef.value?.run(index)
}

function onDone(index: number): void {
  const prize = prizeList[index]
  result.value = prize?.id === 'thanks' ? `未中奖：${prize?.name}` : `恭喜获得：${prize?.name}`
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnDialer ref="dialerRef" :prize-list="prizeList" :turns="5" :duration="3" @click="onClick" @done="onDone" />
    <text class="sn-demo__meta">{{ result }}</text>
    <text class="sn-demo__meta">宿主决定中奖索引：click 时请求后端，再调用 run(index)</text>
  </view>
</template>
