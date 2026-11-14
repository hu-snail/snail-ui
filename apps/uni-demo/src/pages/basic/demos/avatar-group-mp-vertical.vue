<script setup lang="ts">
/**
 * Demo: sn-avatar-group (uni-end) — 竖向排列：vertical 忽略 cascading，
 * 叠层方向转为自上而下。组内统一尺寸 size="64rpx"，见基础用法说明。
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
  <view class="sn-demo">
    <SnAvatarGroup vertical :max-count="3" size="64rpx">
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
