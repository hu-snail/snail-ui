<script setup lang="ts">
/**
 * 模板 Tab：我的 —— 个人中心占位：用户卡 + 场景模板快捷入口（sn-cell）。
 * 深浅色跟随系统。
 */
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnNavbar from '@snui/uni-src/components/sn-navbar/sn-navbar.vue';
import { useTplTheme } from '../../common/theme';

const { isDark } = useTplTheme();

const ENTRIES = [
  { title: '地址管理', desc: '地址卡 / 默认标签 / 新增', icon: 'map-pin', route: '/subpages/address' },
  { title: '数据统计', desc: '指标卡 / 柱状图 / 来源分布', icon: 'chart-column', route: '/subpages/stats' },
  { title: '通讯录', desc: '搜索 / 字母索引分组', icon: 'user', route: '/subpages/contacts' },
] as const;

function open(route: string): void {
  uni.navigateTo({ url: route });
}
function about(): void {
  uni.showToast({ title: 'snui 场景模板 · 基于 @snui/uni', icon: 'none' });
}
</script>

<template>
  <view class="tpl-page tabpage" :class="{ 'sn-theme-dark': isDark }">
    <SnNavbar title="我的" fixed safe-area-inset-top :custom-style="'background-color: var(--tplh-nav);'" />
    <view class="tabpage__space" aria-hidden="true" />
    <view class="tabpage__body">
      <view class="me__card">
        <view class="me__avatar"><text class="me__avatar-text">蜗</text></view>
        <view class="me__meta">
          <text class="me__name">蜗蜗</text>
          <text class="me__sub">snui 模板体验官 · UID 10001</text>
        </view>
      </view>

      <view class="me__group">
        <SnCell
          v-for="e in ENTRIES"
          :key="e.route"
          :title="e.title"
          :label="e.desc"
          :prefix-icon="e.icon"
          is-link
          clickable
          @click="open(e.route)"
        />
        <SnCell title="关于模板库" label="组件与模板的适配说明" prefix-icon="sparkles" is-link clickable @click="about" />
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
  gap: 24rpx;
  padding: 24rpx 24rpx calc(env(safe-area-inset-bottom) + 48rpx);
}
.me__card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 32rpx 28rpx;
  border-radius: 28rpx;
  background: linear-gradient(120deg, #0d5c38, #35a257 70%, #4cd088);
  box-shadow: var(--tplh-shadow);
}
.me__avatar {
  width: 108rpx;
  height: 108rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  border: 3rpx solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.me__avatar-text {
  color: #eafff3;
  font-size: 44rpx;
  font-weight: 800;
}
.me__meta {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.me__name {
  color: #ffffff;
  font-size: 36rpx;
  font-weight: 800;
}
.me__sub {
  color: rgba(234, 255, 243, 0.82);
  font-size: 22rpx;
}
.me__group {
  border-radius: 24rpx;
  overflow: hidden;
  border: 2rpx solid var(--tplh-line);
  background: var(--tplh-card);
}
</style>
