<script setup lang="ts">
/** Demo: sn-sticky — custom sticky offset and stacking level. */
import SnSticky from '@snui/uni-src/components/sn-sticky/sn-sticky.vue';
</script>

<template>
  <view class="sn-demo sn-demo--scroll">
    <scroll-view class="sn-demo__viewport" scroll-y>
      <view v-for="index in 8" :key="`lead-${index}`" class="sn-demo__row">
        <text>Leading content {{ index }}</text>
      </view>
      <SnSticky :offset-top="24" :z-index="20">
        <view class="sn-demo__bar"><text>Sticks 24px from the top (z-index=20)</text></view>
      </SnSticky>
      <view v-for="index in 20" :key="`tail-${index}`" class="sn-demo__row">
        <text>Following content {{ index }}</text>
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
.sn-demo__bar {
  padding: 10px 12px;
  background-color: var(--sn-mp-color-background-subtle);
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__row {
  padding: 10px 12px;
  border-top: 1px solid var(--sn-mp-color-border-subtle);
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
</style>
