<script setup lang="ts">
/**
 * Demo: sn-avatar-group (uni-end) — 形状：round 圆形（默认）/ square 方形。
 * 组内 `shape` 统一覆盖成员自身的 shape（wd-avatar-group「统一设置组内头像
 * 形状」契约）；成员尺寸用 rpx，见基础用法说明。
 */
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import SnAvatarGroup from '@snui/uni-src/components/sn-avatar-group/sn-avatar-group.vue';

/** 演示成员：姓氏 + 渐变底色（深端色值兼作纯色兜底）。 */
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
      <text class="grp-label">圆形叠层（默认）</text>
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
      <text class="grp-label">方形叠层（shape="square" + max-count）</text>
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

/* 场景块：标签在上、头像组在下。 */
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
