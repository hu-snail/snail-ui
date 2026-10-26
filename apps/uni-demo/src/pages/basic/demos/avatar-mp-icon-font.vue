<script setup lang="ts">
/**
 * Demo: sn-avatar (uni-end) — css-icon 字体图标 / icon-prefix / mode / custom-class / custom-style。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-avatar from its SFC source.
 */
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';

const demo = 'https://picsum.photos/seed/snui-avatar-mode/600/400';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">
      字体图标层：cssIcon 为 true 时用 iconPrefix 拼出 `prefix-icon` 类；cssIcon
      传字符串则直接把该值当前缀。 文档站没有图标字体，下面的类用 demo 自带 CSS 画出占位字形，证明
      class 真的挂上去了。
    </text>
    <view class="sn-demo__row">
      <SnAvatar icon="user" icon-prefix="sn-demo-icon" css-icon />
      <SnAvatar icon="star" icon-prefix="sn-demo-icon" css-icon />
      <SnAvatar icon="cart" css-icon="sn-demo-css" />
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
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
/*
 * 占位字形：真实项目里这些类来自图标子集 / 字体。这里只用令牌画一个可辨识的方块，
 * 证明 cssIcon / iconPrefix 拼出的类确实落在字形节点上。
 */
.sn-demo :deep(.sn-demo-icon-user),
.sn-demo :deep(.sn-demo-icon-star),
.sn-demo :deep(.sn-demo-icon-cart),
.sn-demo :deep(.sn-demo-css-cart) {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-sm);
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
