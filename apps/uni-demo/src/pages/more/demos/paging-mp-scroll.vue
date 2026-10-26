<script setup lang="ts">
/**
 * Demo: sn-paging (uni-end) — 纯滑动容器 + 手势开关控制。
 *
 * - `refresher-enabled=false` + `load-more-enabled=false` 时 sn-paging 退化为
 *   纯滚动容器：长内容自由滑动，不请求、不显示页脚
 * - 两个开关实时生效：可随时只开下拉刷新、只开上拉加载或全关
 */
import { ref } from 'vue';
import SnPaging from '@snui/uni-src/components/sn-paging/sn-paging.vue';
import SnSwitch from '@snui/uni-src/components/sn-switch/sn-switch.vue';

const rows = Array.from({ length: 40 }, (_, i) => `第 ${i + 1} 行 · 纯滑动内容`);
const refresherOn = ref(false);
const loadMoreOn = ref(false);
const message = ref('未开启任何手势：仅页面滑动');

function onQuery(): void {
  /* 纯容器模式不应触发；保留计数用于演示「开关后手势立即生效」。 */
  message.value = '手势触发了 query —— 开关已生效';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="paging-switches">
      <view class="paging-switches__item">
        <text class="paging-switches__label">下拉刷新</text>
        <SnSwitch v-model="refresherOn" :size="44" />
      </view>
      <view class="paging-switches__item">
        <text class="paging-switches__label">上拉加载</text>
        <SnSwitch v-model="loadMoreOn" :size="44" />
      </view>
    </view>
    <text class="sn-demo__meta">{{ message }}</text>

    <view class="paging-frame">
      <SnPaging :refresher-enabled="refresherOn" :load-more-enabled="loadMoreOn" @query="onQuery">
        <view v-for="row in rows" :key="row" class="paging-row">
          <text class="paging-row__label">{{ row }}</text>
        </view>
      </SnPaging>
    </view>
  </view>
</template>

<style scoped>
.paging-switches {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-5);
}

.paging-switches__item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
}

.paging-switches__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}

.paging-frame {
  box-sizing: border-box;
  height: 520rpx;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
  overflow: hidden;
}

.paging-row {
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-4);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
  background-color: var(--sn-mp-color-background-surface);
}

.paging-row__label {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
