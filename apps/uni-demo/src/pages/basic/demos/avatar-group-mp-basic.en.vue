<script setup lang="ts">
/**
 * Demo: sn-avatar-group (uni-end) — scenario row cards: label left, group right.
 * Scenarios: basic stack / max-count / custom collapse text / vertical.
 */
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import SnAvatarGroup from '@snui/uni-src/components/sn-avatar-group/sn-avatar-group.vue';

/** 5 demo avatars (stable picsum seeds). */
const users = [1, 2, 3, 4, 5].map((n) => `https://picsum.photos/seed/snui-avatar-${n}/96/96`);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <!-- Basic stack: no max-count, everything visible -->
    <view class="grp-row">
      <view class="grp-meta">
        <text class="grp-title">Basic stack</text>
      </view>
      <SnAvatarGroup cascading="right-up">
        <SnAvatar v-for="src in users.slice(0, 3)" :key="src" :src="src" :size="32" />
      </SnAvatarGroup>
    </view>

    <!-- Max count: max-count=3 → 2 avatars + bubble -->
    <view class="grp-row">
      <view class="grp-meta">
        <text class="grp-title">Overflow limit</text>
      </view>
      <SnAvatarGroup :max-count="3" cascading="right-up">
        <SnAvatar v-for="src in users" :key="src" :src="src" :size="32" />
      </SnAvatarGroup>
    </view>

    <!-- Custom collapse text -->
    <view class="grp-row">
      <view class="grp-meta">
        <text class="grp-title">Custom collapse</text>
      </view>
      <SnAvatarGroup :max-count="3" collapse-avatar="+12" cascading="right-up">
        <SnAvatar v-for="src in users" :key="src" :src="src" :size="32" />
      </SnAvatarGroup>
    </view>

    <!-- Vertical -->
    <view class="grp-row">
      <view class="grp-meta">
        <text class="grp-title">Vertical</text>
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

/* Scenario row card: label left, group right. */
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
