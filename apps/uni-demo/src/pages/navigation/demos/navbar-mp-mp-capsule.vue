<script setup lang="ts">
/**
 * Demo: sn-navbar — 微信小程序自定义导航胶囊适配。
 *
 * navigationStyle: custom 时，微信小程序右上角固定显示系统胶囊（••• / ⊙），
 * 右侧插槽与文案不能放在那一块。此场景还原真实布局：左侧 #capsule 放
 * 「返回 + 首页」、标题居中、右侧留出胶囊避让区；右侧胶囊是演示示意层，
 * 真机上由微信原生绘制。真机开启 safe-area-inset-top 后，组件会按
 * getMenuButtonBoundingClientRect() 的实测值补状态栏并左移右侧锚点。
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
    <view class="mp-nav">
      <SnNavbar
        title="小程序页面"
        custom-style="padding-right: 208rpx;"
        @back-home="report('首页')"
      >
        <template #capsule>
          <view class="mp-nav__capsule">
            <view class="mp-nav__capsule-btn" @tap="report('返回')">
              <SnIcon :icon="ChevronLeft" :size="36" />
            </view>
            <view class="mp-nav__capsule-rule" />
            <view class="mp-nav__capsule-btn" @tap="report('首页')">
              <SnIcon :icon="Home" :size="32" />
            </view>
          </view>
        </template>
      </SnNavbar>

      <!-- 演示示意：真机上是微信原生胶囊，这里只为展示右侧避让空间。 -->
      <view class="mp-nav__system">
        <text class="mp-nav__dots">•••</text>
        <view class="mp-nav__system-rule" />
        <text class="mp-nav__target">⊙</text>
      </view>
    </view>

    <text class="sn-demo__meta">
      右侧 208rpx 为胶囊避让区：自定义导航右上角固定是系统胶囊，右侧插槽不要放内容；开启
      safe-area-inset-top 后，组件按实测值自动留白并补状态栏。
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
.mp-nav {
  position: relative;
}
.mp-nav__capsule {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 64rpx;
  /* 对齐微信系统胶囊的安静观感：极淡描边 + 次级图标色。真机宿主也可以
   * 不手画——sn-navbar 开启 mp-capsule 时会在小程序环境自动渲染内置胶囊。 */
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-text-secondary);
}
.mp-nav__capsule-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 100%;
}
.mp-nav__capsule-rule {
  width: 2rpx;
  height: 32rpx;
  background-color: var(--sn-mp-color-border-subtle);
}
.mp-nav__system {
  position: absolute;
  top: 12rpx;
  right: 16rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  height: 64rpx;
  padding: 0 20rpx;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-surface);
}
.mp-nav__dots {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
.mp-nav__system-rule {
  width: 2rpx;
  height: 32rpx;
  background-color: var(--sn-mp-color-border-default);
}
.mp-nav__target {
  font-size: 32rpx;
  color: var(--sn-mp-color-text-primary);
}
</style>
