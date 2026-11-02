<script setup lang="ts">
/**
 * Demo: sn-tabbar — glass style (translucent bar + backdrop blur).
 *
 * `glass` swaps the bar background for a translucent surface with a
 * backdrop-filter blur (20rpx blur + 1.6 saturate); when fixed, the page
 * shows through from behind. `bordered` stacks as usual; the dark theme
 * flips the glass color through `.sn-theme-dark`.
 */
import { ref } from 'vue';
import SnTabbar from '@snui/uni-src/components/sn-tabbar/sn-tabbar.vue';
import SnTabbarItem from '@snui/uni-src/components/sn-tabbar/sn-tabbar-item.vue';

const active = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-tabbar-demo__stage">
      <view class="sn-tabbar-demo__rows">
        <view v-for="i in 6" :key="i" class="sn-tabbar-demo__row"
          >Row {{ i }}: showing through the glass bar</view
        >
      </view>

      <SnTabbar
        v-model="active"
        fixed
        glass
        bordered
        :z-index="40"
        custom-class="sn-demo-contained"
      >
        <SnTabbarItem title="Home" icon="house" />
        <SnTabbarItem title="Explore" icon="message-circle" />
        <SnTabbarItem title="Inbox" icon="bell" />
        <SnTabbarItem title="Me" icon="user" />
      </SnTabbar>
    </view>

    <text class="sn-demo__meta">
      glass = translucent surface + backdrop-filter blur; scrolling content shows through (full page
      when fixed on device).
    </text>
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
  height: 420rpx;
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
