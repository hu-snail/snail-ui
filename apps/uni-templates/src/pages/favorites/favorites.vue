<script setup lang="ts">
/**
 * 模板 Tab：收藏 —— 展示首页点亮 ♥ 的模板（与首页共享 likedIds 状态），
 * 空态给引导。深浅色跟随系统。
 */
import { computed } from 'vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { ChevronRight, Heart } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnEmpty from '@snui/uni-src/components/sn-empty/sn-empty.vue';
import SnNavbar from '@snui/uni-src/components/sn-navbar/sn-navbar.vue';
import { likedIds, TEMPLATES } from '../../common/templates';
import { useTplTheme } from '../../common/theme';

const { isDark } = useTplTheme();

const likedList = computed(() => TEMPLATES.filter((t) => likedIds.value[t.id]));

function open(id: string): void {
  uni.navigateTo({ url: `/subpages/${id}` });
}
function goHome(): void {
  uni.switchTab({ url: '/pages/index/index' });
}
</script>

<template>
  <view class="tpl-page tabpage" :class="{ 'sn-theme-dark': isDark }">
    <SnNavbar title="收藏" fixed safe-area-inset-top :custom-style="'background-color: var(--tplh-nav);'" />
    <view class="tabpage__space" aria-hidden="true" />
    <view class="tabpage__body">
      <SnEmpty v-if="likedList.length === 0" icon="heart" tip="还没有收藏模板，去首页点亮喜欢的设计" />
      <view v-else class="fav">
        <view v-for="t in likedList" :key="t.id" class="fav__row" @tap="open(t.id)">
          <view class="fav__cover" :style="{ background: `linear-gradient(150deg, ${t.from}, ${t.to})` }">
            <SnIcon :icon="t.icon" :size="30" color="rgba(255,255,255,0.95)" />
          </view>
          <view class="fav__meta">
            <text class="fav__title">{{ t.title }}</text>
            <text class="fav__author">{{ t.author }} · {{ t.tag }}</text>
          </view>
          <SnIcon :icon="ChevronRight" :size="32" color="var(--tplh-text-3)" />
        </view>
        <view class="fav__tip" @tap="goHome">
          <SnIcon :icon="Heart" :size="26" color="var(--tplh-accent)" />
          <text class="fav__tip-text">继续去首页发现更多模板</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.tabpage {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--tplh-bg);
  color: var(--tplh-text);
}
.tabpage__space {
  flex-shrink: 0;
  height: calc(var(--status-bar-height, 0px) + 88rpx);
}
.tabpage__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24rpx 24rpx calc(env(safe-area-inset-bottom) + 48rpx);
}
.fav {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.fav__row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  border-radius: 24rpx;
  background: var(--tplh-card);
  border: 2rpx solid var(--tplh-line);
  box-shadow: var(--tplh-shadow);
}
.fav__cover {
  width: 88rpx;
  height: 88rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.fav__meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}
.fav__title {
  color: var(--tplh-text);
  font-size: 28rpx;
  font-weight: 700;
}
.fav__author {
  color: var(--tplh-text-3);
  font-size: 22rpx;
}
.fav__tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 28rpx 0 8rpx;
}
.fav__tip-text {
  color: var(--tplh-accent);
  font-size: 24rpx;
  font-weight: 600;
}
</style>
