<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — 字体图标路径：`icon` + `class-prefix` + `css-icon`。
 *
 * sn-button 把 `icon` 转给内嵌的 sn-icon，字形由宿主加载的 iconfont 样式表提供。
 * 文档站没有图标字体文件，所以下面用 demo 自带 CSS 把生成的 glyph class 画成
 * 占位字形 —— 真正要看的是产出的类名：
 *
 *   - 默认            → `{classPrefix}-{icon}` = `sn-icon-check`
 *   - `class-prefix`  → 改写前缀 = `wd-icon-star`
 *   - `css-icon="…"`  → 该 class 原样挂上（不加前缀）= `demo-glyph`
 *   - `css-icon` 布尔 + `icon` → 同时挂 `{prefix}-{icon}` 与 `{icon}` 两个类
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'

/** 与 sn-icon 的 glyphClass 规则一致，用来把生成的类名打印出来。 */
function glyphClass(prefix: string, name: string): string {
  return `${prefix}-${name}`
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnButton type="primary" icon="check" :icon-size="40">默认前缀</SnButton>
      <SnButton icon="check" :icon-size="40">default 类型</SnButton>
    </view>
    <text class="sn-demo__meta">生成的类名：{{ glyphClass('sn-icon', 'check') }}</text>

    <view class="sn-demo__row">
      <SnButton type="success" icon="star" class-prefix="wd-icon" :icon-size="40">
        class-prefix
      </SnButton>
    </view>
    <text class="sn-demo__meta">
      class-prefix="wd-icon" → 生成的类名：{{ glyphClass('wd-icon', 'star') }}
    </text>

    <view class="sn-demo__row">
      <SnButton type="warning" icon="cart" css-icon="demo-glyph" :icon-size="40">
        css-icon 字符串
      </SnButton>
    </view>
    <text class="sn-demo__meta">
      css-icon="demo-glyph" → 原样挂上的类名：demo-glyph（不追加前缀）
    </text>

    <view class="sn-demo__row">
      <SnButton icon="heart" css-icon :icon-size="40">css-icon 布尔</SnButton>
    </view>
    <text class="sn-demo__meta">
      css-icon 布尔 + icon="heart" → 同时挂 {{ glyphClass('sn-icon', 'heart') }} 与 heart 两个类
    </text>
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
  gap: 16rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}

/*
 * 占位字形。真实项目里这些类由 iconfont 样式表提供；这里只用令牌画一个能看出
 * 差别的方块，证明 icon / class-prefix / css-icon 拼出的类确实落在字形节点上。
 */
.sn-demo :deep(.sn-icon__glyph) {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary-soft);
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-xs);
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo :deep(.sn-icon-check)::after { content: 'C'; }
.sn-demo :deep(.wd-icon-star)::after { content: 'S'; }
.sn-demo :deep(.demo-glyph)::after { content: 'G'; }
.sn-demo :deep(.sn-icon-heart)::after { content: 'H'; }
.sn-demo :deep(.heart)::after { content: 'H'; }
</style>
