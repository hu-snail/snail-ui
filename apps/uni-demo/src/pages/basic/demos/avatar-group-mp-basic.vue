<script setup lang="ts">
/**
 * Demo: sn-avatar-group (uni-end) — 按场景行卡布局：左标签 + 右头像组。
 * 场景：基础叠层 / 截断计数 / 自定义折叠文本 / 竖向排列。
 */
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import SnAvatarGroup from '@snui/uni-src/components/sn-avatar-group/sn-avatar-group.vue';

/** 5 个演示头像（picsum 按种子稳定取图）。 */
const users = [1, 2, 3, 4, 5].map((n) => `https://picsum.photos/seed/snui-avatar-${n}/96/96`);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <!-- 基础叠层：不设 max-count，全部显示 -->
    <view class="grp-row">
      <view class="grp-meta">
        <text class="grp-title">基础叠层</text>
      </view>
      <SnAvatarGroup cascading="right-up">
        <SnAvatar v-for="src in users.slice(0, 3)" :key="src" :src="src" :size="32" />
      </SnAvatarGroup>
    </view>

    <!-- 截断计数：max-count=3 → 2 个头像 + +4 -->
    <view class="grp-row">
      <view class="grp-meta">
        <text class="grp-title">截断计数限制</text>
      </view>
      <SnAvatarGroup :max-count="3" cascading="right-up">
        <SnAvatar v-for="src in users" :key="src" :src="src" :size="32" />
      </SnAvatarGroup>
    </view>

    <!-- 自定义折叠文本 -->
    <view class="grp-row">
      <view class="grp-meta">
        <text class="grp-title">自定义折叠样式</text>
      </view>
      <SnAvatarGroup :max-count="3" collapse-avatar="+12" cascading="right-up">
        <SnAvatar v-for="src in users" :key="src" :src="src" :size="32" />
      </SnAvatarGroup>
    </view>

    <!-- 竖向排列 -->
    <view class="grp-row">
      <view class="grp-meta">
        <text class="grp-title">竖向排列</text>
      </view>
      <SnAvatarGroup vertical :max-count="3">
        <SnAvatar v-for="src in users" :key="src" :src="src" :size="32" />
      </SnAvatarGroup>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

/* 场景行卡：左侧标签 + 右侧头像组。 */
.grp-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  padding: 24rpx;
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-background-subtle);
}

.grp-meta {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  min-width: 0;
}

.grp-title {
  color: var(--sn-mp-color-text-primary);
  font-size: 26rpx;
  font-weight: var(--sn-mp-font-weight-semibold);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
