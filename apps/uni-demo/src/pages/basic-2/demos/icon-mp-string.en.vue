<script setup lang="ts">
/**
 * Demo: sn-icon (uni-end) — string icon API (catalog / registry / override).
 *
 * `<SnIcon icon="name" />` resolves registry (registerSnIcons) first, then
 * the built-in catalog. Registering the same name overrides the catalog.
 */
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import type { IconData } from '@snui/uni-src/components/sn-icon/sn-icon.vue';

// Override the built-in `star`: registry wins over the catalog.
const BrandStar: IconData = {
  viewBox: '0 0 24 24',
  paths: [
    'M12 2l2.94 5.95 6.57.96-4.75 4.63 1.12 6.54L12 17.02l-5.88 3.06 1.12-6.54-4.75-4.63 6.57-.96L12 2z',
  ],
};
registerSnIcons({ star: BrandStar });
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <view class="item">
        <SnIcon icon="arrow-down" :size="28" />
        <text class="item__name">arrow-down</text>
      </view>
      <view class="item">
        <SnIcon icon="search" :size="28" />
        <text class="item__name">search</text>
      </view>
      <view class="item">
        <SnIcon icon="circle-check" :size="28" color="#34d399" />
        <text class="item__name">circle-check</text>
      </view>
      <view class="item">
        <SnIcon icon="settings" :size="28" />
        <text class="item__name">settings</text>
      </view>
    </view>

    <view class="sn-demo__row">
      <SnButton type="primary">
        <template #icon>
          <SnIcon icon="plus" :size="14" />
        </template>
        新建
      </SnButton>
      <SnButton type="danger">
        <template #icon>
          <SnIcon icon="trash-2" :size="14" />
        </template>
        删除
      </SnButton>
    </view>

    <text class="sn-demo__meta">
      Registry override: custom BrandStar registered as `star`
    </text>
    <view class="sn-demo__row">
      <SnIcon icon="star" :size="28" color="#f59e0b" />
      <SnIcon icon="heart" :size="28" color="#ef4444" />
    </view>
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
  min-width: 120rpx;
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
