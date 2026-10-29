<script setup lang="ts">
/**
 * 模板卡 —— 首页双列瀑布卡片：渐变封面（内嵌迷你屏幕示意）+ 来源工具角标
 * + 收藏心形 + 类型角标 + 标题 / 作者 / 下载量。颜色消费页面级 --tplh-* 变量。
 */
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Download, Heart } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import type { TplItem } from './templates';
import { formatDownloads } from './templates';

defineOptions({ name: 'TplCard' });

const props = defineProps<{
  item: TplItem;
  liked: boolean;
}>();

const emit = defineEmits<{
  (e: 'open'): void;
  (e: 'like'): void;
}>();

function onLike(): void {
  emit('like');
}
</script>

<template>
  <view class="card" @tap="emit('open')">
    <view class="card__cover" :style="{ background: `linear-gradient(155deg, ${props.item.from}, ${props.item.to})` }">
      <view class="card__glow" aria-hidden="true" />
      <view class="card__screen" aria-hidden="true">
        <SnIcon :icon="props.item.icon" :size="46" color="rgba(255,255,255,0.96)" />
        <text class="card__screen-title">{{ props.item.title }}</text>
      </view>
      <view class="card__tool"><text class="card__tool-text">{{ props.item.tool }}</text></view>
      <view
        class="card__like"
        :class="{ 'is-on': props.liked }"
        role="button"
        :aria-label="`收藏 ${props.item.title}`"
        @tap.stop="onLike"
      >
        <SnIcon :icon="Heart" :size="28" :color="props.liked ? '#ff5d76' : '#ffffff'" />
      </view>
      <view class="card__tag"><text class="card__tag-text">{{ props.item.tag }}</text></view>
    </view>
    <view class="card__body">
      <text class="card__title">{{ props.item.title }}</text>
      <view class="card__meta">
        <view class="card__author">
          <view class="card__avatar" :style="{ background: props.item.authorColor }">
            <text class="card__avatar-text">{{ props.item.initial }}</text>
          </view>
          <text class="card__author-name">{{ props.item.author }}</text>
        </view>
        <view class="card__dl">
          <SnIcon :icon="Download" :size="24" color="var(--tplh-accent)" />
          <text class="card__dl-text">{{ formatDownloads(props.item.downloads) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  width: calc(50% - 10rpx);
  border-radius: 24rpx;
  overflow: hidden;
  background: var(--tplh-card);
  border: 2rpx solid var(--tplh-line);
  box-shadow: var(--tplh-shadow);
  box-sizing: border-box;
}
.card__cover {
  position: relative;
  height: 560rpx;
  overflow: hidden;
}
.card__glow {
  position: absolute;
  top: -60rpx;
  left: 50%;
  width: 320rpx;
  height: 320rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  filter: blur(40rpx);
}
.card__screen {
  position: absolute;
  top: 130rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 240rpx;
  height: 300rpx;
  border-radius: 28rpx;
  background: rgba(10, 18, 14, 0.32);
  border: 2rpx solid rgba(255, 255, 255, 0.28);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18rpx;
}
.card__screen-title {
  max-width: 200rpx;
  color: rgba(255, 255, 255, 0.92);
  font-size: 22rpx;
  font-weight: 600;
  text-align: center;
}
.card__tool {
  position: absolute;
  top: 14rpx;
  left: 14rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  background: rgba(0, 0, 0, 0.45);
}
.card__tool-text {
  color: rgba(255, 255, 255, 0.92);
  font-size: 20rpx;
}
.card__like {
  position: absolute;
  top: 14rpx;
  right: 14rpx;
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.card__tag {
  position: absolute;
  bottom: 14rpx;
  right: 14rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  background: rgba(0, 0, 0, 0.45);
  border: 2rpx solid rgba(255, 255, 255, 0.22);
}
.card__tag-text {
  color: #ffffff;
  font-size: 20rpx;
}
.card__body {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 18rpx 20rpx 20rpx;
}
.card__title {
  color: var(--tplh-text);
  font-size: 27rpx;
  font-weight: 600;
  line-height: 1.35;
}
.card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card__author {
  display: flex;
  align-items: center;
  gap: 10rpx;
  min-width: 0;
}
.card__avatar {
  width: 34rpx;
  height: 34rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.card__avatar-text {
  color: #ffffff;
  font-size: 18rpx;
  font-weight: 700;
}
.card__author-name {
  color: var(--tplh-text-3);
  font-size: 21rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card__dl {
  display: flex;
  align-items: center;
  gap: 6rpx;
  flex-shrink: 0;
}
.card__dl-text {
  color: var(--tplh-accent);
  font-size: 21rpx;
  font-weight: 600;
}
</style>
