<script setup lang="ts">
/**
 * Demo: sn-avatar (uni-end) — 微标头像（sn-badge 组合）。
 * 网格布局：头像在上，标签在下。
 *
 * 圆形头像的可见边缘是圆弧，badge 默认锚定的内容盒角在圆外——不调偏移时
 * 角标看起来完全脱离头像。top / right（组件契约内的偏移 prop，8rpx 为
 * normal 头像 72rpx + 32rpx 角标的实测骑弧值）把角标中心压回圆弧上：
 * 一半在内、一半在外，参考 wd-avatar 的骑角观感。
 */
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import SnBadge from '@snui/uni-src/components/sn-badge/sn-badge.vue';

const photo = '/static/avatar-user.png';
const arcNudge = { top: '8rpx', right: '8rpx' };
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">微标头像：sn-badge 包裹 sn-avatar（数字角标 / 红点）：</text>
    <view class="st-grid">
      <view class="st-cell">
        <SnBadge :value="99" :max="99" :top="arcNudge.top" :right="arcNudge.right">
          <SnAvatar :src="photo" />
        </SnBadge>
        <text class="st-label">数字角标</text>
      </view>
      <view class="st-cell">
        <SnBadge :value="3" :top="arcNudge.top" :right="arcNudge.right">
          <SnAvatar
            text="陈"
            bg-color="var(--sn-mp-color-action-primary)"
            color="var(--sn-mp-color-text-on-primary)"
          />
        </SnBadge>
        <text class="st-label">数字角标</text>
      </view>
      <view class="st-cell">
        <SnBadge :value="5" :top="arcNudge.top" :right="arcNudge.right">
          <SnAvatar
            icon="User"
            bg-color="var(--sn-mp-color-feedback-success)"
            color="var(--sn-mp-color-text-on-primary)"
          />
        </SnBadge>
        <text class="st-label">图标头像</text>
      </view>
      <view class="st-cell">
        <SnBadge is-dot :top="arcNudge.top" :right="arcNudge.right">
          <SnAvatar text="M" />
        </SnBadge>
        <text class="st-label">红点</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
.st-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx 16rpx;
}
.st-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  width: 160rpx;
}
.st-label {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-semibold);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
