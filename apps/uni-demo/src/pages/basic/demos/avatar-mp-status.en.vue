<script setup lang="ts">
/**
 * Demo: sn-avatar (uni-end) — presence status (additive) + badge avatars.
 * Grid layout: avatar on top, label + prop code below.
 */
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import SnBadge from '@snui/uni-src/components/sn-badge/sn-badge.vue';

const photo = 'https://picsum.photos/seed/snui-avatar-status/96/96';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta"
      >Presence dot on the bottom-right corner (online green / offline grey); the state is announced
      via aria-label:</text
    >
    <view class="st-grid">
      <view class="st-cell">
        <SnAvatar :src="photo" size="medium" status="online" alt="Online" />
        <text class="st-label">Online</text>
      </view>
      <view class="st-cell">
        <SnAvatar :src="photo" size="medium" status="offline" alt="Offline" />
        <text class="st-label">Offline</text>
      </view>
      <view class="st-cell">
        <SnAvatar
          text="C"
          status="online"
          bg-color="var(--sn-mp-color-action-primary)"
          color="var(--sn-mp-color-text-on-primary)"
        />
        <text class="st-label">Text avatar</text>
      </view>
      <view class="st-cell">
        <SnAvatar text="L" size="medium" status="offline" />
        <text class="st-label">Text avatar</text>
      </view>
    </view>

    <text class="sn-demo__meta">Badge avatars: sn-badge wrapping sn-avatar (count / dot):</text>
    <view class="st-grid">
      <view class="st-cell">
        <SnBadge :value="99" :max="99">
          <SnAvatar :src="photo" />
        </SnBadge>
        <text class="st-label">Count</text>
      </view>
      <view class="st-cell">
        <SnBadge :value="3">
          <SnAvatar
            text="C"
            bg-color="var(--sn-mp-color-action-primary)"
            color="var(--sn-mp-color-text-on-primary)"
          />
        </SnBadge>
        <text class="st-label">Count</text>
      </view>
      <view class="st-cell">
        <SnBadge :value="5">
          <SnAvatar
            icon="User"
            bg-color="var(--sn-mp-color-feedback-success)"
            color="var(--sn-mp-color-text-on-primary)"
          />
        </SnBadge>
        <text class="st-label">Icon avatar</text>
      </view>
      <view class="st-cell">
        <SnBadge is-dot>
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
