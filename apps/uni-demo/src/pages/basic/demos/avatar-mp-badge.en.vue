<script setup lang="ts">
/**
 * Demo: sn-avatar (uni-end) — badge avatars composed from sn-badge.
 * Grid layout: avatar on top, label below.
 *
 * A circular avatar's visible edge is its arc, while the badge anchors at the
 * content's BOX corner (outside the arc) — un-nudged, the marker reads as
 * fully detached. top / right (the contract nudge props; 8rpx measured for a
 * 72rpx avatar with a 32rpx marker) pull the marker center onto the arc:
 * half on the avatar, half off, matching the wd-avatar riding look.
 */
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import SnBadge from '@snui/uni-src/components/sn-badge/sn-badge.vue';

const photo = '/static/avatar-user.png';
const arcNudge = { top: '8rpx', right: '8rpx' };
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">Badge avatars: sn-badge wrapping sn-avatar (count / dot):</text>
    <view class="st-grid">
      <view class="st-cell">
        <SnBadge :value="99" :max="99" :top="arcNudge.top" :right="arcNudge.right">
          <SnAvatar :src="photo" />
        </SnBadge>
        <text class="st-label">Count</text>
      </view>
      <view class="st-cell">
        <SnBadge :value="3" :top="arcNudge.top" :right="arcNudge.right">
          <SnAvatar
            text="C"
            bg-color="var(--sn-mp-color-action-primary)"
            color="var(--sn-mp-color-text-on-primary)"
          />
        </SnBadge>
        <text class="st-label">Count</text>
      </view>
      <view class="st-cell">
        <SnBadge :value="5" :top="arcNudge.top" :right="arcNudge.right">
          <SnAvatar
            icon="User"
            bg-color="var(--sn-mp-color-feedback-success)"
            color="var(--sn-mp-color-text-on-primary)"
          />
        </SnBadge>
        <text class="st-label">Icon avatar</text>
      </view>
      <view class="st-cell">
        <SnBadge is-dot :top="arcNudge.top" :right="arcNudge.right">
          <SnAvatar text="M" />
        </SnBadge>
        <text class="st-label">Dot</text>
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
