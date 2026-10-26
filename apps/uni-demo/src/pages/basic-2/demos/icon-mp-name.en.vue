<script setup lang="ts">
/**
 * Demo: sn-icon (uni-end) — iconfont glyph path (name + class-prefix).
 *
 * The docs site loads no iconfont stylesheet, so demo-local CSS draws the
 * generated glyph class as a placeholder box. The point is the class name
 * sn-icon produces — `{classPrefix}-{name}` — which is what a host app's
 * iconfont stylesheet targets.
 */
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnIcon name="home" :size="40" />
      <SnIcon name="search" :size="40" />
      <SnIcon name="user" :size="40" />
    </view>
    <text class="sn-demo__meta"
      >Default classPrefix: sn-icon-home / sn-icon-search / sn-icon-user</text
    >

    <view class="sn-demo__row">
      <SnIcon name="home" class-prefix="wd-icon" :size="40" />
      <SnIcon name="search" class-prefix="wd-icon" :size="40" />
    </view>
    <text class="sn-demo__meta">class-prefix="wd-icon": wd-icon-home / wd-icon-search</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}

/*
 * Placeholder glyph: a real app gets this from its iconfont stylesheet. Here
 * it only proves the class-name rule. Size / radius / colour are all tokens.
 */
.sn-demo :deep(.sn-icon-home),
.sn-demo :deep(.sn-icon-search),
.sn-demo :deep(.sn-icon-user),
.sn-demo :deep(.wd-icon-home),
.sn-demo :deep(.wd-icon-search) {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-action-primary-soft);
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo :deep(.sn-icon-home)::after {
  content: 'H';
}
.sn-demo :deep(.sn-icon-search)::after {
  content: 'S';
}
.sn-demo :deep(.sn-icon-user)::after {
  content: 'U';
}
.sn-demo :deep(.wd-icon-home)::after {
  content: 'H';
}
.sn-demo :deep(.wd-icon-search)::after {
  content: 'S';
}
</style>
