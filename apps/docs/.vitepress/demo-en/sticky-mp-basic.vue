<script setup lang="ts">
/** Demo: sn-sticky — sticky header inside a scroll container. */
import SnSticky from '@snui/uni-src/components/sn-sticky/sn-sticky.vue'
</script>

<template>
  <view class="sn-demo sn-demo--scroll">
    <scroll-view class="sn-demo__viewport" scroll-y>
      <view class="sn-demo__lead">Scroll down — the heading below sticks to the top</view>
      <SnSticky :offset-top="0" :z-index="5">
        <view class="sn-demo__bar"><text>Sticky heading</text></view>
      </SnSticky>
      <view v-for="index in 20" :key="index" class="sn-demo__row">
        <text>List item {{ index }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped>
.sn-demo--scroll {
  width: 100%;
}
.sn-demo__viewport {
  height: 260px;
  border: 1px solid var(--sn-mp-color-border-subtle);
}
.sn-demo__lead {
  padding: 12px;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__bar {
  padding: 10px 12px;
  background-color: var(--sn-mp-color-action-primary-soft);
  font-size: 24rpx;
  color: var(--sn-mp-color-action-primary);
}
.sn-demo__row {
  padding: 10px 12px;
  border-top: 1px solid var(--sn-mp-color-border-subtle);
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
</style>
