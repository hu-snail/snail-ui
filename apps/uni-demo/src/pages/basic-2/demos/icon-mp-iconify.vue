<script setup lang="ts">
/**
 * Demo: sn-icon (uni-end) — Iconify 按需加载（第三方图标库接入）。
 *
 * `icon="collection:name"` 走 Iconify API 按需拉取（15s 超时、模块级缓存、
 * 卸载中断）。首次渲染需要网络；失败降级为空渲染 + 结构化警告。
 * 无网环境 / 强离线 app 用 `configSnIcons({ iconify: false })` 关闭。
 */
import { ref } from 'vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** 展示的第三方图标目标（collection:name）。 */
const targets = [
  { target: 'mdi:home', label: 'mdi:home', color: '#0052d9' },
  { target: 'tabler:sun', label: 'tabler:sun', color: '#f59e0b' },
  { target: 'logos:vue', label: 'logos:vue', color: 'currentColor' },
  { target: 'ph:heart-bold', label: 'ph:heart-bold', color: '#ef4444' },
];

/** key 变更强制重建图标节点 → 触发重新加载（缓存命中则瞬时）。 */
const reloadKey = ref(0);

function reload(): void {
  reloadKey.value++;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view :key="reloadKey" class="sn-demo__row">
      <view v-for="item in targets" :key="item.target" class="item">
        <view class="item__box" :style="{ color: item.color }">
          <SnIcon :icon="item.target" :size="28" :color="item.color" />
        </view>
        <text class="item__name">{{ item.label }}</text>
      </view>
    </view>

    <view class="sn-demo__row">
      <SnButton size="small" @click="reload">重新加载</SnButton>
    </view>

    <text class="sn-demo__meta">
      首次渲染走 Iconify API（按需、带缓存）；显式 color 会烘焙进请求，
      currentColor 在远程 SVG 文档中渲染为黑色。离线场景请改用内置目录或 iconfont。
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  width: 100%;
}

.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 32rpx;
  align-items: center;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  min-width: 140rpx;
}

.item__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: var(--sn-mp-radius-md);
  background: var(--sn-mp-color-background-subtle);
}

.item__name {
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-tertiary);
}

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: 1.6;
}
</style>
