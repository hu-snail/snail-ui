<script setup lang="ts">
/**
 * Demo: sn-avatar-group (uni-end) — shape: round (default) / square.
 * The group's `shape` uniformly overrides the members' own shape (the
 * wd-avatar-group "unify member shapes" contract); members reuse the
 * gradient text avatars from the basic demo.
 */
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import SnAvatarGroup from '@snui/uni-src/components/sn-avatar-group/sn-avatar-group.vue';

/** Demo members: surname + gradient background (deep stop doubles as fallback). */
const members = [
  { text: '张', base: '#6366F1', gradient: 'linear-gradient(135deg, #8B5CF6, #6366F1)' },
  { text: '李', base: '#2563EB', gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)' },
  { text: '陈', base: '#059669', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
  { text: '王', base: '#D97706', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <!-- Round: default shape -->
    <view class="grp-row">
      <view class="grp-meta">
        <text class="grp-title">Round stack (default)</text>
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

    <!-- Square: unified via the group -->
    <view class="grp-row">
      <view class="grp-meta">
        <text class="grp-title">Square stack (shape="square")</text>
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

/* Scenario row card: label left, group right (same as the basic demo). */
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
