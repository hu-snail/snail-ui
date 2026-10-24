<script setup lang="ts">
/**
 * Demo: sn-icon (uni-end) — 字体图标路径（name + class-prefix）。
 *
 * 文档站没有加载 iconfont 字体文件，所以这里用 demo 自带 CSS 把生成的
 * glyph class 画成占位方块 —— 真正要看的是 sn-icon 产出的类名：
 * `{classPrefix}-{name}`，宿主 app 的 iconfont 样式表就是对着这个类名
 * 定义字形。
 */
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnIcon name="home" :size="40" />
      <SnIcon name="search" :size="40" />
      <SnIcon name="user" :size="40" />
    </view>
    <text class="sn-demo__meta">默认 classPrefix：sn-icon-home / sn-icon-search / sn-icon-user</text>

    <view class="sn-demo__row">
      <SnIcon name="home" class-prefix="wd-icon" :size="40" />
      <SnIcon name="search" class-prefix="wd-icon" :size="40" />
    </view>
    <text class="sn-demo__meta">class-prefix="wd-icon"：wd-icon-home / wd-icon-search</text>
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
 * 占位字形：真实项目里由 iconfont 样式表提供，这里只为了证明 class 名
 * 生成规则。字号 / 圆角 / 颜色全部走 --sn-mp-* 令牌。
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
.sn-demo :deep(.sn-icon-home)::after { content: 'H'; }
.sn-demo :deep(.sn-icon-search)::after { content: 'S'; }
.sn-demo :deep(.sn-icon-user)::after { content: 'U'; }
.sn-demo :deep(.wd-icon-home)::after { content: 'H'; }
.sn-demo :deep(.wd-icon-search)::after { content: 'S'; }
</style>
