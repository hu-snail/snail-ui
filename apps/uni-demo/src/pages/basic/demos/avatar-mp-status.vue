<script setup lang="ts">
/**
 * Demo: sn-avatar (uni-end) — 在线 / 离线状态（additive）+ 微标头像（sn-badge）。
 * 网格布局：头像在上，标签 + prop 代码在下。
 */
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import SnBadge from '@snui/uni-src/components/sn-badge/sn-badge.vue';

const photo = 'https://picsum.photos/seed/snui-avatar-status/96/96';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta"
      >头像右下角状态点（online 绿 / offline 灰），状态会读进 aria-label：</text
    >
    <view class="st-grid">
      <view class="st-cell">
        <SnAvatar :src="photo" size="medium" status="online" alt="在线" />
        <text class="st-label">在线状态</text>
      </view>
      <view class="st-cell">
        <SnAvatar :src="photo" size="medium" status="offline" alt="离线" />
        <text class="st-label">离线状态</text>
      </view>
      <view class="st-cell">
        <SnAvatar
          text="陈"
          status="online"
          bg-color="var(--sn-mp-color-action-primary)"
          color="var(--sn-mp-color-text-on-primary)"
        />
        <text class="st-label">文字头像</text>
      </view>
      <view class="st-cell">
        <SnAvatar text="李" size="medium" status="offline" />
        <text class="st-label">文字头像</text>
      </view>
    </view>

    <text class="sn-demo__meta">微标头像：sn-badge 包裹 sn-avatar（数字角标 / 红点）：</text>
    <view class="st-grid">
      <view class="st-cell">
        <SnBadge :value="99" :max="99">
          <SnAvatar :src="photo" />
        </SnBadge>
        <text class="st-label">数字角标</text>
      </view>
      <view class="st-cell">
        <SnBadge :value="3">
          <SnAvatar
            text="陈"
            bg-color="var(--sn-mp-color-action-primary)"
            color="var(--sn-mp-color-text-on-primary)"
          />
        </SnBadge>
        <text class="st-label">数字角标</text>
      </view>
      <view class="st-cell">
        <SnBadge :value="5">
          <SnAvatar
            icon="User"
            bg-color="var(--sn-mp-color-feedback-success)"
            color="var(--sn-mp-color-text-on-primary)"
          />
        </SnBadge>
        <text class="st-label">图标头像</text>
      </view>
      <view class="st-cell">
        <SnBadge is-dot>
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
