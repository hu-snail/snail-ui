<script setup lang="ts">
/** 模板：图文社区（小红书风格）—— 频道分段 + 双列笔记流 + 点赞。 */
import { ref } from 'vue';
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';

const tab = ref(1);
const tabs = ['关注', '发现', '附近'];
const notes = [
  { id: 1, title: '保温杯里泡枸杞的一天', from: '#6366f1', to: '#c084fc', h: 220 },
  { id: 2, title: '桌面改造分享', from: '#0ea5e9', to: '#22d3ee', h: 300 },
  { id: 3, title: '三个提升效率的小习惯', from: '#f97316', to: '#facc15', h: 260 },
  { id: 4, title: '周末爬山路上的光', from: '#34d399', to: '#a7f3d0', h: 200 },
  { id: 5, title: '一个人的城市夜跑', from: '#8b5cf6', to: '#60a5fa', h: 250 },
  { id: 6, title: '自制低卡便当合集', from: '#fb7185', to: '#fda4af', h: 210 },
];
const liked = ref<Record<number, boolean>>({});
function toggle(id: number): void {
  liked.value[id] = !liked.value[id];
}
</script>

<template>
  <view class="tpl-page xhs">
    <view class="xhs__seg">
      <text
        v-for="(tb, i) in tabs"
        :key="tb"
        class="xhs__seg-item"
        :class="{ 'is-active': tab === i }"
        @tap="tab = i"
      >{{ tb }}</text>
    </view>
    <view class="xhs__flow">
      <view v-for="note in notes" :key="note.id" class="xhs__note">
        <view class="xhs__cover" :style="{ height: `${note.h}rpx`, background: `linear-gradient(135deg, ${note.from}, ${note.to})` }" />
        <text class="xhs__title">{{ note.title }}</text>
        <view class="xhs__foot">
          <SnAvatar text="蜗" :size="36" round />
          <text class="xhs__author">蜗蜗</text>
          <text class="xhs__like" :class="{ 'is-on': liked[note.id] }" @tap.stop="toggle(note.id)">♥ {{ liked[note.id] ? 129 : 128 }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.xhs {
  background: #f4f6f9;
  min-height: 100vh;
}
.xhs__seg {
  display: flex;
  justify-content: center;
  gap: 56rpx;
  padding: 20rpx 0 12rpx;
  background: #ffffff;
}
.xhs__seg-item {
  font-size: 30rpx;
  font-weight: 600;
  color: #98a2b3;
  padding-bottom: 10rpx;
  border-bottom: 4rpx solid transparent;
}
.xhs__seg-item.is-active {
  color: #1d2939;
  border-bottom-color: #4f6ef7;
}
.xhs__flow {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  padding: 20rpx;
}
.xhs__note {
  width: calc(50% - 10rpx);
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.xhs__cover {
  width: 100%;
}
.xhs__title {
  padding: 14rpx 16rpx 0;
  font-size: 24rpx;
  font-weight: 600;
  line-height: 1.45;
  color: #1d2939;
}
.xhs__foot {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 12rpx 16rpx 16rpx;
}
.xhs__author {
  flex: 1;
  font-size: 20rpx;
  color: #98a2b3;
}
.xhs__like {
  font-size: 20rpx;
  color: #98a2b3;
}
.xhs__like.is-on {
  color: #f43f5e;
}
</style>
