<script setup lang="ts">
/**
 * Demo: sn-layout (uni-end) — justify / align 全档位 + custom-class / custom-style。
 *
 * 两个窄列（span=6，共 12/24）留出余量，才能看出主轴对齐差异：
 * center / end / space-between / space-around / space-evenly。
 * align 用不同高度的列才看得出来。
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
        <SnCol :span="8"><view class="sn-demo__block">短</view></SnCol>
      </SnLayout>
      <SnLayout align="bottom">
        <SnCol :span="8"><view class="sn-demo__block sn-demo__block--tall">bottom</view></SnCol>
        <SnCol :span="8"><view class="sn-demo__block">短</view></SnCol>
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
      custom-class 落在 sn-layout 根节点，custom-style 同时支持行级与列级覆盖。
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
/* custom-class 落在 sn-layout 根节点上，需要 :deep 穿透。 */
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
