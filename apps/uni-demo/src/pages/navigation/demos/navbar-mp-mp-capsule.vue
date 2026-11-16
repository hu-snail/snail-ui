<script setup lang="ts">
/**
 * Demo: sn-navbar — 微信小程序自定义导航胶囊适配。
 *
 * navigationStyle: custom 时，微信小程序右上角自带系统胶囊（••• / ⊙），
 * 右侧插槽与文案不能放在那一块，demo 不模拟绘制它。此场景还原真实布局：
 * 左侧 #capsule 放「返回 + 首页」、标题居中、右侧留出胶囊避让区。真机开启
 * safe-area-inset-top 后，组件会按 getMenuButtonBoundingClientRect() 的
 * 实测值补状态栏并左移右侧锚点；宿主不手画左侧胶囊时，mp-capsule 开启的
 * sn-navbar 会在小程序环境自动渲染内置胶囊。
 */
import { ref } from 'vue';
import SnNavbar from '@snui/uni-src/components/sn-navbar/sn-navbar.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { ChevronLeft, Home } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const lastAction = ref('—');

function report(label: string): void {
  lastAction.value = label;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnNavbar
      title="小程序页面"
      custom-style="padding-right: 208rpx;"
      @back-home="report('首页')"
    >
      <template #capsule>
        <view class="mp-nav__capsule">
          <view class="mp-nav__capsule-btn" @tap="report('返回')">
            <SnIcon :icon="ChevronLeft" :size="28" />
          </view>
          <view class="mp-nav__capsule-rule" />
          <view class="mp-nav__capsule-btn" @tap="report('首页')">
            <SnIcon :icon="Home" :size="26" />
          </view>
        </view>
      </template>
    </SnNavbar>

    <text class="sn-demo__meta">
      右侧 208rpx 为胶囊避让区：自定义导航右上角固定是系统胶囊（小程序自带，demo 不模拟绘制），
      右侧插槽不要放内容；开启 safe-area-inset-top 后，组件按实测值自动留白并补状态栏。
    </text>
    <text class="sn-demo__meta">最近一次点击：{{ lastAction }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  padding: 0 32rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.mp-nav__capsule {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 64rpx;
  /* 几何对齐微信真胶囊（87px × 32px = 174 × 64rpx），观感安静：极淡描边 +
   * 次级图标色。真机宿主也可以不手画——sn-navbar 开启 mp-capsule 时会在
   * 小程序环境自动渲染内置胶囊。 */
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-text-secondary);
}
.mp-nav__capsule-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 86rpx;
  height: 100%;
}
.mp-nav__capsule-rule {
  width: 2rpx;
  height: 32rpx;
  background-color: var(--sn-mp-color-border-subtle);
}
</style>
