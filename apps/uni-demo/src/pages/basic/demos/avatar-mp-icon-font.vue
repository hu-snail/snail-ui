<script setup lang="ts">
/**
 * Demo: sn-avatar (uni-end) — css-icon 字体图标 / icon-prefix / mode / custom-class / custom-style。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-avatar from its SFC source.
 */
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import { User, Star } from '@snui/uni-src/components/sn-icon/sn-icon-set';

// 注册内置图标：icon 走 SVG 渲染（无需字体）。
registerSnIcons({ User, Star });

const demo = 'https://picsum.photos/seed/snui-avatar-mode/600/400';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">
      注册图标（icon 走 SVG，经 registerSnIcons 解析，无需字体文件）：
    </text>
    <view class="sn-demo__row">
      <SnAvatar icon="User" />
      <SnAvatar
        icon="Star"
        size="large"
        bg-color="var(--sn-mp-color-action-primary)"
        color="var(--sn-mp-color-text-on-primary)"
      />
      <SnAvatar
        icon="User"
        shape="square"
        bg-color="var(--sn-mp-color-feedback-success)"
        color="var(--sn-mp-color-text-on-primary)"
      />
    </view>

    <text class="sn-demo__meta">
      字体图标层：cssIcon 为 true 时用 iconPrefix 拼出 `prefix-icon` 类，cssIcon
      传字符串则直接把该值当前缀。类会落在字形节点上——真实项目里字形来自图标字体子集； 本 demo
      没有字体文件，用占位「字块」证明 class 确实挂上去了：
    </text>
    <view class="sn-demo__row">
      <view class="sn-demo__font-slot">
        <SnAvatar icon="user" icon-prefix="sn-demo-icon" css-icon size="large" />
        <text class="sn-demo__font-name">sn-demo-icon-user</text>
      </view>
      <view class="sn-demo__font-slot">
        <SnAvatar icon="star" icon-prefix="sn-demo-icon" css-icon size="large" />
        <text class="sn-demo__font-name">sn-demo-icon-star</text>
      </view>
      <view class="sn-demo__font-slot">
        <SnAvatar icon="cart" css-icon="sn-demo-css" size="large" />
        <text class="sn-demo__font-name">sn-demo-css-cart</text>
      </view>
    </view>

    <text class="sn-demo__meta"
      >mode 透传给内部 &lt;image&gt;（aspectFill 裁切 / aspectFit 留白）。</text
    >
    <view class="sn-demo__row">
      <SnAvatar :src="demo" mode="aspectFill" size="large" />
      <SnAvatar :src="demo" mode="aspectFit" size="large" />
    </view>

    <text class="sn-demo__meta"
      >customClass 挂在根节点（描边），customStyle 追加到根节点 inline style。</text
    >
    <view class="sn-demo__row">
      <SnAvatar
        text="CC"
        size="large"
        custom-class="sn-avatar-demo__root"
        custom-style="box-shadow: var(--sn-mp-shadow-sm)"
      />
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  align-items: flex-start;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo__font-slot {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  align-items: center;
}
.sn-demo__font-name {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 20rpx;
  line-height: 1.2;
}

/*
 * 占位字形：真实项目里这些类来自图标字体子集（class 落在字形 <text> 节点上）。
 * 没有字体时用令牌画一个「字块」——衬底 + 单字，读作刻意的占位而不是坏掉的字形。
 */
.sn-demo :deep(.sn-demo-icon-user),
.sn-demo :deep(.sn-demo-icon-star),
.sn-demo :deep(.sn-demo-icon-cart),
.sn-demo :deep(.sn-demo-css-cart) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--sn-mp-color-background-subtle);
  border-radius: inherit;
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo :deep(.sn-demo-icon-user)::after {
  content: 'U';
}
.sn-demo :deep(.sn-demo-icon-star)::after {
  content: 'S';
}
.sn-demo :deep(.sn-demo-icon-cart)::after {
  content: 'C';
}
.sn-demo :deep(.sn-demo-css-cart)::after {
  content: 'F';
}
.sn-demo :deep(.sn-avatar-demo__root) {
  border: 2rpx solid var(--sn-mp-color-action-primary);
}
</style>
