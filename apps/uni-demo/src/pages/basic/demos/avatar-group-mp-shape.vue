<script setup lang="ts">
/**
 * Demo: sn-avatar-group (uni-end) — 形状：round 圆形（默认）/ square 方形。
 * 组内 `shape` 统一覆盖成员自身的 shape（wd-avatar-group「统一设置组内头像
 * 形状」契约）；成员复用基础用法的渐变文字头像。
 */
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import SnAvatarGroup from '@snui/uni-src/components/sn-avatar-group/sn-avatar-group.vue';

/** 演示成员：姓氏 + 渐变底色（深端色值兼作纯色兜底）。 */
const members = [
  { text: '张', base: '#6366F1', gradient: 'linear-gradient(135deg, #8B5CF6, #6366F1)' },
  { text: '李', base: '#2563EB', gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)' },
  { text: '陈', base: '#059669', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
  { text: '王', base: '#D97706', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <!-- 圆形：默认 shape -->
    <view class="grp-row">
      <view class="grp-meta">
        <text class="grp-title">圆形叠层（默认）</text>
      </view>
      <SnAvatarGroup cascading="right-up">
        <SnAvatar
          v-for="member in members"
          :key="member.text"
          :text="member.text"
          :size="32"
          :bg-color="member.base"
          color="var(--sn-mp-color-text-on-primary)"
          :custom-style="`background-image: ${member.gradient}`"
        />
      </SnAvatarGroup>
    </view>

    <!-- 方形：组内统一 square -->
    <view class="grp-row">
      <view class="grp-meta">
        <text class="grp-title">方形叠层（shape="square"）</text>
      </view>
      <SnAvatarGroup shape="square" cascading="right-up">
        <SnAvatar
          v-for="member in members"
          :key="member.text"
          :text="member.text"
          :size="32"
          :bg-color="member.base"
          color="var(--sn-mp-color-text-on-primary)"
          :custom-style="`background-image: ${member.gradient}`"
        />
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

/* 场景行卡：左侧标签 + 右侧头像组（与基础用法一致）。 */
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
