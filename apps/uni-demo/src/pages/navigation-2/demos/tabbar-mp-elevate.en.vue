<script setup lang="ts">
/**
 * Demo: sn-tabbar — elevated center action (elevate).
 *
 * `elevate="{ index, icon }"` renders the tab at `index` as a raised round
 * primary button: it floats above the bar, carries the primary fill with a
 * white glyph and a surface-colored ring, and the bar grows to give it room.
 * Tapping it switches tabs like any other item; pass `null` to disable.
 */
import { ref } from 'vue';
import SnTabbar from '@snui/uni-src/components/sn-tabbar/sn-tabbar.vue';
import SnTabbarItem from '@snui/uni-src/components/sn-tabbar/sn-tabbar-item.vue';

const active = ref(2);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-tabbar-demo__stage">
      <text class="sn-tabbar-demo__hint"
        >elevate={ index: 2, icon: 'plus' } — raised publish button</text
      >

      <SnTabbar
        v-model="active"
        :elevate="{ index: 2, icon: 'plus' }"
        bordered
        custom-class="sn-demo-contained"
      >
        <SnTabbarItem title="Home" icon="house" />
        <SnTabbarItem title="Explore" icon="search" />
        <SnTabbarItem title="Create" />
        <SnTabbarItem title="Inbox" icon="bell" />
        <SnTabbarItem title="Me" icon="user" />
      </SnTabbar>
    </view>

    <text class="sn-demo__meta">Current index: {{ active }} (the raised button switches too)</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-tabbar-demo__stage {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 480rpx;
  overflow: visible;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-sunken);
}
.sn-tabbar-demo__hint {
  padding: var(--sn-mp-spacing-4);
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-tabbar-demo__stage :deep(.sn-tabbar.sn-demo-contained) {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
