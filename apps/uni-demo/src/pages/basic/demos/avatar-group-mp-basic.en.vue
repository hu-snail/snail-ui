<script setup lang="ts">
/**
 * Demo: sn-avatar-group (uni-end) — basic stack: no max-count, everything
 * visible. Member sizes are rpx (same unit system as the component's rpx
 * overlap step, so the overlap ratio stays constant on every viewport —
 * mixing px makes wide viewports cover members down to thin slivers).
 * The group's size is 64rpx (rpx unit). Gradient text members keep the full visual under weak network / offline.
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
  <view class="sn-demo">
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
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: row;
}
</style>
