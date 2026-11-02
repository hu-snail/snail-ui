<script setup lang="ts">
/**
 * Demo: sn-tabbar — 毛玻璃风格（glass）。
 *
 * `glass` 把栏背景换成半透明表面 + backdrop-filter 高斯模糊（20rpx blur +
 * 1.6 饱和），固定在底部时页面内容从栏后透出；`bordered` 照常叠加，暗色主题
 * 由 `.sn-theme-dark` 翻转玻璃色。
 *
 * 预览专用：真实运行时 fixed 栏贴视口底部；stage 内用 custom-class 改为
 * absolute，背景色带 + 文字滚动展示透出效果。
 */
import { ref } from 'vue';
import SnTabbar from '@snui/uni-src/components/sn-tabbar/sn-tabbar.vue';
import SnTabbarItem from '@snui/uni-src/components/sn-tabbar/sn-tabbar-item.vue';

const active = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-tabbar-demo__stage">
      <view class="sn-tabbar-demo__rows">
        <view v-for="i in 6" :key="i" class="sn-tabbar-demo__row"
          >内容行 {{ i }}：从毛玻璃栏后透出</view
        >
      </view>

      <SnTabbar
        v-model="active"
        fixed
        glass
        bordered
        :z-index="40"
        custom-class="sn-demo-contained"
      >
        <SnTabbarItem title="首页" icon="house" />
        <SnTabbarItem title="发现" icon="message-circle" />
        <SnTabbarItem title="消息" icon="bell" />
        <SnTabbarItem title="我的" icon="user" />
      </SnTabbar>
    </view>

    <text class="sn-demo__meta">
      glass = 半透明背景 + backdrop-filter 模糊；滚动内容在栏后透出（真机 fixed 时整页透出）。
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-tabbar-demo__stage {
  position: relative;
  height: 420rpx;
  overflow: hidden;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background: linear-gradient(
    160deg,
    var(--sn-mp-color-action-primary-soft),
    var(--sn-mp-color-background-subtle)
  );
}
.sn-tabbar-demo__rows {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 24rpx;
}
.sn-tabbar-demo__row {
  padding: 20rpx 24rpx;
  border-radius: var(--sn-mp-radius-sm);
  background: var(--sn-mp-color-background-elevated);
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* Docs-preview only — pin the fixed bar to the stage instead of the viewport. */
.sn-tabbar-demo__stage :deep(.sn-tabbar.sn-demo-contained) {
  position: absolute;
}
</style>
