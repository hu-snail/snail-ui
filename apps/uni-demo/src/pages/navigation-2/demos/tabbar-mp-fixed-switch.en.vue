<script setup lang="ts">
/**
 * Demo: sn-tabbar — fixed to the bottom with a mode-switch capsule.
 *
 * The capsule cycles three forms: default / glass / elevate; the bar stays
 * fixed to the stage bottom (the device viewport on real hardware). The
 * capsule itself is a pill: subtle fill, the selected segment primary.
 */
import { ref, computed } from 'vue';
import SnTabbar from '@snui/uni-src/components/sn-tabbar/sn-tabbar.vue';
import SnTabbarItem from '@snui/uni-src/components/sn-tabbar/sn-tabbar-item.vue';

type Mode = 'default' | 'glass' | 'elevate';
const modes: { key: Mode; label: string }[] = [
  { key: 'default', label: 'Standard' },
  { key: 'glass', label: 'Glass' },
  { key: 'elevate', label: 'Elevate' },
];

const mode = ref<Mode>('glass');
const active = ref(0);

const isGlass = computed(() => mode.value === 'glass');
const elevate = computed(() => (mode.value === 'elevate' ? { index: 2, icon: 'plus' } : null));
</script>

<template>
  <view class="sn-demo sn-demo--stack">
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
        <view v-for="i in 4" :key="i" class="sn-tabbar-demo__row">Row {{ i }}</view>
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
        <SnTabbarItem title="Home" icon="house" />
        <SnTabbarItem title="Explore" icon="search" />
        <SnTabbarItem title="Create" icon="plus" />
        <SnTabbarItem title="Inbox" icon="bell" />
        <SnTabbarItem title="Me" icon="user" />
      </SnTabbar>
    </view>

    <text class="sn-demo__meta">Mode: {{ mode }} / selected index: {{ active }}</text>
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
