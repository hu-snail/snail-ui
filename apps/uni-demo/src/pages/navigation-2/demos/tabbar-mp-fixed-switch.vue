<script setup lang="ts">
/**
 * Demo: sn-tabbar — 固定底部 + 形态切换胶囊。
 *
 * 胶囊在三种形态间切换：普通 / 毛玻璃（glass）/ 中心凸起（elevate），
 * 栏始终 fixed 在 stage 底部（真机贴视口底部）。胶囊用 sn-tabs 的胶囊
 * 形态视觉：白底圆角、选中项主色底。
 */
import { ref, computed } from 'vue';
import SnTabbar from '@snui/uni-src/components/sn-tabbar/sn-tabbar.vue';
import SnTabbarItem from '@snui/uni-src/components/sn-tabbar/sn-tabbar-item.vue';

type Mode = 'default' | 'glass' | 'elevate';
const modes: { key: Mode; label: string }[] = [
  { key: 'default', label: '标准' },
  { key: 'glass', label: '毛玻璃' },
  { key: 'elevate', label: '凸起' },
];

const mode = ref<Mode>('glass');
const active = ref(0);

const isGlass = computed(() => mode.value === 'glass');
const elevate = computed(() => (mode.value === 'elevate' ? { index: 2, icon: 'plus' } : null));
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <!-- 切换胶囊 -->
    <view class="sn-tabbar-demo__capsule">
      <view
        v-for="m in modes"
        :key="m.key"
        class="sn-tabbar-demo__capsule-item"
        :class="{ 'sn-tabbar-demo__capsule-item--active': mode === m.key }"
        role="tab"
        :aria-selected="mode === m.key"
        @tap="mode = m.key"
      >
        {{ m.label }}
      </view>
    </view>

    <view class="sn-tabbar-demo__stage">
      <view class="sn-tabbar-demo__rows">
        <view v-for="i in 4" :key="i" class="sn-tabbar-demo__row">内容行 {{ i }}</view>
      </view>

      <SnTabbar
        v-model="active"
        fixed
        :glass="isGlass"
        bordered
        :elevate="elevate"
        :z-index="40"
        custom-class="sn-demo-contained"
      >
        <SnTabbarItem title="首页" icon="house" />
        <SnTabbarItem title="发现" icon="search" />
        <SnTabbarItem title="发布" icon="plus" />
        <SnTabbarItem title="消息" icon="bell" />
        <SnTabbarItem title="我的" icon="user" />
      </SnTabbar>
    </view>

    <text class="sn-demo__meta">当前形态：{{ mode }} ／ 选中索引：{{ active }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-tabbar-demo__capsule {
  display: flex;
  align-self: center;
  gap: 8rpx;
  padding: 8rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-subtle);
}
.sn-tabbar-demo__capsule-item {
  padding: 12rpx 32rpx;
  border-radius: var(--sn-mp-radius-full);
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-secondary);
}
.sn-tabbar-demo__capsule-item--active {
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
}
.sn-tabbar-demo__stage {
  position: relative;
  height: 460rpx;
  overflow: hidden;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background: linear-gradient(
    160deg,
    var(--sn-mp-color-action-primary-soft),
    var(--sn-mp-color-background-subtle)
  );
}
.sn-tabbar-demo__rows {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 24rpx;
}
.sn-tabbar-demo__row {
  padding: 20rpx 24rpx;
  border-radius: var(--sn-mp-radius-sm);
  background: var(--sn-mp-color-background-elevated);
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* Docs-preview only — pin the fixed bar to the stage instead of the viewport. */
.sn-tabbar-demo__stage :deep(.sn-tabbar.sn-demo-contained) {
  position: absolute;
}
</style>
