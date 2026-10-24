<script setup lang="ts">
/**
 * Demo: sn-layout (uni-end) — every justify / align step plus custom-class / custom-style.
 *
 * Two narrow columns (span=6, 12 of 24 total) leave free space, which is the
 * only way the main-axis alignment difference is visible: center / end /
 * space-between / space-around / space-evenly. The cross axis needs columns of
 * different heights to show itself.
 */
import SnLayout from '@snui/uni-src/components/sn-layout/sn-layout.vue'
import SnCol from '@snui/uni-src/components/sn-layout/sn-col.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__case">
      <SnLayout justify="center">
        <SnCol :span="6"><view class="sn-demo__block">center</view></SnCol>
        <SnCol :span="6"><view class="sn-demo__block">6</view></SnCol>
      </SnLayout>
      <SnLayout justify="end">
        <SnCol :span="6"><view class="sn-demo__block">end</view></SnCol>
        <SnCol :span="6"><view class="sn-demo__block">6</view></SnCol>
      </SnLayout>
      <SnLayout justify="space-around">
        <SnCol :span="6"><view class="sn-demo__block">space-around</view></SnCol>
        <SnCol :span="6"><view class="sn-demo__block">6</view></SnCol>
      </SnLayout>
      <SnLayout justify="space-evenly">
        <SnCol :span="6"><view class="sn-demo__block">space-evenly</view></SnCol>
        <SnCol :span="6"><view class="sn-demo__block">6</view></SnCol>
      </SnLayout>
    </view>

    <view class="sn-demo__case">
      <SnLayout align="middle">
        <SnCol :span="8"><view class="sn-demo__block sn-demo__block--tall">middle</view></SnCol>
        <SnCol :span="8"><view class="sn-demo__block">short</view></SnCol>
      </SnLayout>
      <SnLayout align="bottom">
        <SnCol :span="8"><view class="sn-demo__block sn-demo__block--tall">bottom</view></SnCol>
        <SnCol :span="8"><view class="sn-demo__block">short</view></SnCol>
      </SnLayout>
    </view>

    <SnLayout
      custom-class="sn-demo__row-card"
      custom-style="padding: var(--sn-mp-spacing-3); border-radius: var(--sn-mp-radius-md);"
      justify="space-between"
    >
      <SnCol :span="10"><view class="sn-demo__block">custom-class</view></SnCol>
      <SnCol :span="10" custom-style="text-align: right;"><view class="sn-demo__block">custom-style</view></SnCol>
    </SnLayout>
    <text class="sn-demo__meta">
      custom-class lands on the sn-layout root; custom-style works on both the row and a column.
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  width: 100%;
}
.sn-demo__case {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  width: 100%;
}
.sn-demo__block {
  padding: 12rpx;
  border-radius: var(--sn-mp-radius-sm);
  background-color: var(--sn-mp-color-action-primary-soft);
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-xs);
  text-align: center;
}
.sn-demo__block--tall {
  padding: 36rpx 12rpx;
}
/* custom-class lands on the sn-layout root, so it needs :deep. */
.sn-demo :deep(.sn-demo__row-card) {
  background-color: var(--sn-mp-color-background-subtle);
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
