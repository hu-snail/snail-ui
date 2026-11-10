<script setup lang="ts">
/**
 * Demo: sn-tabs — 切换动画（animated）。
 *
 * - `animated` 开启底部条过渡，同时把 `scroll-with-animation` 打开（选中项平滑滚进可视区）
 * - `duration` 控制过渡时长（ms），swiper 模式下同时是内容区滑动时长
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';

const animatedActive = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTabs v-model="animatedActive" animated :duration="600">
      <SnTab title="推荐" :name="0">推荐内容</SnTab>
      <SnTab title="关注" :name="1">关注内容</SnTab>
      <SnTab title="热榜" :name="2">热榜内容</SnTab>
    </SnTabs>

    <text class="sn-demo__meta">animated + duration=600：底部条过渡 + 选中项平滑滚入；当前页签：{{ animatedActive }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  align-items: stretch;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
