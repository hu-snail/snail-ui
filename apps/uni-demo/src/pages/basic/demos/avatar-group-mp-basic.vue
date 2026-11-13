<script setup lang="ts">
/**
 * Demo: sn-avatar-group (uni-end) — 按场景行卡布局：左标签 + 右头像组。
 * 场景：基础叠层 / 截断计数 / 自定义折叠文本 / 竖向排列。
 *
 * 成员头像用「渐变底色 + 姓氏文字」而非网络图片：弱网 / 离线（真机首跑
 * 常见）下图片加载失败会退化成空圆，行卡里几乎不可见；渐变 + 文字在任何
 * 网络状态下都保持完整视觉。bgColor 是渐变不可用时的纯色兜底（与渐变深端
 * 同色），渐变色值是演示装饰，不属于 token 体系。
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
    <!-- 基础叠层：不设 max-count，全部显示 -->
    <view class="grp-row">
      <view class="grp-meta">
        <text class="grp-title">基础叠层</text>
      </view>
      <SnAvatarGroup cascading="right-up">
        <SnAvatar
          v-for="member in members.slice(0, 3)"
          :key="member.text"
          :text="member.text"
          :size="32"
          :bg-color="member.base"
          color="var(--sn-mp-color-text-on-primary)"
          :custom-style="`background-image: ${member.gradient}`"
        />
      </SnAvatarGroup>
    </view>

    <!-- 截断计数：max-count=3 → 2 个头像 + +4 -->
    <view class="grp-row">
      <view class="grp-meta">
        <text class="grp-title">截断计数限制</text>
      </view>
      <SnAvatarGroup :max-count="3" cascading="right-up">
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

    <!-- 自定义折叠文本 -->
    <view class="grp-row">
      <view class="grp-meta">
        <text class="grp-title">自定义折叠样式</text>
      </view>
      <SnAvatarGroup :max-count="3" collapse-avatar="+12" cascading="right-up">
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

    <!-- 竖向排列 -->
    <view class="grp-row">
      <view class="grp-meta">
        <text class="grp-title">竖向排列</text>
      </view>
      <SnAvatarGroup vertical :max-count="3">
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
