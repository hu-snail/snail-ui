<script setup lang="ts">
/**
 * Demo: sn-icon (uni-end) — Iconify on-demand loading (3rd-party sets).
 *
 * `icon="collection:name"` fetches through the Iconify API on demand
 * (15s timeout, module-level cache, abort on unmount). First paint needs
 * network; failures degrade to an empty render + structured warning.
 * Disable with `configSnIcons({ iconify: false })` for offline apps.
 */
import { ref } from 'vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** Third-party targets shown (collection:name). */
const targets = [
  { target: 'mdi:home', label: 'mdi:home', color: '#0052d9' },
  { target: 'tabler:sun', label: 'tabler:sun', color: '#f59e0b' },
  { target: 'logos:vue', label: 'logos:vue', color: 'currentColor' },
  { target: 'ph:heart-bold', label: 'ph:heart-bold', color: '#ef4444' },
];

/** Bumping the key remounts the icons (cache hits are instant). */
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
      First paint goes through the Iconify API (on demand, cached); explicit
      color is baked into the request, while currentColor renders black inside
      a remote SVG document. Use the catalog or iconfont for offline apps.
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
