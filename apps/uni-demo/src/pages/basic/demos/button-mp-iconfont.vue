<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — icon 走 sn-icon 图标库。
 *
 * `icon-name` 字符串交给内嵌 sn-icon 解析：registry（registerSnIcons）→
 * 内置目录（111 个 lucide 图形）→ Provider 前缀，无需字体文件，SVG 直接渲染。
 *
 * `icon` + `class-prefix` + `css-icon` 仍是 iconfont 字形路径（类名拼装），
 * 供宿主自带 iconfont 字体时使用 —— 真实项目里字形由字体样式表提供。
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** 与 sn-icon 的 glyphClass 规则一致，用来把生成的类名打印出来。 */
function glyphClass(prefix: string, name: string): string {
  return `${prefix}-${name}`;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">sn-icon 图标库（icon-name → SVG，无需字体文件）</text>
    <view class="sn-demo__row">
      <SnButton type="primary" icon-name="check" :icon-size="36">check</SnButton>
      <SnButton type="success" icon-name="star" :icon-size="36">star</SnButton>
      <SnButton type="warning" icon-name="cart" :icon-size="36">cart</SnButton>
      <SnButton icon-name="heart" :icon-size="36">heart</SnButton>
    </view>
      <SnButton type="warning" icon-name="search" :icon-size="36">search</SnButton>
    <text class="sn-demo__label">任意目录图标 + 自定义尺寸</text>
    <view class="sn-demo__row">
      <SnButton type="info" icon-name="arrow-right" :icon-size="40">前进</SnButton>
      <SnButton type="danger" icon-name="trash-2" :icon-size="32">删除</SnButton>
      <SnButton icon-name="settings" :icon-size="36">设置</SnButton>
    </view>

    <text class="sn-demo__label">iconfont 字形路径（icon + class-prefix，宿主提供字体）</text>
    <view class="sn-demo__row">
      <SnButton type="primary" icon="check" :icon-size="40">默认前缀</SnButton>
      <SnButton type="success" icon="star" class-prefix="wd-icon" :icon-size="40">
        class-prefix
      </SnButton>
    </view>
    <text class="sn-demo__meta">
      生成的类名：{{ glyphClass('sn-icon', 'check') }} / {{ glyphClass('wd-icon', 'star') }}
    </text>

    <text class="sn-demo__label">css-icon：字符串原样挂类 / 布尔双挂</text>
    <view class="sn-demo__row">
      <SnButton type="warning" icon="cart" css-icon="demo-glyph" :icon-size="40">
        css-icon 字符串
      </SnButton>
      <SnButton icon="heart" css-icon :icon-size="40">css-icon 布尔</SnButton>
    </view>
    <text class="sn-demo__meta">
      css-icon="demo-glyph" → 原样挂 demo-glyph；布尔 + icon="heart" → 同时挂
      {{ glyphClass('sn-icon', 'heart') }} 与 heart
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
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
