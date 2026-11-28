<script setup lang="ts">
/**
 * Demo: sn-avatar-group (uni-end) — shape: round (default) / square. The
 * group's `shape` uniformly overrides the members' own shape (the
 * wd-avatar-group "unify member shapes" contract); member sizes are rpx,
 * see the basic demo note. Labels sit above each stack.
 */
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import SnAvatarGroup from '@snui/uni-src/components/sn-avatar-group/sn-avatar-group.vue';

/** Demo members: surname + gradient background (deep stop doubles as fallback). */
const members = [
  { text: '张', base: '#6366F1', gradient: 'linear-gradient(135deg, #8B5CF6, #6366F1)' },
  { text: '李', base: '#2563EB', gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)' },
  { text: '陈', base: '#059669', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
  { text: '王', base: '#D97706', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
  { text: '赵', base: '#DB2777', gradient: 'linear-gradient(135deg, #EC4899, #DB2777)' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="grp-scene">
      <text class="grp-label">Round stack (default)</text>
      <SnAvatarGroup size="64rpx" cascading="right-up">
        <SnAvatar
          v-for="member in members"
          :key="member.text"
          :text="member.text"
          :bg-color="member.base"
          color="var(--sn-mp-color-text-on-primary)"
          :custom-style="`background-image: ${member.gradient}`"
        />
      </SnAvatarGroup>
    </view>

    <view class="grp-scene">
      <text class="grp-label">Square stack (shape="square" + max-count)</text>
      <SnAvatarGroup shape="square" size="64rpx" :max-count="3" cascading="right-up">
        <SnAvatar
          v-for="member in members"
          :key="member.text"
          :text="member.text"
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
  gap: 24rpx;
}

/* Scenario block: label above, stack below. */
.grp-scene {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.grp-label {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
