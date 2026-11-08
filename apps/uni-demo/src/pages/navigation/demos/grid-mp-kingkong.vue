<script setup lang="ts">
/**
 * Demo: sn-grid — 金刚区（App 首页快捷入口形态）。
 *
 * - 彩色圆角图标块：`#icon` 插槽包一层 view 上色，图标本体仍是内置
 *   目录 kebab 名（零注册、确定性渲染），颜色经 currentColor 级联
 * - `clickable`（grid 级）打开按压反馈；点击事件落在每个 sn-grid-item
 *   上，宿主自行决定跳转（组件不持有路由）
 * - 无边框 + 白底，即经典金刚区画布
 */
import { ref } from 'vue';
import SnGrid from '@snui/uni-src/components/sn-grid/sn-grid.vue';
import SnGridItem from '@snui/uni-src/components/sn-grid/sn-grid-item.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';

/** 金刚区入口：图标（内置目录 kebab 名）+ 文案 + 主题色 token。 */
const entries = [
  {
    icon: 'camera',
    text: '扫一扫',
    bg: 'var(--sn-mp-color-action-primary-soft)',
    fg: 'var(--sn-mp-color-action-primary)',
  },
  {
    icon: 'wallet',
    text: '钱包',
    bg: 'var(--sn-mp-color-feedback-warning-soft)',
    fg: 'var(--sn-mp-color-feedback-warning)',
  },
  {
    icon: 'message-circle',
    text: '消息',
    bg: 'var(--sn-mp-color-feedback-success-soft)',
    fg: 'var(--sn-mp-color-feedback-success)',
  },
  {
    icon: 'camera',
    text: '相册',
    bg: 'var(--sn-mp-color-pink-soft)',
    fg: 'var(--sn-mp-color-pink)',
  },
  {
    icon: 'chart-pie',
    text: '理财',
    bg: 'var(--sn-mp-color-cyan-soft)',
    fg: 'var(--sn-mp-color-cyan)',
  },
  {
    icon: 'calendar',
    text: '日程',
    bg: 'var(--sn-mp-color-volcano-soft)',
    fg: 'var(--sn-mp-color-volcano)',
  },
  {
    icon: 'user-plus',
    text: '邀请',
    bg: 'var(--sn-mp-color-lightblue-soft)',
    fg: 'var(--sn-mp-color-lightblue)',
  },
  {
    icon: 'settings',
    text: '设置',
    bg: 'var(--sn-mp-color-purple-soft)',
    fg: 'var(--sn-mp-color-purple)',
  },
] as const;

const tapped = ref('—');

function onEntryTap(entry: { text: string }): void {
  tapped.value = entry.text;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">彩色图标块 + clickable（4 列 × 2 行）</text>
    <SnGrid :column="4" clickable>
      <SnGridItem
        v-for="entry in entries"
        :key="entry.text"
        :text="entry.text"
        @click="onEntryTap(entry)"
      >
        <template #icon>
          <view
            class="sn-demo__kingkong"
            :style="`--sn-demo-kk-bg: ${entry.bg}; --sn-demo-kk-fg: ${entry.fg};`"
          >
            <SnIcon :icon="entry.icon" size="44rpx" />
          </view>
        </template>
      </SnGridItem>
    </SnGrid>
    <text class="sn-demo__meta">最近点击：{{ tapped }}</text>
  </view>
</template>

<style scoped>
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* 金刚区图标块：色底经 CSS 自定义属性按项注入，图标色走 currentColor。 */
.sn-demo__kingkong {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96rpx;
  height: 96rpx;
  border-radius: var(--sn-mp-radius-xl);
  background-color: var(--sn-demo-kk-bg);
  color: var(--sn-demo-kk-fg);
}
</style>
