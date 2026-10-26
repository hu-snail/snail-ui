<script setup lang="ts">
/**
 * Demo: sn-skeleton (uni-end) — `customClass` 的三种形态。
 *
 * `customClass` 的类型是 `string | string[] | Record<string, boolean>`，直接交给
 * Vue 的 `:class` 归一化，所以三种写法都合法：
 *
 *   - 字符串           → 追加一个类名
 *   - 字符串数组       → 追加多个类名
 *   - 布尔映射对象     → 按条件开关类名
 *
 * 三者在根节点上的效果一致；对象形态适合「按状态切换」的场景（下面用开关演示）。
 */
import { ref } from 'vue';
import SnSkeleton from '@snui/uni-src/components/sn-skeleton/sn-skeleton.vue';

/** 布尔映射形态：条件为 true 的键才会挂上。 */
const dense = ref(false);
const outlined = ref(true);

/** 字符串数组形态。 */
const arrayClass = ['sn-skeleton-demo__block', 'sn-skeleton-demo__wide'];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">字符串：custom-class="sn-skeleton-demo__block"</text>
    <SnSkeleton theme="text" custom-class="sn-skeleton-demo__block" />

    <text class="sn-demo__meta">
      字符串数组：custom-class="['sn-skeleton-demo__block', 'sn-skeleton-demo__wide']"
    </text>
    <SnSkeleton theme="paragraph" :custom-class="arrayClass" />

    <text class="sn-demo__meta">
      布尔映射对象：{ dense, outlined } —— 用下面的开关切换，类名随条件增删
    </text>
    <view class="sn-demo__row">
      <view class="sn-demo__switch" @tap="dense = !dense">
        <text class="sn-demo__switch-label">dense = {{ dense }}</text>
      </view>
      <view class="sn-demo__switch" @tap="outlined = !outlined">
        <text class="sn-demo__switch-label">outlined = {{ outlined }}</text>
      </view>
    </view>
    <SnSkeleton
      theme="avatar"
      :custom-class="{ 'sn-skeleton-demo__dense': dense, 'sn-skeleton-demo__outlined': outlined }"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo__switch {
  display: inline-flex;
  align-items: center;
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary);
}
.sn-demo__switch-label {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-xs);
}
/* customClass 的三种形态最终都落在 sn-skeleton 根节点上。 */
.sn-demo :deep(.sn-skeleton-demo__block) {
  padding: var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-surface);
}
.sn-demo :deep(.sn-skeleton-demo__wide) {
  gap: var(--sn-mp-spacing-4);
}
.sn-demo :deep(.sn-skeleton-demo__dense) {
  gap: var(--sn-mp-spacing-1);
}
.sn-demo :deep(.sn-skeleton-demo__outlined) {
  border: 2rpx dashed var(--sn-mp-color-border-default);
}
</style>
