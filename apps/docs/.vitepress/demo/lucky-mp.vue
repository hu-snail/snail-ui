<script setup lang="ts">
/**
 * Demo: sn-lucky (uni-end) — 九宫格抽奖：play() 起转，宿主异步 stop(index) 落定。
 */
import { ref } from 'vue'
import SnLucky from '@snui/uni-src/components/sn-lucky/sn-lucky.vue'
import type { SnLuckyPrize } from '@snui/uni-src/components/sn-lucky/sn-lucky.vue'

const prizes: SnLuckyPrize[] = [
  { name: '一等奖' },
  { name: '优惠券' },
  { name: '积分' },
  { name: '谢谢参与' },
  { name: '实物奖' },
  { name: '再来一次' },
  { name: '红包' },
  { name: '免单券' },
]
const luckyRef = ref<InstanceType<typeof SnLucky> | null>(null)
const result = ref('点击中间按钮开始')

function onEnd(index: number): void {
  result.value = `落定：${prizes[index]?.name ?? ''}`
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnLucky
      ref="luckyRef"
      :prizes="prizes"
      :speed="60"
      @end="onEnd"
    >
      <template #prize="{ item, isActive }">
        <view class="cell" :class="{ 'cell--active': isActive }">
          <text class="cell__name" :class="{ 'cell__name--active': isActive }">{{ item?.name }}</text>
        </view>
      </template>
    </SnLucky>
    <text class="sn-demo__meta">{{ result }} —— start 后在宿主请求结果，再调用 stop(index)</text>
  </view>
</template>

<style scoped>
.cell {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
  background-color: var(--sn-mp-color-background-surface);
}

.cell--active {
  background-color: var(--sn-mp-color-action-primary-soft);
}

.cell__name {
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-primary);
  text-align: center;
}

.cell__name--active {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
}
</style>
