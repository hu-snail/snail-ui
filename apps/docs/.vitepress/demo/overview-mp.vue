<script setup lang="ts">
/**
 * Demo: 组件总览（uni-end）— 手机内组件目录。
 *
 * 布局对齐参考图：模拟器预览背景 #f8f8f8；每个分类是一张独立圆角卡片；
 * 分类标题完整显示（不省略）；搜索 + 分类 chips 实时过滤。
 * 数据与 sidebar 分组同源：overview-mp-data.ts（新增组件两边同步）。
 */
import { computed, ref } from 'vue'
import { OVERVIEW_GROUPS, OVERVIEW_TOTAL } from './overview-mp-data'

const keyword = ref('')
const activeGroup = ref('all')

const groups = computed(() => {
  const key = keyword.value.trim().toLowerCase()
  return OVERVIEW_GROUPS.filter((group) => activeGroup.value === 'all' || activeGroup.value === group.key)
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => key === '' || item.name.includes(key) || item.title.includes(key) || item.desc.includes(key),
      ),
    }))
    .filter((group) => group.items.length > 0)
})

const shownTotal = computed(() => groups.value.reduce((sum, group) => sum + group.items.length, 0))
</script>

<template>
  <view class="ov">
    <view class="ov__hero">
      <text class="ov__hero-title">Snail AUI</text>
      <text class="ov__hero-sub">uni-app 多端组件库</text>
      <view class="ov__stats">
        <view class="ov__stat">
          <text class="ov__stat-num">{{ OVERVIEW_TOTAL }}</text>
          <text class="ov__stat-label">组件</text>
        </view>
        <view class="ov__stat">
          <text class="ov__stat-num">{{ OVERVIEW_GROUPS.length }}</text>
          <text class="ov__stat-label">分类</text>
        </view>
        <view class="ov__stat">
          <text class="ov__stat-num">v3</text>
          <text class="ov__stat-label">版本</text>
        </view>
      </view>
    </view>

    <view class="ov__search">
      <input v-model="keyword" class="ov__search-input" placeholder="搜索组件…" placeholder-class="ov__search-placeholder" />
    </view>

    <scroll-view class="ov__chips" scroll-x>
      <view class="ov__chips-row">
        <view
          class="ov__chip"
          :class="{ 'ov__chip--active': activeGroup === 'all' }"
          :hover-class="'ov__chip--down'"
          @tap="activeGroup = 'all'"
        >
          <text class="ov__chip-text" :class="{ 'ov__chip-text--active': activeGroup === 'all' }">全部</text>
        </view>
        <view
          v-for="group in OVERVIEW_GROUPS"
          :key="group.key"
          class="ov__chip"
          :class="{ 'ov__chip--active': activeGroup === group.key }"
          :hover-class="'ov__chip--down'"
          @tap="activeGroup = group.key"
        >
          <text class="ov__chip-text" :class="{ 'ov__chip-text--active': activeGroup === group.key }">
            {{ group.label }}
          </text>
        </view>
      </view>
    </scroll-view>

    <view v-for="group in groups" :key="group.key" class="ov__card">
      <view class="ov__card-head">
        <text class="ov__card-title">{{ group.label }}</text>
        <text class="ov__card-count">{{ group.items.length }}</text>
      </view>
      <view v-for="item in group.items" :key="item.name" class="ov__item" :hover-class="'ov__item--down'">
        <view class="ov__item-dot" />
        <view class="ov__item-body">
          <text class="ov__item-name">{{ item.name }}</text>
          <text class="ov__item-desc">{{ item.title }} · {{ item.desc }}</text>
        </view>
        <text class="ov__item-arrow">›</text>
      </view>
    </view>

    <text class="ov__meta">共 {{ shownTotal }} 个组件</text>
  </view>
</template>

<style scoped>
/* 需求：模拟器预览背景 #f8f8f8；每个分类独立圆角卡片；标题完整显示。 */
.ov {
  min-height: 100%;
  padding: 24rpx;
  box-sizing: border-box;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.ov__hero {
  display: flex;
  flex-direction: column;
  padding: 32rpx;
  border-radius: 24rpx;
  background-color: var(--sn-mp-color-background-surface);
}

.ov__hero-title {
  font-size: 44rpx;
  font-weight: var(--sn-mp-font-weight-bold);
  color: var(--sn-mp-color-text-primary);
}

.ov__hero-sub {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}

.ov__stats {
  display: flex;
  flex-direction: row;
  margin-top: 24rpx;
  padding: 20rpx 0;
  border-radius: 16rpx;
  background-color: var(--sn-mp-color-background-subtle);
}

.ov__stat {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
}

.ov__stat-num {
  font-size: 34rpx;
  font-weight: var(--sn-mp-font-weight-bold);
  color: var(--sn-mp-color-action-primary);
}

.ov__stat-label {
  margin-top: 4rpx;
  font-size: 22rpx;
  color: var(--sn-mp-color-text-secondary);
}

.ov__search {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12rpx;
  padding: 18rpx 24rpx;
  border-radius: 40rpx;
  background-color: var(--sn-mp-color-background-surface);
}

.ov__search-input {
  flex: 1;
  font-size: 26rpx;
  color: var(--sn-mp-color-text-primary);
}

.ov__chips {
  width: 100%;
}

.ov__chips-row {
  display: flex;
  flex-direction: row;
  gap: 12rpx;
  padding: 4rpx 0;
}

.ov__chip {
  display: flex;
  flex-direction: row;
  padding: 10rpx 24rpx;
  border-radius: 30rpx;
  background-color: var(--sn-mp-color-background-surface);
  flex-shrink: 0;
}

.ov__chip--active {
  background-color: var(--sn-mp-color-action-primary);
}

.ov__chip--down {
  opacity: 0.8;
}

.ov__chip-text {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}

.ov__chip-text--active {
  color: var(--sn-mp-color-text-on-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}

.ov__card {
  display: flex;
  flex-direction: column;
  padding: 24rpx;
  border-radius: 24rpx;
  background-color: var(--sn-mp-color-background-surface);
}

.ov__card-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.ov__card-title {
  /* 分类标题完整显示：不允许省略号截断。 */
  font-size: 30rpx;
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
  white-space: nowrap;
}

.ov__card-count {
  min-width: 44rpx;
  padding: 2rpx 12rpx;
  border-radius: 18rpx;
  background-color: var(--sn-mp-color-action-primary-soft);
  color: var(--sn-mp-color-action-primary);
  font-size: 22rpx;
  text-align: center;
}

.ov__item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 0;
}

.ov__item--down {
  opacity: 0.7;
}

.ov__item-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background-color: var(--sn-mp-color-action-primary);
  flex-shrink: 0;
}

.ov__item-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.ov__item-name {
  font-size: 27rpx;
  font-weight: var(--sn-mp-font-weight-medium);
  color: var(--sn-mp-color-text-primary);
}

.ov__item-desc {
  margin-top: 4rpx;
  font-size: 22rpx;
  color: var(--sn-mp-color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ov__item-arrow {
  color: var(--sn-mp-color-text-disabled);
  font-size: 30rpx;
  flex-shrink: 0;
}

.ov__meta {
  text-align: center;
  font-size: 22rpx;
  color: var(--sn-mp-color-text-secondary);
  padding-bottom: 24rpx;
}
</style>
